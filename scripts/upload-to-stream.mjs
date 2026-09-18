#!/usr/bin/env node
/**
 * Uploads campaign masters to Cloudflare Stream using the tus resumable protocol (required for files over 200 MB).
 *
 * Run it yourself with your own credentials; the API token needs the "Stream: Edit" permission.
 *
 *   PowerShell:
 *     $env:CLOUDFLARE_ACCOUNT_ID = "<account id>"
 *     $env:CLOUDFLARE_API_TOKEN  = "<api token>"
 *     node scripts/upload-to-stream.mjs
 *
 * Options:
 *   --dir <folder>   Folder of source files (default: C:\Users\Hari\Documents\Campaigns)
 *   --all            Upload every video in the folder, not just the new campaigns
 *   <file names...>  Upload only these files
 *
 * Results are saved to scripts/stream-uploads.json (file name → Stream video uid). Files already recorded there are
 * skipped, so the script is safe to re-run after a failure.
 */
import { open, readFile, readdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ACCOUNT = process.env.CLOUDFLARE_ACCOUNT_ID
const TOKEN = process.env.CLOUDFLARE_API_TOKEN
const RESULTS = path.join(path.dirname(fileURLToPath(import.meta.url)), 'stream-uploads.json')

// The campaigns that aren't on Stream yet; the other files in the folder already have video ids on the site
const NEW_CAMPAIGNS = [
  '43644_NC_LIQUID CONCENTRATE_WIP_CREATIVE CUT_16x9_v8_1.mp4',
  'Cellular Epigenetics.mov',
  'Cellular Serum.mov',
  'Sensitive moisturizer Men.mov',
]

// 50 MiB chunks; Stream requires a multiple of 256 KiB and at least 5 MiB
const CHUNK = 200 * 256 * 1024
const VIDEO = /\.(mp4|mov|m4v|mkv|webm)$/i

const args = process.argv.slice(2)
const dirFlag = args.indexOf('--dir')
const dir = dirFlag >= 0 ? args[dirFlag + 1] : 'C:\\Users\\Hari\\Documents\\Campaigns'
const uploadAll = args.includes('--all')
const named = args.filter((arg, i) => !arg.startsWith('--') && args[i - 1] !== '--dir')

if (!ACCOUNT || !TOKEN) {
  console.error('Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN first (see the comment at the top of this file).')
  process.exit(1)
}

const authHeaders = { Authorization: `Bearer ${TOKEN}`, 'Tus-Resumable': '1.0.0' }
const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(0)} MB`

async function loadResults() {
  try {
    return JSON.parse(await readFile(RESULTS, 'utf8'))
  } catch {
    return {}
  }
}

async function createUpload(name, size) {
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/stream`, {
    method: 'POST',
    headers: {
      ...authHeaders,
      'Upload-Length': String(size),
      'Upload-Metadata': `name ${Buffer.from(name).toString('base64')}`,
    },
  })
  if (res.status !== 201) throw new Error(`Create failed (${res.status}): ${await res.text()}`)
  return { location: res.headers.get('location'), uid: res.headers.get('stream-media-id') }
}

async function currentOffset(location) {
  const res = await fetch(location, { method: 'HEAD', headers: authHeaders })
  return Number(res.headers.get('upload-offset') ?? 0)
}

async function uploadChunks(location, filePath, size) {
  const handle = await open(filePath, 'r')
  let offset = 0
  try {
    while (offset < size) {
      const length = Math.min(CHUNK, size - offset)
      const chunk = Buffer.alloc(length)
      await handle.read(chunk, 0, length, offset)

      let attempt = 0
      for (;;) {
        try {
          const res = await fetch(location, {
            method: 'PATCH',
            headers: { ...authHeaders, 'Upload-Offset': String(offset), 'Content-Type': 'application/offset+octet-stream' },
            body: chunk,
          })
          if (res.status !== 204) throw new Error(`Chunk failed (${res.status}): ${await res.text()}`)
          offset = Number(res.headers.get('upload-offset'))
          break
        } catch (error) {
          if (++attempt > 3) throw error
          console.warn(`  retrying chunk (${attempt}/3): ${error.message}`)
          await new Promise((resolve) => setTimeout(resolve, 2000 * attempt))
          offset = await currentOffset(location)
          break
        }
      }
      process.stdout.write(`\r  ${mb(offset)} / ${mb(size)} (${Math.round((offset / size) * 100)}%)   `)
    }
    process.stdout.write('\n')
  } finally {
    await handle.close()
  }
}

const results = await loadResults()
const folderFiles = (await readdir(dir)).filter((file) => VIDEO.test(file))
const queue = named.length ? named : uploadAll ? folderFiles : NEW_CAMPAIGNS.filter((file) => folderFiles.includes(file))

for (const file of queue) {
  if (results[file]) {
    console.log(`Skipping ${file} (already uploaded as ${results[file]})`)
    continue
  }
  const filePath = path.join(dir, file)
  const { size } = await stat(filePath)
  console.log(`Uploading ${file} (${mb(size)})`)

  const { location, uid } = await createUpload(file, size)
  await uploadChunks(location, filePath, size)

  results[file] = uid
  await writeFile(RESULTS, `${JSON.stringify(results, null, 2)}\n`)
  console.log(`  done → ${uid}`)
}

console.log(`\nVideo ids saved to ${path.relative(process.cwd(), RESULTS)}`)

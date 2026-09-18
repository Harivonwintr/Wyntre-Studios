#!/usr/bin/env node
/*
 * Prepares collage artwork for the web: trims transparent margins (so the visible paper fills its layout box)
 * and converts to WebP at a sensible size.
 *
 * Usage: node scripts/prepare-collage-asset.mjs <input> <output.webp> [paper|photo|texture]
 *   paper   – torn paper, tape and scraps: trimmed, max 1200px
 *   photo   – campaign photos: not trimmed, max 1800px
 *   texture – full-bleed backgrounds: not trimmed, max 2400px
 */
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const PRESETS = {
  paper: { maxSize: 1200, quality: 82, trim: true },
  photo: { maxSize: 1800, quality: 80, trim: false },
  texture: { maxSize: 2400, quality: 72, trim: false },
}

const [input, output, kind = 'paper'] = process.argv.slice(2)
const preset = PRESETS[kind]

if (!input || !output || !preset) {
  console.error('Usage: node scripts/prepare-collage-asset.mjs <input> <output.webp> [paper|photo|texture]')
  process.exit(1)
}

// Bounding box of every pixel that isn't (almost) fully transparent
async function opaqueBounds(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  let left = width
  let top = height
  let right = -1
  let bottom = -1

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * channels + channels - 1] > 8) {
        if (x < left) left = x
        if (x > right) right = x
        if (y < top) top = y
        if (y > bottom) bottom = y
      }
    }
  }

  return right < 0 ? null : { left, top, width: right - left + 1, height: bottom - top + 1 }
}

let pipeline = sharp(input)
if (preset.trim) {
  const bounds = await opaqueBounds(input)
  if (bounds) pipeline = sharp(input).extract(bounds)
}

await mkdir(path.dirname(output), { recursive: true })
const result = await pipeline
  .resize({ width: preset.maxSize, height: preset.maxSize, fit: 'inside', withoutEnlargement: true })
  .webp({ quality: preset.quality, alphaQuality: 90, effort: 5 })
  .toFile(output)

console.log(`${path.basename(output)}: ${result.width}x${result.height}, ${Math.round(result.size / 1024)}KB`)

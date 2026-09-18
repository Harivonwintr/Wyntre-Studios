// Builds the link preview images (1200 × 630) in public/og from site stills, set in Monument.
// Run with: node scripts/make-share-images.mjs
// Needs Monument Extended installed for the current Windows user (the paths below), and sharp.

import sharp from 'sharp'
import os from 'os'
import path from 'path'
import fs from 'fs'

const W = 1200
const H = 630
const PAD = 72
const INK = '#f4f1ea'
// Pango takes the colour and its opacity separately
const FAINT = 62

const FONTS = path.join(os.homedir(), 'AppData/Local/Microsoft/Windows/Fonts')
const DISPLAY = path.join(FONTS, 'MonumentExtended-Ultrabold.otf')
const LABEL = path.join(FONTS, 'MonumentExtended-Regular.otf')

const OUT = 'public/og'
fs.mkdirSync(OUT, { recursive: true })

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// One block of text rendered by Pango, transparent background
const text = (content, { font, fontfile, size, alpha = 100, spacing = 0, width = W - PAD * 2, lineHeight }) =>
  sharp({
    text: {
      text: `<span foreground="${INK}" alpha="${alpha}%" letter_spacing="${Math.round(spacing * 1024)}"${lineHeight ? ` line_height="${lineHeight}"` : ''}>${content}</span>`,
      font: `${font} ${size}`,
      fontfile,
      rgba: true,
      width,
      dpi: 72,
    },
  })
    .png()
    .toBuffer({ resolveWithObject: true })

// Darkest on the left where the type sits, and along the bottom, like the hero
const shade = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="x" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#0d0d0d" stop-opacity="0.92"/>
      <stop offset="0.45" stop-color="#0d0d0d" stop-opacity="0.66"/>
      <stop offset="1" stop-color="#0d0d0d" stop-opacity="0.18"/>
    </linearGradient>
    <linearGradient id="y" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0.55" stop-color="#0d0d0d" stop-opacity="0"/>
      <stop offset="1" stop-color="#0d0d0d" stop-opacity="0.75"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#x)"/>
  <rect width="100%" height="100%" fill="url(#y)"/>
</svg>`)

async function card({ out, background, focus = 'centre', eyebrow, title, detail, titleSize = 64 }) {
  const bg = await sharp(background).resize(W, H, { fit: 'cover', position: focus }).toBuffer()
  const logo = await sharp('public/assets/logo.svg', { density: 300 }).resize(56, 56).png().toBuffer()

  const eyebrowText = await text(escape(eyebrow.toUpperCase()), { font: 'Monument Extended', fontfile: LABEL, size: 15, alpha: FAINT, spacing: 4 })
  const titleText = await text(title.map((line) => escape(line.toUpperCase())).join('\n'), {
    font: 'Monument Extended Ultrabold',
    fontfile: DISPLAY,
    size: titleSize,
    lineHeight: 0.98,
    width: W - PAD * 2,
  })
  const detailText = detail
    ? await text(escape(detail.toUpperCase()), { font: 'Monument Extended', fontfile: LABEL, size: 15, spacing: 3 })
    : null
  const urlText = await text('WYNTRESTUDIOS.COM', { font: 'Monument Extended', fontfile: LABEL, size: 14, alpha: FAINT, spacing: 4 })

  // Stack the type up from the bottom: title, then the detail line under it
  const bottom = H - PAD
  const detailTop = detailText ? bottom - detailText.info.height : bottom
  const titleTop = detailTop - (detailText ? 26 : 0) - titleText.info.height

  const layers = [
    { input: shade, left: 0, top: 0 },
    { input: logo, left: PAD, top: PAD - 8 },
    { input: eyebrowText.data, left: PAD + 56 + 22, top: PAD + 28 - Math.round(eyebrowText.info.height / 2) - 8 },
    { input: urlText.data, left: W - PAD - urlText.info.width, top: PAD + 28 - Math.round(urlText.info.height / 2) - 8 },
    { input: titleText.data, left: PAD, top: titleTop },
  ]
  if (detailText) layers.push({ input: detailText.data, left: PAD, top: detailTop })

  await sharp(bg).composite(layers).jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(OUT, out))
  console.log('wrote', out)
}

const cards = [
  {
    out: 'home.jpg',
    // A frame from the reel (20s in), kept beside this script rather than shipped with the site
    background: 'scripts/og-sources/home.jpg',
    eyebrow: 'Wyntre Studios',
    title: ['Where it all', 'comes together.'],
    detail: 'Post-production · VFX · Motion · Creative technology',
  },
  {
    out: 'nivea.jpg',
    background: 'public/assets/Nivea Case Study Hero.png',
    eyebrow: 'Case study / NIVEA',
    title: ['Skin is for feeling it.', 'So are the campaigns.'],
    // Longest lines of the set: a step down keeps each on one line
    titleSize: 54,
    detail: 'Publicis One Touch · EUMEA / APAC · 2021–2025',
  },
  {
    out: 'nescafe.jpg',
    background: 'public/assets/Nescafe Case Study Hero.png',
    eyebrow: 'Case study / NESCAFÉ',
    title: ['Built to scale'],
    detail: 'Publicis · EUMEA / APAC · 2021–2025',
  },
  {
    out: 'story-nescafe-gold-summer.jpg',
    background: 'public/assets/Rescue 1.png',
    eyebrow: 'Rescue story / NESCAFÉ',
    title: ['Gold Summer'],
    detail: '7 masters · 120 versions · Delivered a day early',
  },
  {
    out: 'story-nivea-black-and-white.jpg',
    background: 'public/assets/Rescue 2.png',
    eyebrow: 'Rescue story / NIVEA',
    title: ['Black & White'],
    detail: '15 films · Key visuals · 19 days',
  },
  {
    out: 'story-subway-love-island.jpg',
    background: 'public/assets/Rescure 3.png',
    eyebrow: 'Rescue story / Subway',
    title: ['We had 72 hours.', 'Done in 36.'],
    detail: 'Subway x Love Island · 4 composite shots',
  },
]

for (const c of cards) await card(c)

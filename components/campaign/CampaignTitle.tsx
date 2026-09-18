'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import styles from './CampaignTitle.module.css'

type Props = {
  brand: string
  campaign: string
  /** Manual line breaks for the campaign name; balanced automatically when omitted */
  lines?: string[]
  /** Width ÷ height of the title box; the box never resizes, names of any length are fitted into it */
  aspectRatio?: number
  /** Height of the left edge as a fraction of the right edge (1 = no taper) */
  taper?: number
  /** Brand name size in px at its left edge; fixed so it matches across every campaign */
  brandSize?: number
  /** Overrides the inherited --campaign-brand colour */
  brandColor?: string
  as?: 'h1' | 'h2' | 'h3'
  className?: string
}

// Must match line-height in CampaignTitle.module.css (.glyph and .brandGlyph)
const LINE_HEIGHT = 0.96
const BRAND_LINE_HEIGHT = 0.9
// Stops long brand names from squashing their last letters into nothing
const MIN_BRAND_SCALE = 0.3

const CONNECTORS = new Set(['&', '+', 'x', '×', '-', '–', '—', '|', '/'])

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
const round = (value: number) => +value.toPrecision(8)

/**
 * Balances a campaign name over 2–3 lines, never starting or ending a line with a connector like "&".
 * "Black & White Checkmate" -> ["Black & White", "Checkmate"]
 */
export function splitCampaignLines(campaign: string): string[] {
  const text = campaign.trim()
  const words = text.split(/\s+/)
  if (words.length < 2 || text.length <= 10) return [text]

  const isValid = (line: string[]) => !CONNECTORS.has(line[0]) && !CONNECTORS.has(line[line.length - 1])
  const preferred = Math.min(text.length > 26 ? 3 : 2, words.length)

  for (let lineCount = preferred; lineCount >= 2; lineCount--) {
    let best: string[][] | null = null
    let bestScore = Infinity

    const search = (start: number, acc: string[][]) => {
      if (acc.length === lineCount - 1) {
        const rest = words.slice(start)
        if (!rest.length || !isValid(rest)) return
        const candidate = [...acc, rest]
        const lengths = candidate.map((line) => line.join(' ').length)
        const longest = Math.max(...lengths)
        const score = longest * 100 + (longest - Math.min(...lengths))
        if (score < bestScore) {
          bestScore = score
          best = candidate
        }
        return
      }
      for (let end = start + 1; end < words.length; end++) {
        const line = words.slice(start, end)
        if (isValid(line)) search(end, [...acc, line])
      }
    }

    search(0, [])
    if (best) return (best as string[][]).map((line) => line.join(' '))
  }

  return [text]
}

/*
 * The warps are bilinear (height changes linearly across x), which no single CSS transform can express.
 * Each glyph instead gets the tangent of the warp at its centre: a 2D matrix that is within a fraction of a
 * pixel at the glyph's corners and, unlike matrix3d, is painted as vectors so it stays sharp.
 */

/** Glyph scaled vertically about the block's bottom edge: flat bottom, top following s0 -> s1 */
function bottomAnchoredMatrix(width: number, height: number, distanceToBottom: number, s0: number, s1: number) {
  const slope = (s1 - s0) / width
  const skew = slope * (height / 2 - distanceToBottom)
  const scaleY = s0 + (slope * width) / 2
  const shiftY = distanceToBottom * (1 - s0) - (slope * width * height) / 4
  return `matrix(1,${round(skew)},0,${round(scaleY)},0,${round(shiftY)})`
}

/** Glyph scaled vertically about its own top edge: flat top, bottom following t0 -> t1 */
function topAnchoredMatrix(width: number, height: number, t0: number, t1: number) {
  const slope = (t1 - t0) / width
  const centreX = width / 2
  const centreY = height / 2
  const skew = slope * centreY
  const scaleY = t0 + slope * centreX
  const shiftY = -slope * centreY * centreX
  return `matrix(1,${round(skew)},0,${round(scaleY)},0,${round(shiftY)})`
}

type GlyphBox = { left: number; width: number }

type Measurement = {
  width: number
  height: number
  fontSize: number
  lines: { width: number; glyphs: GlyphBox[] }[]
  brandFontSize: number
  brandGlyphs: GlyphBox[]
}

type TitleLayout = {
  fontSize: number
  brandFontSize: number
  brandTop: number
  blockTop: number
  lineScales: number[]
  glyphTransforms: string[][]
  brandGlyphTransforms: string[]
}

function computeLayout(m: Measurement, taper: number, brandSize: number): TitleLayout {
  const W = m.width
  const H = m.height
  const leftRatio = clamp(taper, 0.2, 1)

  const brandFontSize = brandSize
  const brandRatio = brandFontSize / m.brandFontSize
  const brandHeight = BRAND_LINE_HEIGHT * brandFontSize
  const gap = 0.12 * brandFontSize

  // The box height is fixed, so the campaign block takes whatever the brand leaves. The brand sits in the
  // wedge above the block's low left edge; if the wedge is too shallow to hold it, the block starts lower.
  let blockTop = (brandHeight + gap - H * (1 - leftRatio)) / leftRatio
  let brandTop = 0
  if (blockTop < 0) {
    blockTop = 0
    brandTop = H * (1 - leftRatio) - brandHeight - gap
  }

  const blockHeight = Math.max(H - blockTop, H * 0.2)
  const wedge = blockHeight * (1 - leftRatio)
  const lineHeight = blockHeight / m.lines.length
  const fontSize = lineHeight / LINE_HEIGHT
  const ratio = fontSize / m.fontSize
  const scaleAt = (x: number) => leftRatio + (1 - leftRatio) * clamp(x / W, 0, 1)

  // Lines are forced to the full width: long names are squeezed, short ones stretched
  const lineScales = m.lines.map((line) => clamp(W / Math.max(line.width * ratio, 1), 0.15, 4))

  // Campaign block: flat bottom, top rising to the right
  const glyphTransforms = m.lines.map((line, j) => {
    const distanceToBottom = blockHeight - j * lineHeight
    const stretch = lineScales[j]

    return line.glyphs.map((glyph) => {
      const left = glyph.left * ratio
      const width = Math.max(glyph.width * ratio, 0.01)
      return bottomAnchoredMatrix(
        width,
        lineHeight,
        distanceToBottom,
        scaleAt(left * stretch),
        scaleAt((left + width) * stretch)
      )
    })
  })

  // Brand mirrors that morph: flat top, bottom edge parallel to the campaign's rising top
  const edgeSlope = wedge / W
  const brandScaleAt = (x: number) => Math.max(MIN_BRAND_SCALE, 1 - (edgeSlope * x) / brandHeight)

  const brandGlyphTransforms = m.brandGlyphs.map((glyph) => {
    const left = glyph.left * brandRatio
    const width = Math.max(glyph.width * brandRatio, 0.01)
    return topAnchoredMatrix(width, brandHeight, brandScaleAt(left), brandScaleAt(left + width))
  })

  return {
    fontSize,
    brandFontSize,
    brandTop,
    blockTop,
    lineScales,
    glyphTransforms,
    brandGlyphTransforms,
  }
}

const measureGlyphs = (parent: HTMLElement): GlyphBox[] =>
  (Array.from(parent.children) as HTMLElement[]).map((glyph) => ({ left: glyph.offsetLeft, width: glyph.offsetWidth }))

function renderGlyphs(text: string, glyphClass: string, transforms?: string[]) {
  return Array.from(text).map((char, j) => {
    const transform = transforms?.[j]
    const isSpace = char === ' '
    return (
      <span
        key={j}
        className={isSpace ? `${glyphClass} ${styles.space}` : glyphClass}
        style={transform ? { transform } : undefined}
      >
        {isSpace ? ' ' : char}
      </span>
    )
  })
}

export default function CampaignTitle({
  brand,
  campaign,
  lines: manualLines,
  aspectRatio = 3,
  taper = 0.62,
  brandSize = 40,
  brandColor,
  as: Heading = 'h2',
  className,
}: Props) {
  const frameRef = useRef<HTMLSpanElement>(null)
  const blockRef = useRef<HTMLSpanElement>(null)
  const brandRef = useRef<HTMLSpanElement>(null)
  const [layout, setLayout] = useState<TitleLayout | null>(null)
  const [fontsReady, setFontsReady] = useState(false)

  const lines = useMemo(
    () => (manualLines?.length ? manualLines : splitCampaignLines(campaign)),
    [manualLines, campaign]
  )
  const linesKey = lines.join('\n')

  useIsomorphicLayoutEffect(() => {
    const frame = frameRef.current
    const block = blockRef.current
    const brandEl = brandRef.current
    if (!frame || !block || !brandEl) return

    let lastWidth = -1
    let cancelled = false

    // offset* values ignore transforms, so natural sizes can be read while warped
    const measure = (force = false) => {
      const width = frame.clientWidth
      const height = frame.clientHeight
      if (!width || !height || (!force && width === lastWidth)) return
      lastWidth = width

      const lineEls = Array.from(block.children) as HTMLElement[]
      setLayout(
        computeLayout(
          {
            width,
            height,
            fontSize: parseFloat(getComputedStyle(block).fontSize),
            lines: lineEls.map((lineEl) => ({ width: lineEl.offsetWidth, glyphs: measureGlyphs(lineEl) })),
            brandFontSize: parseFloat(getComputedStyle(brandEl).fontSize),
            brandGlyphs: measureGlyphs(brandEl),
          },
          taper,
          brandSize
        )
      )
    }

    measure(true)

    // Re-measure once the display font is available; stay hidden until then to avoid a visible jump
    const reveal = () => {
      if (cancelled) return
      measure(true)
      setFontsReady(true)
    }
    const fallbackTimer = window.setTimeout(reveal, 1500)
    if (document.fonts?.load) {
      document.fonts.load(`400 64px ${getComputedStyle(block).fontFamily}`).then(reveal, reveal)
    } else {
      reveal()
    }

    const observer = new ResizeObserver(() => measure())
    observer.observe(frame)

    return () => {
      cancelled = true
      window.clearTimeout(fallbackTimer)
      observer.disconnect()
    }
  }, [linesKey, brand, aspectRatio, taper, brandSize])

  const headingStyle = (brandColor ? { '--campaign-brand': brandColor } : undefined) as CSSProperties | undefined

  return (
    <Heading className={`${styles.title} ${className ?? ''}`} style={headingStyle}>
      <span className={styles.srOnly}>
        {brand} {campaign}
      </span>

      {/* Fixed-ratio box: its size never depends on the campaign name */}
      <span
        ref={frameRef}
        className={styles.frame}
        aria-hidden="true"
        style={{ aspectRatio, visibility: layout && fontsReady ? 'visible' : 'hidden' }}
      >
        <span
          ref={brandRef}
          className={styles.brand}
          style={layout ? { fontSize: layout.brandFontSize, top: layout.brandTop } : undefined}
        >
          {renderGlyphs(brand, styles.brandGlyph, layout?.brandGlyphTransforms)}
        </span>

        <span
          ref={blockRef}
          className={styles.block}
          style={layout ? { fontSize: layout.fontSize, top: layout.blockTop } : undefined}
        >
          {lines.map((line, i) => (
            <span
              key={`${line}-${i}`}
              className={styles.line}
              style={layout?.lineScales[i] ? { transform: `scaleX(${layout.lineScales[i]})` } : undefined}
            >
              {renderGlyphs(line, styles.glyph, layout?.glyphTransforms[i])}
            </span>
          ))}
        </span>
      </span>
    </Heading>
  )
}

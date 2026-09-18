/*
 * Collage layouts are templates: every position is a percentage of the card, so a layout scales with the card
 * and any campaign can use it. Campaign data only supplies photos and copy; paper, tape and texture live here.
 *
 * Boxes are measured from the visible paper in Figma. Artwork must be trimmed to its visible edges to match,
 * which scripts/prepare-collage-asset.mjs does.
 */

export type Box = {
  left: string
  top?: string
  /** Anchor from the bottom instead, e.g. so a title's last line sits on a shared baseline */
  bottom?: string
  width?: string
  height?: string
  rotate?: number
  z?: number
  /** Parallax depth, 0 = still, 1 = moves most; artwork defaults to its stacking order, text to 0 */
  depth?: number
}

export type PhotoSlot = 'hero' | 'detail'

export type CollagePiece =
  /** Campaign photo cut to the paper's torn shape; `texture` lays the paper back on top with hard-light blending */
  | ({ kind: 'photo'; slot: PhotoSlot; shape: string; texture?: boolean } & Box)
  /** Decorative paper, tape or scrap */
  | ({ kind: 'paper'; src: string } & Box)
  /**
   * Paper that holds the campaign highlights; padding percentages are relative to the note's width and keep the
   * text clear of the torn edges. Text is auto-sized to fit between them.
   */
  | ({ kind: 'note'; src: string; padding: string; /** Centre the text block within the padded paper */ align?: 'start' | 'center' } & Box)
  | ({ kind: 'brand'; orientation: 'vertical' | 'horizontal' } & Box)
  | ({ kind: 'number' } & Box)
  | ({ kind: 'title' } & Box)
  | ({ kind: 'cta' } & Box)

export type CollageLayout = {
  /** Width ÷ height of the card canvas */
  aspectRatio: number
  /** Rendered in order; `z` controls stacking */
  pieces: CollagePiece[]
}

const ASSETS = '/assets/work'

export const PAPER = {
  portraitA: `${ASSETS}/paper/torn-portrait-a.webp`,
  portraitB: `${ASSETS}/paper/torn-portrait-b.webp`,
  portraitC: `${ASSETS}/paper/torn-portrait-c.webp`,
  note: `${ASSETS}/paper/torn-note.webp`,
  stripDark: `${ASSETS}/paper/torn-strip-dark.webp`,
  crumpleSmall: `${ASSETS}/paper/crumple-small.webp`,
  crumplePortrait: `${ASSETS}/paper/crumple-portrait.webp`,
  crumpleLarge: `${ASSETS}/paper/crumple-large.webp`,
  tapePaper: `${ASSETS}/paper/tape-paper.webp`,
} as const

// Both cards share the proportions of the Figma artboard halves
const CARD_RATIO = 500 / 593

// Shared bottom row: both CTAs sit on the same line, and the title's last line ends level with their bottom edge
const CTA_ROW = { top: '87.5%', height: '6%', width: '26%' }
const BASELINE_BOTTOM = '6.5%'

export const collageLayouts = {
  /** Brand runs vertically down the left edge, title sits below the hero */
  'brand-vertical': {
    aspectRatio: CARD_RATIO,
    pieces: [
      { kind: 'paper', src: PAPER.stripDark, left: '86.4%', top: '-0.8%', width: '11.6%', height: '64%', z: 1 },
      { kind: 'photo', slot: 'hero', shape: PAPER.portraitA, left: '19%', top: '0%', width: '62%', height: '72.5%', z: 2 },
      { kind: 'note', src: PAPER.note, padding: '54% 12% 0 12%', left: '68.4%', top: '3.4%', width: '26.6%', height: '32%', z: 3 },
      { kind: 'photo', slot: 'detail', shape: PAPER.crumpleSmall, texture: true, left: '71.6%', top: '32%', width: '23.4%', height: '29.5%', z: 4 },
      { kind: 'number', left: '3.6%', top: '5.9%', z: 6 },
      { kind: 'brand', orientation: 'vertical', left: '3%', top: '9.3%', width: '14.6%', height: '62.4%', z: 6 },
      { kind: 'title', left: '4%', bottom: BASELINE_BOTTOM, width: '69.6%', z: 6 },
      { kind: 'cta', left: '74%', ...CTA_ROW, z: 6 },
    ],
  },
  /** Brand spans the top as a banner; portrait hero with a textured detail beside it and highlights below */
  'brand-banner': {
    aspectRatio: CARD_RATIO,
    pieces: [
      { kind: 'paper', src: PAPER.crumpleLarge, left: '8%', top: '54.8%', width: '8%', height: '15.2%', z: 1 },
      { kind: 'photo', slot: 'hero', shape: PAPER.portraitC, left: '8%', top: '18.5%', width: '58%', height: '75%', z: 2 },
      { kind: 'paper', src: PAPER.tapePaper, left: '6%', top: '24.4%', width: '12%', height: '35.4%', z: 3 },
      { kind: 'note', src: PAPER.note, padding: '9% 11%', align: 'center', left: '9%', top: '79%', width: '31%', height: '19.5%', z: 4 },
      { kind: 'photo', slot: 'detail', shape: PAPER.crumplePortrait, texture: true, left: '60%', top: '29.5%', width: '41%', height: '49%', z: 5 },
      { kind: 'number', left: '3.2%', top: '2.5%', z: 7 },
      { kind: 'brand', orientation: 'horizontal', left: '2.4%', top: '6.4%', width: '92%', height: '11.3%', z: 7 },
      { kind: 'cta', left: '67.6%', ...CTA_ROW, z: 7 },
    ],
  },
} satisfies Record<string, CollageLayout>

export type CollageLayoutName = keyof typeof collageLayouts

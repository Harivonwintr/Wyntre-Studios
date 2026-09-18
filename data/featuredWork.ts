import type { CollageLayoutName, PhotoSlot } from '@/components/collage/layouts'

export type CollagePhoto = {
  src: string
  alt: string
  /** CSS object-position, e.g. '40% 30%' */
  focus?: string
  /** Values above 1 zoom into the focus point */
  zoom?: number
}

export type FeaturedWork = {
  slug: string
  brand: string
  title: string
  /** Manual line breaks for the title; balanced automatically when omitted */
  titleLines?: string[]
  href: string
  layout: CollageLayoutName
  /** Lines written on the paper note */
  highlights: string[]
  photos: Record<PhotoSlot, CollagePhoto>
}

// Swap campaigns by editing these entries; the layout templates keep the paper, tape and composition.
// Prepare new photos with: node scripts/prepare-collage-asset.mjs <input> <output.webp> photo
export const featuredWork: FeaturedWork[] = [
  {
    slug: 'nivea',
    brand: 'NIVEA',
    title: 'Global Campaign Infrastructure',
    titleLines: ['Global Campaign', 'Infrastructure'],
    href: '/work/nivea',
    layout: 'brand-vertical',
    highlights: ['4+ YEARS', '12+ Markets', 'TVC / SOCIAL / DOOH', '100+ Assets'],
    photos: {
      hero: {
        src: '/assets/work/campaigns/nivea/hero.webp',
        alt: 'Model applying NIVEA serum with a dropper',
        focus: '40% 45%',
      },
      detail: {
        src: '/assets/work/campaigns/nivea/hero.webp',
        alt: '',
        // Framed on the eye with the dropper
        focus: '45% 37%',
        zoom: 3,
      },
    },
  },
  {
    slug: 'nestle',
    brand: 'NESCAFÉ',
    title: 'Built to scale',
    href: '/work/nescafe',
    layout: 'brand-banner',
    highlights: ['BRAND FILMS', 'SOCIAL CUTDOWNS', 'VFX', 'VERSIONING', 'EUMEA + APAC'],
    photos: {
      hero: {
        src: '/assets/work/campaigns/nescafe/hero.webp',
        alt: 'Iced coffee being shaken in a glass',
        focus: '64% 62%',
        zoom: 1.25,
      },
      detail: {
        src: '/assets/work/campaigns/nescafe/detail.webp',
        alt: 'Woman sipping hot chocolate from a glass mug',
        focus: '62% 55%',
      },
    },
  },
]

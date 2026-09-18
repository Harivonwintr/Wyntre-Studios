import type { Metadata } from 'next'

export const SITE_URL = 'https://www.wyntrestudios.com'
export const SITE_NAME = 'Wyntre Studios'

type PageMeta = {
  /** Page title; the site name is added after it by the root layout's template */
  title?: string
  description: string
  /** Link preview from public/og, 1200 × 630 (see scripts/make-share-images.mjs) */
  image?: string
  imageAlt?: string
}

/**
 * Title, description and link preview for one page. Next replaces rather than merges a parent's openGraph, so every
 * page that sets its own passes the full set here.
 */
export function pageMeta({ title, description, image = '/og/home.jpg', imageAlt = SITE_NAME }: PageMeta): Metadata {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const images = [{ url: image, width: 1200, height: 630, alt: imageAlt }]
  return {
    ...(title ? { title } : {}),
    description,
    openGraph: { type: 'website', siteName: SITE_NAME, title: fullTitle, description, images },
    twitter: { card: 'summary_large_image', title: fullTitle, description, images: [image] },
  }
}

'use client'

import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { WorkItem } from '@/data/workItems'

interface WorkGridProps {
  items: WorkItem[]
  showCaseStudies?: boolean
  showCampaignRange?: boolean
  onItemClick?: (item: WorkItem) => void
}

export default function WorkGrid({ items, showCaseStudies, showCampaignRange, onItemClick }: WorkGridProps) {
  const router = useRouter()
  const pathname = usePathname()

  // Map case study slugs to their routes
  const getCaseStudyRoute = (item: WorkItem): string => {
    // NIVEA case study
    if (item.client === 'NIVEA' && item.campaign === 'Global Campaign Infrastructure') {
      return '/work/nivea'
    }
    // Nestlé case study - route to NESCAFE page (NESCAFE is a Nestlé brand)
    if (item.client === 'Nestlé' && item.campaign === 'Product Textures') {
      return '/work/nescafe'
    }
    // Fallback to slug-based route
    return `/work/${item.slug}`
  }

  const caseStudies = showCaseStudies ? items.slice(0, 2) : []
  const campaignRange = showCampaignRange ? items.slice(2) : []

  return (
    <>
      {showCaseStudies && caseStudies.length > 0 && (
        <div className="cs-grid">
          {caseStudies.map((item) => {
            const caseStudyRoute = getCaseStudyRoute(item)
            return (
              <Link 
                key={item.slug}
                href={caseStudyRoute}
                className="card ratio-2-3 cs-card"
                style={{ textDecoration: 'none', display: 'block' }}
                onClick={() => {
                  // Store origin page path and scroll position before navigating
                  if (typeof window !== 'undefined') {
                    sessionStorage.setItem('caseStudyOriginPath', pathname || '/')
                    sessionStorage.setItem('caseStudyOriginScroll', window.scrollY.toString())
                    sessionStorage.setItem('navigatingToCaseStudy', 'true')
                  }
                }}
              >
                <Image
                  src={item.posterUrl}
                  alt={`${item.client} - ${item.campaign}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="grad"></div>
                <div className="card-content">
                  <div className="card-title">{item.client} | {item.campaign}</div>
                  <div className="card-description">
                    <p>{item.delivery}</p>
                    <p>{item.markets.join(', ')}</p>
                  </div>
                  <div className="card-read-more">
                    READ MORE →
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {showCampaignRange && campaignRange.length > 0 && (
        <div className="campaign-grid">
          {campaignRange.map((item) => (
            <article
              key={item.slug}
              className="campaign-card tilt-card"
              data-tilt="3"
              data-scale="1.02"
              onClick={() => onItemClick?.(item)}
              style={{ cursor: onItemClick ? 'pointer' : 'default' }}
            >
              <Image
                src={item.posterUrl}
                alt={`${item.client} - ${item.campaign}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 33vw"
              />
              <div className="grad"></div>
              <div className="cap">{item.client} | {item.campaign}</div>
            </article>
          ))}
        </div>
      )}
    </>
  )
}


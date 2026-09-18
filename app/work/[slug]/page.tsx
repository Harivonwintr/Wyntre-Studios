'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import CaseStudyModal from '@/components/CaseStudyModal'
import { getWorkItemBySlug } from '@/data/workItems'
import { getCampaignRangeModalItems } from '@/utils/campaignUtils'

// Case studies have dedicated pages; every other work item opens in the campaign modal
const caseStudyRoutes: Record<string, string> = {
  'nivea-global-campaign-infrastructure': '/work/nivea',
  'nestle-product-textures': '/work/nescafe',
}

export default function WorkItemPage() {
  const params = useParams()
  const router = useRouter()
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug || ''

  const item = getWorkItemBySlug(slug)
  const modalItems = getCampaignRangeModalItems()
  // Match on the original image: the modal items now show live Stream posters
  const modalIndex = item
    ? modalItems.findIndex((modalItem) => (modalItem.stillUrl ?? modalItem.posterUrl) === item.posterUrl)
    : -1
  const redirectTo = caseStudyRoutes[slug] ?? (modalIndex < 0 ? '/work' : null)

  useEffect(() => {
    if (redirectTo) router.replace(redirectTo)
  }, [redirectTo, router])

  if (redirectTo) return null

  return (
    <CaseStudyModal
      isOpen
      onClose={() => router.push('/work#campaign-range')}
      items={modalItems}
      initialIndex={modalIndex}
    />
  )
}

import { CaseStudyItem } from '@/components/CaseStudyModal'
import { caseStudyItems } from '@/data/caseStudyItems'

/**
 * Filters out case study items from the modal (only show campaign range items)
 */
export function getCampaignRangeModalItems(): CaseStudyItem[] {
  return caseStudyItems.filter(
    (item) => 
      !(item.client === 'NIVEA' && item.campaign === 'Global Campaign Infrastructure') &&
      !(item.client === 'Nestlé' && item.campaign === 'Product Textures & Visualisation')
  )
}

/**
 * Find campaign range item index by matching posterUrl
 */
export function findCampaignRangeIndex(posterUrl: string): number {
  const campaignRangeModalItems = getCampaignRangeModalItems()
  const index = campaignRangeModalItems.findIndex(
    (item) => item.posterUrl === posterUrl
  )
  return index >= 0 ? index : 0
}


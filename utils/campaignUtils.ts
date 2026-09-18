import { CaseStudyItem } from '@/components/CaseStudyModal'
import { caseStudyItems } from '@/data/caseStudyItems'

/** Case study overview entries, which have their own pages rather than a film */
const isCaseStudyOverview = (item: CaseStudyItem) =>
  (item.client === 'NIVEA' && item.campaign === 'Global Campaign Infrastructure') ||
  (item.client === 'Nestlé' && item.campaign === 'Product Textures & Visualisation')

/** A frame from Cloudflare Stream at full HD; next/image resizes it for each slot */
export const streamPoster = (videoId: string, seconds: number) =>
  `https://videodelivery.net/${videoId}/thumbnails/thumbnail.jpg?time=${seconds}s&height=1080`

/** Films with a Stream video show a live frame from it instead of the old exported PNG */
const withLivePoster = (item: CaseStudyItem): CaseStudyItem =>
  item.streamVideoId
    ? {
        ...item,
        stillUrl: item.posterUrl,
        posterUrl: streamPoster(item.streamVideoId, item.posterTime ?? (item.startTime ?? 0) + 3),
      }
    : item

/**
 * Films for the home page and case study film strips: excludes the case study overviews and library-only entries
 */
export function getCampaignRangeModalItems(): CaseStudyItem[] {
  return caseStudyItems.filter((item) => !isCaseStudyOverview(item) && !item.libraryOnly).map(withLivePoster)
}

/**
 * Every film for the Work page library, including library-only entries
 */
export function getFilmLibraryItems(): CaseStudyItem[] {
  return caseStudyItems.filter((item) => !isCaseStudyOverview(item)).map(withLivePoster)
}

/**
 * Find campaign range item index by matching posterUrl
 */
export function findCampaignRangeIndex(posterUrl: string): number {
  const campaignRangeModalItems = getCampaignRangeModalItems()
  const index = campaignRangeModalItems.findIndex(
    (item) => (item.stillUrl ?? item.posterUrl) === posterUrl
  )
  return index >= 0 ? index : 0
}

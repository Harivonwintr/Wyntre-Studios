export type CampaignItem = {
  client: string
  campaign: string
  year: string
  campaignType: string

  agency: string
  roleTitle: string
  roleDetail?: string

  scope: string
  markets: string
  delivery: string
  challenge: string

  posterUrl: string
  streamVideoId?: string

  // Optional presentation extras; the showcase hides anything left out
  /** Overrides the default brand blue used for the brand name and highlights */
  brandColor?: string
  /** Manual line breaks for the campaign title; lines are balanced automatically when omitted */
  titleLines?: string[]
  tagline?: string
  description?: string
  /** Formats row; shows DEFAULT_FORMATS from CampaignFormats when omitted */
  formats?: string[]
  caseStudyHref?: string
  /** Runtime shown on campaign range thumbnails as mm:ss:ff at 25fps, measured from the Stream master, e.g. '00:26:18' */
  duration?: string
  /** Format label on campaign range cards and its filter: 'TVC' or 'Digital'; defaults to 'TVC' */
  format?: string
  /** Show only in the Work page film library, not the home page film strip */
  libraryOnly?: boolean
  /** Seconds into the film where playback should begin, for masters with a slate or black at the head */
  startTime?: number
  /** Frame (in seconds) to pull as the live Stream poster; defaults to three seconds after the start */
  posterTime?: number
  /** The local image the entry was defined with, kept to match older /work/[slug] links once the poster is live */
  stillUrl?: string
}

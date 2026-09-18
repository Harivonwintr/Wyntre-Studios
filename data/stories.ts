export type Story = {
  slug: string
  client: string
  campaign: string
  image: string
  imageAlt: string
  /** Quick facts beside the title, e.g. deliverables, deadline, turnaround */
  facts: { label: string; value: string }[]
  /** 01 The brief */
  brief: string
  /** 02 What went wrong */
  problem: string
  /** 03 What we did, one entry per step */
  steps: string[]
  /** 04 The result */
  result: string
  /** 05 The lesson: one takeaway */
  lesson: string
  /** Stream uids of the campaign's films, in series order; each must also be in caseStudyItems */
  series?: string[]
  /** Cloudflare Stream uid for the breakdown video, once recorded */
  videoId?: string
  /** Drafts show a "Story in progress" note and are hidden from search engines */
  draft?: boolean
}

// Placeholder copy until each story is written; replace the TBC values and set draft to false to publish.
const TBC = 'TBC'
const DRAFT_COPY = 'To be written.'

export const stories: Story[] = [
  {
    slug: 'nescafe-gold-summer',
    client: 'NESCAFÉ',
    campaign: 'Gold Summer',
    image: '/assets/Rescue 1.png',
    imageAlt: 'NESCAFÉ Gold Summer campaign still',
    facts: [
      { label: 'Deliverables', value: '7 masters · 120 versions' },
      { label: 'Deadline', value: '7 days' },
      { label: 'Turnaround', value: 'Delivered a day early' },
      { label: 'Services', value: 'Edit · Finishing · Versioning' },
    ],
    brief:
      'Monday morning, 3 April 2023. A last-minute brief: seven masters, each with its variations, due the following Monday. Which meant approval by Friday.',
    problem:
      'Briefs like this rarely arrive fresh. The previous editor had walked away when the job got overwhelming, and the agency was left holding someone else’s mess with a week on the clock. There was one other problem. I was booked in for surgery on Friday.',
    steps: [
      'Took over the inherited footage, cleaned it up, and got the edit to a standard the agency was happy with.',
      'Built out all seven masters and their variations. By Thursday everything was locked, with 120 deliverables ready to go.',
      'Then the late feedback landed. A “small” change on seven masters means reworking all 120 versions, so I handed the changes to a sister studio before going in.',
      'The changes overwhelmed them, and the only person left who could finish the job was me. I came out of surgery, sat back down in bandages, and worked through the fixes over the weekend.',
    ],
    result: 'Delivered on Sunday, a day ahead of the deadline. By Monday the client was happy, and I could finally rest.',
    lesson:
      'There’s no such thing as a small change on a campaign. One note on a master touches every version cut from it, so build every job expecting it to change at the last minute.',
    // 1 of the 7 films uploaded so far; add the rest here as they go up on Stream
    series: ['cd632157f90fe67e63ac7d9ae5b2dbe8'],
  },
  {
    slug: 'nivea-black-and-white',
    client: 'NIVEA',
    campaign: 'Black & White',
    image: '/assets/Rescue 2.png',
    imageAlt: 'NIVEA Men Black & White campaign still with Real Madrid players',
    facts: [
      { label: 'Deliverables', value: '15 films · key visuals' },
      { label: 'Deadline', value: 'Before flighting' },
      { label: 'Turnaround', value: '19 days' },
      { label: 'Services', value: 'VFX paint-out · Retouch' },
    ],
    brief:
      '9 May 2023. Fifteen films for NIVEA Men’s Black & White campaign with Real Madrid. A new partner for us at the time, and one of the biggest clubs in the world.',
    problem:
      'Everything went to plan. The campaign was approved and about to flight. Then Real Madrid told the agency Eden Hazard was leaving the club, and his face couldn’t be used anymore. The agency was looking at a reshoot, or pulling the campaign.',
    steps: [
      'Proposed a fix that kept the approved campaign intact: no reshoot, no pulled media.',
      'Painted Hazard out of the films.',
      'Replaced his key visuals with the shirt, so the campaign kept its hero image without the player.',
    ],
    result: 'Delivered on 28 May, on time. The campaign went out as planned, and everyone was happy.',
    lesson:
      'It sounds simple. But when everyone is panicking, the simple solution is often the hardest one to see.',
  },
  {
    slug: 'subway-love-island',
    client: 'Subway',
    campaign: 'x Love Island',
    image: '/assets/Rescure 3.png',
    imageAlt: 'Subway x Love Island campaign still',
    facts: [
      { label: 'Deliverables', value: '4 composite shots' },
      { label: 'Deadline', value: '72 hours' },
      { label: 'Turnaround', value: '36 hours' },
      { label: 'Services', value: 'Keying · Compositing' },
    ],
    brief:
      '30 May 2023. A brief from Prodigious UK for Subway’s Love Island campaign: key out the talent and composite them into a Subway background. It was already shot on green. What could go wrong?',
    problem:
      'Another job inherited from someone else, with 72 hours on the clock. One of the talent had blonde hair against the green screen, and the previous studio couldn’t pull a clean key. Fine, light hair picks up green spill and falls apart the moment you key it.',
    steps: [
      'Split the shot into several composite layers instead of asking one key to do everything.',
      'Pulled a main key for the talent, then isolated the hair and recovered it with a different technique.',
      'Brought the recovered hair back onto the footage and slowly reintroduced the fine detail.',
    ],
    result: 'Delivered by end of day on 31 May. Done in 36 hours, with half the deadline to spare.',
    lesson: 'When one key can’t do it all, don’t force it. Break the problem into layers and solve each one on its own.',
    series: ['c4b78c5fc8e599210dfcd1714d3eccfc'],
  },
]

export const getStory = (slug: string) => stories.find((story) => story.slug === slug)

/** The story after this one, wrapping to the first */
export const getNextStory = (slug: string) => {
  const i = stories.findIndex((story) => story.slug === slug)
  return stories[(i + 1) % stories.length]
}

/** Placeholder text is styled differently so drafts read as unfinished rather than broken */
export const isPlaceholder = (text: string) => text === DRAFT_COPY || text === TBC

import { streamPoster } from '@/utils/campaignUtils'

/** Before and after of the same frame */
type Compare = { before: string; after: string; alt: string; caption?: string }

export type CaseStudyData = {
  /** Slug of the matching collage in data/featuredWork, shown as the page opener */
  collage: string
  brand: string
  /** Title beside the collage; an array sets each line, fitted so every line holds */
  title: string | string[]
  /** Position in the case study sequence, e.g. '01 / 02' */
  index: string
  /** The relationship, shown beside the collage */
  intro: string
  meta: { label: string; value: string }[]
  /** Our role: one large statement with a smaller supporting line */
  role: { statement: string; detail?: string }
  /** Full-width still that breaks up the story */
  still: { src: string; alt: string; caption: string }
  /** Operating at scale: big figures with a short supporting paragraph */
  scale: { stats: { value: string; label: string }[]; detail?: string }
  /** Key challenges paired with how they were handled */
  challenges?: { challenge: string; response: string }[]
  /** Short stories in place of the challenge table: a headline, a few lines, and what we did */
  stories?: {
    title: string
    body: string[]
    did: string
    /** A before/after pair of the same frame under the story; several sit side by side */
    compare?: Compare | Compare[]
    /** One shot in several aspect ratios, shown side by side under the story */
    formats?: {
      alt: string
      caption?: string
      /** Sit in the story column instead of spanning the full width */
      column?: boolean
      items: { src: string; ratio: number; label: string }[]
    }
  }[]
  /** Scope of work as short tags */
  scope: string[]
  /** Taped prints: a bold title, a line under it, and markets when confirmed */
  campaigns: { image: string; title: string; detail: string; markets?: string }[]
  /** Closing statements shown on the dark band; an array becomes separate paragraphs */
  closing: { title: string; body: string | string[] }[]
  next: { href: string; brand: string; title: string; image: string }
}

export const niveaCaseStudy: CaseStudyData = {
  collage: 'nivea',
  brand: 'NIVEA',
  title: ['Skin is for feeling it.', 'So are the campaigns.'],
  index: '01 / 02',
  intro: 'We worked closely with the NIVEA adaptation hub to roll out and launch products for NIVEA across EUMEA and APAC.',
  meta: [
    { label: 'Brand', value: 'NIVEA' },
    { label: 'Agency', value: 'Publicis One Touch' },
    { label: 'Scope', value: 'Adaptation / Motion / Delivery' },
    { label: 'Years active', value: '2021–2025' },
    { label: 'Markets', value: 'EUMEA / APAC' },
  ],
  role: {
    statement: 'Smooth skin. Smoother rollouts.',
    detail:
      'Rollouts, localization, motion and delivery under compressed timelines, plus the pipeline work that let one master turn into every market’s version.',
  },
  still: {
    src: '/assets/Video Post production.png',
    alt: 'NIVEA Q10 Anti-Wrinkle Expert campaign still',
    caption: 'NIVEA / Q10 Anti-Wrinkle Expert',
  },
  scale: {
    stats: [
      { value: '4+ years', label: 'Working together' },
      { value: '12+ markets', label: 'Campaign coverage' },
      { value: '100+ assets', label: 'Delivered' },
      { value: 'TVC · Social · DOOH', label: 'Formats' },
    ],
  },
  stories: [
    {
      title: 'Regional adaptations',
      body: [
        'The campaigns were already shot. Now they needed to be localized.',
        'Problem is, some markets don’t like seeing jewelry, other markets don’t use the same pack, and sometimes a scene or a file didn’t exist. Or perhaps a player decides to call it quits.',
        'We had a solution for everything.',
      ],
      did: 'Took locked-off footage, rebuilt the masters and templatized them for distribution across regions. We supported precision marketing rollouts and multi-format, multi-language delivery, adapting each campaign to fit its market.',
      compare: [
        {
          before: '/assets/work/campaigns/nivea/jewelry-before.webp',
          after: '/assets/work/campaigns/nivea/jewelry-after.webp',
          alt: 'NIVEA campaign frame of three women laughing, with the jewelry removed for a regional version',
          caption: 'NIVEA / Luminous Skin Glow',
        },
        {
          before: '/assets/work/campaigns/nivea/pack-before.webp',
          after: '/assets/work/campaigns/nivea/pack-after.webp',
          alt: 'NIVEA Radiant & Beauty Even Glow frame, with the pack swapped for a regional version',
          caption: 'NIVEA / Radiant & Beauty Even Glow',
        },
      ],
    },
    {
      title: 'New product launches',
      body: [
        'We helped Publicis One Touch with various shoots and campaigns to launch new products. This meant the full conceptualizing treatments, executing assets on creative direction and considering scale.',
      ],
      did: 'We worked closely with the team to ensure that the brand and creative aligned with the audience. This helped successful campaign rollouts across several markets.',
      formats: {
        alt: 'On set for VFX supervision on the NIVEA Derma Skin Clear shoot',
        caption: 'On set for VFX / NIVEA Derma Skin Clear',
        // Beside the story rather than full width: two photos, not a spread
        column: true,
        items: [
          { src: '/assets/work/campaigns/nivea/bts/img_4001.webp', ratio: 3 / 4, label: 'Monitor' },
          { src: '/assets/work/campaigns/nivea/bts/img_4024.webp', ratio: 3 / 4, label: 'Macro' },
        ],
      },
    },
  ],
  scope: [
    'Adaptation & localization',
    'Multi-format cutdowns',
    'Motion design & FX',
    'Broadcast & digital delivery',
    'Technical & pipeline support',
  ],
  campaigns: [
    { image: '/assets/campaign1.png', title: 'Black & White Clear Spray', detail: 'EMEA / LATAM' },
    { image: '/assets/campaign2.png', title: 'Q10 Dual Action Serum', detail: 'Europe' },
    { image: '/assets/campaign3.png', title: 'Body Milk', detail: 'Europe' },
  ],
  closing: [
    {
      title: 'Why it worked',
      body: [
        'Instead of reshooting an ad for every market, every year, NIVEA could repurpose existing campaigns and keep them current with clever post-production.',
        'That let NIVEA reach wider markets at a fraction of the cost, and put more of the budget into higher-quality masters.',
      ],
    },
  ],
  next: {
    href: '/work/nescafe',
    brand: 'NESCAFÉ',
    title: 'Built to scale',
    image: '/assets/Nescafe Case Study Hero.png',
  },
}

export const nescafeCaseStudy: CaseStudyData = {
  collage: 'nestle',
  brand: 'NESCAFÉ',
  title: 'Built to scale',
  index: '02 / 02',
  intro: 'For more than four years, we worked across NESCAFÉ campaigns spanning EUMEA and APAC.',
  meta: [
    { label: 'Brand', value: 'NESCAFÉ' },
    { label: 'Agency', value: 'Publicis' },
    { label: 'Scope', value: 'Post-production / VFX / Adaptation' },
    { label: 'Years active', value: '2021–2025' },
    { label: 'Markets', value: 'EUMEA / APAC' },
  ],
  role: {
    statement: 'Helping Publicis make a lot of coffee.',
    detail:
      'We worked with Publicis as a post-production partner across NESCAFÉ, Starbucks at Home and NESCAFÉ Dolce Gusto, helping launch everything from instant coffee and new recipes to coffee machines and product collaborations.',
  },
  still: {
    src: '/assets/Problem Solving.png',
    alt: 'NESCAFÉ Europe Cold campaign still',
    caption: 'NESCAFÉ / Europe Cold',
  },
  scale: {
    stats: [
      { value: '4+ years', label: 'Working together' },
      { value: 'EUMEA + APAC', label: 'Campaign coverage' },
      { value: '120 versions', label: 'From a single rollout' },
      { value: 'Always-on + launches', label: 'Across the portfolio' },
    ],
  },
  stories: [
    {
      title: 'Generating supply to meet the demand',
      body: [
        'The NESCAFÉ portfolio is enormous.',
        'Instant coffee, machines, recipes, collaborations, new products and new ways of drinking coffee, all launching across different markets, formats and platforms.',
        'The challenge wasn’t just making more content. It was building a process that could handle the volume without treating every product like it was coming off the same production line.',
      ],
      did: 'Built repeatable post-production workflows around each master, then adapted them across markets, formats and deliverables without losing the care put into the original work.',
      formats: {
        alt: 'NESCAFÉ Gold iced latte packshot',
        items: [
          { src: '/assets/work/campaigns/nescafe/format-16x9.webp', ratio: 16 / 9, label: '16:9 · Master' },
          { src: '/assets/work/campaigns/nescafe/format-4x5.webp', ratio: 4 / 5, label: '4:5 · Feed' },
          { src: '/assets/work/campaigns/nescafe/format-9x16.webp', ratio: 9 / 16, label: '9:16 · Stories' },
        ],
      },
    },
    {
      title: 'Fingerprints on glasses',
      body: [
        'Sometimes the problem really is that small.',
        'Fingerprints. Reflections. Product cleanup, liquid spills. Beauty work. Comp fixes. Tiny things nobody watching the final film should ever notice.',
        'A lot of the job was making sure you didn’t notice the job.',
      ],
      did: 'Fix what needed fixing. Leave everything else alone.',
      compare: {
        before: '/assets/work/campaigns/nescafe/cleanup-before.webp',
        after: '/assets/work/campaigns/nescafe/cleanup-after.webp',
        alt: 'NESCAFÉ glass mug with coffee drips running over the logo',
      },
    },
  ],
  scope: [
    'Online & offline post',
    'Color grading',
    'Retouching & beauty',
    'Compositing & VFX',
    'Global master adaptation',
    'Social TVCs & cutdowns',
    'Selected TVC support',
  ],
  campaigns: [
    // Live frames from the films on Stream
    { image: streamPoster('2813fcc35661ee9d82bfafec59bda35b', 5), title: 'Espresso Martini', detail: 'Brand film / Social / Adaptation' },
    { image: streamPoster('fc3826724cfe13029ae276a1297bf1e3', 3), title: 'Dolce Gusto: Neo Machine', detail: 'Product film / Post / VFX' },
    {
      image: streamPoster('17c59bc3c3298bbce45b5ef6a79afe80', 3),
      title: 'NESCAFÉ Gold: White Russian Winter Berry',
      detail: 'Brand film / Post / Versioning',
    },
  ],
  closing: [
    {
      title: 'Why it worked',
      body: [
        'Publicis needed enough post-production capacity to keep an enormous portfolio moving without sacrificing the quality of the work.',
        'Over four years, we helped provide that capacity and kept the work consistent across thousands of deliverables.',
      ],
    },
  ],
  next: {
    href: '/work/nivea',
    brand: 'NIVEA',
    title: 'Skin is for feeling it. So are the campaigns.',
    image: '/assets/Nivea Case Study Hero.png',
  },
}

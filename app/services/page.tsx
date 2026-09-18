import Footer from '@/components/Footer'
import ContactSection from '@/components/ContactSection'
import ClientsSection from '@/components/ClientsSection'
import IntroBand from '@/components/IntroBand'
import ServiceDetails from '@/components/ServiceDetails'
import WhatDrivesUs, { type Point } from '@/components/WhatDrivesUs'
import { pageMeta } from '@/utils/seo'

export const metadata = pageMeta({
  title: 'Services',
  description: 'Editing, color, VFX, sound and delivery for brands and agencies, from the first cut to every market’s version.',
})

// Reasons a producer can repeat to their boss, each backed by something on the site
const REASONS: Point[] = [
  {
    title: ['You talk to the people', 'doing the work.'],
    body: 'No account layer between your notes and the timeline.',
  },
  {
    title: ['Edit, color, VFX, motion.', 'One roof.'],
    body: 'Fewer handoffs, and nothing lost between suppliers.',
  },
  {
    title: ['Built for', 'volume.'],
    body: '10,000+ assets across 40+ markets, with every version still matching the master.',
  },
  {
    title: ['We take the', 'rescue jobs.'],
    body: 'Given 72 hours, we’ve delivered in 36. Tight turnarounds are part of the job, not a crisis.',
  },
]

export default function ServicesPage() {
  return (
    <>
      <IntroBand
        id="spine-seq"
        index="[01]"
        label="Services"
        lead="We don’t just cut"
        hero="the bullshit."
        accent="bullshit."
        image={{ src: '/assets/Studio.png', focus: '52% 50%' }}
      />

      <ServiceDetails />

      <ClientsSection />

      <WhatDrivesUs
        id="why-wyntre"
        index="[03]"
        eyebrow="Why Wyntre"
        intro={null}
        lead="Less between you"
        hero="and the work."
        accent="work."
        points={REASONS}
        ctaHref="#contact"
        ctaLabel="Start a project"
        artwork={null}
        centered
      />

      <ContactSection id="contact" index="[04]" />

      <Footer />
    </>
  )
}

'use client'

import { useState } from 'react'
import Footer from '@/components/Footer'
import CaseStudyModal from '@/components/CaseStudyModal'
import ContactSection from '@/components/ContactSection'
import IntroBand from '@/components/IntroBand'
import OurWork from '@/components/collage/OurWork'
import CampaignRange from '@/components/campaign/CampaignRange'
import RescueStories from '@/components/RescueStories'
import { getFilmLibraryItems } from '@/utils/campaignUtils'

// The full film library (including library-only entries), created once so the modal receives a stable array
const campaignRangeItems = getFilmLibraryItems()

const STATS = [
  { value: '10,000+', label: 'Assets delivered' },
  { value: '40+', label: 'Markets' },
  { value: '4+ yrs', label: 'Longest partnership' },
  { value: '48h', label: 'Fastest turnaround' },
]

export default function WorkPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const openCampaign = (index: number) => {
    setSelectedIndex(index)
    setIsModalOpen(true)
  }

  return (
    <div className="work-page">
      <IntroBand
        id="spine-seq"
        index="[01]"
        label="Our work"
        lead="More than showreel moments."
        hero="Built to last."
        accent="last."
        stats={STATS}
        centered
      />

      <CampaignRange
        id="campaign-range"
        index="[02]"
        items={campaignRangeItems}
        onSelect={openCampaign}
        collectionHref={null}
        layout="grid"
        statement={null}
        description={null}
      />

      <OurWork
        id="case-studies"
        index="[03]"
        heading="Case studies"
        compact
        intro={[]}
        cta={null}
      />

      <RescueStories />

      <ContactSection id="contact" />

      <Footer />

      <CaseStudyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        items={campaignRangeItems}
        initialIndex={selectedIndex}
      />
    </div>
  )
}

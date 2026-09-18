'use client'

import { useState } from 'react'
import Footer from '@/components/Footer'
import CaseStudyModal from '@/components/CaseStudyModal'
import ContactSection from '@/components/ContactSection'
import OurWork from '@/components/collage/OurWork'
import WhatDrivesUs from '@/components/WhatDrivesUs'
import SpineSection from '@/components/SpineSection'
import ClientsSection from '@/components/ClientsSection'
import DrivesCollage from '@/components/DrivesCollage'
import { caseStudyItems } from '@/data/caseStudyItems'
import { useScrollAnimations } from '@/hooks/useScrollAnimations'
import { useTiltCard } from '@/hooks/useTiltCard'
import { getCampaignRangeModalItems } from '@/utils/campaignUtils'
import CampaignRange from '@/components/campaign/CampaignRange'

// Static list, created once so the modal receives a stable array
const campaignRangeItems = getCampaignRangeModalItems()

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  useScrollAnimations()
  useTiltCard()

  const openCampaign = (index: number) => {
    setSelectedIndex(index)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <>

      {/* What we do / Services */}
      <SpineSection />

      {/* Our Work */}
      <OurWork flight />

      {/* Campaign Range */}
      <CampaignRange
        index="[03]"
        items={campaignRangeItems}
        onSelect={openCampaign}
        statement={null}
        description={null}
      />

      {/* Clients */}
      <ClientsSection />

      {/* What Drives Us */}
      <WhatDrivesUs artwork={<DrivesCollage />} />

      {/* Contact */}
      <ContactSection id="contact" />

      <Footer />

      <CaseStudyModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        items={campaignRangeItems}
        initialIndex={selectedIndex}
      />
    </>
  )
}


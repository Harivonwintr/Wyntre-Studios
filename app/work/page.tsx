'use client'

import { useState } from 'react'
import Footer from '@/components/Footer'
import WorkGrid from '@/components/WorkGrid'
import CaseStudyModal from '@/components/CaseStudyModal'
import OutlineButton from '@/components/OutlineButton'
import { workItems } from '@/data/workItems'
import { caseStudyItems } from '@/data/caseStudyItems'
import { useScrollAnimations } from '@/hooks/useScrollAnimations'
import { useTiltCard } from '@/hooks/useTiltCard'
import Image from 'next/image'
import { WorkItem } from '@/data/workItems'

export default function WorkPage() {
  const [activeRescueIndex, setActiveRescueIndex] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  
  useScrollAnimations()
  useTiltCard()

  // Filter out case study items from the modal (only show campaign range items)
  const campaignRangeModalItems = caseStudyItems.filter(
    (item) => 
      !(item.client === 'NIVEA' && item.campaign === 'Global Campaign Infrastructure') &&
      !(item.client === 'Nestlé' && item.campaign === 'Product Textures & Visualisation')
  )

  // Find campaign range item by matching posterUrl
  const findCampaignRangeIndex = (posterUrl: string): number => {
    const index = campaignRangeModalItems.findIndex(
      (item) => item.posterUrl === posterUrl
    )
    return index >= 0 ? index : 0
  }

  const handleCampaignRangeClick = (item: WorkItem) => {
    const index = findCampaignRangeIndex(item.posterUrl)
    setSelectedIndex(index)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <div className="work-page">

      {/* Services / Spine Section */}
      <section id="spine-seq" className="spine-band">
        <div className="spine-stage">
          <div className="work-beyond-reel" style={{ textAlign: 'center' }}>
            <h2 className="work-beyond-reel-heading">Beyond the reel</h2>
            <p className="work-beyond-reel-text">Wyntre has delivered over 10,000 assets across formats, languages, and regions.</p>
            <p className="work-beyond-reel-text">From global TVCs to toolkits, retouching, and last-minute rescues — we make it<br />land.</p>
          </div>
        </div>
      </section>

      <section className="section-light" style={{ paddingTop: '120px', paddingBottom: '4rem' }}>
        <div className="container">
          <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 4.2rem)', fontWeight: 800, marginBottom: '1rem', color: '#0a0b0d' }}>Our Work</h1>
            <p style={{ color: 'rgba(10, 11, 13, 0.75)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
              More than showreel moments — these were built to last. Multi-year campaign systems to quick-turn cutdowns — we've built post at every resolution.
            </p>
          </header>

          {/* Case Studies */}
          <div id="case-studies" style={{ marginBottom: '5rem' }}>
            <h2 className="cs-subheading">Case Studies</h2>
            <WorkGrid items={workItems} showCaseStudies={true} />
          </div>

          {/* Campaign Range */}
          <div id="campaign-range" style={{ marginBottom: '5rem' }}>
            <h2 className="campaign-heading" style={{ textAlign: 'left', marginBottom: '1rem' }}>Campaign Range</h2>
            <p className="campaign-description" style={{ textAlign: 'left', marginBottom: '3rem' }}>
              Beyond our long-term partnerships, we've delivered for dozens of campaigns across formats — from quick-turn TVCs to episodic longform.
            </p>
            <WorkGrid items={workItems} showCampaignRange={true} onItemClick={handleCampaignRangeClick} />
          </div>
        </div>
      </section>

      {/* Rescue Stories Section */}
      <section className="rescue-stories">
        <div className="container">
          <div className="rescue-stories-header">
            <h2 className="rescue-stories-title">Rescue Stories</h2>
            <p className="rescue-stories-tagline">We had 72 hours. Wyntre turned it around in 36.</p>
          </div>
          <div 
            className="rescue-stories-grid"
            onMouseLeave={() => setActiveRescueIndex(null)}
          >
            {[
              { image: '/assets/Rescue 1.png', client: 'NIVEA', campaign: 'Q10 Dual Action Serum', details: 'Editing · Color Grading' },
              { image: '/assets/Rescue 2.png', client: 'NIVEA', campaign: 'Body Milk', details: 'Editing · VFX' },
              { image: '/assets/Rescure 3.png', client: 'NIVEA Men', campaign: 'Black & White Real Madrid', details: 'Editing · Sound Design' }
            ].map((item, i) => {
              const isActive = activeRescueIndex === i
              const isDim = activeRescueIndex !== null && activeRescueIndex !== i
              
              return (
                <div
                  key={i}
                  className={`rescue-story-card ${isActive ? 'isActive' : ''} ${isDim ? 'isDim' : ''}`}
                  onMouseEnter={() => setActiveRescueIndex(i)}
                >
                  <div className="rescue-story-image">
                    <Image
                      src={item.image}
                      alt={`${item.client} ${item.campaign}`}
                      width={600}
                      height={400}
                      style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="rescue-story-caption">
                    <p className="rescue-story-client">{item.client} | {item.campaign}</p>
                    <p className="rescue-story-details">{item.details}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="container">
          <div className="contact-header">
            <h2>get in touch</h2>
            <p className="contact-subtitle">great stories begin with a conversation</p>
          </div>
          
          <div className="contact-content">
            <div className="contact-form">
              <form id="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" name="name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" required />
                </div>
                <div className="form-group">
                  <label htmlFor="company">Company</label>
                  <input type="text" id="company" name="company" />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" rows={5} required></textarea>
                </div>
                <OutlineButton type="submit">Send Message</OutlineButton>
              </form>
            </div>
            
            <div className="contact-info">
              <h3 className="contact-info-title">Contact Information</h3>
              
              <div className="info-item">
                <strong>Email</strong>
                <p><a href="mailto:hello@wyntrestudios.com">hello@wyntrestudios.com</a></p>
              </div>
              
              <div className="info-item">
                <strong>Address</strong>
                <p>
                  447 Broadway<br />
                  2nd Floor Suite #3012<br />
                  New York, New York 10013<br />
                  United States
                </p>
              </div>
              
              <div className="info-item">
                <strong>Office Hours</strong>
                <p>
                  Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                  Weekend appointments available by request
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <CaseStudyModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        items={campaignRangeModalItems}
        initialIndex={selectedIndex}
      />
    </div>
  )
}


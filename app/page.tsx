'use client'

import { useState } from 'react'
import Footer from '@/components/Footer'
import WorkGrid from '@/components/WorkGrid'
import CaseStudyModal from '@/components/CaseStudyModal'
import OutlineButton from '@/components/OutlineButton'
import ContactForm from '@/components/ContactForm'
import { workItems } from '@/data/workItems'
import { caseStudyItems } from '@/data/caseStudyItems'
import { useScrollAnimations } from '@/hooks/useScrollAnimations'
import { useTiltCard } from '@/hooks/useTiltCard'
import Image from 'next/image'
import Link from 'next/link'
import { WorkItem } from '@/data/workItems'

export default function Home() {
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
    <>

      {/* Services / Spine Section */}
      <section id="spine-seq" className="spine-band">
        <div className="spine-stage">
          <div className="spine-headline">
            <h2 className="sp-hdn h-spine">EVERY STORY NEEDS A SPINE.</h2>
            <h2 className="sp-line" aria-label="THIS IS OURS">
              <span className="ti-group">
                <span className="w this">THIS…</span>
                <span className="w is">IS…</span>
              </span>
              <span className="w ours">OURS</span>
            </h2>
          </div>

          <p className="sp-context">
            high-volume versioning to narrative-focused editing, we deliver post that hits every frame with intention.
          </p>

          <nav className="sp-services" aria-label="Services">
            <Link className="sp-item" href="/services#editing">Editing</Link>
            <Link className="sp-item" href="/services#grading">Color Grading</Link>
            <Link className="sp-item" href="/services#vfx">VFX</Link>
            <Link className="sp-item" href="/services#sound">Sound Design</Link>
            <Link className="sp-item" href="/services#delivery">Delivery &amp; Mastery</Link>
          </nav>

          <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center' }}>
            <OutlineButton href="/services" variant="white">LEARN MORE</OutlineButton>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section id="case-studies" className="cs section-light" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="container">
          <header className="cs-intro">
            <h2 className="cs-title">Stories We Helped Shape</h2>
            <p className="cs-kicker">
              More than showreel moments, these were built to last. Multi-year campaign systems to quick-turn cutdowns, we've built post at every resolution.
            </p>
          </header>

          <h3 className="cs-subheading">Case Studies</h3>

          <WorkGrid items={workItems} showCaseStudies={true} />
        </div>
      </section>

      {/* Campaign Range */}
      <section id="campaign-range" className="section-light">
        <div className="container">
          <h2 className="campaign-heading text-left mb-4">Campaign Range</h2>
          
          <p className="campaign-description text-left mb-12">
            Beyond our long-term partnerships, we've delivered for dozens of campaigns across formats — from quick-turn TVCs to episodic longform.
          </p>

          <WorkGrid items={workItems} showCampaignRange={true} onItemClick={handleCampaignRangeClick} />

          <div className="mt-6 flex justify-center">
            <div className="btn-container">
              <OutlineButton href="/work#campaign-range">FULL COLLECTION</OutlineButton>
            </div>
          </div>

          {/* Clients */}
          <div id="clients" className="clients-section">
            <div className="container">
              <h2 className="clients-heading">
                TRUSTED BY <span className="highlight">GLOBAL BRANDS</span>
              </h2>

              <div className="client-grid">
                <div className="client-logo"><Image src="/assets/clients/nivea.png" alt="Nivea" width={120} height={48} /></div>
                <div className="client-logo"><Image src="/assets/clients/starbucks.png" alt="Starbucks" width={120} height={48} /></div>
                <div className="client-logo"><Image src="/assets/clients/spotify.png" alt="Spotify" width={120} height={48} /></div>
                <div className="client-logo"><Image src="/assets/clients/nescafe.png" alt="Nescafe" width={120} height={48} /></div>
                <div className="client-logo"><Image src="/assets/clients/realmadrid.png" alt="Real Madrid" width={120} height={48} /></div>
                <div className="client-logo"><Image src="/assets/clients/subway.png" alt="Standard Bank" width={120} height={48} /></div>
                <div className="client-logo"><Image src="/assets/clients/visa.png" alt="Visa" width={120} height={48} /></div>
                <div className="client-logo"><Image src="/assets/clients/donjulio.png" alt="Don Julio" width={120} height={48} /></div>
                <div className="client-logo"><Image src="/assets/clients/pmi.png" alt="DN" width={120} height={48} /></div>
                <div className="client-logo"><Image src="/assets/clients/mcdonalds.png" alt="McDonalds" width={120} height={48} /></div>
                <div className="client-logo"><Image src="/assets/clients/Microsoft Logo.png" alt="Microsoft" width={120} height={48} /></div>
                <div className="client-logo"><Image src="/assets/clients/ibis.png" alt="Ibis Hotels" width={120} height={48} /></div>
                <div className="client-logo"><Image src="/assets/clients/comfort.png" alt="Comfort" width={120} height={48} /></div>
                <div className="client-logo"><Image src="/assets/clients/tork.png" alt="Tork" width={120} height={48} /></div>
                <div className="client-logo"><Image src="/assets/clients/publicis.png" alt="Sun" width={120} height={48} /></div>
                <div className="client-logo"><Image src="/assets/clients/discovery.png" alt="Volkswagen" width={120} height={48} /></div>
                <div className="client-logo"><Image src="/assets/clients/oldmutual.png" alt="Scissors" width={120} height={48} /></div>
                <div className="client-logo"><Image src="/assets/clients/fnb.png" alt="Yin" width={120} height={48} /></div>
                <div className="client-logo"><Image src="/assets/clients/mtn.png" alt="MTN" width={120} height={48} /></div>
                <div className="client-logo"><Image src="/assets/clients/springboks.png" alt="MTN" width={120} height={48} /></div>
                <div className="client-logo"><Image src="/assets/clients/playgirl.png" alt="MTN" width={120} height={48} /></div>
                <div className="client-logo"><Image src="/assets/clients/Xbox Logo.png" alt="Xbox" width={120} height={48} /></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Drives Us */}
      <section id="drives-seq" className="drives-section section-light">
        <div className="container">
          <div className="drives-grid">
            <div className="drives-image">
              <Image 
                src="/assets/what-drives-photo.png" 
                alt="Studio workspace" 
                className="drives-photo"
                width={800}
                height={600}
              />
            </div>

            <div className="drives-content">
              <h2 className="drives-title">What Drives Us</h2>
              <h3 className="drives-headline">WE MAKE<br />IMPOSSIBLE<br /><span>FEEL <span className="accent-blue">INEVITABLE</span></span></h3>
              
              <div className="drives-text">
                <p>Wyntre didn't start with hype. It started under pressure.<br />When timelines collapsed and expectations didn't.<br />We earned our name in the silence after everyone else logged off. Not through noise, but through consistency. Showing up. Again and again.</p>
                
                <p>We're problem-solvers. Designers who think ahead, and engineers who keep complex systems running when it matters. We blur disciplines, refine obsessively, and deliver with precision under constraint.<br /><br />Because some brands can't afford to get it wrong. And second chances never happen.</p>
              </div>

              <p className="drives-commitment">This isn't <span className="accent-blue">service.</span> It's a <span className="accent-blue">commitment.</span></p>
              
              <div className="btn-container">
                <OutlineButton href="/studio">LEARN MORE</OutlineButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="contact-section">
        <div className="container">
          <div className="contact-header">
            <h2>get in touch</h2>
            <p className="contact-subtitle">great stories begin with a conversation</p>
          </div>
          
          <div className="contact-content">
            <div className="contact-form">
              <ContactForm />
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
    </>
  )
}


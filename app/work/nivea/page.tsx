'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Footer from '@/components/Footer'
import WorkGrid from '@/components/WorkGrid'
import CaseStudyModal from '@/components/CaseStudyModal'
import OutlineButton from '@/components/OutlineButton'
import { workItems } from '@/data/workItems'
import { caseStudyItems } from '@/data/caseStudyItems'
import { findCampaignRangeIndex, getCampaignRangeModalItems } from '@/utils/campaignUtils'
import { WorkItem } from '@/data/workItems'

export default function NiveaCaseStudyPage() {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const handleCampaignRangeClick = (item: WorkItem) => {
    const index = findCampaignRangeIndex(item.posterUrl)
    setSelectedIndex(index)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleBack = () => {
    // Get the origin page from sessionStorage
    if (typeof window !== 'undefined') {
      const originPath = sessionStorage.getItem('caseStudyOriginPath') || '/work'
      sessionStorage.setItem('isBackNavigation', 'true')
      router.push(originPath)
    } else {
      router.push('/work')
    }
  }

  return (
    <>
      <div className="case-study-page-wrapper">
        
        <div className="case-study-page">
        {/* Hero Image */}
        <section className="case-study-hero">
          <div className="case-study-hero-title-wrapper">
            <button onClick={handleBack} className="case-study-back-arrow" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              ‹
            </button>
            <h1 className="case-study-title">NIVEA CASE STUDY</h1>
          </div>
          <div className="container">
            <Image
              src="/assets/Nivea Case Study Hero.png"
              alt="NIVEA Case Study"
              width={1200}
              height={600}
              className="case-study-hero-image"
              priority
            />
          </div>
        </section>

        {/* Overview Bar */}
        <section className="case-study-overview">
          <div className="container">
            <div className="case-study-overview-content">
              <div className="case-study-overview-grid">
                <div className="case-study-overview-item">
                  <div className="case-study-overview-label">Brand</div>
                  <div className="case-study-overview-value">NIVEA</div>
                </div>
                <div className="case-study-overview-item">
                  <div className="case-study-overview-label">Agency</div>
                  <div className="case-study-overview-value">Publicis</div>
                </div>
                <div className="case-study-overview-item">
                  <div className="case-study-overview-label">Scope</div>
                  <div className="case-study-overview-value">Global Post-Production &<br />Campaign Support</div>
                </div>
                <div className="case-study-overview-item">
                  <div className="case-study-overview-label">Years Active</div>
                  <div className="case-study-overview-value">2021-Present</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="case-study-content">
          <div className="container">
            {/* The Relationship */}
            <div className="case-study-section">
              <h2 className="case-study-section-heading">The Relationship</h2>
              <p className="case-study-section-text">
                Wyntre has been NIVEA's post-production partner for global and regional campaign delivery across broadcast and digital platforms. Our partnership focuses on consistency, speed, and scale—delivering high-quality assets that maintain brand integrity across diverse markets and formats.
              </p>
            </div>

            {/* Our Role */}
            <div className="case-study-section">
              <h2 className="case-study-section-heading">Our Role</h2>
              <p className="case-study-section-text">
                We support NIVEA teams in campaign rollouts, localization, motion support, and delivery—often under compressed timelines and evolving requirements. Our role extends beyond execution to include technical pipeline support and strategic guidance on post-production workflows.
              </p>
            </div>

            {/* Scope of Work */}
            <div className="case-study-section">
              <h2 className="case-study-section-heading">Scope of Work</h2>
              <ul className="case-study-list">
                <li>Campaign adaptation and localization</li>
                <li>Cutdowns across multiple formats and durations</li>
                <li>Motion design and FX support</li>
                <li>Broadcast and digital delivery</li>
                <li>Ongoing technical and pipeline support</li>
              </ul>
            </div>

            {/* Operating at Scale */}
            <div className="case-study-section">
              <h2 className="case-study-section-heading">Operating at Scale</h2>
              <p className="case-study-section-text">
                We support multiple campaigns simultaneously, managing parallel timelines, market-specific requirements, and brand-safe execution across regions. Our infrastructure is built to handle volume without compromising quality or turnaround times.
              </p>
              <ul className="case-study-list">
                <li>Dozens of cutdowns</li>
                <li>Multiple regions</li>
                <li>Repeated campaign cycles</li>
              </ul>
            </div>

            {/* Key Challenges */}
            <div className="case-study-section">
              <h2 className="case-study-section-heading">Key Challenges</h2>
              <ul className="case-study-list">
                <li>Adapting locked global masters for regional markets</li>
                <li>Maintaining visual consistency across evolving brand assets</li>
                <li>Responding to late-stage changes without impacting delivery</li>
                <li>Coordinating across agencies, markets, and delivery specs</li>
              </ul>
            </div>

            {/* How We Work */}
            <div className="case-study-section">
              <h2 className="case-study-section-heading">How We Work</h2>
              <ul className="case-study-list">
                <li>Structured pipelines to absorb late changes</li>
                <li>Clear handover and delivery processes</li>
                <li>Calm, responsive communication with brand and agency teams</li>
                <li>Emphasis on reliability over spectacle</li>
              </ul>
            </div>

            {/* Selected Campaigns */}
            <div className="case-study-section" style={{ maxWidth: '1200px' }}>
              <h2 className="case-study-section-heading">Selected Campaigns</h2>
              <div className="case-study-campaigns-grid">
                <div className="case-study-campaign-card">
                  <Image
                    src="/assets/campaign1.png"
                    alt="NIVEA Black and White Clear Spray"
                    width={400}
                    height={400}
                    className="case-study-campaign-image"
                  />
                  <div className="case-study-campaign-overlay">
                    <div className="case-study-campaign-title">NIVEA | Black and White Clear Spray</div>
                    <div className="case-study-campaign-location">Location: NYC, Colombia, Middle East</div>
                  </div>
                </div>
                <div className="case-study-campaign-card">
                  <Image
                    src="/assets/campaign2.png"
                    alt="NIVEA Black and White Checkmate"
                    width={400}
                    height={400}
                    className="case-study-campaign-image"
                  />
                  <div className="case-study-campaign-overlay">
                    <div className="case-study-campaign-title">NIVEA | Black and White Checkmate</div>
                    <div className="case-study-campaign-location">Location: NYC, Colombia, Middle East</div>
                  </div>
                </div>
                <div className="case-study-campaign-card">
                  <Image
                    src="/assets/campaign3.png"
                    alt="NIVEA Black and White Checkmate"
                    width={400}
                    height={400}
                    className="case-study-campaign-image"
                  />
                  <div className="case-study-campaign-overlay">
                    <div className="case-study-campaign-title">NIVEA | Black and White Checkmate</div>
                    <div className="case-study-campaign-location">Location: NYC, Colombia, Middle East</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Outcome */}
            <div className="case-study-section">
              <h2 className="case-study-section-heading">Outcome</h2>
              <p className="case-study-section-text">
                The partnership has enabled NIVEA to execute multiple campaign rollouts efficiently across markets, with consistent visual quality and dependable delivery under real-world constraints. Our operational approach ensures that campaigns launch on time, on brand, and at scale.
              </p>
            </div>

            {/* Why the Partnership Works */}
            <div className="case-study-section">
              <h2 className="case-study-section-heading">Why the Partnership Works</h2>
              <p className="case-study-section-text">
                By focusing on operational clarity and executional consistency, Wyntre functions as a dependable extension of NIVEA's broader production ecosystem rather than a one-off vendor. This approach builds trust, streamlines workflows, and delivers results that scale.
              </p>
            </div>

            {/* View our other Case Studies */}
            <div className="case-study-section" style={{ maxWidth: '1200px' }}>
              <h2 className="case-study-section-heading">View our other Case Studies</h2>
              <Link href="/work/nescafe" className="case-study-other-link">
                <Image
                  src="/assets/Nescafe Case Study Hero.png"
                  alt="NESCAFE Case Study"
                  width={1200}
                  height={600}
                  className="case-study-other-image"
                />
                <div className="case-study-other-overlay">
                  <div className="case-study-other-title">NESCAFE | Global Campaign Infrastructure</div>
                </div>
              </Link>
            </div>

            {/* Explore our work / Campaign Range */}
            <div id="campaign-range" className="case-study-section" style={{ maxWidth: '1200px' }}>
              <h2 className="case-study-section-heading">Campaign Range</h2>
              <p className="case-study-section-text" style={{ marginBottom: '3rem' }}>
                Beyond our long-term partnerships, we've delivered for dozens of campaigns across formats — from quick-turn TVCs to episodic longform.
              </p>
              <WorkGrid items={workItems} showCampaignRange={true} onItemClick={handleCampaignRangeClick} />
              <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                <OutlineButton href="/work#campaign-range">FULL COLLECTION</OutlineButton>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />

      <CaseStudyModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        items={getCampaignRangeModalItems()}
        initialIndex={selectedIndex}
      />
      </div>
    </>
  )
}


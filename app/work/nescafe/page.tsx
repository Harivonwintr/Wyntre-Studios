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

export default function NescafeCaseStudyPage() {
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
            <h1 className="case-study-title">NESCAFE CASE STUDY</h1>
          </div>
          <div className="container">
            <Image
              src="/assets/Nescafe Case Study Hero.png"
              alt="NESCAFE Case Study"
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
                  <div className="case-study-overview-value">NESCAFE</div>
                </div>
                <div className="case-study-overview-item">
                  <div className="case-study-overview-label">Agency</div>
                  <div className="case-study-overview-value">Publicis</div>
                </div>
                <div className="case-study-overview-item">
                  <div className="case-study-overview-label">Scope</div>
                  <div className="case-study-overview-value">Global Campaign Infrastructure</div>
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
                Wyntre partnered with NESCAFÉ to produce digital-first content across multiple global markets, supporting both always-on campaigns and major launches. Our relationship focused on delivering high-quality post-production across multiple formats, markets, and campaign types.
              </p>
            </div>

            {/* Our Role */}
            <div className="case-study-section">
              <h2 className="case-study-section-heading">Our Role</h2>
              <p className="case-study-section-text">
                We work closely with NESCAFÉ and its global teams, providing scalable post-production support across a wide range of deliverables. From social-first edits and versioning to high-end visual effects and compositing, we ensure consistency, speed, and creative excellence across all executions.
              </p>
            </div>

            {/* Scope of Work */}
            <div className="case-study-section">
              <h2 className="case-study-section-heading">Scope of Work</h2>
              <ul className="case-study-list">
                <li>Online and offline post-production</li>
                <li>Colour grading</li>
                <li>Retouching and beauty work</li>
                <li>Compositing and VFX support</li>
                <li>Adaptation of global master assets</li>
                <li>Social TVCs and digital cutdowns</li>
                <li>Selected TVC support</li>
              </ul>
            </div>

            {/* Operating at Scale */}
            <div className="case-study-section">
              <h2 className="case-study-section-heading">Operating at Scale</h2>
              <p className="case-study-section-text">
                We've supported NESCAFÉ's content ecosystem across multiple regions, often working on high-volume delivery pipelines that require speed, consistency, and precision. Our workflows are designed to handle large quantities of assets while maintaining quality across all outputs.
              </p>
              <ul className="case-study-list">
                <li>Multi-market versioning</li>
                <li>Platform-specific adaptations</li>
                <li>High-volume campaign asset delivery</li>
              </ul>
            </div>

            {/* Key Challenges */}
            <div className="case-study-section">
              <h2 className="case-study-section-heading">Key Challenges</h2>
              <ul className="case-study-list">
                <li>Adapting global master assets for local markets and broadcasters</li>
                <li>Supporting fast-turnaround content requirements at scale</li>
                <li>Maintaining brand consistency across diverse formats and executions</li>
                <li>Delivering high-quality compositing and VFX within tight timelines</li>
              </ul>
            </div>

            {/* How We Work */}
            <div className="case-study-section">
              <h2 className="case-study-section-heading">How We Work</h2>
              <ul className="case-study-list">
                <li>Close collaboration with creative and production teams on briefs</li>
                <li>Flexible workflows to support both high-touch and fast-turnaround work</li>
                <li>Scalable pipelines for multi-market rollouts</li>
                <li>Emphasis on precision, quality, and reliability</li>
              </ul>
            </div>

            {/* Selected Campaigns */}
            <div className="case-study-section" style={{ maxWidth: '1200px' }}>
              <h2 className="case-study-section-heading">Selected Campaigns</h2>
              <div className="case-study-campaigns-grid">
                <div className="case-study-campaign-card">
                  <Image
                    src="/assets/campaign1.png"
                    alt="NESCAFÉ Campaign"
                    width={400}
                    height={400}
                    className="case-study-campaign-image"
                  />
                  <div className="case-study-campaign-overlay">
                    <div className="case-study-campaign-title">NESCAFÉ | Core Brand</div>
                    <div className="case-study-campaign-location">Location: Global</div>
                  </div>
                </div>
                <div className="case-study-campaign-card">
                  <Image
                    src="/assets/campaign2.png"
                    alt="NESCAFÉ Campaign"
                    width={400}
                    height={400}
                    className="case-study-campaign-image"
                  />
                  <div className="case-study-campaign-overlay">
                    <div className="case-study-campaign-title">NESCAFÉ | Product Innovations</div>
                    <div className="case-study-campaign-location">Location: Global</div>
                  </div>
                </div>
                <div className="case-study-campaign-card">
                  <Image
                    src="/assets/campaign3.png"
                    alt="NESCAFÉ Campaign"
                    width={400}
                    height={400}
                    className="case-study-campaign-image"
                  />
                  <div className="case-study-campaign-overlay">
                    <div className="case-study-campaign-title">NESCAFÉ | Lifestyle Campaigns</div>
                    <div className="case-study-campaign-location">Location: Global</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Outcome */}
            <div className="case-study-section">
              <h2 className="case-study-section-heading">Outcome</h2>
              <p className="case-study-section-text">
                The partnership enabled NESCAFÉ to deliver a broad range of campaign assets across high-impact platforms, supporting consistent brand presence while accommodating varied creative needs and market requirements.
              </p>
            </div>

            {/* Why We Partnered with NESCAFÉ */}
            <div className="case-study-section">
              <h2 className="case-study-section-heading">Why We Partnered with NESCAFÉ</h2>
              <p className="case-study-section-text">
                By combining technical excellence with flexible workflows, Wyntre became a trusted post-production partner for NESCAFÉ's digital and social campaign needs in high-volume environments.
              </p>
            </div>

            {/* Markets */}
            <div className="case-study-section">
              <h2 className="case-study-section-heading">Markets</h2>
              <p className="case-study-section-text">
                Europe • United Kingdom • Middle East
              </p>
            </div>

            {/* View our other Case Studies */}
            <div className="case-study-section" style={{ maxWidth: '1200px' }}>
              <h2 className="case-study-section-heading">View our other Case Studies</h2>
              <Link href="/work/nivea" className="case-study-other-link">
                <Image
                  src="/assets/Nivea Case Study Hero.png"
                  alt="NIVEA Case Study"
                  width={1200}
                  height={600}
                  className="case-study-other-image"
                />
                <div className="case-study-other-overlay">
                  <div className="case-study-other-title">NIVEA | Global Campaign Infrastructure</div>
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
      </div>

      <Footer />

      <CaseStudyModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        items={getCampaignRangeModalItems()}
        initialIndex={selectedIndex}
      />
    </>
  )
}


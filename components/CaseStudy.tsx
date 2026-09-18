'use client'

import { useMemo, useState, type CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Footer from '@/components/Footer'
import BeforeAfter from '@/components/BeforeAfter'
import FormatSet from '@/components/FormatSet'
import CaseStudyModal from '@/components/CaseStudyModal'
import CampaignRange from '@/components/campaign/CampaignRange'
import SectionSlate from '@/components/SectionSlate'
import TapedPhoto from '@/components/TapedPhoto'
import CollageCard from '@/components/collage/CollageCard'
import FitLines from '@/components/collage/FitLines'
import type { CaseStudyData } from '@/data/caseStudies'
import { featuredWork } from '@/data/featuredWork'
import { getFilmLibraryItems } from '@/utils/campaignUtils'
import styles from './CaseStudy.module.css'

// Every film in the library, filtered per case study to that brand's own work
const libraryItems = getFilmLibraryItems()

/** NIVEA Men counts as NIVEA, NESCAFÉ Gold and Dolce Gusto as NESCAFÉ */
const brandKey = (name: string) => name.normalize('NFD').replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 5)

const TILTS = [-2, 1.5, -1]

const pad = (n: number) => String(n).padStart(2, '0')

/** Shared layout for the case study pages; each page supplies its copy from data/caseStudies */
export default function CaseStudy({ study }: { study: CaseStudyData }) {
  const router = useRouter()
  const collageIndex = featuredWork.findIndex((work) => work.slug === study.collage)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  // Only this brand's films, so the NESCAFÉ page isn't a strip of NIVEA spots
  const campaignRangeItems = useMemo(
    () => libraryItems.filter((item) => brandKey(item.client) === brandKey(study.brand)),
    [study.brand]
  )

  const openCampaign = (index: number) => {
    setSelectedIndex(index)
    setIsModalOpen(true)
  }

  // Return to the page the visitor came from, restoring their scroll position
  const handleBack = () => {
    const originPath = sessionStorage.getItem('caseStudyOriginPath') || '/work'
    sessionStorage.setItem('isBackNavigation', 'true')
    router.push(originPath)
  }

  return (
    <>
      {/* ---------- Header ---------- */}
      <header className={styles.header}>
        <div className={styles.inner}>
          <div className={styles.headerBar}>
            <button type="button" className={styles.back} onClick={handleBack}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M19 12H5M11 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
              </svg>
              Back
            </button>
            <p className={styles.eyebrow}>
              <span>Case study</span>
              <span className={styles.eyebrowRule} aria-hidden="true" />
              <span>{study.index}</span>
            </p>
          </div>

          <div className={styles.headerGrid}>
            {/* The campaign collage from the Our Work board opens the page */}
            <div className={styles.collage}>
              {collageIndex >= 0 ? <CollageCard work={featuredWork[collageIndex]} index={collageIndex} hideCta /> : null}
            </div>

            <div className={styles.intro}>
              <h1 className={styles.introTitle}>
                <span className={styles.srOnly}>{study.brand}: </span>
                {Array.isArray(study.title) ? (
                  <FitLines as="span" className={styles.introTitleLines} lines={study.title} maxFontSize={0.09} capToSelf />
                ) : (
                  study.title
                )}
              </h1>
              <p className={styles.introBody}>{study.intro}</p>

              <dl className={styles.meta}>
                {study.meta.map((item) => (
                  <div key={item.label} className={styles.metaItem}>
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </header>

      {/* ---------- Story: each kind of information gets its own treatment ---------- */}
      <section className={styles.body} aria-label={`${study.brand} case study`}>
        <div className={styles.inner}>
          {/* 01 Our role: one statement */}
          <div className={styles.block}>
            <SectionSlate index="[01]" label="Our role" showTimecode={false} />
            <div className={styles.roleGrid} data-reveal="up">
              <p className={styles.statement}>{study.role.statement}</p>
              {study.role.detail ? <p className={styles.roleDetail}>{study.role.detail}</p> : null}
            </div>
          </div>

          {/* Still to break up the text */}
          <figure className={styles.still} data-reveal="up">
            <span className={styles.stillFrame}>
              <Image src={study.still.src} alt={study.still.alt} fill sizes="(max-width: 1600px) 100vw, 1600px" className={styles.cover} />
            </span>
            <figcaption className={styles.caption}>{study.still.caption}</figcaption>
          </figure>

          {/* 02 Operating at scale: big figures */}
          <div className={styles.block}>
            <SectionSlate index="[02]" label="Operating at scale" showTimecode={false} />
            <dl className={styles.stats}>
              {study.scale.stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={styles.stat}
                  data-reveal="up"
                  style={{ '--reveal-delay': `${i * 90}ms` } as CSSProperties}
                >
                  <dt className={styles.statLabel}>{stat.label}</dt>
                  <dd className={`${styles.statValue} ${stat.value.length > 5 ? styles.statValueLong : ''}`}>{stat.value}</dd>
                </div>
              ))}
            </dl>
            {study.scale.detail ? <p className={styles.scaleDetail}>{study.scale.detail}</p> : null}
          </div>

          {/* 03 Stories: a headline, a few short lines and what we did */}
          {study.stories?.length ? (
            <div className={styles.block}>
              <SectionSlate index="[03]" label="The work" showTimecode={false} />
              <div className={styles.stories}>
                {study.stories.map((story, i) => (
                  <article
                    key={story.title}
                    className={styles.story}
                    data-reveal="up"
                    style={{ '--reveal-delay': `${i * 100}ms` } as CSSProperties}
                  >
                    <h3 className={styles.storyTitle}>{story.title}</h3>
                    <div className={styles.storyBody}>
                      {story.body.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                    <p className={styles.storyDid}>
                      <span className={styles.storyDidLabel}>What we did</span>
                      {story.did}
                    </p>
                    {story.formats ? (
                      <div className={styles.storyCompare} data-column={story.formats.column || undefined}>
                        <FormatSet formats={story.formats.items} alt={story.formats.alt} caption={story.formats.caption} />
                      </div>
                    ) : null}
                    {story.compare ? (
                      <div className={`${styles.storyCompare} ${styles.storyCompares}`}>
                        {[story.compare].flat().map((pair) => (
                          <BeforeAfter key={pair.before} before={pair.before} after={pair.after} alt={pair.alt} caption={pair.caption} />
                        ))}
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            </div>
          ) : null}

          {/* 03 Challenges paired with how they were handled */}
          {study.challenges?.length ? (
          <div className={styles.block}>
            <SectionSlate index="[03]" label="Challenges" showTimecode={false} />
            <div className={styles.pairHead} aria-hidden="true">
              <span />
              <span>The challenge</span>
              <span />
              <span>How we handled it</span>
            </div>
            <ol className={styles.pairs}>
              {study.challenges.map((pair, i) => (
                <li
                  key={pair.challenge}
                  className={styles.pair}
                  data-reveal="up"
                  style={{ '--reveal-delay': `${i * 80}ms` } as CSSProperties}
                >
                  <span className={styles.pairNumber}>{pad(i + 1)}</span>
                  <p className={styles.challenge}>{pair.challenge}</p>
                  <span className={styles.pairArrow} aria-hidden="true">
                    →
                  </span>
                  <p className={styles.response}>{pair.response}</p>
                </li>
              ))}
            </ol>
          </div>
          ) : null}

          {/* 04 Scope of work as tags */}
          <div className={styles.block}>
            <SectionSlate index="[04]" label="Scope of work" showTimecode={false} />
            <ul className={styles.tags} data-reveal="up">
              {study.scope.map((tag) => (
                <li key={tag} className={styles.tag}>
                  {tag}
                </li>
              ))}
            </ul>
          </div>

          {/* 05 Selected campaigns as taped prints */}
          <div className={styles.block}>
            <SectionSlate index="[05]" label="Selected campaigns" showTimecode={false} />
            <ul className={styles.prints}>
              {study.campaigns.map((campaign, i) => (
                <li
                  key={`${campaign.title}-${campaign.detail}`}
                  className={styles.print}
                  data-reveal="up"
                  style={{ '--reveal-delay': `${i * 110}ms` } as CSSProperties}
                >
                  <TapedPhoto
                    src={campaign.image}
                    alt={`${campaign.title} ${campaign.detail}`}
                    rotate={TILTS[i % TILTS.length]}
                    aspect="1 / 1"
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                    className={styles.printPhoto}
                  />
                  <div className={styles.printCaption}>
                    {campaign.markets ? (
                      <p className={styles.printMeta}>
                        <span>Markets</span>
                        <span>{campaign.markets}</span>
                      </p>
                    ) : null}
                    <h3 className={styles.printClient}>{campaign.title}</h3>
                    <p className={styles.printCampaign}>{campaign.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- Outcome ---------- */}
      <section className={styles.closing} aria-label="Outcome">
        <div className={styles.inner}>
          <div className={styles.closingGrid}>
            {study.closing.map((item, i) => (
              <article
                key={item.title}
                className={styles.closingItem}
                data-reveal="up"
                style={{ '--reveal-delay': `${i * 120}ms` } as CSSProperties}
              >
                <h2 className={styles.closingTitle}>{item.title}</h2>
                {(Array.isArray(item.body) ? item.body : [item.body]).map((line) => (
                  <p key={line} className={styles.closingBody}>
                    {line}
                  </p>
                ))}
              </article>
            ))}
          </div>
        </div>
      </section>

      <CampaignRange
        id="campaign-range"
        items={campaignRangeItems}
        onSelect={openCampaign}
        statement={null}
        description={null}
      />

      {/* ---------- Next case study ---------- */}
      <section className={styles.next} aria-label="Next case study">
        <Link
          href={study.next.href}
          className={`${styles.inner} ${styles.nextLink}`}
          onClick={() => sessionStorage.setItem('navigatingToCaseStudy', 'true')}
        >
          <div className={styles.nextCopy}>
            <p className={styles.eyebrow}>
              <span>Next case study</span>
              <span className={styles.eyebrowRule} aria-hidden="true" />
            </p>
            {/* Sized to fill the column on one line, however long the brand name */}
            <FitLines as="p" className={styles.nextBrand} lines={[study.next.brand]} maxFontSize={0.22} capToSelf />
            <p className={styles.nextTitle}>{study.next.title}</p>
            <span className={styles.nextCta}>
              View case study
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M7 17L17 7M8.5 7H17v8.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
              </svg>
            </span>
          </div>
          <div className={styles.nextMedia}>
            <Image src={study.next.image} alt="" fill sizes="(max-width: 900px) 100vw, 50vw" className={styles.nextImage} />
          </div>
        </Link>
      </section>

      <Footer />

      <CaseStudyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        items={campaignRangeItems}
        initialIndex={selectedIndex}
      />
    </>
  )
}

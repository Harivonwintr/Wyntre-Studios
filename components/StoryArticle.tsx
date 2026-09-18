import Image from 'next/image'
import Link from 'next/link'
import Footer from '@/components/Footer'
import ContactSection from '@/components/ContactSection'
import SectionSlate from '@/components/SectionSlate'
import TapedPhoto from '@/components/TapedPhoto'
import TwoTierHeadline from '@/components/TwoTierHeadline'
import CampaignPlayer from '@/components/campaign/CampaignPlayer'
import StorySeries from '@/components/StorySeries'
import { getNextStory, isPlaceholder, stories, type Story } from '@/data/stories'
import styles from './StoryArticle.module.css'

const pad = (n: number) => String(n).padStart(2, '0')

/** A paragraph that renders placeholder copy in a quieter style */
function Copy({ text, className }: { text: string; className?: string }) {
  return <p className={`${className ?? ''} ${isPlaceholder(text) ? styles.placeholder : ''}`}>{text}</p>
}

/** Rescue story page: brief, what went wrong, what we did, the result and the lesson */
export default function StoryArticle({ story }: { story: Story }) {
  const number = stories.findIndex((entry) => entry.slug === story.slug) + 1
  const next = getNextStory(story.slug)

  return (
    <>
      {/* ---------- Header ---------- */}
      <header className={styles.header}>
        <div className={styles.inner}>
          <div className={styles.headerBar}>
            <Link href="/work#rescue-stories" className={styles.back}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M19 12H5M11 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
              </svg>
              All work
            </Link>
            <p className={styles.eyebrow}>
              <span>Rescue story</span>
              <span className={styles.eyebrowRule} aria-hidden="true" />
              <span>
                {pad(number)} / {pad(stories.length)}
              </span>
            </p>
          </div>

          <div className={styles.headerGrid}>
            <div className={styles.headerCopy}>
              {story.draft ? <p className={styles.draft}>Story in progress</p> : null}
              <TwoTierHeadline id="story-heading" lead={story.client} hero={story.campaign} leadMax={0.08} heroMax={0.16} />
              <dl className={styles.facts}>
                {story.facts.map((fact) => (
                  <div key={fact.label} className={styles.fact}>
                    <dt>{fact.label}</dt>
                    <dd className={isPlaceholder(fact.value) ? styles.placeholder : undefined}>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className={styles.headerPhoto}>
              <TapedPhoto
                src={story.image}
                alt={story.imageAlt}
                rotate={2}
                aspect="1 / 1"
                sizes="(max-width: 900px) 90vw, 40vw"
              />
            </div>
          </div>
        </div>
      </header>

      {/* ---------- Article ---------- */}
      <article className={styles.body} aria-labelledby="story-heading">
        <div className={styles.inner}>
          <section className={styles.block}>
            <SectionSlate index="[01]" label="The brief" showTimecode={false} />
            <Copy text={story.brief} className={styles.lead} />
          </section>

          <section className={styles.block}>
            <SectionSlate index="[02]" label="What went wrong" showTimecode={false} />
            <Copy text={story.problem} className={styles.text} />
          </section>

          <section className={styles.block}>
            <SectionSlate index="[03]" label="What we did" showTimecode={false} />
            <ol className={styles.steps}>
              {story.steps.map((step, i) => (
                <li key={`${i}-${step}`} className={styles.step}>
                  <span className={styles.stepNumber}>{pad(i + 1)}</span>
                  <Copy text={step} className={styles.text} />
                </li>
              ))}
            </ol>
          </section>

          {/* Breakdown video, shown once one is recorded */}
          {story.videoId ? (
            <figure className={styles.video}>
              <div className={styles.videoFrame}>
                <CampaignPlayer videoId={story.videoId} title={`${story.client} ${story.campaign} breakdown`} />
              </div>
              <figcaption className={styles.caption}>Breakdown / {story.client} {story.campaign}</figcaption>
            </figure>
          ) : null}

          <section className={styles.block}>
            <SectionSlate index="[04]" label="The result" showTimecode={false} />
            <Copy text={story.result} className={styles.statement} />
          </section>

          <section className={styles.block}>
            <SectionSlate index="[05]" label="The lesson" showTimecode={false} />
            <blockquote className={styles.lesson}>
              <Copy text={story.lesson} className={styles.lessonText} />
            </blockquote>
          </section>

          {story.series?.length ? <StorySeries index="[06]" videoIds={story.series} /> : null}
        </div>
      </article>

      {/* ---------- Next story ---------- */}
      {next && next.slug !== story.slug ? (
        <section className={styles.next} aria-label="Next story">
          <Link href={`/stories/${next.slug}`} className={`${styles.inner} ${styles.nextLink}`}>
            <div className={styles.nextCopy}>
              <p className={styles.eyebrow}>
                <span>Next story</span>
                <span className={styles.eyebrowRule} aria-hidden="true" />
              </p>
              <p className={styles.nextClient}>{next.client}</p>
              <p className={styles.nextCampaign}>{next.campaign}</p>
              <span className={styles.nextCta}>
                Read the story
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M7 17L17 7M8.5 7H17v8.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                </svg>
              </span>
            </div>
            <div className={styles.nextMedia}>
              <Image src={next.image} alt="" fill sizes="(max-width: 900px) 100vw, 40vw" className={styles.nextImage} />
            </div>
          </Link>
        </section>
      ) : null}

      <ContactSection id="contact" index={story.series?.length ? '[07]' : '[06]'} />
      <Footer />
    </>
  )
}

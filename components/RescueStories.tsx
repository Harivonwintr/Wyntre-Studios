import type { CSSProperties } from 'react'
import Link from 'next/link'
import SectionSlate from './SectionSlate'
import TapedPhoto from './TapedPhoto'
import TwoTierHeadline from './TwoTierHeadline'
import { stories } from '@/data/stories'
import styles from './RescueStories.module.css'

const TILTS = [-2, 1.5, -1]

const pad = (n: number) => String(n).padStart(2, '0')

type Props = {
  id?: string
  index?: string
}

/** Rescue stories: each taped print opens its story page */
export default function RescueStories({ id = 'rescue-stories', index = '[04]' }: Props) {
  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-heading`}>
      <div className={styles.inner}>
        <SectionSlate index={index} label="Rescue stories" />

        <div className={styles.header}>
          <TwoTierHeadline id={`${id}-heading`} lead="We had 72 hours." hero="Done in 36." accent="36." accentPop />
        </div>

        <ul className={styles.grid}>
          {stories.map((story, i) => (
            <li
              key={story.slug}
              className={styles.card}
              data-reveal="up"
              style={{ '--reveal-delay': `${i * 110}ms` } as CSSProperties}
            >
              <Link href={`/stories/${story.slug}`} className={styles.link}>
                <TapedPhoto
                  src={story.image}
                  alt={story.imageAlt}
                  rotate={TILTS[i % TILTS.length]}
                  aspect="1 / 1"
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                  className={styles.photo}
                />
                <div className={styles.caption}>
                  <p className={styles.meta}>
                    <span>R/{pad(i + 1)}</span>
                    <span>{story.draft ? 'Story in progress' : 'Read the story'}</span>
                  </p>
                  <h3 className={styles.client}>{story.client}</h3>
                  <p className={styles.campaign}>{story.campaign}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

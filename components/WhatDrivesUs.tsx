import type { CSSProperties, ReactNode } from 'react'
import OutlineButton from '@/components/OutlineButton'
import SectionSlate from '@/components/SectionSlate'
import TwoTierHeadline from '@/components/TwoTierHeadline'
import styles from './WhatDrivesUs.module.css'

export type Point = {
  /** One line, or a pair split over two lines */
  title: string | [string, string]
  body: string
}

const POINTS: Point[] = [
  {
    title: 'Curiosity.',
    body: 'We grew up pulling creative tools apart, learning how they worked, and finding new ways to use them.',
  },
  {
    title: 'Multi-disciplinary.',
    body: 'Design, film, technology, sound and systems are not separate problems. The best ideas move between them.',
  },
  {
    title: 'Solutionists.',
    body: 'Sometimes the answer is an image. Sometimes it is a pipeline, a tool, or an entirely new way of working.',
  },
  {
    title: 'Craft.',
    body: 'Whatever we make, we obsess over the last five percent. Because the difference between finished and exceptional lives there.',
  },
]

type Props = {
  id?: string
  /** Bracketed section number for the slate */
  index?: string
  eyebrow?: string
  /** Lead-in line of the headline */
  lead?: string
  /** Payoff line, shown huge */
  hero?: string
  /** Trailing part of `hero` in blue with the brush underline */
  accent?: string
  /** Short argument between the headline and the points: a bold opening line, then a supporting one. Pass null to leave it out */
  intro?: { statement: string; body?: string } | null
  points?: Point[]
  /** Artwork beside the copy; a placeholder shows until it's supplied. Pass null for a type-only section */
  artwork?: ReactNode | null
  ctaHref?: string
  ctaLabel?: string
  /** Type-only sections: centre the headline, intro, points and button */
  centered?: boolean
}

const pad = (n: number) => String(n).padStart(2, '0')

/** Headline and numbered points beside a collage; the copy defaults to the home page's What Drives Us */
export default function WhatDrivesUs({
  id = 'what-drives-us',
  index = '[04]',
  eyebrow = 'What drives us',
  // One word on the payoff line keeps it big; a longer second line shrinks to fit the column
  lead = 'The impossible doesn’t stay',
  hero = 'impossible.',
  accent = 'impossible.',
  intro = {
    statement: 'Technology keeps turning yesterday’s hard problems into today’s ordinary tools.',
    body: 'We’re not interested in protecting what used to be difficult. We’re interested in what becomes possible next, and what people choose to make with it.',
  },
  points = POINTS,
  artwork,
  ctaHref = '/studio',
  ctaLabel = 'Learn more',
  centered = false,
}: Props) {
  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-heading`}>
      <div className={styles.inner}>
        <SectionSlate index={index} label={eyebrow} />

        <div className={styles.grid} data-bare={artwork === null || undefined} data-centered={centered || undefined}>
          <div className={styles.copy}>
            <TwoTierHeadline id={`${id}-heading`} className={styles.headline} lead={lead} hero={hero} accent={accent} />

            {intro ? (
              <div className={styles.intro} data-reveal="up" style={{ '--reveal-delay': '120ms' } as CSSProperties}>
                <p className={styles.introStatement}>{intro.statement}</p>
                {intro.body ? <p className={styles.introBody}>{intro.body}</p> : null}
              </div>
            ) : null}

            <div className={styles.copyBody}>
              <ol className={styles.points}>
                {points.map((point, i) => (
                  <li
                    key={typeof point.title === 'string' ? point.title : point.title.join(' ')}
                    className={styles.point}
                    data-reveal="up"
                    style={{ '--reveal-delay': `${i * 90}ms` } as CSSProperties}
                  >
                    <span className={styles.pointNumber} aria-hidden="true">
                      {pad(i + 1)}
                    </span>
                    <h3 className={styles.pointTitle}>
                      {typeof point.title === 'string' ? (
                        point.title
                      ) : (
                        <>
                          {point.title[0]}
                          <br />
                          {point.title[1]}
                        </>
                      )}
                    </h3>
                    <p className={styles.pointBody}>{point.body}</p>
                  </li>
                ))}
              </ol>

              <div className={styles.cta}>
                <OutlineButton href={ctaHref}>{ctaLabel}</OutlineButton>
              </div>
            </div>
          </div>

          {artwork === null ? null : (
            <div className={styles.artwork}>
              {artwork ?? (
                <div className={styles.placeholder}>
                  <span>Artwork placeholder</span>
                  <span className={styles.placeholderHint}>Studio collage goes here</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

import Image from 'next/image'
import type { CSSProperties, ReactNode } from 'react'
import CountUp from './CountUp'
import OutlineButton from './OutlineButton'
import SectionSlate from './SectionSlate'
import TwoTierHeadline from './TwoTierHeadline'
import styles from './IntroBand.module.css'

type Stat = { value: string; label: string }

type Props = {
  id?: string
  /** Bracketed index in the label, e.g. '[01]' */
  index: string
  label: string
  lead: string
  hero: string
  /** Trailing part of `hero` shown in blue with the brush underline */
  accent?: string
  /** Intro copy beside the headline; leave out (with cta) to let the headline stand alone. An array breaks the
   *  lines where you choose instead of wherever they happen to wrap */
  body?: string | string[]
  cta?: { href: string; label: string }
  /** Tilted photo at the end of the headline row; hidden below 1100px */
  image?: { src: string; focus?: string }
  /** Big figures in a ruled row under the headline */
  stats?: Stat[]
  /** Headline on the centre line with the copy stacked underneath, rather than side by side */
  centered?: boolean
  /** Extra content under the headline row, e.g. a list of services */
  children?: ReactNode
}

/** The dark opening band used under the hero: label, two-tier headline, intro copy and an optional photo */
export default function IntroBand({ id, index, label, lead, hero, accent, body, cta, image, stats, centered = false, children }: Props) {
  const headingId = `${id ?? 'intro'}-heading`

  return (
    <section id={id} className={styles.section} aria-labelledby={headingId}>
      <div className={styles.inner}>
        <SectionSlate index={index} label={label} />

        <div
          className={`${styles.top} ${image ? '' : styles.noPhoto} ${body || cta ? '' : styles.noIntro} ${
            centered ? styles.stacked : ''
          }`}
        >
          <TwoTierHeadline id={headingId} lead={lead} hero={hero} accent={accent} />

          {body || cta ? (
            <div className={styles.intro} data-reveal="up" style={{ '--reveal-delay': '250ms' } as CSSProperties}>
              {body ? (
                <p>
                  {(Array.isArray(body) ? body : [body]).map((line, i) => (
                    <span key={line}>
                      {i > 0 ? <br /> : null}
                      {line}
                    </span>
                  ))}
                </p>
              ) : null}
              {cta ? (
                <OutlineButton href={cta.href} variant="white">
                  {cta.label}
                </OutlineButton>
              ) : null}
            </div>
          ) : null}

          {image ? (
            <div className={styles.photoWrap} aria-hidden="true">
              <div className={styles.photo}>
                <Image
                  src={image.src}
                  alt=""
                  fill
                  sizes="20vw"
                  className={styles.photoImage}
                  style={{ objectPosition: image.focus ?? 'center' }}
                />
              </div>
              {/* Outside the cropped frame so the tape can overhang the top edge */}
              <img className={styles.photoTape} src="/assets/contact/tape.webp" alt="" />
            </div>
          ) : null}
        </div>

        {stats?.length ? (
          <dl className={styles.stats}>
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={styles.stat}
                data-reveal="up"
                style={{ '--reveal-delay': `${i * 90}ms` } as CSSProperties}
              >
                <dt className={styles.statLabel}>{stat.label}</dt>
                <dd className={styles.statValue}>
                  <CountUp value={stat.value} delay={150 + i * 120} />
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        {children}
      </div>
    </section>
  )
}

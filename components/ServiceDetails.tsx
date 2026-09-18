'use client'

import { useEffect, useState, type CSSProperties, type MouseEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import SectionSlate from './SectionSlate'
import styles from './ServiceDetails.module.css'

type Service = {
  /** Anchor id, used by links like /services#vfx */
  id: string
  name: string
  /** Label in the sticky index */
  short: string
  /** One word for the stage of the work, printed on the frame's foot like a bin label */
  stage: string
  /** Handwritten client note taped over the frame: file in /assets/notes and what it says (its alt text) */
  note: { src: string; text: string }
  tasks: string[]
  image: string
  /** Client and campaign shown with the frame */
  credit: string
  focus?: string
}

const SERVICES: Service[] = [
  {
    id: 'editing',
    stage: 'Edit',
    note: { src: 'tighten-it-up', text: 'Can you tighten it up?' },
    name: 'Editing',
    short: 'Editing',
    tasks: [
      'Video editing (TVC, digital, longform)',
      'Retouching / Cleanup',
      'Audio mix & sound design',
      'Mastering and QC',
      'Localization / multi-language delivery',
    ],
    image: '/assets/Video Post production.png',
    credit: 'NIVEA / Q10 Anti-Wrinkle Expert',
  },
  {
    id: 'vfx',
    stage: 'Composite',
    note: { src: 'more-cinematic', text: 'Can you make it more cinematic?' },
    name: 'VFX & CGI',
    short: 'VFX & CGI',
    tasks: ['Compositing', 'Set extensions', 'Fluid & particle FX', 'CGI product builds', 'Digital doubles / replacements'],
    image: '/assets/VFX & CGI.png',
    credit: 'NIVEA / Cellular Filler Expert',
    focus: '50% 40%',
  },
  {
    id: 'motion',
    stage: 'Title',
    note: { src: 'logo-bigger', text: 'Can you make the logo bigger?' },
    name: 'Motion design',
    short: 'Motion design',
    tasks: ['Branding motion systems', 'UI/UX animation', 'Lower thirds & title cards', 'Typography in motion'],
    image: '/assets/Design & Motion Graphics.png',
    credit: 'FNB / MoneyGram',
    focus: '50% 35%',
  },
  {
    id: 'delivery',
    stage: 'Version',
    note: { src: 'one-tiny-change', text: 'Just one tiny change.' },
    name: 'Campaign toolkits & asset rollouts',
    short: 'Toolkits & rollouts',
    tasks: [
      'Social adaptations',
      'Resizing & platform conversion',
      'Language swaps / subtitle integration',
      'Toolkit creation & global guidelines',
    ],
    image: '/assets/Campaign Toolkits.png',
    credit: 'Starbucks / Cafe Moments',
  },
  {
    id: 'rescue',
    stage: 'Rebuild',
    note: { src: 'by-eod', text: 'Can we have this by EOD?' },
    name: 'Problem-solving & creative rescue',
    short: 'Creative rescue',
    tasks: [
      'Campaign triage',
      'Talent swaps / paint-outs',
      'Last-minute post entry',
      'Compliance & brand safety fixes',
      'Missing file recovery',
    ],
    image: '/assets/Problem Solving.png',
    credit: 'NESCAFE / Europe Cold',
  },
]

const pad = (n: number) => String(n).padStart(2, '0')

// Torn paper and tape scans, alternated so no two frames are dressed the same way
const TAPES = ['tape-a', 'tape-b', 'tape-c', 'tape-d']

// Offset for jumps so the discipline's frame clears the top of the screen
const JUMP_OFFSET = 100

type Props = {
  index?: string
}

/** Disciplines: a sticky index that follows the scroll beside one clean block per discipline */
export default function ServiceDetails({ index = '[02]' }: Props) {
  const [active, setActive] = useState(0)

  // Highlight the last discipline whose top has passed 45% of the screen; worked out from positions on scroll so
  // it never lags or skips an item
  useEffect(() => {
    const articles = SERVICES.map((service) => document.getElementById(service.id)).filter(
      (el): el is HTMLElement => !!el
    )
    let frame = 0
    const update = () => {
      frame = 0
      const line = window.innerHeight * 0.45
      let current = 0
      articles.forEach((article, i) => {
        if (article.getBoundingClientRect().top <= line) current = i
      })
      setActive(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const jumpTo = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id)
    if (!target) return
    e.preventDefault()
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - JUMP_OFFSET, behavior: 'smooth' })
    history.replaceState(null, '', `#${id}`)
  }

  return (
    <section className={styles.section} aria-label="Disciplines">
      <div className={styles.inner}>
        <SectionSlate index={index} label="Disciplines" />

        <div className={styles.layout}>
          <nav className={styles.index} aria-label="Jump to a discipline">
            <ol className={styles.indexList}>
              {SERVICES.map((service, i) => (
                <li key={service.id}>
                  <a
                    href={`#${service.id}`}
                    className={styles.indexLink}
                    aria-current={i === active ? 'true' : undefined}
                    onClick={(e) => jumpTo(e, service.id)}
                  >
                    <span className={styles.indexNumber}>{pad(i + 1)}</span>
                    <span className={styles.indexName}>{service.short}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className={styles.items}>
            {SERVICES.map((service, i) => (
              <article key={service.id} id={service.id} className={styles.item} aria-labelledby={`${service.id}-title`}>
                <header className={styles.head} data-reveal="up">
                  <p className={styles.meta}>
                    <span className={styles.metaCurrent}>{pad(i + 1)}</span>
                    <span className={styles.metaRule} aria-hidden="true" />
                    <span>{pad(SERVICES.length)}</span>
                  </p>
                  {/* One size for all five, set so the longest label still holds its line */}
                  <h2 id={`${service.id}-title`} className={styles.name}>
                    {service.short}
                  </h2>
                </header>

                {/* Frame: film edge, taped corner and a note, with the still dropped into the picture slot */}
                <div className={styles.frame} data-reveal="up" style={{ '--reveal-delay': '90ms' } as CSSProperties}>
                  {/* One strip behind the whole mount, showing only where it runs past the card's left edge */}
                  <span className={styles.filmEdge} aria-hidden="true" />

                  <div className={styles.board}>
                    <p className={styles.boardHead}>
                      <span>{service.credit}</span>
                      <span className={styles.boardTimecode}>{`00:00:${pad((i + 1) * 7)}:12`}</span>
                    </p>

                    <div className={styles.media}>
                      <Image
                        src={service.image}
                        alt={service.credit}
                        fill
                        sizes="(max-width: 900px) 92vw, 52vw"
                        className={styles.cover}
                        style={{ objectPosition: service.focus ?? 'center' }}
                      />
                    </div>

                    <p className={styles.boardFoot} aria-hidden="true">
                      <span>{service.stage}</span>
                      <span className={styles.boardRule} />
                      <span>Frame {pad(i + 1)}</span>
                    </p>
                  </div>

                  <img
                    className={styles.tape}
                    data-tape={TAPES[i % TAPES.length]}
                    data-flip={i >= TAPES.length || undefined}
                    src={`/assets/services/${TAPES[i % TAPES.length]}.webp`}
                    alt=""
                    aria-hidden="true"
                  />

                  {/* The feedback every studio hears for this discipline */}
                  <img
                    className={styles.note}
                    data-lean={i % 2 ? 'left' : 'right'}
                    src={`/assets/notes/${service.note.src}.webp`}
                    alt={`Client note: “${service.note.text}”`}
                  />
                </div>

                <aside className={styles.side} data-reveal="up" style={{ '--reveal-delay': '150ms' } as CSSProperties}>
                  <div className={styles.doing}>
                    <h3 className={styles.tasksLabel}>What we do</h3>
                    <ul className={styles.tasks}>
                      {service.tasks.map((task) => (
                        <li key={task}>{task}</li>
                      ))}
                    </ul>
                    {/* Boxed button here, not the usual underlined link: it anchors the card's right column */}
                    <Link
                      href="/work#campaign-range"
                      className={styles.ctaBox}
                      onClick={() => sessionStorage.setItem('navScrollTarget', 'campaign-range')}
                    >
                      See it in the work
                      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                        <path d="M7 17L17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </Link>
                  </div>
                </aside>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

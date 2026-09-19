'use client'

import { useRef } from 'react'
import OutlineButton from '@/components/OutlineButton'
import SectionSlate from '@/components/SectionSlate'
import { featuredWork } from '@/data/featuredWork'
import CollageCard from './CollageCard'
import { useBoardFlight } from '@/hooks/useBoardFlight'
import styles from './OurWork.module.css'

const pad = (n: number) => String(n).padStart(2, '0')

// The web the camera flies through: client feedback, film stills and tape, only seen during the flight.
// Listed in the order they appear; the last ones pass just before the board lands
const FLIGHT_SOURCES: { src: string; kind: 'note' | 'still' | 'tape' }[] = [
  { src: '/assets/notes/back-to-version-3.webp', kind: 'note' },
  { src: '/assets/notes/logo-bigger.webp', kind: 'note' },
  { src: '/assets/work/library/espresso-martini-still.webp', kind: 'still' },
  { src: '/assets/notes/more-energy.webp', kind: 'note' },
  { src: '/assets/notes/music-too-corporate.webp', kind: 'note' },
  { src: '/assets/work/tape/metallic-b.webp', kind: 'tape' },
  { src: '/assets/notes/one-tiny-change.webp', kind: 'note' },
  { src: '/assets/notes/more-premium.webp', kind: 'note' },
  { src: '/assets/work/library/visa-noob-to-pro-still.webp', kind: 'still' },
  { src: '/assets/notes/by-eod.webp', kind: 'note' },
  { src: '/assets/notes/music-too-happy.webp', kind: 'note' },
  { src: '/assets/notes/feels-flat.webp', kind: 'note' },
  { src: '/assets/notes/product-prominent.webp', kind: 'note' },
  { src: '/assets/work/library/gold-festive-white-russian-still.webp', kind: 'still' },
  { src: '/assets/notes/brighten-it.webp', kind: 'note' },
  { src: '/assets/notes/more-dynamic.webp', kind: 'note' },
  { src: '/assets/work/tape/metallic-a.webp', kind: 'tape' },
  { src: '/assets/notes/skin-natural.webp', kind: 'note' },
  { src: '/assets/notes/hold-packshot.webp', kind: 'note' },
  { src: '/assets/work/library/liquid-concentrate-still.webp', kind: 'still' },
  { src: '/assets/notes/prefers-version-1.webp', kind: 'note' },
  { src: '/assets/notes/make-it-younger.webp', kind: 'note' },
  { src: '/assets/notes/music-too-sad.webp', kind: 'note' },
  { src: '/assets/notes/another-option.webp', kind: 'note' },
  { src: '/assets/work/library/dolce-gusto-neo-still.webp', kind: 'still' },
  { src: '/assets/notes/without-music.webp', kind: 'note' },
  { src: '/assets/notes/tighten-it-up.webp', kind: 'note' },
  { src: '/assets/notes/know-it-when-we-see-it.webp', kind: 'note' },
  { src: '/assets/notes/more-cinematic.webp', kind: 'note' },
  { src: '/assets/work/library/cellular-epigenetics-still.webp', kind: 'still' },
  { src: '/assets/notes/almost-there.webp', kind: 'note' },
  // The last note to pass before the board lands, so it's the one that sticks
  { src: '/assets/notes/make-it-pop.webp', kind: 'note' },
]

// Sizes in vmin, so the web fills any screen shape the same way
const WIDTH = { note: 17, still: 26, tape: 13 }

// The first nine are the opening shot: a loose mix of notes, stills and tape already floating in the dark as the
// previous section scrolls away, then drifting at the camera once the section pins. Everything else materialises in
// the distance as the camera closes in, so the web gets busier the nearer you get. Offsets are in vmin from the
// middle of the section; size scales the piece's usual width.
const OPENING: { x: number; y: number; size: number }[] = [
  { x: -54, y: -40, size: 1.5 }, // back to version 3
  { x: 36, y: -44, size: 1.3 }, // logo bigger
  { x: -44, y: 14, size: 1.35 }, // espresso martini still
  { x: 6, y: -14, size: 1.1 }, // more energy
  { x: -6, y: 38, size: 1.3 }, // music too corporate
  { x: -14, y: -46, size: 1.2 }, // tape
  { x: -76, y: -4, size: 1.1 }, // one tiny change
  { x: 64, y: -6, size: 1.2 }, // more premium
  { x: 44, y: 28, size: 1.25 }, // Visa still
]

// The rest are spread over a 6 × 5 grid reaching a little past the screen edges, one piece per cell, with the cells
// dealt out of order so what's close in time is far apart on screen: stills and notes mix everywhere rather than
// clumping. Timings are in flight time: 0 is when the section pins, 1 is landed, negative is while it rises in.
//   appear  when the piece fades up
//   pass    when it reaches the camera and slips past
//   speed   how fast it closes in: the opening cards drift, the rest come on a little quicker
const COLS = 6
const ROWS = 5
const others = FLIGHT_SOURCES.length - OPENING.length

const FLIGHT_PIECES = FLIGHT_SOURCES.map((piece, i) => {
  const opening = OPENING[i]
  // The opening cards are already close, so they read large from the first glance
  const w = WIDTH[piece.kind] * (opening ? opening.size : 1)
  const k = i - OPENING.length
  // 17 and 30 share no factors, so this visits every cell once in a scattered order
  const cell = (k * 17) % (COLS * ROWS)
  const x = -15 + ((cell % COLS) + 0.5 + (((k * 13) % 7) - 3) / 10) * (130 / COLS)
  const y = -10 + (Math.floor(cell / COLS) + 0.5 + (((k * 11) % 7) - 3) / 10) * (120 / ROWS)
  const appear = opening ? -0.8 + i * 0.04 : (0.52 * k) / (others - 1)
  // Opening cards leave one after another through the first half of the flight
  const pass = opening ? 0.2 + ((i * 5) % OPENING.length) * 0.04 : Math.min(0.95, appear + 0.38 + 0.03 * ((i * 7) % 5))
  return {
    ...piece,
    w,
    // Centred on its spot: opening cards sit in vmin from the middle of the screen, the rest by percentage
    left: opening ? `calc(50% + ${opening.x - w / 2}vmin)` : `calc(${x.toFixed(1)}% - ${w / 2}vmin)`,
    top: opening ? `calc(50% + ${opening.y - w * 0.3}vmin)` : `calc(${y.toFixed(1)}% - ${w * 0.3}vmin)`,
    appear,
    pass,
    // Opening cards start at about their full size (distance 1.1 from the camera), whenever they pass
    speed: opening ? 0.8 / pass : 4.5,
    rot: ((i * 37) % 17) - 8 + (piece.kind === 'tape' ? -24 : 0),
  }
})

// The first line is the statement; what follows supports it
const INTRO = [
  'Good work became cheap. But great work requires the right people.',
  'The best things usually happen when the right people care about the same thing at the same time. That matters more to us than making more for the sake of more.',
]

type Props = {
  id?: string
  /** Bracketed section number for the slate */
  index?: string
  heading?: string
  intro?: string[]
  /** Header button; pass null to hide it */
  cta?: { href: string; label: string } | null
  /** Smaller heading for longer titles */
  compact?: boolean
  /** Scroll flies a camera through a web of notes onto the board (wide screens, motion allowed) */
  flight?: boolean
}

export default function OurWork({
  id = 'our-work',
  index = '[02]',
  heading = 'Our Work',
  intro = INTRO,
  cta = { href: '/work', label: 'View all work' },
  compact = false,
  flight = false,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  useBoardFlight(sectionRef, flight)

  return (
    <section ref={sectionRef} id={id} className={styles.section} data-flight-stage={flight || undefined}>
      {/* The heading fades on as the board lands, so the notes never fly across it */}
      <div data-fly-piece="" data-fly-depth="0" data-fly-fade="0.6">
        <SectionSlate index={index} label="Featured campaigns" className={styles.slate} />
      </div>
      <header className={styles.header} data-fly-piece="" data-fly-depth="0" data-fly-fade="0.6">
        <h2 className={`${styles.heading} ${compact ? styles.headingCompact : ''}`}>{heading}</h2>
        {/* Copy runs long across the row, with the button underneath rather than in its own column */}
        <div className={styles.intro}>
          {intro.map((line) => (
            <p key={line}>{line}</p>
          ))}
          {cta ? (
            <OutlineButton href={cta.href} className={styles.cta}>
              {cta.label}
            </OutlineButton>
          ) : null}
        </div>
      </header>

      <div className={styles.board}>
        {/* The speckled sheet is its own layer so it can fly in with the pieces; it fades on last, closing the frame
            behind a collage that's already assembled */}
        <div className={styles.sheet} data-fly-piece="" data-fly-depth="0" data-fly-fade="0.75" aria-hidden="true" />

        {featuredWork.map((work, i) => (
          <CollageCard key={work.slug} work={work} index={i} />
        ))}
      </div>

      {flight ? (
        <div className={styles.flight} aria-hidden="true">
          {FLIGHT_PIECES.map((piece) => (
            <img
              key={piece.src}
              className={piece.kind === 'still' ? `${styles.flightPiece} ${styles.flightStill}` : styles.flightPiece}
              src={piece.src}
              alt=""
              loading="lazy"
              decoding="async"
              data-fly-appear={piece.appear.toFixed(3)}
              data-fly-pass={piece.pass.toFixed(3)}
              data-fly-speed={piece.speed}
              style={{
                left: piece.left,
                top: piece.top,
                width: `${piece.w}vmin`,
                transform: `rotate(${piece.rot}deg)`,
              }}
            />
          ))}
        </div>
      ) : null}

      <div className={styles.pagination} aria-hidden="true" data-fly-piece="" data-fly-depth="0" data-fly-fade="0.6">
        {featuredWork.map((work, i) => (
          <span key={work.slug}>
            {pad(i + 1)} / {pad(featuredWork.length)}
          </span>
        ))}
      </div>
    </section>
  )
}

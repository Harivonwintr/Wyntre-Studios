'use client'

import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import IntroBand from './IntroBand'
import SectionSlate from './SectionSlate'
import styles from './SpineSection.module.css'

const pad = (n: number) => String(n).padStart(2, '0')

// Deterministic bar heights so the waveforms render identically on server and client
const WAVE = Array.from({ length: 64 }, (_, i) => {
  const envelope = 0.35 + 0.65 * Math.abs(Math.sin(i * 0.19))
  const jitter = 0.55 + 0.45 * Math.abs(Math.sin(i * 2.7) * Math.cos(i * 1.3))
  // Rounded, since server and browser can disagree on the last digit of a float
  return Math.round(Math.max(0.08, envelope * jitter) * 1000) / 1000
})

function Waveform({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 320 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      {WAVE.map((h, i) => (
        <rect key={i} x={i * 5 + 1} y={50 - h * 46} width={2.4} height={h * 92} rx={1} style={{ '--i': i } as CSSProperties} />
      ))}
    </svg>
  )
}

/* ---------- Card visuals ---------- */

// A still from the edit, with a timeline of frames and a playhead sweeping across it
function EditingVisual() {
  const frames = [
    { src: '/assets/Video Post production.png', focus: '45% 30%' },
    { src: '/assets/Problem Solving.png', focus: '40% 50%' },
    { src: '/assets/Video Post production.png', focus: '80% 45%' },
    { src: '/assets/VFX & CGI.png', focus: '50% 55%' },
    { src: '/assets/Campaign Toolkits.png', focus: '55% 50%' },
  ]
  return (
    <>
      <div className={styles.editingStill}>
        <Image
          src="/assets/Video Post production.png"
          alt=""
          fill
          sizes="(max-width: 1100px) 90vw, 55vw"
          className={styles.cover}
          style={{ objectPosition: '50% 32%' }}
        />
      </div>
      {/* Full-width timeline with NLE-style track headers: timecode ruler, V1 clips, A1 audio */}
      <div className={styles.timeline} aria-hidden="true">
        <div className={styles.trackLabels}>
          <span>TC</span>
          <span>V1</span>
          <span>A1</span>
        </div>
        <div className={styles.lanes}>
          <span className={styles.ruler} />
          <div className={styles.frames}>
            {frames.map((frame, i) => (
              <span key={i} className={styles.frame}>
                <Image src={frame.src} alt="" fill sizes="12vw" className={styles.cover} style={{ objectPosition: frame.focus }} />
              </span>
            ))}
          </div>
          <Waveform className={styles.track} />
          <span className={styles.playhead} />
        </div>
      </div>
    </>
  )
}

// Before/after grade; the split follows the pointer
function ColorVisual() {
  const ref = useRef<HTMLDivElement>(null)
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const box = ref.current
    if (!box) return
    const rect = box.getBoundingClientRect()
    const split = Math.min(92, Math.max(8, ((e.clientX - rect.left) / rect.width) * 100))
    box.style.setProperty('--split', `${split}%`)
  }
  const reset = () => ref.current?.style.setProperty('--split', '50%')

  return (
    <div ref={ref} className={styles.compare} onPointerMove={move} onPointerLeave={reset} aria-hidden="true">
      <Image src="/assets/Problem Solving.png" alt="" fill sizes="(max-width: 1100px) 90vw, 40vw" className={styles.cover} />
      <span className={styles.before}>
        <Image src="/assets/Problem Solving.png" alt="" fill sizes="(max-width: 1100px) 90vw, 40vw" className={styles.cover} />
      </span>
      <span className={styles.divider} />
      <span className={`${styles.compareLabel} ${styles.compareBefore}`}>Before</span>
      <span className={`${styles.compareLabel} ${styles.compareAfter}`}>After</span>
    </div>
  )
}

function VfxVisual() {
  return (
    <div className={styles.vfx} aria-hidden="true">
      <Image
        src="/assets/VFX & CGI.png"
        alt=""
        fill
        sizes="(max-width: 1100px) 90vw, 33vw"
        className={styles.cover}
        style={{ objectPosition: '50% 35%' }}
      />
      <span className={`${styles.cross} ${styles.crossA}`} />
      <span className={`${styles.cross} ${styles.crossB}`} />
    </div>
  )
}

function SoundVisual() {
  return (
    <div className={styles.sound} aria-hidden="true">
      <span className={styles.readout}>
        <span>48.0 kHz</span>
        <span>24 bit</span>
      </span>
      <Waveform className={styles.soundWave} />
    </div>
  )
}

const VERSIONS = [
  { id: 'v01', name: "Director's Cut", codec: 'ProRes 422', done: true },
  { id: 'v02', name: 'Client Review', codec: 'H.264', done: true },
  { id: 'v03', name: 'Final Master', codec: 'ProRes 422', done: true, current: true },
  { id: 'v04', name: 'Socials', codec: 'H.264', done: false },
]

function DeliveryVisual() {
  return (
    <div className={styles.delivery} aria-hidden="true">
      <img loading="lazy" decoding="async" className={styles.tape} src="/assets/work/tape/metallic-b.webp" alt="" />
      <ul className={styles.versions}>
        {VERSIONS.map((version) => (
          <li key={version.id} className={version.current ? styles.versionCurrent : undefined}>
            <span>{version.id}</span>
            <span>{version.name}</span>
            <span>{version.codec}</span>
            <span>{version.done ? '✓' : '—'}</span>
          </li>
        ))}
      </ul>
      {/* v03 is the final master, so of course someone wants to go back to it */}
      <img loading="lazy" decoding="async" className={styles.deliveryNote} src="/assets/notes/back-to-version-3.webp" alt="" />
    </div>
  )
}

/* ---------- Grid ---------- */

type Service = {
  name: string
  tags: string
  href: string
  size: 'wide' | 'medium' | 'third'
  visual: ReactNode
  /** Handwritten client note stuck on the card (file in /assets/notes) */
  note?: string
  /** Pin the note to the whole card instead of its visual, for notes that sit in the copy area */
  noteOnCard?: boolean
}

const SERVICES: Service[] = [
  {
    name: 'Editing',
    tags: 'Story / Rhythm / Performance',
    href: '/services#editing',
    size: 'wide',
    visual: <EditingVisual />,
    note: 'more-energy',
    noteOnCard: true,
  },
  {
    name: 'Color',
    tags: 'Grade / Finish / Look development',
    href: '/services#editing',
    size: 'medium',
    visual: <ColorVisual />,
    note: 'make-it-pop',
  },
  {
    name: 'VFX',
    tags: 'Cleanup / Compositing / Motion',
    href: '/services#vfx',
    size: 'third',
    visual: <VfxVisual />,
    note: 'one-tiny-change',
  },
  {
    name: 'Sound',
    tags: 'Design / Mix / Master',
    href: '/services#editing',
    size: 'third',
    visual: <SoundVisual />,
    note: 'music-too-sad',
  },
  {
    name: 'Delivery',
    tags: 'Versioning / Masters / Localization',
    href: '/services#delivery',
    size: 'third',
    visual: <DeliveryVisual />,
  },
]

export default function SpineSection() {
  return (
    <IntroBand
      id="spine-seq"
      index="[01]"
      label="What we do"
      lead="Every story needs a spine."
      hero="This is ours."
      accent="ours."
    >
      {/* Mini-slate so the grid reads as its own chapter under the intro */}
      <SectionSlate
        label={`Services / ${pad(SERVICES.length)} disciplines`}
        aside={<Link href="/services">View all services ↗</Link>}
        className={styles.bentoSlate}
      />
      <ul className={styles.bento}>
        {SERVICES.map((service, i) => (
          <li
            key={service.name}
            className={styles[service.size]}
            data-reveal="up"
            style={{ '--reveal-delay': `${i * 90}ms` } as CSSProperties}
          >
            <Link href={service.href} className={`${styles.card} ${styles[`card${service.name}`] ?? ''}`}>
              <div className={styles.visual}>
                {service.visual}
                {service.note && !service.noteOnCard ? (
                  <img loading="lazy" decoding="async"
                    className={`${styles.cardNote} ${styles[`note${service.name}`] ?? ''}`}
                    src={`/assets/notes/${service.note}.webp`}
                    alt=""
                  />
                ) : null}
              </div>

              <div className={styles.copy}>
                <span className={styles.number}>{pad(i + 1)}</span>
                <h3 className={styles.name}>{service.name}</h3>
                <span className={styles.tags}>{service.tags}</span>
              </div>

              {service.note && service.noteOnCard ? (
                <img loading="lazy" decoding="async"
                  className={`${styles.cardNote} ${styles[`note${service.name}`] ?? ''}`}
                  src={`/assets/notes/${service.note}.webp`}
                  alt=""
                />
              ) : null}

              <span className={styles.go} aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M7 17L17 7M8.5 7H17v8.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square" />
                </svg>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </IntroBand>
  )
}

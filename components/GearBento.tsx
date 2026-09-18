'use client'

import { useState, type CSSProperties } from 'react'
import Image from 'next/image'
import SectionSlate from './SectionSlate'
import styles from './GearBento.module.css'

type Gear = {
  category: string
  image: string
  /** CSS object-position for the crop */
  focus: string
  /** Spec rows */
  specs: { label: string; value: string }[]
}

// The first entry is the tall feature card; the other four fill the two
// columns beside it (Sound over Capture & VO, Storage & backup over Controllers).
const GEAR: Gear[] = [
  {
    category: 'Edit suite',
    image: '/assets/Studio.png',
    focus: '52% 55%',
    specs: [
      { label: 'Workstation', value: 'Intel Ultra 9 285K · 96GB DDR5 · RTX 5090 Astral' },
      { label: 'Laptop', value: 'MacBook M5 Max · 48GB' },
      { label: 'Display', value: 'Alienware AW3423DW 34" ultrawide' },
      { label: 'Tablet', value: 'iPad Pro M4' },
      {
        label: 'Software',
        value: 'DaVinci Resolve · After Effects · Blender · Photoshop · Illustrator · Figma · Ableton Live · Universal Audio',
      },
    ],
  },
  {
    category: 'Sound',
    image: '/assets/studio/gear-sound.webp',
    focus: '50% 55%',
    specs: [
      { label: 'Monitors', value: 'PreSonus Eris E5' },
      { label: 'Headphones', value: 'Sennheiser HD 660S · 2× Audio-Technica M50x' },
      { label: 'Interface', value: 'Universal Audio Apollo Twin X Quad' },
    ],
  },
  {
    category: 'Storage',
    image: '/assets/what sets us apart.png',
    focus: '30% 35%',
    specs: [
      { label: 'Primary', value: 'SanDisk Blade Station · 16TB NVMe' },
      { label: 'Backup', value: 'NAS server' },
      { label: 'Offsite', value: 'Cloud backup' },
    ],
  },
  {
    category: 'Capture & VO',
    image: '/assets/studio/gear-capture.webp',
    focus: '45% 55%',
    specs: [
      { label: 'Microphone', value: 'Shure SM7B' },
    ],
  },
  {
    category: 'Controllers',
    image: '/assets/studio/gear-controllers.webp',
    focus: '40% 45%',
    specs: [
      { label: 'Keys', value: 'Komplete Kontrol S61 · Arturia MiniLab 3' },
      { label: 'Guitar', value: 'Gibson Les Paul Classic' },
    ],
  },
]

const pad = (n: number) => String(n).padStart(2, '0')

type Entry = { gear: Gear; number: number }

const [FEATURE, ...REST] = GEAR.map((gear, i): Entry => ({ gear, number: i + 1 }))
// Column-wise so reading order across the top row is still 02, 03
const COLUMNS: Entry[][] = [
  [REST[0], REST[2]],
  [REST[1], REST[3]],
].map((column) => column.filter(Boolean))

/** Rows shown before a card needs its expand button */
const VISIBLE_SPECS = 3

type CardProps = Entry & {
  feature?: boolean
  /** Folded into a bar because the other card in this column is open */
  collapsed?: boolean
  expanded?: boolean
  onToggle?: () => void
}

function GearCard({ gear, number, feature = false, collapsed = false, expanded = false, onToggle }: CardProps) {
  // The tall feature card has room for everything; only the column cards need to fold
  const overflows = !feature && gear.specs.length > VISIBLE_SPECS
  const specs = overflows && !expanded ? gear.specs.slice(0, VISIBLE_SPECS) : gear.specs
  const hidden = gear.specs.length - VISIBLE_SPECS

  return (
    <article className={`${styles.card} ${feature ? styles.featureCard : ''}`} data-collapsed={collapsed || undefined}>
      <div className={styles.media}>
        <Image
          src={gear.image}
          alt=""
          fill
          sizes={feature ? '(max-width: 1100px) 90vw, 50vw' : '(max-width: 700px) 90vw, (max-width: 1100px) 45vw, 30vw'}
          className={styles.image}
          style={{ objectPosition: gear.focus }}
        />
      </div>

      <div className={styles.copy}>
        <div className={styles.head}>
          <span className={styles.number}>{pad(number)}</span>
          <h3 className={styles.name}>{gear.category}</h3>
        </div>

        {/* Collapses to nothing when the card folds into a bar */}
        <div className={styles.specsWrap}>
          <div className={styles.specsInner}>
            <dl className={styles.specs}>
              {specs.map((spec) => (
                <div key={spec.label} className={styles.spec}>
                  <dt>{spec.label}</dt>
                  <dd>{spec.value}</dd>
                </div>
              ))}
            </dl>

            {/* Only long lists need this: opening one card folds the other in its column */}
            {overflows && onToggle ? (
              <button className={styles.toggle} type="button" onClick={onToggle} aria-expanded={expanded}>
                <span>{expanded ? 'Show less' : `Show ${hidden} more`}</span>
                <span className={styles.toggleIcon} aria-hidden="true">
                  {expanded ? '−' : '+'}
                </span>
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  )
}

type Props = {
  index?: string
}

/** The studio's kit: a tall feature card beside two columns. A long list opens on click and folds its neighbour */
export default function GearBento({ index = '[03]' }: Props) {
  // Which card is open in each column, by row index
  const [open, setOpen] = useState<Record<number, number | null>>({})

  return (
    <section className={styles.section} aria-labelledby="gear-heading">
      <div className={styles.inner}>
        <SectionSlate index={index} label="The studio" />

        <div className={styles.header}>
          <h2 id="gear-heading" className={styles.heading}>
            The kit behind the work
          </h2>
        </div>

        <div className={styles.bento}>
          <div className={styles.featureSlot} data-reveal="up">
            <GearCard {...FEATURE} feature />
          </div>

          {COLUMNS.map((column, c) => (
            <div key={c} className={styles.column}>
              {column.map((entry, r) => (
                <div
                  key={entry.gear.category}
                  className={styles.slot}
                  data-reveal="up"
                  style={{ '--reveal-delay': `${(c + r + 1) * 80}ms` } as CSSProperties}
                >
                  <GearCard
                    {...entry}
                    expanded={open[c] === r}
                    collapsed={open[c] !== undefined && open[c] !== null && open[c] !== r}
                    onToggle={() => setOpen((state) => ({ ...state, [c]: state[c] === r ? null : r }))}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

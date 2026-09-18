'use client'

import { useState, type CSSProperties } from 'react'
import Image from 'next/image'
import styles from './BeforeAfter.module.css'

type Props = {
  before: string
  after: string
  /** Describes the shot; each side appends its own state */
  alt: string
  /** Where the divider starts, as a percentage from the left */
  start?: number
  /** Mono line under the frame, e.g. 'NIVEA / Luminous Skin Glow' */
  caption?: string
}

/** Two frames of the same shot with a draggable divider: before on the left, after on the right */
export default function BeforeAfter({ before, after, alt, start = 50, caption }: Props) {
  const [position, setPosition] = useState(start)

  return (
    <figure className={styles.figure}>
    <div className={styles.compare} style={{ '--pos': `${position}%` } as CSSProperties}>
      <Image src={after} alt={`${alt}, after`} fill sizes="(max-width: 1600px) 100vw, 1600px" className={styles.image} />
      <div className={styles.beforeLayer} aria-hidden="true">
        <Image src={before} alt="" fill sizes="(max-width: 1600px) 100vw, 1600px" className={styles.image} />
      </div>

      <span className={`${styles.label} ${styles.labelBefore}`} aria-hidden="true">
        Before
      </span>
      <span className={`${styles.label} ${styles.labelAfter}`} aria-hidden="true">
        After
      </span>

      <span className={styles.divider} aria-hidden="true">
        <span className={styles.handle}>
          <svg viewBox="0 0 24 24" width="16" height="16" focusable="false">
            <path d="M9 6l-5 6 5 6M15 6l5 6-5 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
          </svg>
        </span>
      </span>

      {/* A native range over the whole frame: drag anywhere, and arrow keys work for keyboard users */}
      <input
        className={styles.range}
        type="range"
        min={0}
        max={100}
        step={0.5}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        aria-label="Drag to compare before and after"
      />
    </div>
    {caption ? <figcaption className={styles.caption}>{caption}</figcaption> : null}
    </figure>
  )
}

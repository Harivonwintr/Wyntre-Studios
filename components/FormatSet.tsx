import Image from 'next/image'
import type { CSSProperties } from 'react'
import styles from './FormatSet.module.css'

export type Format = {
  src: string
  /** Aspect as width / height, e.g. 16 / 9 */
  ratio: number
  /** Short label under the frame, e.g. '16:9 · Master' */
  label: string
}

/** One shot delivered in several aspect ratios, shown side by side at the same height */
export default function FormatSet({ formats, alt, caption }: { formats: Format[]; alt: string; caption?: string }) {
  return (
    <figure className={styles.figure}>
    <ul
      className={styles.set}
      // Column widths follow each frame's aspect, so every frame shares one height
      style={{ gridTemplateColumns: formats.map((f) => `${f.ratio}fr`).join(' ') } as CSSProperties}
    >
      {formats.map((format) => (
        <li key={format.label} className={styles.item}>
          <span className={styles.frame} style={{ aspectRatio: format.ratio }}>
            <Image src={format.src} alt={`${alt}, ${format.label}`} fill sizes="(max-width: 900px) 100vw, 60vw" className={styles.image} />
          </span>
          <span className={styles.label}>{format.label}</span>
        </li>
      ))}
    </ul>
    {caption ? <figcaption className={styles.caption}>{caption}</figcaption> : null}
    </figure>
  )
}

import type { ReactNode } from 'react'
import styles from './SectionSlate.module.css'

type Props = {
  /** Bracketed section number, e.g. '[04]' */
  index?: string
  label: string
  /** Right-hand slot; defaults to a timecode built from the index */
  aside?: ReactNode
  /** Hide the default timecode, e.g. for sub-sections inside a page section */
  showTimecode?: boolean
  className?: string
}

/** Opens a section like a clapperboard slate: number, label, a hairline across the width and a timecode */
export default function SectionSlate({ index, label, aside, showTimecode = true, className }: Props) {
  const digits = index?.replace(/\D/g, '')
  const timecode = digits && showTimecode ? `00:${digits.padStart(2, '0')}` : null

  return (
    <div className={`${styles.slate} ${className ?? ''}`} data-reveal="slate">
      {index ? <span className={styles.index}>{index}</span> : null}
      <span className={styles.label}>{label}</span>
      <span className={styles.rule} aria-hidden="true" />
      {aside ?? (timecode ? <span className={styles.timecode} aria-hidden="true">{timecode}</span> : null)}
    </div>
  )
}

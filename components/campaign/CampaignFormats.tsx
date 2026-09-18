import styles from './CampaignFormats.module.css'

export const DEFAULT_FORMATS = ['TVC', 'Social', 'DOOH', 'OLV', 'Digital', 'Longform']

type Props = {
  /** Falls back to DEFAULT_FORMATS when omitted or empty */
  formats?: string[]
  label?: string
  className?: string
}

export default function CampaignFormats({ formats, label = 'Formats', className }: Props) {
  const list = formats?.length ? formats : DEFAULT_FORMATS

  return (
    <div className={`${styles.formats} ${className ?? ''}`}>
      <span className={styles.label}>{label}</span>
      <ul className={styles.list} aria-label={label}>
        {list.map((format) => (
          <li key={format}>{format}</li>
        ))}
      </ul>
      <span className={styles.rule} aria-hidden="true" />
    </div>
  )
}

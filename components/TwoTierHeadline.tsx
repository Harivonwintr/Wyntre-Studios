import FitLines from '@/components/collage/FitLines'
import styles from './TwoTierHeadline.module.css'

type Props = {
  id?: string
  /** Lead-in line, fitted to the column */
  lead: string
  /** Payoff line, fitted to the column and usually much larger */
  hero: string
  /** Trailing part of `hero` shown in blue with the brush underline */
  accent?: string
  leadMax?: number
  heroMax?: number
  /** The accent punches up and settles once its line lands, then the underline draws */
  accentPop?: boolean
  className?: string
}

/** Monument headline in two tiers: a lead-in line, then the payoff filling the column */
export default function TwoTierHeadline({
  id,
  lead,
  hero,
  accent,
  leadMax = 0.2,
  heroMax = 0.3,
  accentPop = false,
  className,
}: Props) {
  const cut = accent ? hero.lastIndexOf(accent) : -1
  const heroLine =
    cut >= 0 ? (
      <span key="hero">
        {hero.slice(0, cut)}
        <span className={`${styles.underlined} ${accentPop ? styles.pop : ''}`}>
          {accent}
          <span className={styles.underline} aria-hidden="true" />
        </span>
      </span>
    ) : (
      hero
    )

  return (
    <h2
      id={id}
      className={`${styles.headline} ${className ?? ''}`}
      data-reveal="mask"
      data-pop={accentPop || undefined}
    >
      <FitLines as="span" className={styles.lead} lines={[lead]} maxFontSize={leadMax} />
      <FitLines as="span" className={styles.hero} lines={[heroLine]} fitKey={hero} maxFontSize={heroMax} />
    </h2>
  )
}

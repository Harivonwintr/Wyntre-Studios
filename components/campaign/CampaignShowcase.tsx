'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import Image from 'next/image'
import OutlineButton from '@/components/OutlineButton'
import CampaignPlayer from './CampaignPlayer'
import CampaignFormats from './CampaignFormats'
import FitLines from '@/components/collage/FitLines'
import { splitCampaignLines } from './CampaignTitle'
import type { CampaignItem } from './types'
import styles from './CampaignShowcase.module.css'

type Props = {
  items: CampaignItem[]
  index: number
  onIndexChange: (index: number) => void
  /** When provided, shows a close button and closes after the case study CTA is used */
  onClose?: () => void
  eyebrow?: string
  className?: string
}

export function wrapIndex(i: number, len: number) {
  if (len <= 0) return 0
  return ((i % len) + len) % len
}

function hasPlayableVideo(videoId?: string) {
  return (
    !!videoId &&
    videoId.trim() !== '' &&
    !videoId.includes('your-cloudflare-stream-video-id') &&
    !videoId.includes('placeholder')
  )
}

const pad = (n: number) => String(n).padStart(2, '0')

export default function CampaignShowcase({
  items,
  index,
  onIndexChange,
  onClose,
  eyebrow = 'Campaign',
  className,
}: Props) {
  const [isPlaying, setIsPlaying] = useState(false)
  const thumbsRef = useRef<HTMLUListElement>(null)

  const total = items.length
  const current = wrapIndex(index, total)
  const item = items[current]

  // Stop playback when switching campaigns
  useEffect(() => {
    setIsPlaying(false)
  }, [current])

  // Keep the active thumbnail centred in the strip
  useEffect(() => {
    const strip = thumbsRef.current
    const active = strip?.querySelector<HTMLElement>('[aria-current="true"]')
    if (!strip || !active) return
    const left = active.offsetLeft - (strip.clientWidth - active.offsetWidth) / 2
    strip.scrollTo({ left, behavior: 'smooth' })
  }, [current])

  if (!item) return null

  const hasVideo = hasPlayableVideo(item.streamVideoId)
  const titleLines = item.titleLines ?? splitCampaignLines(item.campaign)
  const go = (delta: number) => onIndexChange(wrapIndex(current + delta, total))
  const brandStyle = (item.brandColor ? { '--campaign-brand': item.brandColor } : undefined) as CSSProperties | undefined

  return (
    <div className={`${styles.showcase} ${className ?? ''}`} style={brandStyle}>
      <div className={styles.stage}>
        <div className={styles.media} data-modal-media data-playing={(isPlaying && hasVideo) || undefined}>
          {isPlaying && hasVideo ? (
            <CampaignPlayer
              videoId={item.streamVideoId!}
              title={`${item.client} ${item.campaign}`}
              startTime={item.startTime}
            />
          ) : (
            <>
              <Image
                key={item.posterUrl}
                className={styles.poster}
                src={item.posterUrl}
                alt=""
                fill
                // The stage grows taller than 16:9 to match the panel, so the cover crop needs a wider source
                // than the column width suggests; ask for a full-width frame rather than 62vw
                sizes="(max-width: 960px) 100vw, 1280px"
                priority
              />
              <div className={styles.vignette} aria-hidden="true" />
              {hasVideo ? (
                <button className={styles.play} type="button" onClick={() => setIsPlaying(true)} aria-label="Play video">
                  <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" focusable="false">
                    <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
                  </svg>
                </button>
              ) : null}
            </>
          )}

          {total > 1 ? (
            <>
              <button className={`${styles.nav} ${styles.navPrev}`} type="button" onClick={() => go(-1)} aria-label="Previous campaign">
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
                  <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                </svg>
              </button>
              <button className={`${styles.nav} ${styles.navNext}`} type="button" onClick={() => go(1)} aria-label="Next campaign">
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
                  <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                </svg>
              </button>
            </>
          ) : null}
        </div>

        {total > 1 ? (
          <ul className={styles.thumbs} ref={thumbsRef} aria-label="Campaigns">
            {items.map((entry, i) => (
              <li key={`${entry.posterUrl}-${i}`}>
                <button
                  className={styles.thumb}
                  type="button"
                  onClick={() => onIndexChange(i)}
                  aria-current={i === current ? 'true' : undefined}
                  aria-label={`${entry.client} ${entry.campaign}`}
                >
                  <Image src={entry.posterUrl} alt="" fill sizes="180px" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        <CampaignFormats formats={item.formats} />
      </div>

      <aside className={styles.panel}>
        <div className={styles.panelTop}>
          <span className={styles.eyebrow}>{eyebrow}</span>
          <span className={styles.counter}>
            <strong>{pad(current + 1)}</strong> / {pad(total)}
          </span>
          {onClose ? (
            <button data-close className={styles.close} type="button" onClick={onClose} aria-label="Close">
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
              </svg>
            </button>
          ) : null}
        </div>

        <p className={styles.titleMeta}>
          <span className={styles.titleBrand}>{item.client}</span>
          <span aria-hidden="true">·</span>
          <span>{item.year}</span>
          <span aria-hidden="true">·</span>
          <span>{item.campaignType}</span>
        </p>

        {/* Straight Monument fitted to the panel; keyed so each line rises out of its mask when the campaign changes */}
        <FitLines
          key={current}
          as="h2"
          className={styles.title}
          lines={titleLines.map((line) => (
            <span key={line} className={styles.titleLine}>
              {line}
            </span>
          ))}
          fitKey={titleLines.join('|')}
          maxFontSize={0.24}
          capToSelf
        />

        <section className={styles.challenge}>
          <h3 className={styles.label}>The challenge</h3>
          <p className={styles.body}>{item.challenge}</p>
        </section>

        <dl className={styles.specs}>
          <div className={styles.spec}>
            <dt className={styles.label}>Agency</dt>
            <dd>{item.agency}</dd>
          </div>
          <div className={styles.spec}>
            <dt className={styles.label}>Markets</dt>
            <dd>{item.markets}</dd>
          </div>
          <div className={styles.spec}>
            <dt className={styles.label}>Role</dt>
            <dd>
              {item.roleTitle}
              {item.roleDetail ? <span className={styles.specSub}>{item.roleDetail}</span> : null}
            </dd>
          </div>
          <div className={styles.spec}>
            <dt className={styles.label}>Delivery</dt>
            <dd>{item.delivery}</dd>
          </div>
          <div className={`${styles.spec} ${styles.specWide}`}>
            <dt className={styles.label}>Scope</dt>
            <dd>{item.scope}</dd>
          </div>
        </dl>

        {item.caseStudyHref ? (
          <div className={styles.cta}>
            <OutlineButton href={item.caseStudyHref} onClick={onClose} variant="white">
              View full case study
            </OutlineButton>
          </div>
        ) : null}      </aside>
    </div>
  )
}

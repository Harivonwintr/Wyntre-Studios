'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import OutlineButton from './OutlineButton'
import FitLines from './collage/FitLines'
import CampaignPlayer from './campaign/CampaignPlayer'
import CampaignFormats from './campaign/CampaignFormats'
import { getFilmLibraryItems } from '@/utils/campaignUtils'
import modalStyles from './CaseStudyModal.module.css'
import styles from './campaign/CampaignShowcase.module.css'

// Cloudflare Stream upload of the current studio reel
const REEL_VIDEO_ID = '3808f7c54c00a942317bb2ecaa7badcf'

const REEL = {
  year: '2026',
  runtime: '01:00',
  titleLines: ['The reel', '2026'],
  disciplines: ['Edit', 'Color', 'VFX', 'Motion', 'Sound'],
}

// Films from the library, shown under the reel: each one plays in this same card
const FILM_COUNT = 8
const FILMS = getFilmLibraryItems().slice(0, FILM_COUNT)

/** Campaign frames under the reel; the active one is the film currently in the player */
function ReelFilms({ active, onPick }: { active: number | null; onPick: (index: number) => void }) {
  return (
    <ol className={styles.scenes} aria-label="Some of our other work">
      {FILMS.map((film, i) => (
        <li key={film.streamVideoId ?? film.posterUrl}>
          <button
            className={styles.scene}
            type="button"
            onClick={() => onPick(i)}
            aria-current={i === active ? 'true' : undefined}
            aria-label={`Play ${film.client} ${film.campaign}`}
          >
            <img src={film.posterUrl} alt="" loading="lazy" />
            <span className={styles.sceneTc} aria-hidden="true">
              {film.client}
            </span>
          </button>
        </li>
      ))}
    </ol>
  )
}

type Props = {
  isOpen: boolean
  onClose: () => void
}

/** The studio reel in the same card as the campaign films, with reel details in place of campaign credits */
export default function ReelModal({ isOpen, onClose }: Props) {
  const [mounted, setMounted] = useState(false)
  const [closing, setClosing] = useState(false)
  // null while the reel itself is playing; otherwise the film from the strip that took over the player
  const [film, setFilm] = useState<number | null>(null)
  const mediaRef = useRef<HTMLDivElement>(null)

  useEffect(() => setMounted(true), [])
  useEffect(() => {
    if (!isOpen) {
      setClosing(false)
      setFilm(null)
    }
  }, [isOpen])

  if (!mounted || (!isOpen && !closing)) return null

  const close = () => setClosing(true)
  const playing = film === null ? null : FILMS[film]
  const state = closing ? modalStyles.closing : modalStyles.opening

  return createPortal(
    <div
      className={`${modalStyles.backdrop} ${state}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) close()
      }}
    >
      <div
        className={`${modalStyles.card} ${modalStyles.reelCard} ${state}`}
        role="dialog"
        aria-modal="true"
        aria-label="Wyntre Studios reel"
        onAnimationEnd={(e) => {
          if (closing && e.target === e.currentTarget) onClose()
        }}
      >
        <div className={`${styles.showcase} ${styles.reelWide}`}>
          <div className={`${styles.stage} ${styles.reelStage}`}>
            <div ref={mediaRef} className={styles.media} data-modal-media data-playing>
              {playing ? (
                <CampaignPlayer
                  key={playing.streamVideoId}
                  videoId={playing.streamVideoId!}
                  title={`${playing.client} ${playing.campaign}`}
                  startTime={playing.startTime}
                />
              ) : (
                <CampaignPlayer key={REEL_VIDEO_ID} videoId={REEL_VIDEO_ID} title="Wyntre Studios reel" />
              )}
            </div>

            <div className={styles.stripHead}>
              <span className={styles.stripLabel}>
                {playing ? `Now playing · ${playing.client} ${playing.campaign}` : 'Some of our other work'}
              </span>
              {playing ? (
                <button className={styles.stripBack} type="button" onClick={() => setFilm(null)}>
                  Back to the reel
                </button>
              ) : null}
            </div>
            <ReelFilms active={film} onPick={setFilm} />
            <CampaignFormats label="Inside" formats={REEL.disciplines} />
          </div>

          <aside className={styles.panel}>
            <div className={styles.panelTop}>
              <span className={styles.eyebrow}>Reel</span>
              <span className={styles.counter}>
                <strong>{REEL.year}</strong>
              </span>
              <button data-close className={styles.close} type="button" onClick={close} aria-label="Close" autoFocus>
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                </svg>
              </button>
            </div>

            <p className={styles.titleMeta}>
              <span className={styles.titleBrand}>Wyntre Studios</span>
              <span aria-hidden="true">·</span>
              <span>Selected work</span>
              <span aria-hidden="true">·</span>
              <span>{REEL.runtime}</span>
            </p>

            <FitLines
              as="h2"
              className={styles.title}
              lines={REEL.titleLines.map((line) => (
                <span key={line} className={styles.titleLine}>
                  {line}
                </span>
              ))}
              fitKey={REEL.titleLines.join('|')}
              maxFontSize={0.24}
              capToSelf
            />

            <dl className={styles.specs}>
              <div className={styles.spec}>
                <dt className={styles.label}>Runtime</dt>
                <dd>{REEL.runtime}</dd>
              </div>
              <div className={styles.spec}>
                <dt className={styles.label}>Work from</dt>
                <dd>2021–{REEL.year}</dd>
              </div>
              <div className={styles.spec}>
                <dt className={styles.label}>Disciplines</dt>
                <dd>{REEL.disciplines.slice(0, 4).join(' · ')}</dd>
              </div>
              <div className={styles.spec}>
                <dt className={styles.label}>Delivered</dt>
                <dd>TVC · 40+ markets</dd>
              </div>
              {/* Some jobs were part of a bigger team (composites only), so the reel points to the per-film credits */}
              <div className={`${styles.spec} ${styles.specWide}`}>
                <dt className={styles.label}>Credits</dt>
                <dd>Our role varies by project. Each film&apos;s full credit is in the film library.</dd>
              </div>
            </dl>

            <div className={styles.cta}>
              <OutlineButton href="/contact" onClick={close} variant="white">
                Start a project
              </OutlineButton>
              <Link
                href="/work#campaign-range"
                className={styles.reelSecondary}
                onClick={() => {
                  sessionStorage.setItem('navScrollTarget', 'campaign-range')
                  close()
                }}
              >
                View full campaign range
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>,
    document.body
  )
}

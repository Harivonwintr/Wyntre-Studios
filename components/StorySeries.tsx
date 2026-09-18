'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import CaseStudyModal from '@/components/CaseStudyModal'
import SectionSlate from '@/components/SectionSlate'
import { setModalOrigin } from '@/components/campaign/modalOrigin'
import { getFilmLibraryItems } from '@/utils/campaignUtils'
import styles from './StorySeries.module.css'

type Props = {
  /** Stream uids in series order */
  videoIds: string[]
  index?: string
}

const pad = (n: number) => String(n).padStart(2, '0')

/** The campaign's films under a rescue story, opening in the same player as the film library */
export default function StorySeries({ videoIds, index }: Props) {
  const films = useMemo(() => {
    const library = getFilmLibraryItems()
    return videoIds.flatMap((id) => library.filter((item) => item.streamVideoId === id))
  }, [videoIds])

  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(0)

  if (films.length === 0) return null

  return (
    <section className={styles.section} aria-labelledby="story-series-heading">
      <SectionSlate index={index} label="The series" showTimecode={false} />
      <h2 id="story-series-heading" className={styles.srOnly}>
        Films from the campaign
      </h2>

      <ul className={styles.grid} data-count={films.length}>
        {films.map((film, i) => (
          <li key={film.streamVideoId}>
            <button
              type="button"
              className={styles.film}
              onClick={(e) => {
                const picture = e.currentTarget.querySelector<HTMLElement>(`.${styles.picture}`)
                if (picture) setModalOrigin({ el: picture })
                setSelected(i)
                setOpen(true)
              }}
              aria-label={`Watch ${film.client} ${film.campaign}`}
            >
              <span className={styles.picture}>
                <Image src={film.posterUrl} alt="" fill sizes="(max-width: 900px) 100vw, 1100px" className={styles.poster} />
                <span className={styles.play} aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="22" height="22" focusable="false">
                    <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
                  </svg>
                </span>
              </span>
              <span className={styles.caption}>
                <span className={styles.number}>{pad(i + 1)}</span>
                <span className={styles.title}>{film.campaign}</span>
                <span className={styles.meta}>{film.client}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <CaseStudyModal isOpen={open} onClose={() => setOpen(false)} items={films} initialIndex={selected} />
    </section>
  )
}

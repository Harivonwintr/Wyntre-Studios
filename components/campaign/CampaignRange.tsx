'use client'

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import OutlineButton from '@/components/OutlineButton'
import SectionSlate from '@/components/SectionSlate'
import { syncSmoothScroll } from '@/utils/smoothScroll'
import { setModalOrigin } from './modalOrigin'
import type { CampaignItem } from './types'
import styles from './CampaignRange.module.css'

type Props = {
  items: CampaignItem[]
  /** Called with the index of the selected campaign, e.g. to open it in CaseStudyModal */
  onSelect: (index: number) => void
  heading?: string
  /** Short bold line above the description; pass null to leave it out */
  statement?: string | null
  /** Pass null to leave it out */
  description?: string | null
  /** Target of the "View full collection" link; pass null to hide it */
  collectionHref?: string | null
  id?: string
  /** Bracketed section number for the slate */
  index?: string
  /** 'strip': pinned, scroll-driven film strip (a highlight reel). 'grid': filterable grid for the full library. */
  layout?: 'strip' | 'grid'
  /** Grid only: how many frames show before "Show all" */
  initialCount?: number
}

const pad = (n: number) => String(n).padStart(2, '0')

/** '00:26:18' (mm:ss:ff, measured from the Stream master at 25fps) → '00:00:26:18' */
const toTimecode = (duration?: string) => {
  const [mm = '00', ss = '00', ff = '00'] = (duration ?? '').split(':')
  return `00:${mm.padStart(2, '0')}:${ss.padStart(2, '0')}:${ff.padStart(2, '0')}`
}

// Desktop with motion allowed: the section pins and scrolling slides the strip sideways
const PIN_QUERY = '(min-width: 769px) and (prefers-reduced-motion: no-preference)'

const ALL = 'All'

/** Sub-brands roll up to their parent so the brand filter stays short: NIVEA Men → NIVEA, NESCAFÉ Gold → NESCAFÉ */
const brandOf = (client: string) => {
  if (/^nivea/i.test(client)) return 'NIVEA'
  if (/^nescaf/i.test(client)) return 'NESCAFÉ'
  return client
}

// Every film in the library is a TVC unless an entry says otherwise
const formatOf = (item: CampaignItem) => item.format ?? 'TVC'

/** One film frame: edge markings, picture with a play button, client and timecode */
function Frame({ item, number, onSelect }: { item: CampaignItem; number: number; onSelect: () => void }) {
  return (
    <>
      <button
        type="button"
        className={styles.frame}
        onClick={(e) => {
          const picture = e.currentTarget.querySelector<HTMLElement>(`.${styles.picture}`)
          if (picture) setModalOrigin({ el: picture })
          onSelect()
        }}
        aria-label={`Watch ${item.client} ${item.campaign}`}
      >
        <span className={styles.edge} aria-hidden="true">
          <span>{pad(number)}</span>
          <span>▸</span>
          <span>{formatOf(item)}</span>
        </span>

        <span className={styles.picture}>
          <Image
            src={item.posterUrl}
            alt=""
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 32vw"
            className={styles.image}
            draggable={false}
          />
          <span className={styles.play} aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />
            </svg>
          </span>
        </span>

        <span className={styles.edge} aria-hidden="true">
          <span>{item.client}</span>
          <span className={styles.timecode}>{toTimecode(item.duration)}</span>
        </span>
      </button>

      <h3 className={styles.title}>{item.campaign}</h3>
    </>
  )
}

/** Campaign films as a pinned film strip (home, case studies) or a filterable grid (work page) */
export default function CampaignRange({
  id,
  index,
  items,
  onSelect,
  heading = 'Campaign Range',
  statement = 'You can tell when someone cared.',
  description = 'Every film here passed through people who argued over a single frame. That part still doesn’t come cheap.',
  collectionHref = '/work#campaign-range',
  layout = 'strip',
  initialCount = 9,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLUListElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const fillRef = useRef<HTMLSpanElement>(null)

  // ---------- Grid state ----------
  const [filter, setFilter] = useState(ALL)
  const [brand, setBrand] = useState(ALL)
  const [expanded, setExpanded] = useState(false)

  // Each row counts against the other row's selection, so a chip never leads to an empty grid
  const formats = useMemo(() => {
    const inBrand = items.filter((item) => brand === ALL || brandOf(item.client) === brand)
    const labels = Array.from(new Set(items.map(formatOf)))
    return [
      { label: ALL, count: inBrand.length },
      ...labels.map((label) => ({ label, count: inBrand.filter((item) => formatOf(item) === label).length })),
    ]
  }, [items, brand])

  const brands = useMemo(() => {
    const inFormat = items.filter((item) => filter === ALL || formatOf(item) === filter)
    const totals = new Map<string, number>()
    items.forEach((item) => totals.set(brandOf(item.client), (totals.get(brandOf(item.client)) ?? 0) + 1))
    // Biggest relationships first
    const labels = Array.from(totals.keys()).sort((a, b) => totals.get(b)! - totals.get(a)! || a.localeCompare(b))
    return [
      { label: ALL, count: inFormat.length },
      ...labels.map((label) => ({ label, count: inFormat.filter((item) => brandOf(item.client) === label).length })),
    ]
  }, [items, filter])

  // Keep each item's original index so the modal opens the right campaign after filtering
  const filtered = useMemo(
    () =>
      items
        .map((item, i) => ({ item, i }))
        .filter(
          ({ item }) =>
            (filter === ALL || formatOf(item) === filter) && (brand === ALL || brandOf(item.client) === brand)
        ),
    [items, filter, brand]
  )
  const visible = expanded ? filtered : filtered.slice(0, initialCount)

  // Expanding or collapsing changes the page height: tell the smooth scroll straight away, and when collapsing
  // from further down, bring the library's top back into view rather than leaving the reader past its end
  const toggleExpanded = (next: boolean) => {
    setExpanded(next)
    requestAnimationFrame(() => {
      const section = sectionRef.current
      if (!next && section && section.getBoundingClientRect().top < 0) {
        window.scrollTo({ top: section.getBoundingClientRect().top + window.scrollY })
      }
      syncSmoothScroll()
      ScrollTrigger.refresh()
    })
  }

  // ---------- Strip: pin, scroll-driven slide and drag ----------
  useEffect(() => {
    if (layout !== 'strip') return
    const section = sectionRef.current
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!section || !viewport || !track || items.length === 0) return

    gsap.registerPlugin(ScrollTrigger)
    const frames = Array.from(track.children) as HTMLElement[]
    let active = -1

    // Marks the frame nearest the current scroll position; written to the DOM directly to avoid re-rendering
    const setActive = (next: number) => {
      if (next === active) return
      frames[active]?.removeAttribute('data-active')
      frames[next]?.setAttribute('data-active', '')
      active = next
      if (counterRef.current) counterRef.current.textContent = pad(next + 1)
    }

    // Set while pinned; drag maps onto its scroll range
    let trigger: ScrollTrigger | null = null
    let distance = () => 0

    // Updates the counter, progress hairline and sprockets for a given strip offset
    const syncToX = (x: number) => {
      const range = distance()
      const progress = range > 0 ? Math.min(1, Math.max(0, -x / range)) : 0
      setActive(Math.round(progress * (frames.length - 1)))
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${progress})`
      viewport.style.setProperty('--strip-x', `${x}px`)
    }

    const mm = gsap.matchMedia()
    mm.add(PIN_QUERY, () => {
      section.setAttribute('data-pinned', '')
      setActive(0)
      distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth)

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          // Pin mid-screen so neighbouring sections stay in view; from the top when the band is taller than the screen
          start: () => (section.offsetHeight > window.innerHeight ? 'top top' : 'center center'),
          end: () => `+=${distance()}`,
          pin: true,
          // Follow scroll directly: Lenis already smooths it, and extra scrub lag left the strip still sliding
          // after the band unpinned
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setActive(Math.round(self.progress * (frames.length - 1)))
            if (fillRef.current) fillRef.current.style.transform = `scaleX(${self.progress})`
            // Sprocket edges span the full band and shift in step with the strip, so the film never runs out
            viewport.style.setProperty('--strip-x', `${-self.progress * distance()}px`)
          },
        },
      })
      trigger = tween.scrollTrigger ?? null
      ScrollTrigger.refresh()

      return () => {
        trigger = null
        distance = () => 0
        section.removeAttribute('data-pinned')
        viewport.style.removeProperty('--strip-x')
        frames[active]?.removeAttribute('data-active')
        active = -1
      }
    })

    // 'scroll': pinned and in range, so dragging moves the page scroll that drives the strip.
    // 'strip': above or below the pin, so dragging slides the strip itself and the page stays put.
    // 'native': not pinned at all (swipe fallback), so dragging scrolls the strip's own overflow.
    type DragMode = 'scroll' | 'strip' | 'native'
    const drag = { down: false, moved: false, mode: 'native' as DragMode, startX: 0, startScroll: 0, startLeft: 0, startTrackX: 0 }

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch' || e.button !== 0) return
      drag.down = true
      drag.moved = false
      drag.startX = e.clientX
      drag.startScroll = window.scrollY
      drag.startLeft = viewport.scrollLeft
      drag.startTrackX = Number(gsap.getProperty(track, 'x')) || 0
      if (!trigger) drag.mode = 'native'
      else drag.mode = window.scrollY >= trigger.start - 2 && window.scrollY <= trigger.end + 2 ? 'scroll' : 'strip'
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!drag.down) return
      const dx = e.clientX - drag.startX
      if (!drag.moved) {
        if (Math.abs(dx) < 6) return
        drag.moved = true
        section.setAttribute('data-dragging', '')
      }

      if (drag.mode === 'scroll' && trigger) {
        const top = Math.min(trigger.end, Math.max(trigger.start, drag.startScroll - dx))
        window.scrollTo({ top, behavior: 'instant' })
      } else if (drag.mode === 'strip') {
        // Scroll-driven position resumes the next time the visitor scrolls through the pin
        const x = Math.min(0, Math.max(-distance(), drag.startTrackX + dx))
        gsap.set(track, { x })
        syncToX(x)
      } else {
        viewport.scrollLeft = drag.startLeft - dx
      }
    }

    const onPointerUp = () => {
      if (!drag.down) return
      drag.down = false
      section.removeAttribute('data-dragging')
      if (!drag.moved || frames.length < 2) return

      // Settle on the nearest frame
      if (drag.mode === 'scroll' && trigger) {
        const range = trigger.end - trigger.start
        const progress = (window.scrollY - trigger.start) / range
        const snapped = Math.round(progress * (frames.length - 1)) / (frames.length - 1)
        window.scrollTo({ top: trigger.start + snapped * range, behavior: 'smooth' })
      } else if (drag.mode === 'strip') {
        const range = distance()
        const current = Number(gsap.getProperty(track, 'x')) || 0
        const step = range / (frames.length - 1)
        const target = Math.min(0, Math.max(-range, Math.round(current / step) * step))
        gsap.to(track, {
          x: target,
          duration: 0.5,
          ease: 'power3.out',
          onUpdate: () => syncToX(Number(gsap.getProperty(track, 'x')) || 0),
        })
      }
    }

    // A drag shouldn't also open the campaign it ended on
    const onClickCapture = (e: MouseEvent) => {
      if (!drag.moved) return
      e.preventDefault()
      e.stopPropagation()
      drag.moved = false
    }

    const preventNativeDrag = (e: DragEvent) => e.preventDefault()

    viewport.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
    viewport.addEventListener('click', onClickCapture, true)
    viewport.addEventListener('dragstart', preventNativeDrag)

    return () => {
      viewport.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      viewport.removeEventListener('click', onClickCapture, true)
      viewport.removeEventListener('dragstart', preventNativeDrag)
      mm.revert()
    }
  }, [items.length, layout])

  return (
    <section
      ref={sectionRef}
      id={id}
      className={styles.section}
      data-layout={layout}
      aria-labelledby="campaign-range-heading"
    >
      <div className={styles.inner}>
        <SectionSlate index={index} label={layout === 'grid' ? 'Film library' : 'Selected films'} />
        <header className={styles.header}>
          <h2 id="campaign-range-heading" className={styles.heading}>
            {heading}
          </h2>
          <div className={styles.headerCopy}>
            {statement ? <p className={styles.statement}>{statement}</p> : null}
            {description ? <p className={styles.description}>{description}</p> : null}
            {collectionHref && layout === 'grid' ? (
              <OutlineButton href={collectionHref} variant="white">
                View full collection
              </OutlineButton>
            ) : null}
          </div>
        </header>
      </div>

      {layout === 'grid' ? (
        <div className={styles.inner}>
          {formats.length > 2 || brands.length > 2 ? (
            <div className={styles.filterBar}>
              {[
                { name: 'Format', options: formats, value: filter, set: setFilter, show: formats.length > 2 },
                { name: 'Brand', options: brands, value: brand, set: setBrand, show: brands.length > 2 },
              ]
                .filter((row) => row.show)
                .map((row) => (
                  <div key={row.name} className={styles.filterRow}>
                    <span className={styles.filterLabel} aria-hidden="true">
                      {row.name}
                    </span>
                    <div className={styles.filters} role="group" aria-label={`Filter by ${row.name.toLowerCase()}`}>
                      {row.options.map((option) => (
                        <button
                          key={option.label}
                          type="button"
                          className={styles.filter}
                          aria-pressed={row.value === option.label}
                          disabled={option.count === 0 && row.value !== option.label}
                          onClick={() => {
                            row.set(option.label)
                            setExpanded(false)
                          }}
                        >
                          {option.label}
                          <span className={styles.filterCount}>{pad(option.count)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          ) : null}

          <ul className={styles.grid}>
            {visible.map(({ item, i }, position) => (
              <li
                key={`${item.client}-${item.campaign}`}
                className={styles.gridItem}
                data-reveal="up"
                style={{ '--reveal-delay': `${(position % 3) * 80}ms` } as CSSProperties}
              >
                <Frame item={item} number={i + 1} onSelect={() => onSelect(i)} />
              </li>
            ))}
          </ul>

          {filtered.length > initialCount ? (
            <div className={styles.more}>
              <OutlineButton onClick={() => toggleExpanded(!expanded)} variant="white" icon="none">
                {expanded ? 'Show fewer' : `Show all (${filtered.length})`}
              </OutlineButton>
            </div>
          ) : null}
        </div>
      ) : (
        <>
          <div ref={viewportRef} className={styles.viewport}>
            <ul ref={trackRef} className={styles.track}>
              {items.map((item, i) => (
                <li key={`${item.client}-${item.campaign}`} className={styles.item}>
                  <Frame item={item} number={i + 1} onSelect={() => onSelect(i)} />
                </li>
              ))}
            </ul>
          </div>

          <div className={`${styles.inner} ${styles.progress}`} aria-hidden="true">
            <span className={styles.counter}>
              <span ref={counterRef}>01</span> / {pad(items.length)}
            </span>
            <span className={styles.bar}>
              <span ref={fillRef} className={styles.fill} />
            </span>
            <span className={styles.hint}>Drag or scroll</span>
          </div>

          {/* Under the strip, on the right: the way out to the full library */}
          {collectionHref ? (
            <div className={`${styles.inner} ${styles.collection}`}>
              <OutlineButton href={collectionHref} variant="white">
                View full collection
              </OutlineButton>
            </div>
          ) : null}
        </>
      )}
    </section>
  )
}

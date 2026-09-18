'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import OutlineButton from '@/components/OutlineButton'
import Viewfinder from '@/components/Viewfinder'
import styles from './Hero.module.css'
import ReelModal from './ReelModal'
import BriefPanel from './BriefPanel'

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isReelOpen, setIsReelOpen] = useState(false)
  const [isBriefOpen, setIsBriefOpen] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  // Hide the scroll cue once it has done its job
  useEffect(() => {
    const onScroll = () => setHasScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // The load sequence waits for the page to finish hydrating, so the headline doesn't stutter under that work; the
  // background film then starts once the headline has landed, so its decoding doesn't land mid-animation either
  const [introReady, setIntroReady] = useState(false)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    const frame = requestAnimationFrame(() => {
      setIntroReady(true)
      timer = setTimeout(() => videoRef.current?.load(), 1500)
    })

    return () => {
      cancelAnimationFrame(frame)
      if (timer) clearTimeout(timer)
    }
  }, [])

  // Lock scroll and close on Escape while the reel is open
  useEffect(() => {
    if (!isReelOpen) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsReelOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isReelOpen])

  const closeBrief = useCallback(() => setIsBriefOpen(false), [])

  return (
    <section id="hero" className={styles.hero} data-intro={introReady ? 'play' : undefined}>
      <video ref={videoRef} className={styles.media} autoPlay loop muted playsInline preload="none">
        <source src="/assets/Sizzle Reel.mp4" type="video/mp4" />
      </video>
      <div className={styles.shade} aria-hidden="true" />

      {/* Viewport corner marks, capped to the content width so they frame the copy on ultra-wide screens */}
      <div className={styles.frameBox} aria-hidden="true">
        <Viewfinder className={styles.frame} hud />
      </div>

      <div className={styles.content}>
        <p className={styles.eyebrow}>
          {/* The logo is only a wordmark, so first-time visitors need the name spelled out */}
          <span>Wyntre Studios</span>
          <span className={styles.eyebrowRule} aria-hidden="true" />
        </p>

        <h1 className={styles.title}>
          <span className={styles.line}>
            <span className={styles.lineInner}>Where it all</span>
          </span>{' '}
          {/* The space keeps the sentence intact for screen readers and search; the lines are blocks visually */}
          <span className={`${styles.line} ${styles.accent}`}>
            <span className={`${styles.lineInner} ${styles.lineInnerLate}`}>comes together.</span>
            <span className={styles.underline} aria-hidden="true" />
          </span>
        </h1>

        <p className={styles.kicker}>
          Post-production, VFX, motion &amp; creative technology.
        </p>

        <div className={styles.actions}>
          <OutlineButton onClick={() => setIsReelOpen(true)} variant="white" icon="play">
            Watch the reel
          </OutlineButton>
          <OutlineButton onClick={() => setIsBriefOpen(true)} variant="white">
            Start a brief
          </OutlineButton>
        </div>
      </div>

      {/* Hairline with a tick running down it; fades once the visitor starts scrolling */}
      <div className={styles.scroll} data-hidden={hasScrolled || undefined} aria-hidden="true">
        <span className={styles.scrollTrack}>
          <span className={styles.scrollTick} />
        </span>
      </div>

      <ReelModal isOpen={isReelOpen} onClose={() => setIsReelOpen(false)} />
      <BriefPanel isOpen={isBriefOpen} onClose={closeBrief} />
    </section>
  )
}

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

  // The load sequence waits for the page to finish hydrating and for the headline font to be ready, so the headline
  // neither stutters under that work nor rises in the fallback face and then jumps to Monument. Capped at 1.2s so a
  // slow or missing font never holds the hero back. The background film starts once the headline has landed, so its
  // decoding doesn't land mid-animation either.
  const [introReady, setIntroReady] = useState(false)

  useEffect(() => {
    // Set once the sequence has started, or once the component has gone
    let settled = false
    let frame = 0
    let timer: ReturnType<typeof setTimeout> | undefined

    const play = () => {
      if (settled) return
      settled = true
      frame = requestAnimationFrame(() => {
        setIntroReady(true)
        // play() also starts the download; there's no autoPlay attribute, which would start it straight away and
        // then get cut off and restarted when this ran
        timer = setTimeout(() => videoRef.current?.play().catch(() => {}), 1500)
      })
    }

    document.fonts.load("800 1em 'Monument Extended Ultrabold Local'").then(play, play)
    const cap = setTimeout(play, 1200)

    return () => {
      settled = true
      clearTimeout(cap)
      cancelAnimationFrame(frame)
      if (timer) clearTimeout(timer)
    }
  }, [])

  // Stop decoding the film while the hero is off screen; it picks up again on the way back
  useEffect(() => {
    const video = videoRef.current
    if (!video || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) video.pause()
      // Only resume a film that has started; before that the intro's timer starts it
      else if (video.currentTime > 0 && video.paused) video.play().catch(() => {})
    })
    observer.observe(video)
    return () => observer.disconnect()
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
      {/* 720p loop (about 3MB); the poster, its first frame, shows straight away so the hero is never blank */}
      <video
        ref={videoRef}
        className={styles.media}
        loop
        muted
        playsInline
        preload="none"
        poster="/assets/hero-poster.jpg"
      >
        <source src="/assets/hero-loop.mp4" type="video/mp4" />
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

'use client'

import { useEffect, useRef } from 'react'
import OutlineButton from '@/components/OutlineButton'
import ScrollIndicator from '@/components/ScrollIndicator'

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Defer video loading until after page is interactive
    const loadVideo = () => {
      if (videoRef.current) {
        videoRef.current.load()
      }
    }
    
    // Load video after a short delay to prioritize page content
    if (document.readyState === 'complete') {
      setTimeout(loadVideo, 100)
    } else {
      window.addEventListener('load', () => setTimeout(loadVideo, 100))
    }
  }, [])

  return (
    <section id="hero" className="hero">
      <video
        ref={videoRef}
        className="hero-media"
        autoPlay
        loop
        muted
        playsInline
        preload="none"
      >
        <source src="/assets/Sizzle Reel.mp4" type="video/mp4" />
      </video>
      <div className="hero-overlay"></div>

      <div className="hero-inner">
        <h1 className="hero-title">POST, <span className="accent">PERFECTED.</span></h1>
        <p className="hero-kicker">Creative solutions through post, for brands and directors who can't afford to get it wrong.</p>
        <div className="btn-container">
          <OutlineButton href="#reel" variant="white">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              WATCH NOW
              <img 
                src="/assets/Play_Circle.svg" 
                alt="Play" 
                width={24} 
                height={24}
                style={{ display: 'inline-block' }}
              />
            </span>
          </OutlineButton>
        </div>
      </div>

      <div className="hero-scroll-indicator">
        <ScrollIndicator state="active" count={1} fadeOnScroll={true} />
      </div>
    </section>
  )
}


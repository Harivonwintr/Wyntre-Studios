'use client'

import OutlineButton from '@/components/OutlineButton'
import ScrollIndicator from '@/components/ScrollIndicator'

export default function Hero() {
  return (
    <section id="hero" className="hero">
      <video
        className="hero-media"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
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


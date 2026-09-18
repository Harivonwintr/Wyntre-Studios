'use client'

import { useLayoutEffect } from 'react'
import { usePathname } from 'next/navigation'
import Hero from './Hero'

export default function ConditionalHero() {
  const pathname = usePathname()
  
  // Show hero on main pages, hide on case study pages
  const showHero = pathname === '/' || 
                   pathname === '/work' || 
                   pathname === '/services' || 
                   pathname === '/studio' || 
                   pathname === '/contact'
  
  // Scroll to top synchronously before browser paint to prevent bounce
  useLayoutEffect(() => {
    if (!showHero) return

    // Nav links skip past the hero: place the page there before paint instead of flashing the top and scrolling down
    if (sessionStorage.getItem('navScroll')) {
      const hero = document.getElementById('hero')
      if (hero) window.scrollTo({ top: hero.offsetTop + hero.offsetHeight - 80, behavior: 'instant' })
      return
    }

    // Skip when a hash is present so links like /services#vfx land on their section
    if (!window.location.hash) {
      // Scroll immediately, before Next.js can restore scroll position
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }
  }, [pathname, showHero])
  
  if (!showHero) {
    return null
  }
  
  return <Hero />
}


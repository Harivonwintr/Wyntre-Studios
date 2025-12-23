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
    if (showHero) {
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


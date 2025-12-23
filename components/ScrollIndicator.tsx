'use client'

import { useEffect, useState } from 'react'
import styles from './ScrollIndicator.module.css'

interface ScrollIndicatorProps {
  state: 'active' | 'idle' | 'disabled'
  count?: number
  fadeOnScroll?: boolean
}

export default function ScrollIndicator({ state, count = 1, fadeOnScroll = false }: ScrollIndicatorProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    if (!fadeOnScroll) return

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [fadeOnScroll])

  const indicators = Array.from({ length: count }, (_, i) => (
    <div key={i} className={`${styles.mouse} ${styles[state]} ${isScrolled ? styles.fadeOut : ''}`}>
      <div className={styles.dot}></div>
    </div>
  ))

  return (
    <div className={styles.row}>
      {indicators}
    </div>
  )
}


'use client'

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { syncSmoothScroll } from '@/utils/smoothScroll'
import styles from './PageTransition.module.css'

type Variant = 'none' | 'fade'

const isCaseStudy = (path: string | null) => !!path && path.startsWith('/work/') && path !== '/work'

/**
 * Fades each new page in where it lands. Opacity only: a transform on the page would break fixed-position
 * pinning (the campaign film strip) while the animation runs.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const prevPathRef = useRef<string | null>(null)
  // Set when the route change came from the browser's back/forward buttons, which restore scroll themselves
  const fromHistoryRef = useRef(false)
  const [variant, setVariant] = useState<Variant>('none')

  // Browser back from a case study counts as a back navigation
  useEffect(() => {
    const handlePopState = () => {
      fromHistoryRef.current = true
      if (isCaseStudy(window.location.pathname)) {
        sessionStorage.setItem('isBackNavigation', 'true')
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useLayoutEffect(() => {
    const prevPath = prevPathRef.current
    prevPathRef.current = pathname
    if (!prevPath || prevPath === pathname) return

    // A glide still running from the previous page would otherwise carry on and pull the new page down with it
    syncSmoothScroll()

    const toCaseStudy = sessionStorage.getItem('navigatingToCaseStudy') === 'true'
    const backFlag = sessionStorage.getItem('isBackNavigation') === 'true'
    sessionStorage.removeItem('navigatingToCaseStudy')
    sessionStorage.removeItem('isBackNavigation')

    setVariant('fade')

    const isBack = backFlag || (isCaseStudy(prevPath) && !isCaseStudy(pathname) && !toCaseStudy)
    const fromHistory = fromHistoryRef.current
    fromHistoryRef.current = false
    const saved = isBack ? sessionStorage.getItem('caseStudyOriginScroll') : null

    if (!saved) {
      // New pages start at the top, unless the link targets a section (a #hash, or a nav shortcut the Nav and
      // ConditionalHero handle) or the browser is restoring its own position on back/forward
      const targetsSection =
        !!window.location.hash || !!sessionStorage.getItem('navScroll') || !!sessionStorage.getItem('navScrollTarget')
      if (!isBack && !fromHistory && !targetsSection) {
        window.scrollTo({ top: 0, behavior: 'instant' })
      }
      syncSmoothScroll()
      // Browser back/forward restores its position after this runs, and the new page's height settles late
      const settle = requestAnimationFrame(() => requestAnimationFrame(syncSmoothScroll))
      return () => cancelAnimationFrame(settle)
    }

    sessionStorage.removeItem('caseStudyOriginScroll')
    sessionStorage.removeItem('caseStudyOriginPath')
    const top = parseInt(saved, 10)

    // Return to where the visitor left the origin page. Pinned sections add scroll space once they build, which
    // shifts the page, so restore again after each ScrollTrigger refresh until the visitor scrolls themselves.
    const restore = () => {
      window.scrollTo({ top, behavior: 'instant' })
      syncSmoothScroll()
    }
    let userScrolled = false
    const markUserScroll = () => {
      userScrolled = true
    }
    const onRefresh = () => {
      if (!userScrolled) restore()
    }

    restore()
    requestAnimationFrame(restore)
    ScrollTrigger.addEventListener('refresh', onRefresh)
    window.addEventListener('wheel', markUserScroll, { passive: true, once: true })
    window.addEventListener('touchstart', markUserScroll, { passive: true, once: true })
    window.addEventListener('keydown', markUserScroll, { once: true })

    const stop = setTimeout(() => {
      ScrollTrigger.removeEventListener('refresh', onRefresh)
      window.removeEventListener('wheel', markUserScroll)
      window.removeEventListener('touchstart', markUserScroll)
      window.removeEventListener('keydown', markUserScroll)
    }, 2000)

    return () => {
      clearTimeout(stop)
      ScrollTrigger.removeEventListener('refresh', onRefresh)
      window.removeEventListener('wheel', markUserScroll)
      window.removeEventListener('touchstart', markUserScroll)
      window.removeEventListener('keydown', markUserScroll)
    }
  }, [pathname])

  return (
    <div className={styles.pageWrapper}>
      <div key={pathname} className={`${styles.pageLayer} ${variant === 'fade' ? styles.fade : ''}`}>
        {children}
      </div>
    </div>
  )
}

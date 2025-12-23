'use client'

import { useEffect, useLayoutEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import styles from './PageTransition.module.css'

interface PageTransitionProps {
  children: React.ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [displayChildren, setDisplayChildren] = useState(children)
  const [prevChildren, setPrevChildren] = useState<React.ReactNode>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isBackNavigation, setIsBackNavigation] = useState(false)
  const [shouldAnimate, setShouldAnimate] = useState(false)
  const prevPathRef = useRef<string | null>(null)
  const prevChildrenRef = useRef<React.ReactNode>(children)
  const enteringLayerRef = useRef<HTMLDivElement>(null)
  const exitingLayerRef = useRef<HTMLDivElement>(null)

  // Listen for browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      // When browser back is used, mark as back navigation if going from case study
      const currentPath = window.location.pathname
      const isCaseStudyRoute = currentPath?.startsWith('/work/') && currentPath !== '/work'
      
      // If we're on a case study page and user clicks back, mark as back navigation
      if (isCaseStudyRoute) {
        sessionStorage.setItem('isBackNavigation', 'true')
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useLayoutEffect(() => {
    const isCaseStudyRoute = pathname?.startsWith('/work/') && pathname !== '/work'
    const prevPath = prevPathRef.current
    const prevIsCaseStudy = prevPath?.startsWith('/work/') && prevPath !== '/work'

    // Detect if this is a back navigation (from case study to any origin page)
    const navigatingToCaseStudy = typeof window !== 'undefined' 
      ? sessionStorage.getItem('navigatingToCaseStudy') === 'true'
      : false
    
    const isBackNavFlag = typeof window !== 'undefined'
      ? sessionStorage.getItem('isBackNavigation') === 'true'
      : false
    
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('navigatingToCaseStudy')
      if (isBackNavFlag) {
        sessionStorage.removeItem('isBackNavigation')
      }
    }

    // Check if we're navigating back from a case study to any page
    const isBackNav = (prevIsCaseStudy && !isCaseStudyRoute && !navigatingToCaseStudy) || isBackNavFlag

    // Only animate if navigating to/from case study pages
    if ((isCaseStudyRoute || prevIsCaseStudy) && prevPath && prevPath !== pathname) {
      // Store previous children BEFORE updating
      const childrenToStore = prevChildrenRef.current
      
      // Set all states synchronously to ensure both layers render
      setIsBackNavigation(isBackNav)
      setIsTransitioning(true)
      setPrevChildren(childrenToStore)
      setDisplayChildren(children)
      prevChildrenRef.current = children
      setShouldAnimate(false) // Reset animation trigger

      // Store the navigation direction for useEffect
      return
    } else {
      // No transition for other routes or initial load
      setDisplayChildren(children)
      prevChildrenRef.current = children
      setPrevChildren(null)
      setIsTransitioning(false)
      setIsBackNavigation(false)
    }

    // Store current path for next navigation
    prevPathRef.current = pathname || null
  }, [pathname, children])

  // Trigger animation after DOM is ready
  useEffect(() => {
    if (!isTransitioning) {
      setShouldAnimate(false)
      return
    }

    // Small delay to ensure both layers are in DOM, then trigger animation
    const timer = setTimeout(() => {
      setShouldAnimate(true)
    }, 10)

    // If going back from case study, restore scroll position after animation
    if (isBackNavigation) {
      const scrollPosition = typeof window !== 'undefined'
        ? sessionStorage.getItem('caseStudyOriginScroll')
        : null

      const completeTimer = setTimeout(() => {
        setIsTransitioning(false)
        setPrevChildren(null)
        setIsBackNavigation(false)
        
        // Restore scroll position with a slight delay to ensure DOM is ready
        if (scrollPosition && typeof window !== 'undefined') {
          // Use requestAnimationFrame to ensure DOM is fully rendered
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              window.scrollTo({
                top: parseInt(scrollPosition, 10),
                behavior: 'instant'
              })
              sessionStorage.removeItem('caseStudyOriginScroll')
              sessionStorage.removeItem('caseStudyOriginPath')
            })
          })
        }
      }, 600) // Full animation duration

      return () => {
        clearTimeout(timer)
        clearTimeout(completeTimer)
      }
    } else {
      // Forward navigation - complete transition after animation
      const completeTimer = setTimeout(() => {
        setIsTransitioning(false)
        setPrevChildren(null)
        setIsBackNavigation(false)
      }, 600) // Full animation duration

      return () => {
        clearTimeout(timer)
        clearTimeout(completeTimer)
      }
    }
  }, [isTransitioning, isBackNavigation])

  const isCaseStudyPage = pathname?.startsWith('/work/') && pathname !== '/work'
  const prevPath = prevPathRef.current

  // Determine animation classes - only apply if shouldAnimate is true
  const exitClass = (isTransitioning && shouldAnimate && isBackNavigation) 
    ? styles.pageExitRight 
    : (isTransitioning && shouldAnimate && !isBackNavigation) 
      ? styles.pageExit 
      : ''
  const enterClass = (isTransitioning && shouldAnimate && isBackNavigation) 
    ? styles.slideInFromLeft 
    : (isTransitioning && shouldAnimate && isCaseStudyPage && !isBackNavigation) 
      ? styles.slideIn 
      : ''

  return (
    <div 
      className={`${styles.pageWrapper} ${isTransitioning ? styles.transitioning : ''} ${isCaseStudyPage ? styles.caseStudyPage : ''} ${isBackNavigation ? styles.backNavigation : ''}`}
    >
      {/* Previous page - sliding out */}
      {prevChildren && (
        <div
          ref={exitingLayerRef}
          key={`prev-${prevPath ?? 'none'}`}
          className={`${styles.pageLayer} ${exitClass}`}
        >
          {prevChildren}
        </div>
      )}
      {/* Current page - sliding in */}
      <div
        ref={enteringLayerRef}
        key={`curr-${pathname ?? 'none'}`}
        className={`${styles.pageLayer} ${enterClass}`}
      >
        {displayChildren}
      </div>
    </div>
  )
}


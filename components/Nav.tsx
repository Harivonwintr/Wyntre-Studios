'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isWorkDropdownOpen, setIsWorkDropdownOpen] = useState(false)
  const [pillStyle, setPillStyle] = useState({ width: 0, left: 0, opacity: 0 })
  const pathname = usePathname()
  const router = useRouter()
  
  const workRef = useRef<HTMLAnchorElement>(null)
  const servicesRef = useRef<HTMLAnchorElement>(null)
  const studioRef = useRef<HTMLAnchorElement>(null)
  const contactRef = useRef<HTMLAnchorElement>(null)
  const navLinksRef = useRef<HTMLElement>(null)
  
  // Check if we're on a case study page
  const isCaseStudyPage = pathname?.startsWith('/work/') && pathname !== '/work'

  // Function to scroll to the first content section after hero
  const scrollToContent = (targetPath: string, immediate = false) => {
    let targetId = ''
    
    if (targetPath === '/work' || targetPath === '/services' || targetPath === '/studio' || targetPath === '/') {
      targetId = 'spine-seq'
    } else if (targetPath === '/contact') {
      targetId = 'contact'
    }

    if (targetId) {
      const performScroll = () => {
        const element = document.getElementById(targetId)
        if (element) {
          const headerHeight = 80 // Approximate header height
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
          const offsetPosition = elementPosition - headerHeight

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
          return true
        }
        return false
      }

      if (immediate) {
        // For same-page navigation, try immediately
        requestAnimationFrame(() => {
          if (!performScroll()) {
            // If not found, try once more after a tiny delay
            setTimeout(performScroll, 10)
          }
        })
      } else {
        // For cross-page navigation, retry with shorter intervals
        const attemptScroll = (attempts = 0) => {
          if (!performScroll() && attempts < 20) {
            setTimeout(() => attemptScroll(attempts + 1), 25)
          }
        }
        requestAnimationFrame(() => attemptScroll())
      }
    }
  }

  // Handle scroll on page load if navigating from another page
  useEffect(() => {
    // Check if we should scroll based on sessionStorage flag
    const shouldScroll = sessionStorage.getItem('navScroll')
    if (shouldScroll) {
      sessionStorage.removeItem('navScroll')
      // Start scrolling immediately, retry logic will handle element availability
      scrollToContent(pathname || '/', false)
    }
  }, [pathname])
  
  // Update pill position based on active link
  useEffect(() => {
    const updatePillPosition = () => {
      if (isMenuOpen) return // Don't show pill in mobile menu
      
      let activeRef: React.RefObject<HTMLAnchorElement> | null = null
      
      if (pathname === '/work' || isCaseStudyPage) {
        activeRef = workRef
      } else if (pathname === '/services') {
        activeRef = servicesRef
      } else if (pathname === '/studio') {
        activeRef = studioRef
      } else if (pathname === '/contact') {
        activeRef = contactRef
      }
      
      if (activeRef?.current && navLinksRef.current) {
        const activeElement = activeRef.current
        const navLinks = navLinksRef.current
        const navLinksRect = navLinks.getBoundingClientRect()
        const activeRect = activeElement.getBoundingClientRect()
        
        const left = activeRect.left - navLinksRect.left
        const width = activeRect.width
        
        setPillStyle({
          width,
          left,
          opacity: 1
        })
      } else {
        setPillStyle(prev => ({ ...prev, opacity: 0 }))
      }
    }
    
    updatePillPosition()
    
    // Update on resize
    window.addEventListener('resize', updatePillPosition)
    return () => window.removeEventListener('resize', updatePillPosition)
  }, [pathname, isCaseStudyPage, isMenuOpen])

  // Close menu when clicking outside or on a link
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setIsWorkDropdownOpen(false)
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMenuOpen(!isMenuOpen)
    if (isMenuOpen) {
      setIsWorkDropdownOpen(false)
    }
  }

  const handleWorkClick = (e: React.MouseEvent) => {
    // Only prevent default on mobile (when menu is open)
    if (isMenuOpen) {
      e.preventDefault()
      setIsWorkDropdownOpen(!isWorkDropdownOpen)
      return
    }
    
    // If clicking Work link and already on work page, scroll to content
    if (pathname === '/work' || isCaseStudyPage) {
      e.preventDefault()
      scrollToContent('/work', true)
    }
  }

  const handleLinkClick = (e: React.MouseEvent, targetPath: string) => {
    setIsMenuOpen(false)
    setIsWorkDropdownOpen(false)
    
    // If already on the target page, scroll to content immediately
    if (pathname === targetPath) {
      e.preventDefault()
      scrollToContent(targetPath, true)
    } else {
      // Set flag to scroll after navigation
      sessionStorage.setItem('navScroll', 'true')
      // Navigate to new page
      router.push(targetPath)
    }
  }

  const handleHomeClick = (e: React.MouseEvent) => {
    setIsMenuOpen(false)
    setIsWorkDropdownOpen(false)
    
    // If already on home page, scroll to top
    if (pathname === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      // Navigate to home
      router.push('/')
    }
  }

  return (
    <>
      {isMenuOpen && (
        <div 
          className="nav-backdrop"
          onClick={(e) => {
            e.stopPropagation()
            setIsMenuOpen(false)
            setIsWorkDropdownOpen(false)
          }}
          aria-hidden="true"
        />
      )}
      <header className={`site-header ${isMenuOpen ? 'menu-open' : ''} ${isCaseStudyPage ? 'case-study-nav' : ''}`} id="siteHeader">
        <div className="nav-inner">
          <Link href="/" className="brand" onClick={handleHomeClick} scroll={false}>
            <Image 
              src={isCaseStudyPage ? "/assets/Brandmark dark.png" : "/assets/logo.svg"} 
              alt="Wyntre" 
              className="brand-mark"
              width={100}
              height={100}
              priority
            />
          </Link>

          <button 
            className={`hamburger ${isMenuOpen ? 'is-active' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            type="button"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <nav 
            ref={navLinksRef}
            className={`nav-links ${isMenuOpen ? 'is-open' : ''}`} 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="nav-pill" style={pillStyle} aria-hidden="true" />
            <div className="nav-dropdown">
              <Link 
                ref={workRef}
                href="/work" 
                className={`nav-link ${pathname === '/work' || isCaseStudyPage ? 'active' : ''}`}
                onClick={(e) => {
                  if (!isMenuOpen) {
                    handleLinkClick(e, '/work')
                  } else {
                    handleWorkClick(e)
                  }
                }}
                scroll={false}
              >
                Work <span className={`dropdown-arrow ${isWorkDropdownOpen ? 'is-open' : ''}`}>▼</span>
              </Link>
              <div className={`dropdown-menu ${isWorkDropdownOpen ? 'is-open' : ''}`}>
                <Link href="/work#case-studies" onClick={(e) => {
                  setIsMenuOpen(false)
                  setIsWorkDropdownOpen(false)
                  if (pathname === '/work') {
                    e.preventDefault()
                    const element = document.getElementById('case-studies')
                    if (element) {
                      const headerHeight = 80
                      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
                      const offsetPosition = elementPosition - headerHeight
                      window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
                    }
                  }
                }} scroll={false}>Case Studies</Link>
                <Link href="/work#campaign-range" onClick={(e) => {
                  setIsMenuOpen(false)
                  setIsWorkDropdownOpen(false)
                  if (pathname === '/work') {
                    e.preventDefault()
                    const element = document.getElementById('campaign-range')
                    if (element) {
                      const headerHeight = 80
                      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
                      const offsetPosition = elementPosition - headerHeight
                      window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
                    }
                  }
                }} scroll={false}>Campaign Range</Link>
              </div>
            </div>
            <Link 
              ref={servicesRef}
              href="/services" 
              className={pathname === '/services' ? 'active' : ''}
              onClick={(e) => handleLinkClick(e, '/services')} 
              scroll={false}
            >
              Services
            </Link>
            <Link 
              ref={studioRef}
              href="/studio" 
              className={pathname === '/studio' ? 'active' : ''}
              onClick={(e) => handleLinkClick(e, '/studio')} 
              scroll={false}
            >
              Studio
            </Link>
            <Link 
              ref={contactRef}
              href="/contact" 
              className={pathname === '/contact' ? 'active' : ''}
              onClick={(e) => handleLinkClick(e, '/contact')} 
              scroll={false}
            >
              Contact
            </Link>
          </nav>
        </div>
      </header>
    </>
  )
}


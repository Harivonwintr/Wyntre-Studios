'use client'

import { Fragment, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

// Shortcuts in the Work dropdown, each an anchor on the Work page
const WORK_SECTIONS = [
  { id: 'case-studies', label: 'Case studies' },
  { id: 'campaign-range', label: 'Film library' },
  { id: 'rescue-stories', label: 'Rescue stories' },
]

// Direct shortcuts into each case study, listed under "Case studies"
const CASE_STUDIES = [
  { href: '/work/nivea', label: 'NIVEA' },
  { href: '/work/nescafe', label: 'NESCAFÉ' },
]

const HEADER_OFFSET = 80

/** Scrolls to a section by id, retrying briefly while a newly loaded page renders it */
const scrollToSection = (id: string, smooth: boolean) => {
  let attempts = 0
  const tryScroll = () => {
    const element = document.getElementById(id)
    if (element) {
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET,
        behavior: smooth ? 'smooth' : 'instant',
      })
      return
    }
    if (attempts++ < 40) setTimeout(tryScroll, 50)
  }
  tryScroll()
}

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isWorkDropdownOpen, setIsWorkDropdownOpen] = useState(false)
  const pathname = usePathname()

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

          // Smooth on the same page; instant after navigating so the new page doesn't scroll past the hero
          window.scrollTo({
            top: offsetPosition,
            behavior: immediate ? 'smooth' : 'instant'
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
    if (typeof window !== 'undefined') {
      // A Work dropdown shortcut used from another page: land on that section
      const section = sessionStorage.getItem('navScrollTarget')
      if (section) {
        sessionStorage.removeItem('navScrollTarget')
        scrollToSection(section, false)
        return
      }

      const shouldScroll = sessionStorage.getItem('navScroll')
      if (shouldScroll) {
        sessionStorage.removeItem('navScroll')
        // Start scrolling immediately, retry logic will handle element availability
        scrollToContent(pathname || '/', false)
      }
    }
  }, [pathname])
  
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
      // Set flag to scroll after navigation; <Link> performs the navigation itself
      sessionStorage.setItem('navScroll', 'true')
    }
  }

  const handleHomeClick = (e: React.MouseEvent) => {
    setIsMenuOpen(false)
    setIsWorkDropdownOpen(false)
    
    // If already on home page, scroll to top
    if (pathname === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
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
              src={isCaseStudyPage ? "/assets/Brandmark dark.png" : "/assets/logo.webp"}
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
            className={`nav-links ${isMenuOpen ? 'is-open' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="nav-dropdown">
              <Link
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
                Work
                <span className={`dropdown-arrow ${isWorkDropdownOpen ? 'is-open' : ''}`} aria-hidden="true">
                  <svg viewBox="0 0 10 6" focusable="false">
                    <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </span>
              </Link>
              <div className={`dropdown-menu ${isWorkDropdownOpen ? 'is-open' : ''}`}>
                {WORK_SECTIONS.map((section, i) => (
                  <Fragment key={section.id}>
                  <Link
                    href={`/work#${section.id}`}
                    scroll={false}
                    onClick={(e) => {
                      setIsMenuOpen(false)
                      setIsWorkDropdownOpen(false)
                      if (pathname === '/work') {
                        e.preventDefault()
                        scrollToSection(section.id, true)
                      } else {
                        // Scroll once the Work page has rendered
                        sessionStorage.setItem('navScrollTarget', section.id)
                      }
                    }}
                  >
                    <span className="dropdown-index">{String(i + 1).padStart(2, '0')}</span>
                    <span className="dropdown-label">{section.label}</span>
                    <svg className="dropdown-go" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      <path d="M7 17L17 7M8.5 7H17v8.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                    </svg>
                  </Link>
                  {section.id === 'case-studies'
                    ? CASE_STUDIES.map((study) => (
                        <Link
                          key={study.href}
                          href={study.href}
                          className="dropdown-sub"
                          aria-current={pathname === study.href ? 'page' : undefined}
                          onClick={() => {
                            setIsMenuOpen(false)
                            setIsWorkDropdownOpen(false)
                          }}
                        >
                          <span className="dropdown-index" aria-hidden="true" />
                          <span className="dropdown-label">{study.label}</span>
                          <svg className="dropdown-go" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                            <path d="M7 17L17 7M8.5 7H17v8.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                          </svg>
                        </Link>
                      ))
                    : null}
                  </Fragment>
                ))}
              </div>
            </div>
            <Link
              href="/services"
              className={pathname === '/services' ? 'active' : ''}
              onClick={(e) => handleLinkClick(e, '/services')} 
              scroll={false}
            >
              Services
            </Link>
            <Link
              href="/studio"
              className={pathname === '/studio' ? 'active' : ''}
              onClick={(e) => handleLinkClick(e, '/studio')} 
              scroll={false}
            >
              Studio
            </Link>
            <Link
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


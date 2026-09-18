'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import ContactForm from './ContactForm'
import styles from './BriefPanel.module.css'

type Props = {
  isOpen: boolean
  onClose: () => void
}

// Matches the slide-out transition in the stylesheet
const CLOSE_MS = 450

/** "Start a brief" without leaving the page: the contact form in a panel that slides in from the right */
export default function BriefPanel({ isOpen, onClose }: Props) {
  // Stays mounted through the slide-out, then unmounts
  const [isRendered, setIsRendered] = useState(false)
  const [isShown, setIsShown] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true)
      // Two frames so the closed state paints before the transition to open
      let inner = 0
      const outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => setIsShown(true))
      })
      return () => {
        cancelAnimationFrame(outer)
        cancelAnimationFrame(inner)
      }
    }
    setIsShown(false)
    const timer = window.setTimeout(() => setIsRendered(false), CLOSE_MS)
    return () => window.clearTimeout(timer)
  }, [isOpen])

  // Lock the page, close on Escape, keep Tab inside the panel and hand focus back afterwards
  useEffect(() => {
    if (!isOpen || !isRendered) return
    const panel = panelRef.current
    const previouslyFocused = document.activeElement as HTMLElement | null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Cursor goes straight into the first field once the panel has slid in
    const focusTimer = window.setTimeout(() => {
      panel?.querySelector<HTMLInputElement>('input[name="name"]')?.focus({ preventScroll: true })
    }, 350)

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab' || !panel) return
      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>('button, [href], input:not([tabindex="-1"]), textarea, [tabindex]:not([tabindex="-1"])')
      ).filter((el) => !el.hasAttribute('disabled'))
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.clearTimeout(focusTimer)
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
      previouslyFocused?.focus?.({ preventScroll: true })
    }
  }, [isOpen, isRendered, onClose])

  if (!isRendered) return null

  return createPortal(
    <div className={styles.root} data-open={isShown || undefined}>
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />

      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="brief-panel-heading"
        data-lenis-prevent
      >
        <div className={styles.top}>
          <span className={styles.slate}>[Brief]</span>
          <span className={styles.rule} aria-hidden="true" />
          <button className={styles.close} type="button" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
            </svg>
          </button>
        </div>

        <div className={styles.head}>
          <h2 id="brief-panel-heading" className={styles.heading}>
            Start a brief.
          </h2>
          <p className={styles.lede}>A few lines is plenty. We&apos;ll take it from there.</p>
        </div>

        <ContactForm id="brief-form" />

        <p className={styles.direct}>
          {/* Pinned in the empty space at the foot of the panel, above the email line */}
          <img className={styles.note} src="/assets/notes/great-stories.webp" alt="" />
          <span className={styles.directLabel}>Rather email?</span>
          <a href="mailto:hari@wyntrestudios.com">hari@wyntrestudios.com</a>
        </p>
      </div>
    </div>,
    document.body
  )
}

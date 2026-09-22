'use client'

import { scrollToTop } from '@/utils/smoothScroll'
import styles from './Footer.module.css'

/** Footer button that glides the page back up to the hero */
export default function BackToTop() {
  return (
    <button type="button" className={styles.backToTop} onClick={scrollToTop}>
      Back to top
      <span className={styles.backToTopIcon} aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </span>
    </button>
  )
}

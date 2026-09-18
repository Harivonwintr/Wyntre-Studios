import type { Metadata } from 'next'
import Link from 'next/link'
import OutlineButton from '@/components/OutlineButton'
import Viewfinder from '@/components/Viewfinder'
import styles from './not-found.module.css'

export const metadata: Metadata = {
  title: 'Page not found · Wyntre Studios',
}

/** Missing pages: an empty viewfinder, one line, and a way back */
export default function NotFound() {
  return (
    <section className={styles.section}>
      <Viewfinder className={styles.frame} />

      <div className={styles.inner}>
        <p className={styles.slate}>
          <span>[404]</span>
          <span className={styles.rule} aria-hidden="true" />
          <span>Frame not found</span>
        </p>

        <h1 className={styles.heading}>
          <span className={styles.lead}>Lost in</span>
          <span className={styles.hero}>the edit.</span>
        </h1>

        <p className={styles.body}>This page didn&apos;t make the final cut.</p>

        <div className={styles.actions}>
          <OutlineButton href="/" variant="white">
            Back to the homepage
          </OutlineButton>
          <Link href="/work" className={styles.secondary}>
            See the work
          </Link>
        </div>

        {/* The client note every missing page deserves */}
        <img className={styles.note} src="/assets/notes/back-to-version-3.webp" alt="" aria-hidden="true" />
      </div>
    </section>
  )
}

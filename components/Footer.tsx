import Image from 'next/image'
import Link from 'next/link'
import styles from './Footer.module.css'

// Fill in real URLs to show these links; entries without one are hidden rather than rendered as dead "#" links
const socialLinks = [
  { label: 'LinkedIn', href: '' },
  { label: 'Instagram', href: '' },
  { label: 'X', href: '' },
  { label: 'YouTube', href: '' },
].filter((link) => link.href)

const legalLinks = [
  { label: 'Terms', href: '' },
  { label: 'Privacy', href: '' },
].filter((link) => link.href)

const EXPLORE = [
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/services' },
  { label: 'Studio', href: '/studio' },
  { label: 'Contact', href: '/contact' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.columns}>
          <div className={styles.brand}>
            <Link href="/" aria-label="Wyntre Studios home">
              <Image src="/assets/logo.svg" alt="Wyntre Studios" width={120} height={120} className={styles.logo} />
            </Link>
          </div>

          <nav aria-labelledby="footer-explore">
            <h3 id="footer-explore" className={styles.label}>
              <span className={styles.index}>[01]</span> Explore
            </h3>
            <ul className={styles.list}>
              {EXPLORE.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className={styles.label}>
              <span className={styles.index}>[02]</span> Location
            </h3>
            {/* City only: no street address on a public page */}
            <address className={styles.address}>
              San Francisco, CA
              <br />
              United States
            </address>
          </div>

          <div>
            <h3 className={styles.label}>
              <span className={styles.index}>[03]</span> Contact
            </h3>
            <ul className={styles.list}>
              <li>
                <a href="mailto:hari@wyntrestudios.com">hari@wyntrestudios.com</a>
              </li>
              <li>
                <a href="tel:+16283060599">+1 (628) 306-0599</a>
              </li>
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {legalLinks.length > 0 && (
            <nav aria-labelledby="footer-legal">
              <h3 id="footer-legal" className={styles.label}>
                <span className={styles.index}>[04]</span> Legal
              </h3>
              <ul className={styles.list}>
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>

        <div className={styles.meta}>
          <span>© {currentYear} Wyntre Studios LLC. All rights reserved.</span>
          <span>San Francisco, CA</span>
          <a href="#top" className={styles.backToTop}>
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  )
}

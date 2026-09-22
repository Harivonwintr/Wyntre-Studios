import ContactForm from './ContactForm'
import TwoTierHeadline from './TwoTierHeadline'
import SectionSlate from './SectionSlate'
import styles from './ContactSection.module.css'

const ASSETS = '/assets/contact'

// Add a URL to show each icon; entries without one stay hidden rather than linking nowhere
const SOCIALS = [
  { label: 'LinkedIn', href: '', icon: 'linkedin' },
  { label: 'Instagram', href: '', icon: 'instagram' },
  { label: 'X', href: '', icon: 'x' },
].filter((social) => social.href)

const SERVICES = ['Film', 'Commercial', 'Social', 'VFX', 'Color', 'Post']

function SocialIcon({ icon }: { icon: string }) {
  if (icon === 'linkedin') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="3" y="9" width="4" height="12" />
        <circle cx="5" cy="4.5" r="2.2" />
        <path d="M10 9h3.8v1.7c.6-1 1.9-2 3.9-2 3.3 0 4.3 2.1 4.3 5.3V21h-4v-6.2c0-1.6-.3-2.8-1.9-2.8-1.7 0-2.1 1.2-2.1 2.8V21h-4z" />
      </svg>
    )
  }
  if (icon === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M4 4l16 16M20 4L4 20" />
    </svg>
  )
}

type Props = {
  id?: string
  /** Bracketed section number for the slate */
  index?: string
}

export default function ContactSection({ id, index = '[05]' }: Props) {
  return (
    <section id={id} className={styles.section} aria-labelledby="contact-heading">
      <div className={styles.inner}>
        <SectionSlate index={index} label="Get in touch" />
        <div className={styles.top}>
        <div className={styles.headlineWrap}>
          {/* Each line fitted to the column on its own, so the shorter second line comes out larger at the same width */}
          <TwoTierHeadline
            id="contact-heading"
            className={styles.headline}
            lead="Let's make something"
            hero="worth watching."
            leadMax={0.2}
            heroMax={0.3}
          />
        </div>

          {/* Beside the headline, above the San Francisco address it belongs to */}
          <div className={styles.postcard} aria-hidden="true">
            <img loading="lazy" decoding="async" className={styles.photo} src={`${ASSETS}/golden-gate.webp`} alt="" />
            <img loading="lazy" decoding="async" className={styles.tape} src={`${ASSETS}/tape.webp`} alt="" />
            <img loading="lazy" decoding="async" className={styles.note} src={`${ASSETS}/san-francisco.webp`} alt="" />
            {/* The invitation, stuck under the postcard where the column would otherwise run empty */}
            <img loading="lazy" decoding="async" className={styles.briefNote} src="/assets/notes/great-stories.webp" alt="" />
          </div>
        </div>

        <div className={styles.columns}>
          <div className={styles.project}>
            <p className={`${styles.sectionLabel} ${styles.ruled}`}>
              <span className={styles.index}>[01]</span>
              <span className={styles.labelText}>Start a project</span>
            </p>
            <ContactForm />
          </div>

          <div className={styles.contact}>
            <p className={styles.sectionLabel}>
              <span className={styles.index}>[02]</span>
              <span className={styles.labelText}>Contact</span>
            </p>

            <ul className={styles.details}>
              <li>
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
                </svg>
                <div>
                  <strong className={styles.city}>San Francisco</strong>
                  <address className={styles.address}>
                    California, United States
                  </address>
                </div>
              </li>
              <li>
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
                </svg>
                <div>
                  <strong className={styles.city}>Cape Town</strong>
                  <address className={styles.address}>
                    Western Cape, South Africa
                  </address>
                </div>
              </li>
              <li>
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="5" width="18" height="14" rx="1.5" />
                  <path d="M3.5 6l8.5 7 8.5-7" />
                </svg>
                <a href="mailto:hari@wyntrestudios.com">hari@wyntrestudios.com</a>
              </li>
              <li>
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 3.5h4l2 5-2.5 1.5a11 11 0 005.5 5.5l1.5-2.5 5 2v4a2 2 0 01-2 2A16.5 16.5 0 013 5.5a2 2 0 012-2z" />
                </svg>
                <a href="tel:+16283060599">+1 (628) 306-0599</a>
              </li>
            </ul>

            {SOCIALS.length > 0 && (
              <ul className={styles.socials}>
                {SOCIALS.map((social) => (
                  <li key={social.label}>
                    <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                      <SocialIcon icon={social.icon} />
                    </a>
                  </li>
                ))}
              </ul>
            )}

            <div className={styles.services}>
              <p className={styles.sectionLabel}>
                <span className={styles.index}>[03]</span>
                <span className={styles.labelText}>What we do</span>
              </p>
              <p className={styles.serviceList}>{SERVICES.join(' / ')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

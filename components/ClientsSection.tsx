import Image from 'next/image'
import SectionSlate from './SectionSlate'
import styles from './ClientsSection.module.css'

type Client = { name: string; logo: string }

// Swap in transparent SVG/PNG logos here as they come in; every file gets the same treatment
const CLIENTS: Client[] = [
  { name: 'Nivea', logo: 'nivea.png' },
  { name: 'Starbucks', logo: 'starbucks.png' },
  { name: 'Spotify', logo: 'spotify.png' },
  { name: 'Nescafé', logo: 'nescafe.png' },
  { name: 'Real Madrid', logo: 'realmadrid.png' },
  { name: 'Subway', logo: 'subway.png' },
  { name: 'Visa', logo: 'visa.png' },
  { name: 'Don Julio', logo: 'donjulio.png' },
  { name: 'Philip Morris International', logo: 'pmi.png' },
  { name: "McDonald's", logo: 'mcdonalds.png' },
  { name: 'Microsoft', logo: 'Microsoft Logo.png' },
  { name: 'Xbox', logo: 'Xbox Logo.png' },
  { name: 'Ibis Hotels', logo: 'ibis.png' },
  { name: 'Comfort', logo: 'comfort.png' },
  { name: 'Tork', logo: 'tork.png' },
  { name: 'Publicis', logo: 'publicis.png' },
  { name: 'Discovery', logo: 'discovery.png' },
  { name: 'Old Mutual', logo: 'oldmutual.png' },
  { name: 'FNB', logo: 'fnb.png' },
  { name: 'MTN', logo: 'mtn.png' },
  { name: 'Springboks', logo: 'springboks.png' },
  { name: 'Playgirl', logo: 'playgirl.png' },
]

const half = Math.ceil(CLIENTS.length / 2)
const ROWS = [CLIENTS.slice(0, half), CLIENTS.slice(half)]

// The track slides by half its width, so each half (two copies) must be wider than the container
const COPIES = [0, 1, 2, 3]

/** One endlessly scrolling row: the list repeats so the loop never shows a gap */
function MarqueeRow({ clients, reverse }: { clients: Client[]; reverse?: boolean }) {
  return (
    <div className={styles.row}>
      <div className={`${styles.track} ${reverse ? styles.reverse : ''}`}>
        {COPIES.map((copy) => (
          <ul key={copy} className={styles.set} aria-hidden={copy > 0 ? true : undefined}>
            {clients.map((client) => (
              <li key={client.name} className={styles.item}>
                <Image
                  src={`/assets/clients/${client.logo}`}
                  alt={copy === 0 ? client.name : ''}
                  width={160}
                  height={80}
                  className={styles.logo}
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}

/** Credibility band: a slate-style label over two logo marquees, held to the content width */
export default function ClientsSection() {
  return (
    <section id="clients" className={styles.section} aria-labelledby="clients-heading">
      <div className={styles.inner}>
        <h2 id="clients-heading" className={styles.srOnly}>
          Trusted by global brands
        </h2>
        <SectionSlate
          label="Trusted by global brands"
          aside={
            <span className={styles.aside}>
              {CLIENTS.length} brands / 40+ markets
            </span>
          }
          className={styles.slate}
        />

        <div className={styles.marquee}>
          <MarqueeRow clients={ROWS[0]} />
          <MarqueeRow clients={ROWS[1]} reverse />
        </div>
      </div>
    </section>
  )
}

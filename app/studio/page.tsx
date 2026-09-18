import Footer from '@/components/Footer'
import ContactSection from '@/components/ContactSection'
import GearBento from '@/components/GearBento'
import IntroBand from '@/components/IntroBand'
import SectionSlate from '@/components/SectionSlate'
import TapedPhoto from '@/components/TapedPhoto'
import TwoTierHeadline from '@/components/TwoTierHeadline'
import WhatDrivesUs, { type Point } from '@/components/WhatDrivesUs'
import styles from './Studio.module.css'
import { pageMeta } from '@/utils/seo'

export const metadata = pageMeta({
  title: 'Studio',
  description: 'The studio behind the work: who we are, how we work and the kit we cut on.',
})

const STORY = [
  'Hari grew up as the youngest in a creative, chaotic household, sneaking onto his siblings’ computers to teach himself Photoshop and Maya long before most kids knew what either was.',
  'Raised by two small business owners, he was exposed early to creativity, independence, and the idea that there was no single correct path. By nine, he was already working with professional creative tools, learning from industry mentors, and developing an unusual overlap between art, science, and mathematics.',
  'That combination shaped the way he thinks today. Visual ideas are treated as systems. Technical problems are approached creatively. And convention is rarely accepted simply because it is convention.',
  'Creativity became a way for Hari to make sense of the world, communicate ideas, and build the things he wished existed. When the traditional mold did not fit, he learned to make his own.',
  'Wyntre is an extension of that philosophy: a studio built around imagination, precision, and experimentation, where challenges are approached like a designer and solved like an engineer.',
]

const BELIEFS = [
  {
    label: 'Vision',
    text: 'Technology keeps changing what’s possible. We want to use that progress to make new things, not just make yesterday’s things faster.',
  },
  {
    label: 'Mission',
    text: 'Make creative work simpler, better, and possible.',
  },
]

// What we're like to work with, and who we want to work with
const HOW_WE_WORK: Point[] = [
  { title: ['Say what', 'you mean.'], body: 'If something isn’t working, say it. We will too.' },
  {
    title: ['Work with the people', 'doing the work.'],
    body: 'The people in the conversation are the people actually making the thing.',
  },
  {
    title: ['Move fast.', 'Skip the drama.'],
    body: 'Sometimes there are weeks. Sometimes there are hours. Either way, panic isn’t a production strategy.',
  },
  {
    title: ['Do what you', 'said you’d do.'],
    body: 'Good work means very little if it arrives late, broken, or impossible to use.',
  },
]

const pad = (n: number) => String(n).padStart(2, '0')

const FOUNDER_SOCIALS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/harivonwintr' },
  { label: 'X', href: 'https://x.com/harivonwintr' },
]

export default function StudioPage() {
  return (
    <>
      <IntroBand
        id="spine-seq"
        index="[01]"
        label="Studio"
        lead="The creative and technical were never"
        hero="separate."
        accent="separate."
        body={[
          'Good ideas need taste. Hard problems need engineering.',
          'Great work needs people who actually want to make it together.',
        ]}
        centered
      />

      <section id="founder" className={styles.founder} aria-labelledby="founder-heading">
        <div className={styles.inner}>
          <SectionSlate index="[02]" label="Founder's story" />

          <div className={styles.founderGrid}>
            <div className={styles.portrait}>
              <TapedPhoto
                src="/assets/Portrait(1).png"
                alt="Hari Von Wintr, founder of Wyntre Studios"
                rotate={-2}
                aspect="889 / 907"
                sizes="(max-width: 900px) 90vw, 35vw"
                paper
              />
              <p className={styles.credit}>
                <span className={styles.creditName}>Hari Von Wintr</span>
                <span>Founder &amp; creative director</span>
              </p>
              <ul className={styles.socials}>
                {FOUNDER_SOCIALS.map((social) => (
                  <li key={social.label}>
                    <a href={social.href} target="_blank" rel="noopener noreferrer">
                      {social.label}
                      <span aria-hidden="true"> ↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.story}>
              <TwoTierHeadline id="founder-heading" lead="A studio built around" hero="imagination." accent="imagination." />
              <div className={styles.storyBody}>
                {STORY.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <GearBento index="[03]" />

      <section className={styles.beliefs} aria-label="Vision and mission">
        <div className={styles.inner}>
          <SectionSlate index="[04]" label="What we stand for" />

          <div className={styles.beliefGrid}>
            {BELIEFS.map((belief) => (
              <article key={belief.label} className={styles.belief}>
                <h2 className={styles.beliefLabel}>{belief.label}</h2>
                <p className={styles.beliefText}>{belief.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <WhatDrivesUs
        id="how-we-work"
        index="[05]"
        eyebrow="How we work"
        intro={{ statement: 'If everyone can do the job, it starts to matter who you actually want to do it with.' }}
        lead="We’re not everybody’s cup of tea."
        hero="And that’s fine."
        accent="fine."
        points={HOW_WE_WORK}
        ctaHref="#contact"
        ctaLabel="Start a project"
        artwork={null}
        centered
      />

      <ContactSection id="contact" index="[06]" />

      <Footer />
    </>
  )
}

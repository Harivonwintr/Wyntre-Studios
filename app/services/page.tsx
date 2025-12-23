'use client'

import Image from 'next/image'
import Footer from '@/components/Footer'
import OutlineButton from '@/components/OutlineButton'
import { useScrollAnimations } from '@/hooks/useScrollAnimations'

export default function ServicesPage() {
  useScrollAnimations()
  return (
    <>

      {/* Services / Spine Section */}
      <section id="spine-seq" className="spine-band">
        <div className="spine-stage">
          <h1 className="services-spine-line">When the campaign's on the line,</h1>
          <h1 className="services-spine-line services-spine-accent">this is who you call.</h1>
          <p className="services-spine-subtitle">
            At Wyntre, we don't just cut, color, or composite — we solve. We step in when timelines collapse, when visuals need saving, and when there's no room to miss. Post-production is where campaigns become reality. We make sure they land.
          </p>
        </div>
      </section>

      {/* Video Post Production Section */}
      <section className="services-section">
        <div className="container">
          <h2 className="services-title-standalone">VIDEO POST PRODUCTION</h2>
          <div className="services-card-box">
            <div className="services-card-image-wrapper">
              <Image
                src="/assets/Video Post production.png"
                alt="NIVEA Q10 Anti-Wrinkle Expert"
                width={1200}
                height={800}
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
              />
              <div className="services-card-overlay">
                <span className="services-card-brand">NIVEA | Q10 Anti-Wrinkle Expert</span>
              </div>
            </div>
            <div className="services-card-text-content">
              <p className="services-description">
                We shape story from signal — refining pace, performance, and visual tone across formats. Built for campaigns that don't just need to land — but last.
              </p>
              <div className="services-tasks-section">
                <h3 className="services-tasks-heading">TASKS</h3>
                <ul className="services-tasks services-tasks-two-col">
                  <li>Video editing (TVC, digital, longform)</li>
                  <li>Retouching / Cleanup</li>
                  <li>Audio mix & sound design</li>
                  <li>Mastering and QC</li>
                  <li>Localization / multi-language delivery</li>
                </ul>
              </div>
            </div>
          </div>

          {/* VFX & CGI and Design & Motion Graphics - Side by Side */}
          <div className="services-two-col-grid" style={{ marginTop: '80px' }}>
            {/* VFX & CGI Section */}
            <div className="services-two-col-item">
              <h2 className="services-title-standalone">VFX & CGI</h2>
              <div className="services-card-box">
                <div className="services-card-image-wrapper">
                  <Image
                    src="/assets/VFX & CGI.png"
                    alt="NIVEA Cellular Filler Expert"
                    width={1200}
                    height={800}
                    style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                  />
                  <div className="services-card-overlay">
                    <span className="services-card-brand">NIVEA | Cellular Filler Expert</span>
                  </div>
                </div>
                <div className="services-card-text-content">
                  <p className="services-description">
                    We build what isn't there and fix what shouldn't be. From invisible cleanup to full product simulation, we deliver realism under pressure.
                  </p>
                  <div className="services-tasks-section">
                    <h3 className="services-tasks-heading">TASKS</h3>
                    <ul className="services-tasks">
                      <li>Compositing</li>
                      <li>Set extensions</li>
                      <li>Fluid & particle FX</li>
                      <li>CGI product builds</li>
                      <li>Digital doubles / replacements</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Motion Design Section */}
            <div className="services-two-col-item">
              <h2 className="services-title-standalone">Motion Design</h2>
              <div className="services-card-box">
                <div className="services-card-image-wrapper">
                  <Image
                    src="/assets/Design & Motion Graphics.png"
                    alt="FNB MoneyGram"
                    width={1200}
                    height={800}
                    style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                  />
                  <div className="services-card-overlay">
                    <span className="services-card-brand">FNB | MoneyGram</span>
                  </div>
                </div>
                <div className="services-card-text-content">
                  <p className="services-description">
                    Visual systems that move with purpose — titles, toolkits, and branded moments with clarity baked in. Built to be seen, understood, and remembered.
                  </p>
                  <div className="services-tasks-section">
                    <h3 className="services-tasks-heading">TASKS</h3>
                    <ul className="services-tasks">
                      <li>Branding motion systems</li>
                      <li>UI/UX animation</li>
                      <li>Lower thirds & title cards</li>
                      <li>Typography in motion</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Campaign Toolkits & Asset Rollouts Section */}
          <h2 className="services-title-standalone" style={{ marginTop: '80px' }}>Campaign Toolkits & Asset Rollouts</h2>
          <div className="services-card-box">
            <div className="services-card-image-wrapper">
              <Image
                src="/assets/Campaign Toolkits.png"
                alt="STARBUCKS Cafe Moments"
                width={1200}
                height={800}
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
              />
              <div className="services-card-overlay">
                <span className="services-card-brand">STARBUCKS | Cafe Moments</span>
              </div>
            </div>
            <div className="services-card-text-content">
              <p className="services-description">
                One master. Dozens of markets.<br />
                We version campaigns with pixel-perfect consistency across platforms, languages, and timelines.
              </p>
              <div className="services-tasks-section">
                <h3 className="services-tasks-heading">TASKS</h3>
                <ul className="services-tasks services-tasks-two-col">
                  <li>Social adaptations</li>
                  <li>Resizing & platform conversion</li>
                  <li>Language swaps / subtitle integration</li>
                  <li>Toolkit creation & global guidelines</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Problem-Solving & Creative Rescue Section */}
          <h2 className="services-title-standalone" style={{ marginTop: '80px' }}>Problem-Solving & Creative Rescue</h2>
          <div className="services-card-box">
            <div className="services-card-image-wrapper">
              <Image
                src="/assets/Problem Solving.png"
                alt="NESCAFE Europe Cold"
                width={1200}
                height={800}
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
              />
              <div className="services-card-overlay">
                <span className="services-card-brand">NESCAFE | Europe Cold</span>
              </div>
            </div>
            <div className="services-card-text-content">
              <p className="services-description">
                When things fall apart, we step in. We've saved campaigns mid-meltdown, rebuilt assets from scratch, and delivered when no one else could.
              </p>
              <div className="services-tasks-section">
                <h3 className="services-tasks-heading">TASKS</h3>
                <ul className="services-tasks services-tasks-two-col">
                  <li>Campaign triage</li>
                  <li>Talent swaps / paint-outs</li>
                  <li>Last-minute post entry</li>
                  <li>Compliance & brand safety fixes</li>
                  <li>Missing file recovery</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Sets Us Apart Section */}
      <section className="services-apart">
        <div className="container">
          <div className="services-apart-grid">
            <div className="services-apart-content">
              <h2 className="services-apart-heading">What Sets Us Apart</h2>
              <ul className="services-apart-list">
                <li>Speed – "We can turn work in 48 hours if needed."</li>
                <li>Cost-efficiency – "Cheaper than a bloated internal team."</li>
                <li>Trusted by billion-dollar brands across 40+ markets</li>
                <li>Rescue specialists — we fix the things no one else can</li>
              </ul>
            </div>
            <div className="services-apart-image">
              <Image
                src="/assets/what sets us apart.png"
                alt="Professional equipment"
                width={800}
                height={600}
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="studio-contact">
        <div className="container">
          <div className="contact-header">
            <h2>get in touch</h2>
            <p className="contact-subtitle">great stories begin with a conversation</p>
          </div>
          
          <div className="contact-content">
            <div className="contact-form">
              <form id="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" name="name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" required />
                </div>
                <div className="form-group">
                  <label htmlFor="company">Company</label>
                  <input type="text" id="company" name="company" />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" rows={5} required></textarea>
                </div>
                <OutlineButton type="submit">Send Message</OutlineButton>
              </form>
            </div>
            
            <div className="contact-info">
              <h3 className="contact-info-title">Contact Information</h3>
              
              <div className="info-item">
                <strong>Email</strong>
                <p><a href="mailto:hello@wyntrestudios.com">hello@wyntrestudios.com</a></p>
              </div>
              
              <div className="info-item">
                <strong>Address</strong>
                <p>
                  447 Broadway<br />
                  2nd Floor Suite #3012<br />
                  New York, New York 10013<br />
                  United States
                </p>
              </div>
              
              <div className="info-item">
                <strong>Office Hours</strong>
                <p>
                  Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                  Weekend appointments available by request
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}


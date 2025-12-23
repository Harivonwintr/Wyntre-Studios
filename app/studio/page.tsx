'use client'

import Image from 'next/image'
import Link from 'next/link'
import Footer from '@/components/Footer'
import OutlineButton from '@/components/OutlineButton'
import { useScrollAnimations } from '@/hooks/useScrollAnimations'

export default function StudioPage() {
  useScrollAnimations()
  return (
    <>

      {/* Services / Spine Section */}
      <section id="spine-seq" className="spine-band">
        <div className="spine-stage">
          <h1 className="studio-hero-line">We think like designers.</h1>
          <h1 className="studio-hero-line">solve like engineers.</h1>
          <h1 className="studio-hero-line studio-hero-accent">commit like partners.</h1>
        </div>
      </section>

      {/* Great Work Section */}
      <section className="studio-great-work">
        <div className="container">
          <h2 className="studio-great-work-heading">
            Great work doesn't shout, it resonates.
          </h2>
          <p className="studio-great-work-text">
            We build with care, think with precision, and move with purpose. It's not about doing more it's about doing it right.
          </p>
        </div>
      </section>

      {/* Founder's Story Section */}
      <section className="studio-founder">
        <div className="container">
          <div className="studio-founder-grid">
            <div className="studio-founder-image">
              <div className="studio-founder-image-wrapper">
                <Image
                  src="/assets/Portrait(1).png"
                  alt="Hari, Founder of Wyntre Studios"
                  width={800}
                  height={1000}
                  style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                />
              </div>
              <div className="studio-founder-name">
                <p className="studio-founder-name-line">Hari Von Wintr</p>
                <p className="studio-founder-title">Founder & creative director</p>
              </div>
            </div>
            <div className="studio-founder-content">
              <h2 className="studio-founder-heading">Founder's Story</h2>
              <div className="studio-founder-text">
                <p>
                  Hari grew up the youngest in a creative, chaotic household — sneaking onto his siblings' computers to teach himself Photoshop and Maya while most kids were still learning to color inside the lines.
                </p>
                <p>
                  His parents, both small business owners, gave him early exposure to creativity and independence, instilling a mindset that rejected dogma and encouraged carving one's own path.
                </p>
                <p>
                  By nine, he was using professional tools, learning from industry mentors, and excelling in art, science, and mathematics — thinking in systems and aesthetics before he even had words for them.
                </p>
                <p>
                  Creativity became his way to be seen, understood, and in control. He never fit the mold — not at school, not in family debates — so he built his own.
                </p>
                <p>
                  Wyntre is the result: a studio born from rebellion, precision, and imagination — where challenges are approached by thinking like a designer and solved like an engineer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="studio-vision">
        <div className="container">
          <h2 className="studio-vision-heading">VISION</h2>
          <p className="studio-vision-text">
            Wyntre exists to blur the lines between creativity and technology — crafting visual experiences that are as intelligent as they are beautiful.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="studio-mission">
        <div className="container">
          <h2 className="studio-mission-heading">MISSION</h2>
          <p className="studio-mission-text">
            We don't chase trends — we solve problems. Whether it's pixels or pipelines, we build what's needed to make the impossible happen and make our customers lives as easy and streamlined as possible.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="studio-contact">
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


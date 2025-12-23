'use client'

import Footer from '@/components/Footer'
import ContactForm from '@/components/ContactForm'
import { useScrollAnimations } from '@/hooks/useScrollAnimations'

export default function ContactPage() {
  useScrollAnimations()
  return (
    <>
      
      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="container">
          <div className="contact-header">
            <h2>get in touch</h2>
            <p className="contact-subtitle">great stories begin with a conversation</p>
          </div>
          
          <div className="contact-content">
            <div className="contact-form">
              <ContactForm />
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


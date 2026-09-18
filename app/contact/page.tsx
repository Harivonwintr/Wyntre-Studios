'use client'

import Footer from '@/components/Footer'
import ContactSection from '@/components/ContactSection'
import { useScrollAnimations } from '@/hooks/useScrollAnimations'

export default function ContactPage() {
  useScrollAnimations()
  return (
    <>
      
      {/* Contact Section */}
      <ContactSection id="contact" index="[01]" />

      <Footer />
    </>
  )
}


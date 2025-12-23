'use client'

import { useEffect } from 'react'

export function useScrollAnimations() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in')
          observer.unobserve(entry.target)
        }
      })
    }, observerOptions)

    // Campaign Range section
    const campaignSection = document.getElementById('campaign-range')
    if (campaignSection) {
      const campaignElements = [
        campaignSection.querySelector('.campaign-heading'),
        campaignSection.querySelector('.campaign-description'),
        ...Array.from(campaignSection.querySelectorAll('.campaign-card')),
        campaignSection.querySelector('.btn-container')
      ].filter(el => el !== null)
      campaignElements.forEach(el => observer.observe(el))
    }

    // Spine/Services section
    const spineSection = document.getElementById('spine-seq')
    if (spineSection) {
      const spineElements = [
        spineSection.querySelector('.sp-hdn'),
        spineSection.querySelector('.sp-line'),
        spineSection.querySelector('.sp-context'),
        spineSection.querySelector('.sp-services')
      ].filter(el => el !== null)
      spineElements.forEach(el => observer.observe(el))
    }

    // Case Studies section
    const caseStudiesSection = document.getElementById('case-studies')
    if (caseStudiesSection) {
      const caseElements = [
        caseStudiesSection.querySelector('.cs-intro'),
        caseStudiesSection.querySelector('.cs-subheading'),
        ...Array.from(caseStudiesSection.querySelectorAll('.cs-card'))
      ].filter(el => el !== null)
      caseElements.forEach(el => observer.observe(el))
    }

    // Clients section
    const clientsSection = document.getElementById('clients')
    if (clientsSection) {
      const clientsHeading = clientsSection.querySelector('.clients-heading')
      if (clientsHeading) observer.observe(clientsHeading)
      
      const clientLogos = clientsSection.querySelectorAll('.client-logo')
      clientLogos.forEach(logo => observer.observe(logo))
    }

    // What Drives Us section
    const drivesSection = document.getElementById('drives-seq')
    if (drivesSection) {
      const drivesElements = [
        drivesSection.querySelector('.drives-image'),
        drivesSection.querySelector('.drives-title'),
        drivesSection.querySelector('.drives-headline'),
        drivesSection.querySelector('.drives-text'),
        drivesSection.querySelector('.drives-commitment'),
        drivesSection.querySelector('.btn-container')
      ].filter(el => el !== null)
      drivesElements.forEach(el => observer.observe(el))
    }

    // Contact section
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      const contactElements = [
        contactSection.querySelector('.contact-header'),
        contactSection.querySelector('.contact-content')
      ].filter(el => el !== null)
      contactElements.forEach(el => observer.observe(el))
    }

    // Studio page sections
    // Spine section on studio page
    const studioSpineSection = document.getElementById('spine-seq')
    if (studioSpineSection) {
      const studioSpineLines = studioSpineSection.querySelectorAll('.studio-hero-line')
      studioSpineLines.forEach((line, index) => {
        observer.observe(line)
      })
    }

    // Great Work section
    const greatWorkSection = document.querySelector('.studio-great-work')
    if (greatWorkSection) {
      const greatWorkElements = [
        greatWorkSection.querySelector('.studio-great-work-heading'),
        greatWorkSection.querySelector('.studio-great-work-text')
      ].filter(el => el !== null)
      greatWorkElements.forEach(el => observer.observe(el))
    }

    // Founder section
    const founderSection = document.querySelector('.studio-founder')
    if (founderSection) {
      const founderElements = [
        founderSection.querySelector('.studio-founder-image'),
        founderSection.querySelector('.studio-founder-heading'),
        founderSection.querySelector('.studio-founder-text')
      ].filter(el => el !== null)
      founderElements.forEach(el => observer.observe(el))
    }

    // Vision section
    const visionSection = document.querySelector('.studio-vision')
    if (visionSection) {
      const visionElements = [
        visionSection.querySelector('.studio-vision-heading'),
        visionSection.querySelector('.studio-vision-text')
      ].filter(el => el !== null)
      visionElements.forEach(el => observer.observe(el))
    }

    // Mission section
    const missionSection = document.querySelector('.studio-mission')
    if (missionSection) {
      const missionElements = [
        missionSection.querySelector('.studio-mission-heading'),
        missionSection.querySelector('.studio-mission-text')
      ].filter(el => el !== null)
      missionElements.forEach(el => observer.observe(el))
    }

    // Studio Contact section
    const studioContactSection = document.querySelector('.studio-contact')
    if (studioContactSection) {
      const studioContactElements = [
        studioContactSection.querySelector('.contact-header'),
        studioContactSection.querySelector('.contact-content')
      ].filter(el => el !== null)
      studioContactElements.forEach(el => observer.observe(el))
    }

    // Services page sections
    // Spine section on services page
    const servicesSpineSection = document.getElementById('spine-seq')
    if (servicesSpineSection) {
      const servicesSpineLines = servicesSpineSection.querySelectorAll('.services-spine-line')
      const servicesSpineSubtitle = servicesSpineSection.querySelector('.services-spine-subtitle')
      servicesSpineLines.forEach((line, index) => {
        observer.observe(line)
      })
      if (servicesSpineSubtitle) observer.observe(servicesSpineSubtitle)
    }

    // Services section (Video Post Production, VFX & CGI, etc.)
    const servicesSection = document.querySelector('.services-section')
    if (servicesSection) {
      const serviceTitles = servicesSection.querySelectorAll('.services-title-standalone')
      const serviceCards = servicesSection.querySelectorAll('.services-card-box')
      serviceTitles.forEach(title => observer.observe(title))
      serviceCards.forEach(card => observer.observe(card))
    }

    // What Sets Us Apart section
    const servicesApartSection = document.querySelector('.services-apart')
    if (servicesApartSection) {
      const apartElements = [
        servicesApartSection.querySelector('.services-apart-heading'),
        servicesApartSection.querySelector('.services-apart-list'),
        servicesApartSection.querySelector('.services-apart-image')
      ].filter(el => el !== null)
      apartElements.forEach(el => observer.observe(el))
    }

    // Services Contact section
    const servicesContactSection = document.querySelector('.studio-contact')
    if (servicesContactSection && !servicesContactSection.closest('.studio')) {
      const servicesContactElements = [
        servicesContactSection.querySelector('.contact-header'),
        servicesContactSection.querySelector('.contact-content')
      ].filter(el => el !== null)
      servicesContactElements.forEach(el => observer.observe(el))
    }

    // Rescue Stories section
    const rescueStoriesSection = document.querySelector('.rescue-stories')
    if (rescueStoriesSection) {
      const rescueElements = [
        rescueStoriesSection.querySelector('.rescue-stories-header'),
        ...Array.from(rescueStoriesSection.querySelectorAll('.rescue-story-card'))
      ].filter(el => el !== null)
      rescueElements.forEach((el, index) => {
        // Add staggered delay for cards
        if (el.classList.contains('rescue-story-card')) {
          el.setAttribute('data-animation-delay', `${index * 0.1}s`)
        }
        observer.observe(el)
      })
    }

    // Work page - Beyond the reel section
    const beyondReelSection = document.querySelector('.work-beyond-reel')
    if (beyondReelSection) {
      const beyondReelElements = [
        beyondReelSection.querySelector('.work-beyond-reel-heading'),
        ...Array.from(beyondReelSection.querySelectorAll('.work-beyond-reel-text'))
      ].filter(el => el !== null)
      beyondReelElements.forEach((el, index) => {
        observer.observe(el)
      })
    }

    return () => {
      observer.disconnect()
    }
  }, [])
}


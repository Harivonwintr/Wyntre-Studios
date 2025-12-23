/* main.js */

/* Footer year */
document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();
});

/* Tilt-card hover effect */
document.addEventListener('DOMContentLoaded', () => {
  const DEFAULT_TILT = 4;
  const DEFAULT_SCALE = 1.012;
  const PERSPECTIVE = 900;
  const ENTER_EASE = 110;
  const LEAVE_EASE = 200;

  if (!matchMedia('(pointer:fine)').matches) return;
  const cards = document.querySelectorAll('.tilt-card');
  if (!cards.length) return;

  cards.forEach(card => {
    const grid = card.closest('.campaign-grid') || card.closest('.cs-grid');
    let rect = null, raf = null;

    const maxTilt = parseFloat(card.dataset.tilt || DEFAULT_TILT);
    const hoverScale = parseFloat(card.dataset.scale || DEFAULT_SCALE);

    const setStyle = (rx = 0, ry = 0, scale = 1) => {
      card.style.transform =
        `perspective(${PERSPECTIVE}px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`;
    };

    const onEnter = () => {
      rect = card.getBoundingClientRect();
      card.style.transition = `transform ${ENTER_EASE}ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)`;
      card.classList.add('is-hovered');
      if (grid) grid.classList.add('hovering');
    };

    const onMove = (e) => {
      if (!rect) rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const px = (e.clientX - cx) / (rect.width / 2);
      const py = (e.clientY - cy) / (rect.height / 2);
      const ry =  px * maxTilt;
      const rx = -py * maxTilt;

      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setStyle(rx, ry, hoverScale));
    };

    const onLeave = () => {
      card.style.transition = `transform ${LEAVE_EASE}ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)`;
      setStyle(0, 0, 1);
      rect = null;
      card.classList.remove('is-hovered');
      if (grid && !grid.querySelector('.tilt-card.is-hovered')) {
        grid.classList.remove('hovering');
      }
    };

    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
  });
});

/* Scroll-triggered animations for all sections */
document.addEventListener('DOMContentLoaded', () => {
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Campaign Range section
  const campaignSection = document.getElementById('campaign-range');
  if (campaignSection) {
    const campaignElements = [
      campaignSection.querySelector('.campaign-heading'),
      campaignSection.querySelector('.campaign-description'),
      ...campaignSection.querySelectorAll('.campaign-card'),
      campaignSection.querySelector('.btn-container')
    ].filter(el => el !== null);
    campaignElements.forEach(el => observer.observe(el));
  }

  // Spine/Services section
  const spineSection = document.getElementById('spine-seq');
  if (spineSection) {
    const spineElements = [
      spineSection.querySelector('.sp-hdn'),
      spineSection.querySelector('.sp-line'),
      spineSection.querySelector('.sp-context'),
      spineSection.querySelector('.sp-services')
    ].filter(el => el !== null);
    spineElements.forEach(el => observer.observe(el));
  }

  // Case Studies section
  const caseStudiesSection = document.getElementById('case-studies');
  if (caseStudiesSection) {
    const caseElements = [
      caseStudiesSection.querySelector('.cs-intro'),
      caseStudiesSection.querySelector('.cs-subheading'),
      ...caseStudiesSection.querySelectorAll('.cs-card')
    ].filter(el => el !== null);
    caseElements.forEach(el => observer.observe(el));
  }

  // Clients section
  const clientsSection = document.getElementById('clients');
  if (clientsSection) {
    const clientsHeading = clientsSection.querySelector('.clients-heading');
    if (clientsHeading) observer.observe(clientsHeading);
    
    // Observe each individual logo for staggered animation
    const clientLogos = clientsSection.querySelectorAll('.client-logo');
    clientLogos.forEach(logo => observer.observe(logo));
  }

  // What Drives Us section
  const drivesSection = document.getElementById('drives-seq');
  if (drivesSection) {
    const drivesElements = [
      drivesSection.querySelector('.drives-image'),
      drivesSection.querySelector('.drives-title'),
      drivesSection.querySelector('.drives-headline'),
      drivesSection.querySelector('.drives-text'),
      drivesSection.querySelector('.drives-commitment'),
      drivesSection.querySelector('.btn-container')
    ].filter(el => el !== null);
    drivesElements.forEach(el => observer.observe(el));
  }

  // Contact section
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    const contactElements = [
      contactSection.querySelector('.contact-header'),
      contactSection.querySelector('.contact-content')
    ].filter(el => el !== null);
    contactElements.forEach(el => observer.observe(el));
  }
});

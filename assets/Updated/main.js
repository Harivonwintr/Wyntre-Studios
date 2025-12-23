/* main.js — Hero scroll-scrub video with glitch + reveal */

/* Utilities */
const onReady = (fn) => document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn);

/* HERO logic */
onReady(() => {
  if (!window.gsap || !window.ScrollTrigger) return;

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  const section = document.getElementById('hero-scrub');
  const video   = document.getElementById('heroVideo');
  const freeze  = document.getElementById('freezeFrame');
  const glitch  = document.getElementById('glitchOverlay');
  const tagline = document.querySelector('.tagline');
  const header  = document.getElementById('siteHeader');

  if (!section || !video || !freeze || !glitch || !tagline || !header) return;

  // iOS prime for reliable seek
  const prime = () => {
    video.muted = true;
    video.play().then(() => video.pause()).catch(() => {});
    window.removeEventListener('pointerdown', prime);
    window.removeEventListener('touchstart', prime);
    window.removeEventListener('wheel', prime, { passive: true });
  };
  window.addEventListener('pointerdown', prime);
  window.addEventListener('touchstart', prime, { passive: true });
  window.addEventListener('wheel', prime, { passive: true });

  let dur = 3.5;
  const setDur = () => { dur = video.duration || 3.5; ScrollTrigger.refresh(); };
  if (video.readyState >= 1) setDur(); else video.addEventListener('loadedmetadata', setDur, { once: true });

  // Ensure we start at 0
  try { video.currentTime = 0; } catch (e) {}

  const scrubber = { t: 0 };
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => {
        const scrubPx  = (dur || 3.5) * 800;
        const revealPx = 1200;
        return '+=' + Math.round(scrubPx + revealPx);
      },
      scrub: true,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true
      // markers: true
    }
  });

  // Phase 1 — scrub video
  tl.to(scrubber, {
    t: 1,
    ease: 'none',
    onUpdate: () => {
      if (dur) {
        const t = Math.min(dur, Math.max(0, scrubber.t * dur));
        if (Math.abs(video.currentTime - t) > 0.001) video.currentTime = t;
      }
    }
  });

  // Phase 2 — freeze + glitch + reveal
  tl.addLabel('freeze');
  tl.to(freeze, { opacity: 1, duration: 0.3, ease: 'power2.out' }, 'freeze');
  tl.to(glitch, { opacity: 1, duration: 0.15, ease: 'power1.out', onStart: () => glitch.classList.add('glitch-on') }, 'freeze+=0.05');
  tl.to(tagline, { opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out' }, 'freeze+=0.2');

  // Reveal nav by class (CSS handles transition)
  tl.call(() => header.classList.add('is-visible'), null, 'freeze+=0.35');

  // Hold final state
  tl.to({}, { duration: 0.4 });
});

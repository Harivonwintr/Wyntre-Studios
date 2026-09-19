'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { registerLenis } from '@/utils/smoothScroll'

/**
 * Site-wide motion: Lenis smooth scrolling driven by the GSAP ticker (so ScrollTrigger stays in sync) and a single
 * IntersectionObserver that marks [data-reveal] elements with data-inview as they enter the viewport.
 * The inline script in app/layout sets html[data-motion='ready'] before first paint; reduced motion skips all of it.
 */
export default function MotionProvider() {
  useEffect(() => {
    const root = document.documentElement
    // Cancels the inline script's fallback, which un-hides everything if this never runs
    root.setAttribute('data-motion-live', '')

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || !('IntersectionObserver' in window)) {
      root.removeAttribute('data-motion')
      return
    }

    gsap.registerPlugin(ScrollTrigger)

    // Smooth scrolling only for mouse wheels. Mac trackpads and touch screens already glide natively; easing them a
    // second time made the page trail behind the fingers, which reads as input lag.
    const nativeGlide =
      /Mac|iPhone|iPad|iPod/.test(navigator.platform) || window.matchMedia('(pointer: coarse)').matches
    const lenis = nativeGlide
      ? null
      : new Lenis({
          duration: 1.1,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        })
    registerLenis(lenis)
    const tick = (time: number) => lenis?.raf(time * 1000)
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
    }

    // Reveal once, then stop watching
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute('data-inview', '')
          io.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    )

    // Tracked per effect run, not on the element, so a remount (e.g. React strict mode) re-observes everything
    const observed = new WeakSet<Element>()
    const scan = () => {
      document.querySelectorAll('[data-reveal]:not([data-inview])').forEach((el) => {
        if (observed.has(el)) return
        observed.add(el)
        io.observe(el)
      })
    }
    scan()

    // New pages mount new [data-reveal] elements
    let queued = false
    const content = new MutationObserver(() => {
      if (queued) return
      queued = true
      queueMicrotask(() => {
        queued = false
        scan()
      })
    })
    content.observe(document.body, { childList: true, subtree: true })

    // Fonts, fitted headlines and images can change the page height after pinned sections measured their scroll
    // range; re-measure once the layout settles so pins start and release in the right place
    let refreshTimer: ReturnType<typeof setTimeout> | undefined
    let lastHeight = document.body.scrollHeight
    const layout = new ResizeObserver(() => {
      const height = document.body.scrollHeight
      if (Math.abs(height - lastHeight) < 2) return
      lastHeight = height
      // Lenis caps scrolling at the page height it last measured; re-read it straight away so content that
      // expands (Show all in the film library, for one) can always be scrolled to the end
      lenis?.resize()
      clearTimeout(refreshTimer)
      refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 200)
    })
    layout.observe(document.body)

    // The nav drawer and modals lock the page with body overflow; pause smooth scrolling while they're open
    const lock = new MutationObserver(() => {
      if (!lenis) return
      if (document.body.style.overflow === 'hidden') lenis.stop()
      else lenis.start()
    })
    lock.observe(document.body, { attributes: true, attributeFilter: ['style'] })

    return () => {
      io.disconnect()
      content.disconnect()
      layout.disconnect()
      clearTimeout(refreshTimer)
      lock.disconnect()
      gsap.ticker.remove(tick)
      registerLenis(null)
      lenis?.destroy()
    }
  }, [])

  return null
}

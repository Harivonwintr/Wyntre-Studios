'use client'

import { useEffect, type RefObject } from 'react'

const EASE = 0.08
const SETTLED = 0.0005

const clamp = (value: number) => Math.max(-1, Math.min(1, value))

/**
 * Drives 2.5D collage motion through CSS variables on the element, so nothing re-renders while it animates:
 *   --px / --py   eased pointer position relative to the collage centre (-1…1)
 *   --scroll      eased progress of the collage through the viewport (-1 below centre … 1 above)
 *   data-inview   set once the collage first scrolls into view, to trigger the entrance
 * Pieces combine these with their own --depth in CSS. Pointer tracking is skipped on touch devices and
 * all motion is skipped when the user prefers reduced motion.
 */
export function useCollageParallax(ref: RefObject<HTMLElement>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const finePointer = window.matchMedia('(pointer: fine)').matches

    // Pieces only start hidden once motion is ready, so the collage still shows if this script never runs
    if (reduceMotion || typeof IntersectionObserver === 'undefined') {
      el.dataset.inview = 'true'
      return
    }
    el.dataset.motion = 'ready'

    const target = { px: 0, py: 0, scroll: 0 }
    const current = { px: 0, py: 0, scroll: 0 }
    let frame = 0
    let listening = false

    const tick = () => {
      let moving = false
      for (const key of ['px', 'py', 'scroll'] as const) {
        const diff = target[key] - current[key]
        if (Math.abs(diff) > SETTLED) {
          current[key] += diff * EASE
          moving = true
        } else {
          current[key] = target[key]
        }
      }
      el.style.setProperty('--px', current.px.toFixed(4))
      el.style.setProperty('--py', current.py.toFixed(4))
      el.style.setProperty('--scroll', current.scroll.toFixed(4))
      // Stop the loop once everything has settled; the next input restarts it
      frame = moving ? requestAnimationFrame(tick) : 0
    }

    const start = () => {
      if (!frame) frame = requestAnimationFrame(tick)
    }

    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const halfViewport = window.innerHeight / 2
      target.scroll = clamp((halfViewport - (rect.top + rect.height / 2)) / (halfViewport + rect.height / 2))
      start()
    }

    // Normalised by half the viewport so the response is gentle and continuous across the whole page
    const onPointerMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      target.px = clamp((event.clientX - (rect.left + rect.width / 2)) / (window.innerWidth / 2))
      target.py = clamp((event.clientY - (rect.top + rect.height / 2)) / (window.innerHeight / 2))
      start()
    }

    const onPointerLeave = () => {
      target.px = 0
      target.py = 0
      start()
    }

    const listen = (on: boolean) => {
      if (on === listening) return
      listening = on
      const method = on ? 'addEventListener' : 'removeEventListener'
      window[method]('scroll', onScroll, { passive: true } as AddEventListenerOptions)
      if (finePointer) {
        window[method]('pointermove', onPointerMove as EventListener, { passive: true } as AddEventListenerOptions)
        document.documentElement[method]('pointerleave', onPointerLeave)
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.inview = 'true'
          onScroll()
        }
        listen(entry.isIntersecting)
      },
      { threshold: 0.15 }
    )
    observer.observe(el)

    return () => {
      observer.disconnect()
      listen(false)
      cancelAnimationFrame(frame)
    }
  }, [ref])
}

'use client'

import { useEffect, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// How far back the camera starts, in board-distances: 1 is the resting view, 1 + TRAVEL is the start
const TRAVEL = 2.5
// How long each board piece takes to fade on, as a share of the flight
const FADE = 0.22
// The lead-in matches the section before (#0d0d0d); the page lightens to white as the camera reaches the board
const DARK = 13
const LIGHT = 255
// Only wide screens with motion allowed get the flight; everything else sees the board as it is
const FLIGHT_QUERY = '(min-width: 901px) and (prefers-reduced-motion: no-preference)'

type Flyer = {
  el: HTMLElement
  /** Resting centre relative to the camera's aim point, in px */
  dx: number
  dy: number
  /** Board pieces start this far behind the board and settle onto it; flight-only notes sit at a fixed depth */
  spread: number
  /** Flight-only pieces: when they fade up and when they reach the camera, in flight time (0 = pinned, 1 = landed;
   *  negative is during the rise-in), and how fast they close on the camera */
  appear?: number
  pass?: number
  speed?: number
  /** Board pieces: where in the flight (0…1) they start fading on */
  fade: number
  spin: number
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

// Cheap deterministic jitter so every visit flies the same way
const jitter = (i: number) => {
  const x = Math.sin(i * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

/**
 * Scroll-driven fly-through for the Our Work section: the whole section pins, heading included, and scroll moves a
 * camera forward through a web of client notes until every piece lands where it rests. Pure 2D projection (scale and
 * translate from the centre of the screen) rather than preserve-3d, so the collage's Hard Light blends keep working.
 *   [data-fly-piece]  board pieces, with an optional data-fly-depth (0 = lands first, 1 = comes from furthest back)
 *                     and data-fly-fade (where in the flight they start fading on)
 *   [data-fly-pass]   flight-only pieces, with data-fly-appear and data-fly-speed: when they fade up, when they pass
 *                     the camera and how fast they close on it
 */
export function useBoardFlight(sectionRef: RefObject<HTMLElement>, enabled: boolean) {
  useEffect(() => {
    const section = sectionRef.current
    if (!enabled || !section) return

    gsap.registerPlugin(ScrollTrigger)
    const mm = gsap.matchMedia()

    // Measuring every piece and inserting the pin reflows the whole page, so it waits until the hero's load
    // sequence has played (about two seconds) or the visitor starts scrolling, whichever comes first
    let started = false
    const start = () => {
      if (started) return
      started = true
      window.clearTimeout(timer)
      window.removeEventListener('scroll', start)
      setup()
    }
    const timer = window.setTimeout(start, 2400)
    window.addEventListener('scroll', start, { passive: true })

    const setup = () => mm.add(FLIGHT_QUERY, () => {
      const flyers: Flyer[] = []
      section.querySelectorAll<HTMLElement>('[data-fly-piece], [data-fly-pass]').forEach((el, i) => {
        const note = el.dataset.flyPass !== undefined
        const depth = Number(el.dataset.flyDepth ?? 0.5)
        flyers.push({
          el,
          dx: 0,
          dy: 0,
          spread: note ? 0 : 0.3 + depth * 1.9 + jitter(i) * 0.7,
          appear: note ? Number(el.dataset.flyAppear ?? 0) : undefined,
          pass: note ? Number(el.dataset.flyPass) : undefined,
          speed: note ? Number(el.dataset.flySpeed ?? 8) : undefined,
          // Staggered a little so the case studies build up rather than appear at once,
          // and every piece is fully on a little before landing
          fade: Math.min(0.97 - FADE, Number(el.dataset.flyFade ?? 0.4) + jitter(i + 3) * 0.12),
          spin: (jitter(i + 7) - 0.5) * (note ? 40 : 24),
        })
      })

      let live = false
      // Share of the scroll spent on the lead-in, while the section rises in dark and empty: nothing flies until it
      // fills the screen, so the previous section has cleared off and no piece is cut off at the section's top edge
      let lead = 0.4

      const clear = () => {
        for (const f of flyers) {
          f.el.style.removeProperty('translate')
          f.el.style.removeProperty('scale')
          f.el.style.removeProperty('rotate')
          f.el.style.removeProperty('opacity')
        }
        section.style.removeProperty('background-color')
      }

      // Resting positions, measured with the flight transforms off
      const measure = () => {
        clear()
        // The camera aims at the middle of the screen while pinned: the section's centre, or the middle of its top
        // screenful when it's taller than the screen
        const box = section.getBoundingClientRect()
        const cx = box.left + box.width / 2
        const cy = box.top + Math.min(box.height, window.innerHeight) / 2
        for (const f of flyers) {
          const r = f.el.getBoundingClientRect()
          f.dx = r.left + r.width / 2 - cx
          f.dy = r.top + r.height / 2 - cy
        }
      }

      const render = (progress: number) => {
        // The camera holds still through the lead-in, then flies
        const p = clamp01((progress - lead) / (1 - lead))
        const landed = progress >= 0.999
        if (landed) {
          if (live) {
            clear()
            section.setAttribute('data-flight', 'landed')
            live = false
          }
          return
        }
        // Until the section starts coming into view, pose everything once but keep it off the GPU: no will-change
        // layers and the flight pieces hidden, so the rest of the page (the hero especially) animates unhindered
        const idle = progress <= 0
        const state = idle ? 'idle' : 'live'
        if (section.getAttribute('data-flight') !== state) section.setAttribute('data-flight', state)
        live = true

        const rest = 1 - p
        const camera = 1 + TRAVEL * rest
        // Flight time without the clamp: negative while the section is still rising in
        const time = (progress - lead) / (1 - lead)

        // Dark while the notes fly, lightening to white as the board comes up
        const t = clamp01((p - 0.28) / 0.34)
        const shade = Math.round(DARK + (LIGHT - DARK) * t * t * (3 - 2 * t))
        section.style.backgroundColor = `rgb(${shade}, ${shade}, ${shade})`

        // Pieces ease into the board plane a little behind the camera, so they settle rather than stop
        const settle = Math.pow(rest, 1.6)

        for (const f of flyers) {
          const note = f.pass !== undefined
          // Notes hold still while the section rises, then close on the camera and slip past at their pass time
          const dist = note ? 0.3 + f.speed! * (f.pass! - p) : camera + f.spread * settle
          if (dist <= 0.05) {
            f.el.style.opacity = '0'
            continue
          }
          const s = 1 / dist
          // Fade out just before passing the camera; flight notes also fade in from the distance
          let alpha = clamp01((dist - 0.22) / 0.3)
          // Notes fade up in the distance at their own moment, so the web builds rather than appearing all at once
          if (note) alpha *= clamp01((time - f.appear!) / 0.1) * clamp01(rest / 0.06)
          // The case studies fade on as the camera closes in, rather than being there from the start
          else alpha *= clamp01((p - f.fade) / FADE)
          f.el.style.translate = `${(f.dx * (s - 1)).toFixed(1)}px ${(f.dy * (s - 1)).toFixed(1)}px`
          f.el.style.scale = s.toFixed(4)
          f.el.style.rotate = `${(f.spin * settle).toFixed(2)}deg`
          f.el.style.opacity = alpha.toFixed(3)
          // Whatever is nearest the camera right now draws on top, so nothing far away cuts across something close
          if (note) f.el.style.zIndex = String(Math.round(100 / dist))
        }
      }

      measure()

      // Flight length while pinned; the progress also covers the screen of scrolling before the pin (the lead-in)
      const pinLength = () => Math.round(window.innerHeight * 1.4)

      const pin = ScrollTrigger.create({
        trigger: section,
        // Pin mid-screen; from the top when the section is taller than the screen, so the heading stays in shot
        start: () => (section.offsetHeight > window.innerHeight ? 'top top' : 'center center'),
        end: () => `+=${pinLength()}`,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefreshInit: () => {
          live = false
          section.removeAttribute('data-flight')
          measure()
        },
      })

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: () => pin.end,
        // Lenis already smooths the scroll, so follow it directly
        scrub: true,
        invalidateOnRefresh: true,
        onRefresh: (self) => {
          lead = clamp01((pin.start - self.start) / Math.max(1, self.end - self.start))
          render(self.progress)
        },
        onUpdate: (self) => render(self.progress),
      })
      // These triggers are created after the ones further down the page (the Campaign Range pin), so re-order them by
      // position and re-measure everything: the pin's added scroll length pushes every later trigger down
      ScrollTrigger.sort()
      ScrollTrigger.refresh()
      render(trigger.progress)

      return () => {
        trigger.kill()
        pin.kill()
        clear()
        section.removeAttribute('data-flight')
      }
    })

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('scroll', start)
      mm.revert()
    }
  }, [sectionRef, enabled])
}

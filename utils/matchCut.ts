/**
 * Match cuts between pages: an element on one page carries across and becomes its counterpart on the next (the
 * Our Work collage growing into the case study's opener, a rescue story print into the story's header photo).
 *
 * Built on the browser's View Transitions: both elements share a view-transition-name (see matchCutName), and the
 * route change runs inside document.startViewTransition so the browser can morph one into the other. Next 14
 * doesn't do this itself, so the transition waits for PageTransition to report that the new page has rendered.
 * Browsers without View Transitions, and visitors who prefer reduced motion, get the normal page change.
 */

import { syncSmoothScroll } from '@/utils/smoothScroll'

type Navigate = () => void

let pending: (() => void) | null = null

/** Shared name for the element that carries across, e.g. matchCutName('collage', 'nivea') */
export const matchCutName = (kind: 'collage' | 'story', id: string) => `match-${kind}-${id}`

/** Set on <html> while a match cut runs, so the regular page fade stands aside */
export const MATCH_CUT_ATTR = 'data-match-cut'

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => Promise<void>) => { finished: Promise<void> }
}

export function canMatchCut() {
  if (typeof document === 'undefined') return false
  const doc = document as ViewTransitionDocument
  return typeof doc.startViewTransition === 'function' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Runs the navigation inside a view transition; resolves the new snapshot once the next page has rendered */
export function navigateWithMatchCut(navigate: Navigate) {
  const doc = document as ViewTransitionDocument
  if (!canMatchCut() || !doc.startViewTransition) {
    navigate()
    return
  }

  const root = document.documentElement
  root.setAttribute(MATCH_CUT_ATTR, '')

  const transition = doc.startViewTransition(
    () =>
      new Promise<void>((resolve) => {
        // Safety net: never hold the page frozen if the route is slow to render
        const timeout = window.setTimeout(done, 1500)
        function done() {
          window.clearTimeout(timeout)
          pending = null
          // A moment for the new page's layout to settle. A timer, not a frame: the browser pauses rendering while
          // it holds the old snapshot, so a requestAnimationFrame here would never fire.
          window.setTimeout(resolve, 30)
        }
        pending = done
        navigate()
      })
  )

  transition.finished.finally(() => {
    root.removeAttribute(MATCH_CUT_ATTR)
    // Frames are held while the browser runs the cut, so the wheel smoothing can resume mid-glide from the old
    // page and drift the new one down; settle it where the page actually is
    syncSmoothScroll()
  })
}

/** Called by PageTransition once the new route has committed */
export function matchCutRouteRendered() {
  pending?.()
}

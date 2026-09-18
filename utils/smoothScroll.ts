import type Lenis from 'lenis'

/**
 * The site's Lenis instance, registered by MotionProvider. Lenis keeps its own scroll target and ignores native
 * scroll events while it's easing, so code that jumps the page (route changes, restoring a position) has to
 * tell it, or it drags the page back towards where the old page was heading.
 */
let instance: Lenis | null = null

export const registerLenis = (lenis: Lenis | null) => {
  instance = lenis
}

/**
 * Cancels any glide in progress and re-reads the page size and scroll position, so the next wheel or trackpad
 * scroll starts from where the page actually is. Leaves a page locked by a modal or menu locked.
 */
export function syncSmoothScroll() {
  const lenis = instance
  if (!lenis) return
  lenis.resize()
  if (lenis.isStopped) return
  // stop() and start() each reset Lenis: the running animation ends and its target snaps to the real position
  lenis.stop()
  lenis.start()
}

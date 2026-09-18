'use client'

import { useEffect, useRef } from 'react'

const pad = (n: number) => String(n).padStart(2, '0')

type Props = {
  className?: string
  /** 24 for 23.98 (US / cinema), 25 for PAL */
  fps?: number
  /** Seconds before the take rolls back to zero, like a spot length */
  loop?: number
}

/**
 * HH:MM:SS:FF counting like a recording take: it rolls over at the end of the spot length, only ticks while on
 * screen, and writes straight to the DOM so it never re-renders React
 */
export default function RunningTimecode({ className, fps = 24, loop = 30 }: Props) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const takeLength = loop * fps
    let frames = 0
    let timer: ReturnType<typeof setInterval> | undefined

    const render = () => {
      const s = Math.floor(frames / fps)
      el.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(frames % fps)}`
    }
    const start = () => {
      if (timer) return
      timer = setInterval(() => {
        frames = (frames + 1) % takeLength
        render()
      }, 1000 / fps)
    }
    const stop = () => {
      clearInterval(timer)
      timer = undefined
    }

    // Paused while scrolled away; picks up where it left off when the hero comes back
    const observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()))
    observer.observe(el)

    return () => {
      observer.disconnect()
      stop()
    }
  }, [fps, loop])

  return (
    <span ref={ref} className={className}>
      00:00:00:00
    </span>
  )
}

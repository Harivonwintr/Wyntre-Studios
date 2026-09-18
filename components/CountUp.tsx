'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import styles from './CountUp.module.css'

type Props = {
  /** The stat as written, e.g. '10,000+', '4+ yrs', '48h' */
  value: string
  /** Milliseconds to wait once in view, for staggering a row */
  delay?: number
  duration?: number
}

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/** '10,000+' → { prefix: '', target: 10000, suffix: '+', grouped: true } */
function parse(value: string) {
  const match = value.match(/^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/)
  if (!match) return null
  const [, prefix, number, suffix] = match
  return {
    prefix,
    suffix,
    target: parseFloat(number.replace(/,/g, '')),
    grouped: number.includes(','),
    decimals: (number.split('.')[1] ?? '').length,
  }
}

/** Counts a stat up from zero the first time it scrolls into view; the text stays whole for screen readers */
export default function CountUp({ value, delay = 0, duration = 1600 }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const parts = parse(value)
  // Server render and no-JS show the real figure
  const [display, setDisplay] = useState(value)

  const format = (n: number) => {
    if (!parts) return value
    const fixed = n.toFixed(parts.decimals)
    const body = parts.grouped ? Number(fixed).toLocaleString('en-US', { minimumFractionDigits: parts.decimals }) : fixed
    return `${parts.prefix}${body}${parts.suffix}`
  }

  // Drop to zero before the first paint so the count never flashes the final number first
  useIsoLayoutEffect(() => {
    if (!parts || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setDisplay(format(0))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  useEffect(() => {
    const el = ref.current
    if (!el || !parts || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    let timer: ReturnType<typeof setTimeout>
    const run = () => {
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration)
        const eased = 1 - Math.pow(1 - t, 4)
        setDisplay(t < 1 ? format(Math.floor(parts.target * eased * 10 ** parts.decimals) / 10 ** parts.decimals) : value)
        if (t < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        timer = setTimeout(run, delay)
      },
      { threshold: 0.4 }
    )
    observer.observe(el)

    return () => {
      observer.disconnect()
      clearTimeout(timer)
      cancelAnimationFrame(frame)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, delay, duration])

  return (
    <span ref={ref} className={styles.countUp}>
      {/* The final value holds the width so the row doesn't shuffle while digits change */}
      <span className={styles.ghost} aria-hidden="true">
        {value}
      </span>
      <span className={styles.live} aria-hidden="true">
        {display}
      </span>
      <span className={styles.srOnly}>{value}</span>
    </span>
  )
}

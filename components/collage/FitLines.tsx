'use client'

import { createElement, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

type Props = {
  lines: ReactNode[]
  /** Element to render: a paragraph of lines, a list, or a heading */
  as?: 'p' | 'ul' | 'h2' | 'span'
  id?: string
  className?: string
  style?: CSSProperties
  /** Largest allowed font size as a fraction of the grandparent's width (e.g. 0.1 = 10%) */
  maxFontSize: number
  /** Re-fits when this changes; defaults to the text of string lines */
  fitKey?: string
  /** Base the maxFontSize cap on the box's own width instead of its grandparent's */
  capToSelf?: boolean
}

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

const LINE_STYLE = { display: 'block', width: 'max-content', whiteSpace: 'nowrap' } as const

/** Sizes text so its widest line exactly fills the box's content width, however long the copy is */
export default function FitLines({ lines, as = 'p', id, className, style, maxFontSize, fitKey, capToSelf }: Props) {
  const boxRef = useRef<HTMLElement>(null)
  const [fontSize, setFontSize] = useState<number>()
  const linesKey = fitKey ?? lines.map((line) => (typeof line === 'string' ? line : '')).join('\n')

  useIsomorphicLayoutEffect(() => {
    const box = boxRef.current
    if (!box) return
    let cancelled = false

    const fit = () => {
      const computed = getComputedStyle(box)
      const width = box.clientWidth - parseFloat(computed.paddingLeft) - parseFloat(computed.paddingRight)
      // The box sits inside a positioned wrapper, which sits inside the layout it should scale with
      const containerWidth = capToSelf ? width : box.parentElement?.parentElement?.clientWidth || width
      if (width <= 0) return
      const current = parseFloat(computed.fontSize)
      const widest = Math.max(...Array.from(box.children).map((line) => (line as HTMLElement).offsetWidth), 1)
      setFontSize(Math.min((current * width) / widest, containerWidth * maxFontSize))
    }

    fit()
    document.fonts?.ready.then(() => {
      if (!cancelled) fit()
    })

    const observer = new ResizeObserver(fit)
    observer.observe(box)
    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [linesKey, maxFontSize, capToSelf])

  const children = lines.map((line, i) =>
    createElement(as === 'ul' ? 'li' : 'span', { key: i, style: LINE_STYLE }, line)
  )

  return createElement(
    as,
    { ref: boxRef, id, className, style: fontSize ? { ...style, fontSize } : style },
    children
  )
}

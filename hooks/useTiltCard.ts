'use client'

import { useEffect } from 'react'

export function useTiltCard() {
  useEffect(() => {
    const DEFAULT_TILT = 4
    const DEFAULT_SCALE = 1.012
    const PERSPECTIVE = 900
    const ENTER_EASE = 110
    const LEAVE_EASE = 200

    if (!matchMedia('(pointer:fine)').matches) return

    const cards = document.querySelectorAll('.tilt-card')
    if (!cards.length) return

    cards.forEach(card => {
      const grid = card.closest('.campaign-grid') || card.closest('.cs-grid')
      let rect: DOMRect | null = null
      let raf: number | null = null

      const maxTilt = parseFloat((card as HTMLElement).dataset.tilt || String(DEFAULT_TILT))
      const hoverScale = parseFloat((card as HTMLElement).dataset.scale || String(DEFAULT_SCALE))

      const setStyle = (rx = 0, ry = 0, scale = 1) => {
        ;(card as HTMLElement).style.transform =
          `perspective(${PERSPECTIVE}px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`
      }

      const onEnter = () => {
        rect = card.getBoundingClientRect()
        ;(card as HTMLElement).style.transition = `transform ${ENTER_EASE}ms ease, box-shadow ${ENTER_EASE}ms ease`
        card.classList.add('is-hovered')
        if (grid) grid.classList.add('hovering')
      }

      const onMove = (e: MouseEvent) => {
        if (!rect) rect = card.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const px = (e.clientX - cx) / (rect.width / 2)
        const py = (e.clientY - cy) / (rect.height / 2)
        const ry = px * maxTilt
        const rx = -py * maxTilt

        if (raf) cancelAnimationFrame(raf)
        raf = requestAnimationFrame(() => setStyle(rx, ry, hoverScale))
      }

      const onLeave = () => {
        ;(card as HTMLElement).style.transition = `transform ${LEAVE_EASE}ms ease, box-shadow ${LEAVE_EASE}ms ease`
        setStyle(0, 0, 1)
        rect = null
        card.classList.remove('is-hovered')
        if (grid && !grid.querySelector('.tilt-card.is-hovered')) {
          grid.classList.remove('hovering')
        }
      }

      card.addEventListener('mouseenter', onEnter)
      card.addEventListener('mousemove', onMove)
      card.addEventListener('mouseleave', onLeave)

      return () => {
        card.removeEventListener('mouseenter', onEnter)
        card.removeEventListener('mousemove', onMove)
        card.removeEventListener('mouseleave', onLeave)
      }
    })
  }, [])
}


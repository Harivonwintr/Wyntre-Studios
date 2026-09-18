'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef, type CSSProperties } from 'react'
import { useCollageParallax } from '@/hooks/useCollageParallax'
import type { FeaturedWork } from '@/data/featuredWork'
import { splitCampaignLines } from '@/components/campaign/CampaignTitle'
import FitLines from './FitLines'
import { collageLayouts, type Box, type CollagePiece } from './layouts'
import styles from './CollageCard.module.css'

type Props = {
  work: FeaturedWork
  index: number
  /** Drops the View case study link, e.g. on the case study page itself */
  hideCta?: boolean
}

const pad = (n: number) => String(n).padStart(2, '0')

const MAX_Z = 7
const TEXT_KINDS = new Set(['brand', 'number', 'title', 'cta'])

// Motion is applied in CSS from --depth, --rot and --order; text stays still so it's readable and clickable
const boxStyle = (piece: CollagePiece, order: number): CSSProperties => {
  const { left, top, bottom, width, height, rotate, z } = piece
  const depth = piece.depth ?? (TEXT_KINDS.has(piece.kind) ? 0 : Math.min(1, (z ?? 1) / MAX_Z))
  return {
    left,
    top,
    bottom,
    width,
    height,
    zIndex: z,
    '--rot': `${rotate ?? 0}deg`,
    '--depth': depth,
    '--order': order,
  } as CSSProperties
}

// Marks a piece for the Our Work fly-through: deeper pieces start further back, and the type fades on last
const flyProps = (piece: CollagePiece) => {
  const text = TEXT_KINDS.has(piece.kind)
  return {
    'data-fly-piece': '',
    'data-fly-depth': piece.depth ?? (text ? 0 : Math.min(1, (piece.z ?? 1) / MAX_Z)),
    'data-fly-fade': text ? 0.58 : 0.4,
  }
}

// Monument Extended caps are roughly 72% of the em, so this size makes the caps fill the 100-unit band
const FIT_FONT_SIZE = 139

/** Stretches text to exactly fill its box whatever its length; vertical text reads bottom to top */
function FitText({ text, orientation }: { text: string; orientation: 'vertical' | 'horizontal' }) {
  const vertical = orientation === 'vertical'
  return (
    <svg
      className={styles.fitText}
      viewBox={vertical ? '0 0 100 1000' : '0 0 1000 100'}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <text
        x={vertical ? -1000 : 0}
        y={100}
        transform={vertical ? 'rotate(-90)' : undefined}
        textLength={1000}
        lengthAdjust="spacingAndGlyphs"
        fontSize={FIT_FONT_SIZE}
      >
        {text}
      </text>
    </svg>
  )
}

export function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M7 17L17 7M8.5 7H17v8.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="square" />
    </svg>
  )
}

export default function CollageCard({ work, index, hideCta = false }: Props) {
  const layout = collageLayouts[work.layout]
  const canvasRef = useRef<HTMLDivElement>(null)
  useCollageParallax(canvasRef)

  return (
    <article className={styles.card}>
      <h3 className={styles.srOnly}>
        {work.brand}: {work.title}
      </h3>

      <div ref={canvasRef} className={styles.canvas} style={{ aspectRatio: layout.aspectRatio }}>
        {/* Pictures tilt towards the pointer; the type sits in its own flat layer above so it stays readable */}
        <div className={styles.stage}>
        {layout.pieces.map((piece, i) => {
          if (TEXT_KINDS.has(piece.kind)) return null
          switch (piece.kind) {
            case 'photo': {
              const photo = work.photos[piece.slot]
              const maskUrl = `url("${piece.shape}")`
              return (
                <div key={i} className={`${styles.piece} ${styles.motion}`} style={boxStyle(piece, i)} {...flyProps(piece)}>
                  <div className={styles.photoMask} style={{ WebkitMaskImage: maskUrl, maskImage: maskUrl }}>
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 900px) 90vw, 45vw"
                      className={styles.photo}
                      style={{
                        objectPosition: photo.focus ?? 'center',
                        transform: photo.zoom ? `scale(${photo.zoom})` : undefined,
                        transformOrigin: photo.focus ?? 'center',
                      }}
                    />
                  </div>
                  {piece.texture ? <img className={styles.texture} src={piece.shape} alt="" /> : null}
                </div>
              )
            }

            case 'paper':
              return (
                <div key={i} className={`${styles.piece} ${styles.motion}`} style={boxStyle(piece, i)} {...flyProps(piece)}>
                  <img className={styles.paper} src={piece.src} alt="" />
                </div>
              )

            case 'note':
              return (
                <div key={i} className={`${styles.piece} ${styles.motion}`} style={boxStyle(piece, i)} {...flyProps(piece)}>
                  <img className={styles.paper} src={piece.src} alt="" />
                  <FitLines
                    as="ul"
                    lines={work.highlights}
                    className={
                      'align' in piece && piece.align === 'center'
                        ? `${styles.highlights} ${styles.highlightsCentered}`
                        : styles.highlights
                    }
                    style={{ padding: piece.padding }}
                    maxFontSize={0.027}
                  />
                </div>
              )

          }
        })}
        </div>

        {/* Flat layer: type and the button never tilt, so they stay legible and easy to click */}
        <div className={styles.textLayer}>
          {layout.pieces.map((piece, i) => {
            if (!TEXT_KINDS.has(piece.kind)) return null
            switch (piece.kind) {
            case 'brand':
              return (
                <div key={i} className={`${styles.brand} ${styles.motion}`} style={boxStyle(piece, i)} {...flyProps(piece)}>
                  <FitText text={work.brand} orientation={piece.orientation} />
                </div>
              )

            case 'number':
              return (
                <span key={i} className={`${styles.number} ${styles.motion}`} style={boxStyle(piece, i)} {...flyProps(piece)} aria-hidden="true">
                  {pad(index + 1)}
                </span>
              )

            case 'title':
              return (
                <div key={i} className={`${styles.titleBox} ${styles.motion}`} style={boxStyle(piece, i)} {...flyProps(piece)} aria-hidden="true">
                  <FitLines
                    lines={work.titleLines ?? splitCampaignLines(work.title)}
                    className={styles.title}
                    maxFontSize={0.11}
                  />
                </div>
              )

            case 'cta':
              if (hideCta) return null
              return (
                <Link
                  key={i}
                  href={work.href}
                  className={`${styles.cta} ${styles.motion}`}
                  style={boxStyle(piece, i)}
                  {...flyProps(piece)}
                  aria-label={`View ${work.brand} case study`}
                >
                  View case study
                  <ArrowUpRight className={styles.ctaArrow} />
                </Link>
              )
            }
          })}
        </div>
      </div>
    </article>
  )
}

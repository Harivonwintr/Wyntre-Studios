'use client'

import { useRef, type CSSProperties } from 'react'
import Image from 'next/image'
import collage from '@/data/drivesCollage.json'
import { useCollageParallax } from '@/hooks/useCollageParallax'
import styles from './DrivesCollage.module.css'

type Piece = {
  src: string
  /** Optional matte (white shape on transparency) that cuts the image to a torn edge */
  mask?: string
  /** 'contain' keeps pre-cut artwork whole; 'cover' fills a masked shape with a plain photo */
  fit?: 'contain' | 'cover'
  left: string
  top: string
  width: string
  height: string
  rotate?: number
  /** Mirror the artwork left–right / top–bottom */
  flipX?: boolean
  flipY?: boolean
  /** How far forward the piece sits for parallax: 0 = back of the board, 1 = closest to the viewer */
  depth?: number
  z: number
}

const ASSETS = '/assets/drives'

/*
 * Layout lives in data/drivesCollage.json: positions are percentages of the collage box, measured from the
 * Figma composite. Artwork is trimmed to its visible edges (scripts/prepare-collage-asset.mjs), so nudging a
 * box never distorts a piece. Unused alternates: note-same-story(-alt), film-portrait, film-impossible.
 */
const [WIDTH, HEIGHT] = collage.size
// Sorted by z so --order matches the stack: the CSS lifts each piece by its order to set the paint order
const PIECES = [...(collage.pieces as Piece[])].sort((a, b) => a.z - b.z)

export default function DrivesCollage() {
  const collageRef = useRef<HTMLDivElement>(null)
  useCollageParallax(collageRef)

  return (
    <div
      ref={collageRef}
      className={styles.collage}
      style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
      role="img"
      aria-label="Studio collage: an editor at a post-production desk, New York and Los Angeles scenes, a camera monitor and a handwritten note reading ideas, people, platforms, culture, impact"
    >
      <div className={styles.stage}>
        {PIECES.map((piece, order) => {
          const maskUrl = piece.mask ? `url("${ASSETS}/${piece.mask}")` : undefined
          return (
            <div
              key={piece.src}
              className={styles.piece}
              style={
                {
                  left: piece.left,
                  top: piece.top,
                  width: piece.width,
                  height: piece.height,
                  zIndex: piece.z,
                  '--depth': piece.depth ?? 0.5,
                  '--rot': `${piece.rotate ?? 0}deg`,
                  '--flip-x': piece.flipX ? -1 : 1,
                  '--flip-y': piece.flipY ? -1 : 1,
                  '--order': order,
                } as CSSProperties
              }
            >
              <div className={styles.frame} style={maskUrl ? { WebkitMaskImage: maskUrl, maskImage: maskUrl } : undefined}>
                <Image
                  src={`${ASSETS}/${piece.src}`}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 60vw, 25vw"
                  style={{ objectFit: piece.fit ?? 'contain' }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

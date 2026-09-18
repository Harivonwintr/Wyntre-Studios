import Image from 'next/image'
import type { CSSProperties } from 'react'
import styles from './TapedPhoto.module.css'

type Props = {
  src: string
  alt?: string
  /** Tilt in degrees */
  rotate?: number
  /** CSS aspect-ratio of the print */
  aspect?: string
  /** CSS object-position for the crop */
  focus?: string
  sizes?: string
  /** One strip across the top edge, or metallic strips on opposite corners */
  tape?: 'top' | 'corners'
  /** Paper-coloured backing, for cutouts with transparency */
  paper?: boolean
  grayscale?: boolean
  className?: string
  style?: CSSProperties
}

/** A photo print with a paper border, a slight tilt and tape holding it down */
export default function TapedPhoto({
  src,
  alt = '',
  rotate = 0,
  aspect = '4 / 5',
  focus,
  sizes = '(max-width: 900px) 90vw, 30vw',
  tape = 'top',
  paper = false,
  grayscale = false,
  className,
  style,
}: Props) {
  const variants = `${paper ? styles.paper : ''} ${grayscale ? styles.grayscale : ''}`

  return (
    <figure
      className={`${styles.print} ${variants} ${className ?? ''}`}
      style={{ ...style, aspectRatio: aspect, '--rot': `${rotate}deg` } as CSSProperties}
    >
      <span className={styles.frame}>
        <Image src={src} alt={alt} fill sizes={sizes} className={styles.image} style={{ objectPosition: focus ?? 'center' }} />
      </span>
      {tape === 'top' ? (
        <img className={`${styles.tape} ${styles.tapeTop}`} src="/assets/contact/tape.webp" alt="" aria-hidden="true" />
      ) : (
        <>
          <img className={`${styles.tape} ${styles.tapeStart}`} src="/assets/work/tape/metallic-a.webp" alt="" aria-hidden="true" />
          <img className={`${styles.tape} ${styles.tapeEnd}`} src="/assets/work/tape/metallic-a.webp" alt="" aria-hidden="true" />
        </>
      )}
    </figure>
  )
}

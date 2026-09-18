import RunningTimecode from './RunningTimecode'
import styles from './Viewfinder.module.css'

type Props = {
  className?: string
  /** Camera readouts beside the corners (REC and running timecode, format, exposure, aspect) and a centre cross */
  hud?: boolean
}

/** Camera-viewport corner marks framing a section; place inside a positioned parent. Takes the parent's text colour. */
export default function Viewfinder({ className, hud = false }: Props) {
  return (
    <div className={`${styles.frame} ${className ?? ''}`} aria-hidden="true" data-reveal="frame">
      <span className={`${styles.corner} ${styles.tl}`} />
      <span className={`${styles.corner} ${styles.tr}`} />
      <span className={`${styles.corner} ${styles.bl}`} />
      <span className={`${styles.corner} ${styles.br}`} />

      {hud ? (
        <>
          <span className={`${styles.readout} ${styles.readoutTl}`}>
            <span className={styles.rec}>Rec</span>
            {/* 23.98 counts 24 frames a second, so the frames column never passes :23 */}
            <RunningTimecode className={styles.timecode} fps={24} />
          </span>
          <span className={`${styles.readout} ${styles.readoutTr}`}>4K · 23.98</span>
          <span className={`${styles.readout} ${styles.readoutBl}`}>ISO 800 · 1/48 · F2.8</span>
          <span className={`${styles.readout} ${styles.readoutBr}`}>16:9</span>
          <span className={styles.cross} />
        </>
      ) : null}
    </div>
  )
}

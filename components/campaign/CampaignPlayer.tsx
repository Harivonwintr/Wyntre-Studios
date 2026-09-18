'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import Hls from 'hls.js'
import styles from './CampaignPlayer.module.css'

type Props = {
  /** Cloudflare Stream video uid */
  videoId: string
  /** Accessible name, e.g. "NIVEA Body Milk" */
  title: string
  /** Seconds to skip at the head of the film */
  startTime?: number
}

const FPS = 25
const IDLE_MS = 2500

/** Seconds → HH:MM:SS:FF, matching the timecodes on the film strip */
const toTimecode = (seconds: number) => {
  const safe = Number.isFinite(seconds) && seconds > 0 ? seconds : 0
  const whole = Math.floor(safe)
  const parts = [Math.floor(whole / 3600), Math.floor((whole % 3600) / 60), whole % 60, Math.floor((safe % 1) * FPS)]
  return parts.map((n) => String(n).padStart(2, '0')).join(':')
}

const Icon = {
  play: <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />,
  pause: <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" />,
  sound: (
    <>
      <path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" fill="currentColor" />
      <path d="M15.5 9a4 4 0 010 6M18 6.5a7.5 7.5 0 010 11" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </>
  ),
  muted: (
    <>
      <path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" fill="currentColor" />
      <path d="M15.5 9.5l5 5M20.5 9.5l-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </>
  ),
  fullscreen: <path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" fill="none" stroke="currentColor" strokeWidth="1.8" />,
}

/** Stream playback with the site's own controls: square buttons, mono timecode and a hairline scrubber */
export default function CampaignPlayer({ videoId, title, startTime = 0 }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const idleTimer = useRef<ReturnType<typeof setTimeout>>()

  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(false)
  const [idle, setIdle] = useState(false)

  // Attach the HLS stream: Safari plays it natively, other browsers go through hls.js
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const src = `https://videodelivery.net/${videoId}/manifest/video.m3u8`
    let hls: Hls | null = null
    // Index of the top rendition once the manifest lands; used again after every seek
    let topLevel = -1
    setReady(false)
    setError(false)
    setTime(0)
    setDuration(0)

    // Opened from a click, so sound is usually allowed; fall back to muted if the browser blocks it.
    // Waiting for the source to be usable matters: calling play() before then just rejects.
    let started = false
    const start = () => {
      if (started) return
      started = true
      if (startTime > 0 && video.currentTime < startTime) video.currentTime = startTime
      video.play().catch(() => {
        video.muted = true
        video.play().catch(() => setPlaying(false))
      })
    }

    // hls.js first wherever Media Source works: current Chrome also reports native HLS, but its built-in
    // player opens on the lowest rendition and ignores our quality settings. Native is for iOS Safari.
    if (Hls.isSupported()) {
      hls = new Hls({
        // Fetch from the offset instead of loading the skipped head first
        startPosition: startTime > 0 ? startTime : -1,
        // hls.js assumes a 500 kbps connection until it has measured one, which opens every film on the
        // 240p rendition for its first few seconds. Assume a fast link so the opening plays at full quality;
        // it still steps down if the network genuinely can't keep up.
        abrEwmaDefaultEstimate: 8_000_000,
        // Otherwise hls.js deliberately loads the lowest rendition first to measure bandwidth
        testBandwidth: false,
        // Hold loading until the start level is chosen below; with auto-start it begins on the lowest rung
        autoStartLoad: false,
      })
      // Levels are sorted by bitrate, so the last is the top rendition (1080p on Stream)
      hls.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
        if (!hls) return
        topLevel = data.levels.length - 1
        hls.startLevel = topLevel
        hls.startLoad(startTime > 0 ? startTime : -1)
      })
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) setError(true)
      })
      hls.on(Hls.Events.MANIFEST_PARSED, start)
      hls.loadSource(src)
      hls.attachMedia(video)
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src
      video.addEventListener('loadedmetadata', start, { once: true })
    } else {
      setError(true)
      return
    }

    // Safety net for either path, in case the event above has already fired
    video.addEventListener('canplay', start, { once: true })

    // Seeking empties the buffer, and hls.js refills it from the lowest rendition to resume quickly, so the
    // first seconds after a scrub look like 240p. Ask for the top rendition instead; ABR takes over after.
    const onSeeking = () => {
      if (hls && topLevel >= 0) hls.nextLoadLevel = topLevel
    }
    video.addEventListener('seeking', onSeeking)

    return () => {
      video.removeEventListener('loadedmetadata', start)
      video.removeEventListener('canplay', start)
      video.removeEventListener('seeking', onSeeking)
      hls?.destroy()
      video.pause()
      video.removeAttribute('src')
      video.load()
    }
  }, [videoId, startTime])

  // Controls fade out while playing and the pointer is still
  const wake = useCallback(() => {
    setIdle(false)
    clearTimeout(idleTimer.current)
    idleTimer.current = setTimeout(() => setIdle(true), IDLE_MS)
  }, [])

  useEffect(() => {
    if (playing) wake()
    else {
      clearTimeout(idleTimer.current)
      setIdle(false)
    }
    return () => clearTimeout(idleTimer.current)
  }, [playing, wake])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) void video.play().catch(() => {})
    else video.pause()
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    // Coming back from a drag to silence: restore an audible level rather than unmuting at zero
    if (video.muted && video.volume === 0) video.volume = 0.5
    video.muted = !video.muted
  }

  const changeVolume = (next: number) => {
    const video = videoRef.current
    if (!video) return
    const level = Math.min(1, Math.max(0, next))
    video.volume = level
    video.muted = level === 0
  }

  const seekTo = (seconds: number) => {
    const video = videoRef.current
    if (video && Number.isFinite(video.duration)) video.currentTime = Math.min(video.duration, Math.max(0, seconds))
  }

  const toggleFullscreen = () => {
    const wrap = wrapRef.current
    if (!wrap) return
    if (document.fullscreenElement) void document.exitFullscreen()
    else void wrap.requestFullscreen?.()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    // Leave keys alone while the scrubber is focused; it handles its own arrows
    if ((e.target as HTMLElement).tagName === 'INPUT') return
    const key = e.key.toLowerCase()
    if (key === ' ' || key === 'k') {
      e.preventDefault()
      togglePlay()
    } else if (key === 'arrowleft') seekTo(time - 5)
    else if (key === 'arrowright') seekTo(time + 5)
    else if (key === 'm') toggleMute()
    else if (key === 'arrowup') changeVolume(volume + 0.1)
    else if (key === 'arrowdown') changeVolume(volume - 0.1)
    else if (key === 'f') toggleFullscreen()
    else return
    wake()
  }

  const progress = duration > 0 ? (time / duration) * 100 : 0

  return (
    <div
      ref={wrapRef}
      className={styles.player}
      data-idle={idle || undefined}
      onPointerMove={wake}
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="region"
      aria-label={`${title} video player`}
    >
      <video
        ref={videoRef}
        className={styles.video}
        playsInline
        onClick={togglePlay}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        onCanPlay={() => setReady(true)}
        onVolumeChange={(e) => {
          setMuted(e.currentTarget.muted)
          setVolume(e.currentTarget.volume)
        }}
        onError={() => setError(true)}
      />

      {error ? (
        <p className={styles.status}>Video unavailable</p>
      ) : !ready ? (
        <p className={styles.status} aria-live="polite">
          Loading
        </p>
      ) : null}

      <div className={styles.bar}>
        <button type="button" className={styles.button} onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            {playing ? Icon.pause : Icon.play}
          </svg>
        </button>

        <span className={styles.time} aria-hidden="true">
          {toTimecode(time)}
          <span> / {toTimecode(duration)}</span>
        </span>

        <input
          type="range"
          className={styles.scrub}
          min={0}
          max={duration || 0}
          step={1 / FPS}
          value={Math.min(time, duration || 0)}
          onChange={(e) => seekTo(Number(e.target.value))}
          style={{ '--progress': `${progress}%` } as CSSProperties}
          aria-label="Seek"
          aria-valuetext={`${toTimecode(time)} of ${toTimecode(duration)}`}
          disabled={!ready}
        />

        {/* The level slider stays tucked behind the speaker until it's hovered or focused */}
        <div className={styles.volume}>
          <button type="button" className={styles.button} onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}>
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              {muted ? Icon.muted : Icon.sound}
            </svg>
          </button>

          <input
            type="range"
            className={styles.level}
            min={0}
            max={1}
            step={0.01}
            value={muted ? 0 : volume}
            onChange={(e) => changeVolume(Number(e.target.value))}
            style={{ '--progress': `${(muted ? 0 : volume) * 100}%` } as CSSProperties}
            aria-label="Volume"
            aria-valuetext={`${Math.round((muted ? 0 : volume) * 100)} percent`}
          />
        </div>

        <button type="button" className={styles.button} onClick={toggleFullscreen} aria-label="Fullscreen">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            {Icon.fullscreen}
          </svg>
        </button>
      </div>
    </div>
  )
}

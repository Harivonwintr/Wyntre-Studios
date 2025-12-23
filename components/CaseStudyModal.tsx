"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./CaseStudyModal.module.css";
import StreamVideo from "./StreamVideo";
import OutlineButton from "./OutlineButton";

export type CaseStudyItem = {
  client: string;
  campaign: string;
  year: string;
  campaignType: string;

  agency: string;
  roleTitle: string;
  roleDetail?: string;

  scope: string;
  markets: string;
  delivery: string;
  challenge: string;

  posterUrl: string;
  videoUrl?: string;
  streamVideoId?: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  items: CaseStudyItem[];
  initialIndex?: number;
};

function clampIndex(i: number, len: number) {
  if (len <= 0) return 0;
  const mod = ((i % len) + len) % len;
  return mod;
}

export default function CaseStudyModal({
  isOpen,
  onClose,
  items,
  initialIndex = 0,
}: Props) {
  const [index, setIndex] = useState(() => clampIndex(initialIndex, items?.length || 0));
  const [isPlaying, setIsPlaying] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const backdropRef = React.useRef<HTMLDivElement>(null);

  const item = useMemo(() => {
    if (!items || items.length === 0) return null;
    return items[clampIndex(index, items.length)];
  }, [items, index]);

  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
  }, [isClosing]);

  useEffect(() => {
    if (!isOpen) {
      setIsClosing(false);
      setIndex(0);
      setIsPlaying(false);
      return;
    }
    const newIndex = clampIndex(initialIndex, items?.length || 0);
    setIndex(newIndex);
    setIsPlaying(false);
  }, [isOpen, initialIndex, items]);

  // Reset playback when index changes
  useEffect(() => {
    if (!isOpen || isClosing) return;
    setIsPlaying(false);
  }, [index, isOpen, isClosing]);

  // Lock body scroll - simple overflow lock with cleanup
  useEffect(() => {
    if (!isOpen) return;
    
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  // Force backdrop scrollTop to 0 on mount
  useEffect(() => {
    if (!isOpen) return;
    backdropRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [isOpen]);

  // Focus management + basic focus trap
  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const dialog = document.querySelector(`[role="dialog"]`) as HTMLElement | null;
    const closeBtn = dialog?.querySelector('footer button') as HTMLElement | null;
    // Focus close button after a brief delay to ensure dialog is rendered
    requestAnimationFrame(() => {
      closeBtn?.focus();
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (isClosing) return;
        setIsPlaying(false);
        setIndex((v) => clampIndex(v - 1, items?.length || 0));
        return;
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        if (isClosing) return;
        setIsPlaying(false);
        setIndex((v) => clampIndex(v + 1, items?.length || 0));
        return;
      }

      if (e.key === "Tab") {
        if (!dialog) return;

        const focusables = Array.from(
          dialog.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => !el.hasAttribute("disabled"));

        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [isOpen, handleClose, isClosing]);

  const handleAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
    if (!isClosing) return;
    if (e.currentTarget !== e.target) return;

    onClose();
  };

  // Keep component mounted during closing animation
  if ((!isOpen && !isClosing) || !item || !items || items.length === 0) return null;

  const goPrev = () => {
    if (isClosing) return;
    setIsPlaying(false);
    setIndex((v) => clampIndex(v - 1, items.length));
  };

  const goNext = () => {
    if (isClosing) return;
    setIsPlaying(false);
    setIndex((v) => clampIndex(v + 1, items.length));
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const modalContent = (
    <div
      ref={backdropRef}
      className={`${styles.backdrop} ${isClosing ? styles.closing : styles.opening}`}
      onClick={handleBackdropClick}
      aria-hidden={false}
    >
      <div className={styles.backdropInner}>
        <div
          className={`${styles.card} ${isClosing ? styles.closing : styles.opening}`}
          onClick={handleCardClick}
          onAnimationEnd={handleAnimationEnd}
          role="dialog"
          aria-modal="true"
          aria-label={`${item.client} ${item.campaign} details`}
        >
          <header className={styles.header}>
            <div className={styles.titleRow}>
              <span className={styles.client}>{item.client}</span>
              <span className={styles.dot}>·</span>
              <span className={styles.campaign}>{item.campaign}</span>
            </div>
            <div className={styles.subtitle}>
              <span>{item.year}</span>
              <span className={styles.dot}>·</span>
              <span>{item.campaignType}</span>
            </div>
          </header>

          <div className={styles.contentStage}>
            <section className={styles.mediaWrap}>
              <button
                className={styles.navBtnLeft}
                onClick={goPrev}
                aria-label="Previous"
                type="button"
              >
                <span aria-hidden="true">‹</span>
              </button>

              <div className={styles.mediaFrame}>
                {!isPlaying ? (
                  <>
                    <img className={styles.mediaImg} src={item.posterUrl} alt="" />
                    {item.streamVideoId && 
                     item.streamVideoId.trim() !== '' && 
                     !item.streamVideoId.includes('your-cloudflare-stream-video-id') &&
                     !item.streamVideoId.includes('placeholder') ? (
                      <button
                        className={styles.playBtn}
                        type="button"
                        onClick={() => {
                          if (!isClosing) setIsPlaying(true);
                        }}
                        aria-label="Play video"
                      >
                        ▶
                      </button>
                    ) : null}
                  </>
                ) : (
                  item.streamVideoId && 
                  item.streamVideoId.trim() !== '' && 
                  !item.streamVideoId.includes('your-cloudflare-stream-video-id') &&
                  !item.streamVideoId.includes('placeholder') && (
                    <StreamVideo videoId={item.streamVideoId} autoplay />
                  )
                )}
                <div className={styles.mediaVignette} aria-hidden="true" />
              </div>

              <button
                className={styles.navBtnRight}
                onClick={goNext}
                aria-label="Next"
                type="button"
              >
                <span aria-hidden="true">›</span>
              </button>
            </section>

            <section className={styles.meta}>
              <div className={styles.metaCol}>
                <div className={styles.block}>
                  <div className={styles.label}>Agency</div>
                  <div className={styles.valueStrong}>{item.agency}</div>
                </div>

                <div className={styles.block}>
                  <div className={styles.label}>Role</div>
                  <div className={styles.valueStrong}>{item.roleTitle}</div>
                  {item.roleDetail ? (
                    <div className={styles.valueSub}>{item.roleDetail}</div>
                  ) : null}
                </div>

                <div className={styles.block}>
                  <div className={styles.label}>Markets</div>
                  <div className={styles.valueStrong}>{item.markets}</div>
                </div>

                <div className={styles.block}>
                  <div className={styles.label}>Challenge</div>
                  <div className={styles.valueBody}>{item.challenge}</div>
                </div>
              </div>

              <div className={styles.metaCol}>
                <div className={styles.block}>
                  <div className={styles.label}>Scope</div>
                  <div className={styles.valueStrong}>{item.scope}</div>
                </div>

                <div className={styles.block}>
                  <div className={styles.label}>Delivery</div>
                  <div className={styles.valueStrong}>{item.delivery}</div>
                </div>
              </div>
            </section>
          </div>

          <footer className={styles.footer}>
            <OutlineButton
              onClick={handleClose}
              variant="white"
            >
              CLOSE
            </OutlineButton>
          </footer>
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  
  return createPortal(modalContent, document.body);
}

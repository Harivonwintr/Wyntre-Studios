"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import styles from "./CaseStudyModal.module.css";
import CampaignShowcase, { wrapIndex } from "./campaign/CampaignShowcase";
import { takeModalOrigin, type ModalOrigin } from "./campaign/modalOrigin";
import type { CampaignItem } from "./campaign/types";

export type { CampaignItem as CaseStudyItem } from "./campaign/types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  items: CampaignItem[];
  initialIndex?: number;
};

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** clip-path that shows only `inner` within `outer` */
const insetWithin = (inner: DOMRect, outer: DOMRect) => {
  const t = Math.max(0, inner.top - outer.top);
  const r = Math.max(0, outer.right - inner.right);
  const b = Math.max(0, outer.bottom - inner.bottom);
  const l = Math.max(0, inner.left - outer.left);
  return `inset(${t}px ${r}px ${b}px ${l}px)`;
};

const FULL = "inset(0px 0px 0px 0px)";

/** A fixed copy of the frame's picture that travels between the page and the player */
function createFlyer(origin: ModalOrigin, rect: DOMRect) {
  const flyer = document.createElement("div");
  const img = origin.el.querySelector("img");
  Object.assign(flyer.style, {
    position: "fixed",
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    zIndex: "10000",
    overflow: "hidden",
    background: "#000",
    pointerEvents: "none",
  });
  if (img) {
    const copy = document.createElement("img");
    copy.src = img.currentSrc || img.src;
    copy.alt = "";
    Object.assign(copy.style, { width: "100%", height: "100%", objectFit: "cover", display: "block" });
    flyer.appendChild(copy);
  }
  document.body.appendChild(flyer);
  return flyer;
}

export default function CaseStudyModal({
  isOpen,
  onClose,
  items,
  initialIndex = 0,
}: Props) {
  const [index, setIndex] = useState(() => wrapIndex(initialIndex, items?.length || 0));
  const [isClosing, setIsClosing] = useState(false);
  // Portal only after mount so server and first client render match (avoids hydration errors when opened on load)
  const [isMounted, setIsMounted] = useState(false);

  const backdropRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  // The frame this modal flew out of, while it can still fly back
  const originRef = useRef<ModalOrigin | null>(null);
  const openTlRef = useRef<gsap.core.Timeline | null>(null);
  // True once GSAP has taken over from the CSS animations for this opening
  const flightRef = useRef(false);
  const closingRef = useRef(false);
  const indexRef = useRef(index);
  indexRef.current = index;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setIsClosing(false);
      closingRef.current = false;
      flightRef.current = false;
      setIndex(0);
      return;
    }
    setIndex(wrapIndex(initialIndex, items?.length || 0));
  }, [isOpen, initialIndex, items]);

  // Open: the clicked frame's picture flies into the player, then the dialog opens out from it
  useIsoLayoutEffect(() => {
    if (!isOpen || !isMounted) return;
    const origin = takeModalOrigin();
    originRef.current = null;

    const card = cardRef.current;
    const backdrop = backdropRef.current;
    const media = card?.querySelector<HTMLElement>("[data-modal-media]");
    if (!card || !backdrop || !media || !origin?.el.isConnected || prefersReducedMotion()) return;

    const from = origin.el.getBoundingClientRect();
    if (from.width === 0) return;
    const to = media.getBoundingClientRect();
    originRef.current = origin;

    // GSAP takes over from the CSS fade
    backdrop.style.animation = "none";
    card.style.animation = "none";
    flightRef.current = true;
    origin.el.style.visibility = "hidden";
    const flyer = createFlyer(origin, from);
    const panelItems = card.querySelectorAll(":scope aside > *");

    gsap.set(card, { opacity: 0, clipPath: insetWithin(to, card.getBoundingClientRect()) });

    const tl = gsap.timeline({
      onComplete: () => {
        flyer.remove();
        origin.el.style.visibility = "";
        gsap.set(card, { clearProps: "opacity,clipPath" });
        gsap.set(panelItems, { clearProps: "opacity,transform" });
        openTlRef.current = null;
      },
    });
    tl.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out" }, 0)
      .to(flyer, { left: to.left, top: to.top, width: to.width, height: to.height, duration: 0.75, ease: "expo.inOut" }, 0)
      .set(card, { opacity: 1 }, 0.72)
      .to(card, { clipPath: FULL, duration: 0.7, ease: "expo.out" }, 0.72)
      .from(panelItems, { opacity: 0, y: 14, duration: 0.5, stagger: 0.035, ease: "power3.out" }, 0.82)
      .to(flyer, { opacity: 0, duration: 0.3, ease: "none" }, 0.95);
    openTlRef.current = tl;

    return () => {
      tl.kill();
      flyer.remove();
      origin.el.style.visibility = "";
    };
  }, [isOpen, isMounted]);

  const handleClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    openTlRef.current?.progress(1);

    const card = cardRef.current;
    const backdrop = backdropRef.current;
    const media = card?.querySelector<HTMLElement>("[data-modal-media]");
    const origin = originRef.current;
    const target = origin?.el.isConnected ? origin.el.getBoundingClientRect() : null;
    const targetVisible = !!target && target.width > 0 && target.bottom > 0 && target.top < window.innerHeight;
    const sameCampaign = indexRef.current === wrapIndex(initialIndex, items?.length || 0);

    // Fly back into the frame it came from, if that frame is still on screen and still the campaign shown
    if (card && backdrop && media && origin && target && targetVisible && sameCampaign && !prefersReducedMotion()) {
      const from = media.getBoundingClientRect();
      const flyer = createFlyer(origin, from);
      flyer.style.opacity = "0";
      backdrop.style.animation = "none";
      card.style.animation = "none";

      gsap.set(card, { clipPath: FULL });
      gsap
        .timeline({
          onComplete: () => {
            flyer.remove();
            origin.el.style.visibility = "";
            onClose();
          },
        })
        // Cover the player first (it may be mid-playback), then fold the dialog back into the picture
        .to(flyer, { opacity: 1, duration: 0.15, ease: "none" }, 0)
        .to(card, { clipPath: insetWithin(from, card.getBoundingClientRect()), duration: 0.4, ease: "power3.in" }, 0)
        .set(card, { opacity: 0 }, 0.4)
        .add(() => {
          origin.el.style.visibility = "hidden";
        }, 0.4)
        .to(flyer, { left: target.left, top: target.top, width: target.width, height: target.height, duration: 0.6, ease: "expo.inOut" }, 0.4)
        .to(backdrop, { opacity: 0, duration: 0.5, ease: "power2.inOut" }, 0.45);
      return;
    }

    // Opened by the flight, so the CSS animations are switched off and the .closing fade would never end
    // (the modal couldn't be closed). Fade out with GSAP instead.
    if (flightRef.current && card && backdrop) {
      if (prefersReducedMotion()) {
        onClose();
        return;
      }
      gsap
        .timeline({ onComplete: onClose })
        .to(card, { opacity: 0, y: 10, duration: 0.25, ease: "power2.in" }, 0)
        .to(backdrop, { opacity: 0, duration: 0.3, ease: "power2.in" }, 0);
      return;
    }

    setIsClosing(true);
  }, [onClose, initialIndex, items]);

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  // Focus management, keyboard navigation and focus trap (waits for mount so the portal exists)
  useEffect(() => {
    if (!isOpen || !isMounted) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const dialog = cardRef.current;
    requestAnimationFrame(() => {
      dialog?.querySelector<HTMLElement>("[data-close]")?.focus({ preventScroll: true });
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
        return;
      }

      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        if (closingRef.current) return;
        const delta = e.key === "ArrowLeft" ? -1 : 1;
        setIndex((v) => wrapIndex(v + delta, items?.length || 0));
        return;
      }

      if (e.key === "Tab" && dialog) {
        const focusables = Array.from(
          dialog.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, iframe, [tabindex]:not([tabindex="-1"])'
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
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [isOpen, isMounted, handleClose, items]);

  const handleAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
    if (!isClosing || e.currentTarget !== e.target) return;
    onClose();
  };

  // Keep component mounted during closing animation
  if ((!isOpen && !isClosing) || !items || items.length === 0 || !isMounted) return null;

  const item = items[wrapIndex(index, items.length)];

  return createPortal(
    <div
      ref={backdropRef}
      className={`${styles.backdrop} ${isClosing ? styles.closing : styles.opening}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        ref={cardRef}
        className={`${styles.card} ${isClosing ? styles.closing : styles.opening}`}
        onAnimationEnd={handleAnimationEnd}
        role="dialog"
        aria-modal="true"
        aria-label={`${item.client} ${item.campaign} details`}
      >
        <CampaignShowcase
          items={items}
          index={index}
          onIndexChange={setIndex}
          onClose={handleClose}
        />
      </div>
    </div>,
    document.body
  );
}

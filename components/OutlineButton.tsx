"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./OutlineButton.module.css";

interface OutlineButtonProps {
  children?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "black" | "white";
}

export default function OutlineButton({ 
  children = "LEARN MORE",
  href,
  onClick,
  type = "button",
  variant = "black"
}: OutlineButtonProps) {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });

  const elementRef = href ? linkRef : btnRef;

  useLayoutEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const update = () => {
      const w = Math.round(el.clientWidth);
      const h = Math.round(el.clientHeight);
      if (w && h) setBox({ w, h });
    };

    update();

    const ro = new ResizeObserver(() => update());
    ro.observe(el);

    return () => ro.disconnect();
  }, [elementRef]);

  const stroke = 2; // px
  const w = box.w || 220; // fallback
  const h = box.h || 56;  // fallback

  // Pill radius must be half the height (minus stroke inset)
  const r = Math.max(0, (h - stroke * 2) / 2);

  const buttonContent = (
    <>
      <span className={styles.label}>{children}</span>
      <svg
        className={styles.outline}
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <rect
          className={styles.rect}
          x={stroke}
          y={stroke}
          width={w - stroke * 2}
          height={h - stroke * 2}
          rx={r}
          ry={r}
          pathLength={1}
        />
      </svg>
    </>
  );

  const commonProps = {
    className: styles.btn,
    'data-variant': variant === "white" ? "white" : undefined
  } as const;

  if (href) {
    return (
      <Link 
        ref={linkRef as any} 
        href={href} 
        {...commonProps}
      >
        {buttonContent}
      </Link>
    );
  }

  return (
    <button 
      ref={btnRef} 
      {...commonProps}
      type={type} 
      onClick={onClick}
    >
      {buttonContent}
    </button>
  );
}

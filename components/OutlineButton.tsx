import Link from 'next/link'
import type { ReactNode } from 'react'
import styles from './OutlineButton.module.css'

type Props = {
  children?: ReactNode
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  /** 'white' for dark backgrounds */
  variant?: 'black' | 'white'
  disabled?: boolean
  /** Icon after the label: ↗ for links, ▶ for video, or none */
  icon?: 'arrow' | 'play' | 'none'
  className?: string
}

const ICONS = {
  arrow: <path d="M7 17L17 7M8.5 7H17v8.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square" />,
  play: <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />,
}

/** The site's call-to-action: an underlined text link with an icon that nudges on hover */
export default function OutlineButton({
  children = 'Learn more',
  href,
  onClick,
  type = 'button',
  variant = 'black',
  disabled,
  icon = 'arrow',
  className,
}: Props) {
  const content = (
    <>
      <span className={styles.label}>{children}</span>
      {icon !== 'none' ? (
        <svg className={styles.icon} data-icon={icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          {ICONS[icon]}
        </svg>
      ) : null}
    </>
  )

  const shared = { className: `${styles.btn} ${className ?? ''}`, 'data-variant': variant }

  if (href) {
    return (
      <Link href={href} onClick={onClick} {...shared}>
        {content}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} {...shared}>
      {content}
    </button>
  )
}

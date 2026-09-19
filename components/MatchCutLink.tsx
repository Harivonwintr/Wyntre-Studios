'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { ComponentProps, MouseEvent } from 'react'
import { canMatchCut, navigateWithMatchCut } from '@/utils/matchCut'

type Props = ComponentProps<typeof Link> & {
  href: string
  /** view-transition-name the destination page gives its matching element (see matchCutName) */
  matchName: string
  /** The element that carries across, found inside this link (usable from server components) */
  matchSelector?: string
  /** Or found some other way, e.g. a sibling of the link */
  matchTarget?: (link: HTMLAnchorElement) => HTMLElement | null
}

/**
 * A Link whose page change plays as a match cut (see utils/matchCut). Only the clicked piece is named, and only
 * for the cut, so nothing else on the page lifts out. Modified clicks (new tab, etc.) and browsers without View
 * Transitions behave like a normal Link.
 */
export default function MatchCutLink({ href, matchName, matchSelector, matchTarget, onClick, ...rest }: Props) {
  const router = useRouter()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    if (!canMatchCut()) return
    const link = e.currentTarget
    const source = matchTarget ? matchTarget(link) : matchSelector ? link.querySelector<HTMLElement>(matchSelector) : null
    e.preventDefault()
    if (source) source.style.viewTransitionName = matchName
    // PageTransition puts the new page at the top inside the same commit, so the snapshot starts there
    navigateWithMatchCut(() => router.push(href, { scroll: false }))
  }

  return <Link href={href} onClick={handleClick} {...rest} />
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from './Logo'

/*
 * The wordmark, pinned to the top-left of every page. It uses
 * mix-blend-mode: difference, so instead of painting a fixed color it inverts
 * whatever scrolls beneath it, like looking through tinted glass. Its base
 * color is set so that over the page background the result is exactly cobalt.
 */
export default function SiteLogo() {
  const pathname = usePathname()
  if (pathname?.startsWith('/studio')) return null
  return (
    <Link href="/" aria-label="Dillon Key, home" className="site-logo">
      <Logo size="md" className="" />
    </Link>
  )
}

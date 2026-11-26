'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { site } from '@/lib/site'

const PAGES = [
  { href: '/about', label: 'About' },
  { href: '/work', label: 'Work' },
  { href: '/side-projects', label: 'Side Projects' },
]

/*
 * The three primary pages. On desktop they sit top-right, mirroring the
 * wordmark and inverting what passes beneath them the same way. On phones a
 * Menu button opens a full-screen menu.
 */
export default function SiteNav() {
  const pathname = usePathname() ?? '/'
  const [open, setOpen] = useState(false)

  // Close on Escape, and stop the page scrolling behind the open menu.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [open])

  if (pathname.startsWith('/studio')) return null
  const isCurrent = (href: string) => pathname === href || (href === '/work' && pathname.startsWith('/work/'))

  return (
    <>
      <nav aria-label="Primary" className="site-nav">
        <ul className="hidden gap-7 sm:flex">
          {PAGES.map((p) => (
            <li key={p.href}>
              <Link href={p.href} aria-current={isCurrent(p.href) ? 'page' : undefined} className="site-nav-link">
                {p.label}
              </Link>
            </li>
          ))}
        </ul>
        <button type="button" className="site-nav-link sm:hidden" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(true)}>
          Menu
        </button>
      </nav>

      {open && (
        <div id="site-menu" role="dialog" aria-modal="true" aria-label="Menu" className="site-menu chat-fade">
          <div className="flex items-start justify-between">
            <Link href="/" onClick={() => setOpen(false)} className="text-[0.8125rem] font-bold tracking-[0.12em] uppercase">
              {site.name}
            </Link>
            <button type="button" onClick={() => setOpen(false)} className="text-[0.9375rem]" autoFocus>
              Close
            </button>
          </div>
          <ul className="mt-16 space-y-3">
            {PAGES.map((p) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  onClick={() => setOpen(false)}
                  aria-current={isCurrent(p.href) ? 'page' : undefined}
                  className="text-[2.75rem] leading-[1.1] font-semibold tracking-[-0.03em] underline-offset-8 aria-[current=page]:underline"
                >
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="mt-auto space-y-2 text-[0.9375rem] opacity-80">
            <li>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
            <li>
              <Link href="/resume" onClick={() => setOpen(false)}>
                Resume
              </Link>
            </li>
            <li>
              <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </div>
      )}
    </>
  )
}

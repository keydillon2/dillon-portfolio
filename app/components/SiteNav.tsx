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
 * A hamburger pinned top-right, mirroring the wordmark and inverting what
 * passes beneath it the same way. It opens a full-screen menu with the three
 * primary pages.
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
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen(true)}
          className="site-burger"
        >
          <span aria-hidden />
          <span aria-hidden />
        </button>
      </nav>

      {open && (
        <div id="site-menu" role="dialog" aria-modal="true" aria-label="Menu" className="site-menu chat-fade">
          <div className="mx-auto flex h-full w-full max-w-6xl flex-col">
            <div className="flex items-start justify-between">
              <Link href="/" onClick={() => setOpen(false)} className="text-[0.8125rem] font-bold tracking-[0.12em] uppercase sm:text-[1rem]">
                {site.name}
              </Link>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="site-close" autoFocus>
                <svg aria-hidden width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M3 3l16 16M19 3 3 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <ul className="mt-16 space-y-2 sm:mt-24">
              {PAGES.map((p) => (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    onClick={() => setOpen(false)}
                    aria-current={isCurrent(p.href) ? 'page' : undefined}
                    className="site-menu-link"
                  >
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="mt-auto flex flex-wrap gap-x-8 gap-y-2 text-[0.9375rem] opacity-80">
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
        </div>
      )}
    </>
  )
}

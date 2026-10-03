'use client'

import { useEffect, useState } from 'react'

export interface NavItem {
  id: string
  index: string
  title: string
  client?: string
}

/**
 * Sticky left-hand index of case studies with typographic thumbnails.
 * No cover imagery exists yet, so each thumbnail is the entry's index
 * number set large — honest placeholder until real covers land.
 * Scroll-spy highlights whichever case study is in view.
 * On mobile this collapses to a horizontal chip bar (sticky top).
 */
export default function CaseStudyNav({ items }: { items: NavItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null)
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        }
      },
      { rootMargin: '-35% 0px -55% 0px' }
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [items])

  return (
    <>
      {/* Mobile: horizontal chip bar */}
      <nav
        aria-label="Case studies"
        className="lg:hidden sticky top-0 z-10 -mx-6 px-6 py-3 bg-white/95 backdrop-blur border-b border-zinc-200 overflow-x-auto"
      >
        <ul className="flex gap-2 whitespace-nowrap">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={activeId === item.id ? 'true' : undefined}
                className={`inline-block rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  activeId === item.id
                    ? 'bg-zinc-900 text-white border-zinc-900 font-medium'
                    : 'border-zinc-300 text-zinc-700 hover:border-zinc-500'
                }`}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Desktop: left-hand thumbnail index */}
      <aside className="hidden lg:block w-56 shrink-0">
        <nav
          aria-label="Case studies"
          className="sticky top-8"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-600">
            Index
          </p>
          <ul className="mt-4 space-y-1">
            {items.map((item) => {
              const active = activeId === item.id
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={active ? 'true' : undefined}
                    className="group flex items-center gap-3 rounded-lg p-2 -m-2 transition-colors hover:bg-zinc-100"
                  >
                    <span
                      aria-hidden="true"
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md border text-lg font-bold transition-colors ${
                        active
                          ? 'bg-zinc-900 text-white border-zinc-900'
                          : 'border-zinc-300 text-zinc-500 group-hover:border-zinc-500 group-hover:text-zinc-700'
                      }`}
                    >
                      {item.index}
                    </span>
                    <span className="min-w-0">
                      <span
                        className={`block truncate text-sm ${
                          active ? 'font-semibold text-zinc-900' : 'text-zinc-700'
                        }`}
                      >
                        {item.title}
                      </span>
                      {item.client && (
                        <span className="block truncate text-xs text-zinc-600">
                          {item.client}
                        </span>
                      )}
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>
    </>
  )
}

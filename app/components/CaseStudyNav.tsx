'use client'

import { useEffect, useState } from 'react'

export interface NavItem {
  id: string
  title: string
  client?: string
}

/**
 * Sticky left-hand index of case studies with scroll-spy.
 * The case studies aren't a sequence, so entries aren't numbered;
 * the active one is marked with an accent rule instead.
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
        className="lg:hidden sticky top-0 z-10 -mx-6 mb-10 px-6 py-3 bg-paper/95 backdrop-blur border-b border-rule overflow-x-auto"
      >
        <ul className="flex gap-2 whitespace-nowrap">
          {items.map((item) => {
            const active = activeId === item.id
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={active ? 'true' : undefined}
                  className={`inline-block rounded-full border px-4 py-1.5 text-meta transition-colors ${
                    active
                      ? 'bg-ink text-paper border-ink font-medium'
                      : 'border-rule text-muted hover:border-muted hover:text-ink'
                  }`}
                >
                  {item.title}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Desktop: left-hand index */}
      <aside className="hidden lg:block w-52 shrink-0">
        <nav aria-label="Case studies" className="sticky top-10">
          <ul className="space-y-1 border-l border-rule">
            {items.map((item) => {
              const active = activeId === item.id
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={active ? 'true' : undefined}
                    className={`-ml-px block border-l-2 py-2 pl-4 transition-colors ${
                      active ? 'border-accent' : 'border-transparent hover:border-muted'
                    }`}
                  >
                    <span className={`block text-meta ${active ? 'font-semibold text-ink' : 'text-ink/80'}`}>
                      {item.title}
                    </span>
                    {item.client && (
                      <span className="block text-[0.8125rem] leading-snug text-muted">{item.client}</span>
                    )}
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

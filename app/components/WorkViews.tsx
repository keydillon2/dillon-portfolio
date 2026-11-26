'use client'

import { useState, type ReactNode } from 'react'

/** Switches the Work page between the card grid and the compact list. */
export default function WorkViews({ grid, list }: { grid: ReactNode; list: ReactNode }) {
  const [view, setView] = useState<'grid' | 'list'>('grid')
  return (
    <>
      <div role="group" aria-label="View" className="inline-flex rounded-full border border-rule p-1 text-meta">
        {(['grid', 'list'] as const).map((v) => (
          <button
            key={v}
            type="button"
            aria-pressed={view === v}
            onClick={() => setView(v)}
            className="rounded-full px-4 py-1.5 capitalize transition-colors aria-pressed:bg-ink aria-pressed:text-paper"
          >
            {v}
          </button>
        ))}
      </div>
      <div className="mt-10">{view === 'grid' ? grid : list}</div>
    </>
  )
}

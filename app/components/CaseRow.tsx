'use client'

import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'

/*
 * A home page case row. The headline is the real link (for keyboards and
 * screen readers). A click anywhere else on the row also opens the case,
 * unless the visitor was selecting text, so the copy stays easy to select.
 */
export default function CaseRow({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  const router = useRouter()
  return (
    <div
      className={`cursor-pointer ${className ?? ''}`}
      // A drag that selected text (even across the headline link) shouldn't navigate.
      onClickCapture={(e) => {
        if (window.getSelection()?.toString()) {
          e.preventDefault()
          e.stopPropagation()
        }
      }}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('a')) return
        if (window.getSelection()?.toString()) return
        if (e.metaKey || e.ctrlKey) window.open(href, '_blank', 'noopener')
        else router.push(href)
      }}
    >
      {children}
    </div>
  )
}

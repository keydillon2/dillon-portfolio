import Link from 'next/link'
import type { ReactNode } from 'react'

export interface HoverItem {
  key: string
  href?: string
  title: ReactNode
  detail?: ReactNode
  meta?: ReactNode
}

/*
 * A list whose rows fill with ink on hover (or keyboard focus), show an arrow,
 * and fade the other rows back, after Collins.
 */
export default function HoverList({ items, label }: { items: HoverItem[]; label?: string }) {
  return (
    <ul className="hover-list" aria-label={label}>
      {items.map((it) => {
        const inner = (
          <>
            <span className="hover-row-title">{it.title}</span>
            {it.detail && <span className="hover-row-detail">{it.detail}</span>}
            {it.meta && <span className="hover-row-meta">{it.meta}</span>}
            <span aria-hidden className="hover-row-arrow">→</span>
          </>
        )
        return (
          <li key={it.key}>
            {it.href ? (
              <Link href={it.href} className="hover-row">
                {inner}
              </Link>
            ) : (
              <div className="hover-row">{inner}</div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

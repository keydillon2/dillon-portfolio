import type { CSSProperties, ElementType } from 'react'

/*
 * Text that starts grey and fills in word by word as it scrolls into view
 * (the Collins effect). It's driven by the browser's own scroll timeline, so
 * there's no JavaScript; browsers without support, and visitors who prefer
 * reduced motion, simply see the finished text. Use `hero` for text at the
 * top of a page, which fills in over the first stretch of scrolling instead.
 */
export default function ScrollText({ text, as: Tag = 'p', className = '', hero = false }: { text: string; as?: ElementType; className?: string; hero?: boolean }) {
  const words = text.split(/\s+/).filter(Boolean)
  return (
    <Tag className={`scroll-text ${hero ? 'scroll-text--hero' : ''} ${className}`}>
      {words.map((w, i) => (
        <span key={i} className="scroll-word" style={{ '--p': (i / Math.max(1, words.length - 1)).toFixed(3) } as CSSProperties}>
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  )
}

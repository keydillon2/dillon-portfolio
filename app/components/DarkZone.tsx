'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/*
 * A section that turns the whole page dark while it crosses the middle of the
 * screen, after Collins. The page's colors are tokens, so flipping one
 * attribute on <html> recolors everything, including the see-through logo.
 */
let active = 0

export default function DarkZone({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const root = document.documentElement
    let inside = false
    const set = (on: boolean) => {
      if (on === inside) return
      inside = on
      active += on ? 1 : -1
      if (active > 0) root.dataset.zone = 'dark'
      else delete root.dataset.zone
    }
    // Trigger on a thin band across the middle of the viewport.
    const io = new IntersectionObserver(([entry]) => set(entry.isIntersecting), { rootMargin: '-45% 0px -45% 0px' })
    io.observe(el)
    return () => {
      io.disconnect()
      set(false)
    }
  }, [])
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

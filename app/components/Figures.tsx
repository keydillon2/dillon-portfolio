import type { Figure } from '@/sanity/lib/caseStudies'

/** A row of real figures: large tabular value, short label underneath. */
export default function Figures({ figures, compact }: { figures?: Figure[]; compact?: boolean }) {
  if (!figures?.length) return null
  return (
    <ul className={`grid gap-x-8 gap-y-5 ${compact ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-[repeat(auto-fit,minmax(9.5rem,1fr))]'}`}>
      {figures.map((f) => (
        <li key={f._key} className="min-w-0">
          <span
            className={`block font-semibold tracking-[-0.02em] text-ink ${
              compact ? 'text-[1.375rem] leading-none' : 'text-[2.25rem] leading-none'
            }`}
          >
            {f.value}
          </span>
          <span className={`mt-2 block text-muted text-pretty ${compact ? 'text-[0.8125rem] leading-snug' : 'text-meta'}`}>
            {f.label}
          </span>
        </li>
      ))}
    </ul>
  )
}

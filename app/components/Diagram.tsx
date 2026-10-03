import type { Diagram as DiagramData, QuadrantPosition } from '@/sanity/lib/caseStudies'

/*
 * Framework diagrams, drawn from structured Sanity data.
 * All text is real HTML (not baked into an image), so it wraps, reads in
 * both themes, scales with the user's font size, and is read by screen
 * readers in order.
 */

export default function Diagram({ data }: { data: DiagramData }) {
  const body =
    data.kind === 'quadrant' ? <Quadrant d={data} /> :
    data.kind === 'shifts' ? <Shifts d={data} /> :
    data.kind === 'sequence' ? <Sequence d={data} /> :
    null
  if (!body) return null

  return (
    <figure className="rounded-[10px] border border-rule bg-panel p-5 sm:p-8">
      {data.title && <p className="text-meta font-medium text-ink">{data.title}</p>}
      <div className="mt-6">{body}</div>
      {data.caption && (
        <figcaption className="mt-6 max-w-[60ch] text-meta text-muted text-pretty">{data.caption}</figcaption>
      )}
    </figure>
  )
}

/* ---------- 2×2 ---------- */

const CELLS: QuadrantPosition[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right']

function Quadrant({ d }: { d: DiagramData }) {
  return (
    <div>
      <div className="grid grid-cols-[auto_1fr] gap-x-3">
        {/* Vertical axis labels, read top to bottom */}
        <div className="flex w-[4.25rem] flex-col justify-between py-1 text-right text-[0.75rem] leading-snug text-muted sm:w-28 sm:text-[0.8125rem]">
          <span>{d.yAxis?.high}</span>
          <span>{d.yAxis?.low}</span>
        </div>

        <div className="relative grid aspect-square grid-cols-2 sm:aspect-[2/1] grid-rows-2 border-l border-b border-ink/40">
          {/* Crosshair */}
          <span aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-full border-l border-dashed border-rule" />
          <span aria-hidden className="pointer-events-none absolute left-0 top-1/2 w-full border-t border-dashed border-rule" />

          {CELLS.map((pos) => {
            const crowded = d.crowded?.position === pos
            const open = d.open?.position === pos
            return (
              <div key={pos} className="relative p-1.5 sm:p-3">
                {crowded && (
                  <div className="quadrant-crowd flex h-full items-end rounded-[6px] p-2 sm:p-3">
                    <span className="relative text-[0.75rem] leading-snug text-muted sm:text-[0.8125rem]">{d.crowded?.label}</span>
                  </div>
                )}
                {open && (
                  <div className="flex h-full items-start rounded-[6px] border-2 border-accent bg-accent/[0.06] p-2 sm:p-3">
                    <span className="font-serif text-[1.0625rem] leading-snug text-accent sm:text-[1.25rem]">
                      {d.open?.label}
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Horizontal axis labels */}
        <span />
        <div className="mt-2 flex justify-between gap-4 text-[0.75rem] leading-snug text-muted sm:text-[0.8125rem]">
          <span>{d.xAxis?.low}</span>
          <span className="text-right">{d.xAxis?.high}</span>
        </div>
      </div>
    </div>
  )
}

/* ---------- From → to ---------- */

function Shifts({ d }: { d: DiagramData }) {
  const rows = d.shifts?.filter((s) => s.from || s.to) ?? []
  return (
    <ol className="divide-y divide-rule">
      {rows.map((s) => (
        <li
          key={s._key}
          className="grid gap-1 py-4 first:pt-0 last:pb-0 sm:grid-cols-[1fr_3rem_1fr] sm:items-center sm:gap-4"
        >
          <span className="text-muted line-through decoration-muted/40 decoration-1">
            <span className="sr-only">From: </span>
            {s.from}
          </span>
          <Arrow />
          <span className="font-medium text-ink">
            <span className="sr-only">To: </span>
            {s.to}
          </span>
        </li>
      ))}
    </ol>
  )
}

function Arrow() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 48 12"
      className="h-3 w-10 text-accent rotate-90 sm:rotate-0 sm:w-12 my-1 sm:my-0 -ml-1 sm:ml-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M0 6h45M40 1l5 5-5 5" />
    </svg>
  )
}

/* ---------- Ordered sequence ---------- */

function Sequence({ d }: { d: DiagramData }) {
  const steps = d.steps?.filter(Boolean) ?? []
  return (
    <ol className="relative">
      {steps.map((step, i) => (
        <li key={i} className="relative flex gap-4 pb-5 last:pb-0">
          {/* Connector between nodes */}
          {i < steps.length - 1 && (
            <span aria-hidden className="absolute left-[0.9375rem] top-8 bottom-0 border-l border-rule" />
          )}
          <span
            aria-hidden
            className={`relative z-[1] flex h-[1.875rem] w-[1.875rem] shrink-0 items-center justify-center rounded-full border text-[0.8125rem] font-medium ${
              i === steps.length - 1 ? 'border-accent bg-accent text-paper' : 'border-ink/30 bg-panel text-ink'
            }`}
          >
            {i + 1}
          </span>
          <span className={`pt-[0.2rem] ${i === steps.length - 1 ? 'font-medium text-ink' : 'text-ink'}`}>{step}</span>
        </li>
      ))}
    </ol>
  )
}

/*
 * The signature device: what the client asked for, set against what the
 * problem turned out to be. The reframe is where a strategist earns their
 * keep, so it gets the page's one piece of motion: the connector draws in
 * and the reframe settles after it (skipped under reduced motion).
 */
export default function BriefReframe({ brief, reframe }: { brief?: string; reframe?: string }) {
  if (!brief || !reframe) return null
  return (
    <section aria-label="The brief and the reframe" className="grid gap-0 md:grid-cols-[1fr_4.5rem_1.35fr] md:items-stretch">
      <div className="md:py-1">
        <h2 className="text-meta font-medium text-muted">The brief</h2>
        <p className="mt-2 max-w-[44ch] text-muted text-pretty">{brief}</p>
      </div>

      {/* Connector: vertical on mobile, horizontal on desktop */}
      <div aria-hidden className="flex items-center py-4 pl-[0.4rem] md:justify-center md:py-0 md:pl-0">
        <span className="reframe-line block h-8 w-px bg-accent md:h-px md:w-full" />
      </div>

      <div className="reframe-text border-l-2 border-accent pl-5">
        <h2 className="text-meta font-medium text-accent">The reframe</h2>
        <p className="mt-2 max-w-[48ch] font-serif text-[1.25rem] leading-[1.45] sm:text-[1.5rem] text-pretty">
          {reframe}
        </p>
      </div>
    </section>
  )
}

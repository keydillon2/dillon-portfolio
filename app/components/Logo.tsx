import { site } from '@/lib/site'

/*
 * The wordmark: the name in wide, heavy capitals, with "Brand Strategist"
 * underneath in light, widely spaced capitals that run the full width of the
 * name. The descriptor's letters are spread edge to edge with flexbox, so the
 * two lines always line up whatever the size.
 */
const DESCRIPTOR = 'Brand Strategist'

export default function Logo({ size = 'lg' }: { size?: 'lg' | 'sm' }) {
  const lg = size === 'lg'
  return (
    <span
      role="img"
      aria-label={`${site.name}, ${DESCRIPTOR}`}
      className="inline-flex flex-col text-accent uppercase select-none"
    >
      <span
        aria-hidden
        className={`font-bold leading-none ${
          lg ? 'text-[2.75rem] tracking-[0.12em] sm:text-[4.25rem]' : 'text-[1.25rem] tracking-[0.12em]'
        }`}
        // Trim the trailing letter-spacing so the right edges align.
        style={{ marginRight: '-0.12em' }}
      >
        {site.name}
      </span>
      <span
        aria-hidden
        className={`flex justify-between font-normal leading-none ${
          lg ? 'mt-3 text-[0.8125rem] sm:mt-4 sm:text-[1.0625rem]' : 'mt-1.5 text-[0.5rem]'
        }`}
      >
        {[...DESCRIPTOR].map((ch, i) => (
          <span key={i} className={ch === ' ' ? 'w-[0.3em]' : undefined}>
            {ch === ' ' ? '' : ch}
          </span>
        ))}
      </span>
    </span>
  )
}

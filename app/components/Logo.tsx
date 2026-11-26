import { site } from '@/lib/site'

/*
 * The wordmark: the name in wide, heavy capitals, with "Brand Strategist"
 * underneath in light, widely spaced capitals that run the full width of the
 * name. The descriptor's letters are spread edge to edge with flexbox, so the
 * two lines always line up whatever the size.
 */
const DESCRIPTOR = 'Brand Strategist'

export default function Logo({ size = 'lg', className = 'text-accent' }: { size?: 'lg' | 'md' | 'sm'; className?: string }) {
  const lg = size === 'lg'
  const md = size === 'md'
  return (
    <span
      role="img"
      aria-label={`${site.name}, ${DESCRIPTOR}`}
      className={`inline-flex flex-col uppercase select-none ${className}`}
    >
      <span
        aria-hidden
        className={`font-bold leading-none ${
          lg
            ? 'text-[2.75rem] tracking-[0.12em] sm:text-[4.25rem]'
            : md
              ? 'text-[1.375rem] tracking-[0.12em] sm:text-[2rem]'
              : 'text-[1.25rem] tracking-[0.12em]'
        }`}
        // Trim the trailing letter-spacing so the right edges align.
        style={{ marginRight: '-0.12em' }}
      >
        {site.name}
      </span>
      <span
        aria-hidden
        className={`flex justify-between font-normal leading-none ${
          lg
            ? 'mt-3 text-[0.8125rem] sm:mt-4 sm:text-[1.0625rem]'
            : md
              ? 'mt-1.5 text-[0.5625rem] sm:mt-2 sm:text-[0.8125rem]'
              : 'mt-1.5 text-[0.5rem]'
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

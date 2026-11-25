// Google Analytics 4. The Measurement ID is public by design (it ships in the
// page), so it lives here rather than in a secret. Tracking runs on the live
// site only, so preview checks don't count as visits.

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? 'G-6THFCCHT02'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * Records an event, such as a chat question or a case card click.
 * Never pass what a visitor typed: only counts, labels and page paths.
 */
export function track(name: string, params: Record<string, string | number> = {}) {
  if (typeof window !== 'undefined') window.gtag?.('event', name, params)
}

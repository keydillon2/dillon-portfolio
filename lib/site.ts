// Site-wide facts used in metadata, share images, the sitemap and the footer.

export const site = {
  name: 'Dillon Key',
  role: 'Senior Strategist',
  // From the LinkedIn intro; used as the default description and share text.
  summary:
    "I'm a Senior Strategist at Prosek Partners in New York. I work with brands that have complex products and multiple stakeholders.",
  email: 'dillon.key@gmail.com',
  linkedin: 'https://www.linkedin.com/in/dillon-key/',
}

// The canonical address. dillonkey.com redirects here (set in Vercel).
const PRODUCTION_URL = 'https://www.dillonkey.com'

/** Absolute site URL: the real domain in production, the preview URL on previews. */
export function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  if (process.env.VERCEL_ENV === 'production') return PRODUCTION_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:3000'
}

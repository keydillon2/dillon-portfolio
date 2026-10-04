// Site-wide facts used in metadata, share images, the sitemap and the footer.

export const site = {
  name: 'Dillon Key',
  role: 'Senior Strategist',
  // From the resume; used as the home page lede and the default description.
  lede: 'I partner with CEOs and CMOs to uncover new ways to create value and compete.',
  email: 'dillon.key@gmail.com',
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

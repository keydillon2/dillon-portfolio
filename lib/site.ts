// Site-wide facts used in metadata, share images, the sitemap and the footer.

export const site = {
  name: 'Dillon Key',
  role: 'Senior Strategist',
  // From the resume; used as the home page lede and the default description.
  lede: 'I partner with CEOs and CMOs to uncover new ways to create value and compete.',
  email: 'dillon.key@gmail.com',
}

/** Absolute site URL. Set NEXT_PUBLIC_SITE_URL once a custom domain is live. */
export function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  return 'http://localhost:3000'
}

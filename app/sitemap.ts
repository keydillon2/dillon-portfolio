import type { MetadataRoute } from 'next'
import { getCaseStudies } from '@/sanity/lib/caseStudies'
import { siteUrl } from '@/lib/site'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl()
  const cases = await getCaseStudies()
  return [
    { url: base, changeFrequency: 'monthly', priority: 1 },
    ...cases.map((cs) => ({ url: `${base}/work/${cs.slug}`, changeFrequency: 'monthly' as const, priority: 0.8 })),
  ]
}

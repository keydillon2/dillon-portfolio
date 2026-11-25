import type { MetadataRoute } from 'next'
import { getCaseStudies, type SanityImage } from '@/sanity/lib/caseStudies'
import { urlFor } from '@/sanity/lib/image'
import { siteUrl } from '@/lib/site'

export const revalidate = 3600

// Google ignores changefreq and priority; it uses lastmod (when accurate) and
// image entries, which make case images eligible for Google Images.
const imageUrl = (img?: SanityImage) => (img?.asset ? urlFor(img).width(1600).auto('format').url() : null)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl()
  const cases = await getCaseStudies()
  const latest = cases.map((cs) => cs._updatedAt).filter(Boolean).sort().at(-1)
  return [
    { url: base, lastModified: latest, images: cases.map((cs) => imageUrl(cs.cardImage ?? cs.coverImage)).filter((u): u is string => !!u) },
    { url: `${base}/resume` },
    ...cases.map((cs) => ({
      url: `${base}/work/${cs.slug}`,
      lastModified: cs._updatedAt,
      images: [cs.coverImage, ...(cs.gallery ?? [])].map(imageUrl).filter((u): u is string => !!u),
    })),
  ]
}

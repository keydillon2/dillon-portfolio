import { renderOg, ogSize } from '@/lib/og'
import { getCaseStudies, getCaseStudy } from '@/sanity/lib/caseStudies'

export const alt = 'Case study'
export const size = ogSize
export const contentType = 'image/png'
export const revalidate = 60

export async function generateStaticParams() {
  const all = await getCaseStudies()
  return all.map((cs) => ({ slug: cs.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const found = await getCaseStudy(slug)
  const cs = found?.cs
  return renderOg({
    eyebrow: cs ? [cs.client, cs.title].filter(Boolean).join(', ') : 'Case study',
    headline: cs?.hook ?? cs?.title ?? 'Case study',
  })
}

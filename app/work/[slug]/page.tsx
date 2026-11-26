import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCaseStudies, getCaseStudy, type CaseStudy, type SanityImage } from '@/sanity/lib/caseStudies'
import { jsonLd } from '@/lib/structuredData'
import { siteUrl } from '@/lib/site'
import { urlFor } from '@/sanity/lib/image'
import BriefReframe from '../../components/BriefReframe'
import Diagram from '../../components/Diagram'
import Figures from '../../components/Figures'
import ReasoningChain from '../../components/ReasoningChain'

export const revalidate = 60

const DISPLAY = 'text-[2.125rem] leading-[1.08] font-semibold tracking-[-0.03em] sm:text-[3.5rem] text-balance'

export async function generateStaticParams() {
  const all = await getCaseStudies()
  return all.map((cs) => ({ slug: cs.slug }))
}

export async function generateMetadata(props: PageProps<'/work/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params
  const found = await getCaseStudy(slug)
  if (!found) return {}
  const { cs } = found
  const description = caseDescription(cs)
  const image = cs.coverImage?.asset ? urlFor(cs.coverImage).width(1200).height(630).fit('crop').auto('format').url() : undefined
  return {
    title: `${cs.client}: ${cs.title}`,
    description,
    alternates: { canonical: `/work/${cs.slug}` },
    openGraph: {
      title: `${cs.client}: ${cs.title}`,
      description,
      type: 'article',
      ...(image ? { images: [{ url: image, width: 1200, height: 630, alt: cs.coverImage?.alt ?? '' }] } : {}),
    },
  }
}

/** A search-result description: the client, the skills, then the headline, within ~160 characters. */
function caseDescription(cs: CaseStudy) {
  const skills = cs.skills?.length ? `${cs.skills.slice(0, 2).join(' and ')} for ${cs.client}. ` : `${cs.client} case study. `
  const text = `${skills}${cs.headline ?? cs.reframe ?? ''}`
  return text.length > 160 ? `${text.slice(0, 157).replace(/\s+\S*$/, '')}…` : text
}

function Picture({ image, sizes, priority }: { image: SanityImage; sizes: string; priority?: boolean }) {
  const dims = image.asset?.metadata?.dimensions
  if (!image.asset || !dims) return null
  return (
    <Image
      src={urlFor(image).width(Math.min(2400, dims.width)).auto('format').url()}
      width={dims.width}
      height={dims.height}
      alt={image.alt ?? ''}
      sizes={sizes}
      priority={priority}
      className="h-auto w-full rounded-[10px] bg-wash"
    />
  )
}

export default async function CasePage(props: PageProps<'/work/[slug]'>) {
  const { slug } = await props.params
  const found = await getCaseStudy(slug)
  if (!found) notFound()
  const { cs, next } = found
  const meta = [cs.client, cs.industry].filter(Boolean).join(', ')

  return (
    <main className="mx-auto w-full max-w-6xl px-6 pt-32 pb-24 sm:pt-40">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: `${cs.client}: ${cs.title}`,
          headline: cs.headline ?? cs.title,
          description: caseDescription(cs),
          url: `${siteUrl()}/work/${cs.slug}`,
          ...(cs.publishedAt ? { datePublished: cs.publishedAt } : {}),
          ...(cs._updatedAt ? { dateModified: cs._updatedAt } : {}),
          ...(cs.coverImage?.asset ? { image: urlFor(cs.coverImage).width(1600).auto('format').url() } : {}),
          about: { '@type': 'Organization', name: cs.client },
          keywords: cs.skills?.join(', '),
          author: { '@id': `${siteUrl()}/#person` },
          creator: { '@id': `${siteUrl()}/#person` },
        })}
      />
      <nav aria-label="Breadcrumb" className="text-meta">
        <Link href="/#work" className="text-muted underline-offset-4 hover:text-ink hover:underline">
          Work
        </Link>
        <span aria-hidden className="mx-2 text-rule">/</span>
        <span className="text-ink">{cs.title}</span>
      </nav>

      <header className="mt-10 max-w-4xl sm:mt-14">
        <p className="text-meta text-muted">{meta}</p>
        {cs.headline ? (
          <>
            <h1 className="mt-2 text-meta font-medium text-ink">{cs.title}</h1>
            <p className={`mt-6 ${DISPLAY}`}>{cs.headline}</p>
          </>
        ) : (
          <h1 className={`mt-4 ${DISPLAY}`}>{cs.title}</h1>
        )}
      </header>

      {(cs.brief && cs.reframe) && (
        <div className="mt-16 sm:mt-20">
          <BriefReframe brief={cs.brief} reframe={cs.reframe} />
        </div>
      )}

      {(cs.role || cs.contribution || cs.figures?.length) && (
        <section aria-label="Role and figures" className="mt-16 grid gap-10 border-t border-rule pt-10 md:grid-cols-[1fr_1.35fr] md:gap-16">
          {(cs.role || cs.contribution) && (
            <div>
              <h2 className="text-meta font-medium text-muted">My role</h2>
              {cs.role && <p className="mt-2 font-medium">{cs.role}</p>}
              {cs.contribution && <p className="mt-2 text-muted text-pretty">{cs.contribution}</p>}
            </div>
          )}
          {cs.figures?.length ? (
            <div>
              <h2 className="sr-only">Figures</h2>
              <Figures figures={cs.figures} />
            </div>
          ) : null}
        </section>
      )}

      {cs.coverImage && (
        <div className="mt-16">
          <Picture image={cs.coverImage} sizes="(min-width: 1024px) 64rem, 100vw" priority />
        </div>
      )}

      {cs.diagram?.kind && (
        <div className="mt-16">
          <Diagram data={cs.diagram} />
        </div>
      )}

      <section aria-labelledby="full-case" className="mt-20">
        <h2 id="full-case" className="text-[1.375rem] font-semibold tracking-[-0.015em]">
          The full case
        </h2>
        <div className="mt-8">
          <ReasoningChain cs={cs} />
        </div>
      </section>

      {cs.gallery && cs.gallery.length > 0 && (
        // Landscape images run the full width so their detail is legible;
        // portrait images pair up side by side.
        <div className="mt-20 grid gap-x-6 gap-y-12 sm:grid-cols-2">
          {cs.gallery.map((img) => {
            const dims = img.asset?.metadata?.dimensions
            const wide = !dims || dims.width >= dims.height
            return (
              <figure key={img._key} className={wide ? 'sm:col-span-2' : undefined}>
                {img.asset ? (
                  <a
                    href={urlFor(img).auto('format').url()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block cursor-zoom-in"
                  >
                    <Picture image={img} sizes={wide ? '(min-width: 1024px) 64rem, 100vw' : '(min-width: 640px) 32rem, 100vw'} />
                    <span className="sr-only"> (open full size in a new tab)</span>
                  </a>
                ) : null}
                {img.caption && <figcaption className="mt-3 text-meta text-muted">{img.caption}</figcaption>}
              </figure>
            )
          })}
        </div>
      )}

      {next && (
        <nav aria-label="Next case study" className="mt-24 border-t border-rule pt-10">
          <Link href={`/work/${next.slug}`} className="group block">
            <span className="text-meta text-muted">Next: {next.client}</span>
            <span className="mt-2 block max-w-3xl text-[1.5rem] leading-[1.2] font-semibold tracking-[-0.02em] text-balance transition-colors group-hover:text-accent sm:text-[1.875rem]">
              {next.headline ?? next.title}
            </span>
          </Link>
        </nav>
      )}
    </main>
  )
}

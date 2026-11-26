import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { getCaseStudies, getCaseStudy, type CaseStudy, type SanityImage } from '@/sanity/lib/caseStudies'
import { jsonLd } from '@/lib/structuredData'
import { siteUrl } from '@/lib/site'
import { urlFor } from '@/sanity/lib/image'
import Diagram from '../../components/Diagram'
import ReasoningChain from '../../components/ReasoningChain'
import DarkZone from '../../components/DarkZone'
import { ViewTransition } from 'react'

export const revalidate = 60

const DISPLAY = 'font-serif text-[2.25rem] leading-[1.08] font-semibold tracking-[-0.015em] sm:text-[3.5rem] text-balance'

// The left column used by the overview and the full case, so they line up.
const COLS = 'md:grid-cols-[15rem_1fr] md:gap-16'

function Meta({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-muted">{label}</dt>
      <dd className="mt-1 text-ink">{children}</dd>
    </div>
  )
}

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
        <Link href="/work" className="text-muted underline-offset-4 hover:text-ink hover:underline">
          <span aria-hidden>← </span>All work
        </Link>
      </nav>

      <header className="mt-10 max-w-5xl sm:mt-14">
        <h1 className="text-meta text-muted">
          <span className="font-medium text-ink">{cs.client}</span>
          {cs.headline && <span> · {cs.title}</span>}
        </h1>
        <p className={`mt-4 ${DISPLAY}`}>{cs.headline ?? cs.title}</p>
      </header>

      {/*
        The facts a hiring manager scans for, in one place: a metadata column
        beside the reframe, with the brief and my role underneath it.
      */}
      <section aria-label="Overview" className={`mt-14 grid gap-10 border-t border-rule pt-10 sm:mt-16 ${COLS}`}>
        <dl className="grid content-start gap-6 text-meta sm:grid-cols-2 md:grid-cols-1">
          {cs.client && <Meta label="Client">{cs.client}</Meta>}
          {cs.industry && <Meta label="Industry">{cs.industry}</Meta>}
          {cs.role && <Meta label="Role">{cs.role}</Meta>}
          {cs.skills?.length ? (
            <Meta label="Skills">
              <ul className="space-y-0.5">
                {cs.skills.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </Meta>
          ) : null}
        </dl>

        <div className="min-w-0">
          {cs.reframe && (
            <>
              <h2 className="text-meta font-medium text-accent">The reframe</h2>
              <p className="mt-3 font-serif text-[1.5rem] leading-[1.35] text-pretty sm:text-[2rem]">{cs.reframe}</p>
            </>
          )}
          {(cs.brief || cs.contribution) && (
            <div className="mt-10 grid gap-8 border-t border-rule pt-8 sm:grid-cols-2">
              {cs.brief && (
                <div>
                  <h2 className="text-meta font-medium text-muted">The brief</h2>
                  <p className="mt-2 text-muted text-pretty">{cs.brief}</p>
                </div>
              )}
              {cs.contribution && (
                <div>
                  <h2 className="text-meta font-medium text-muted">My role</h2>
                  <p className="mt-2 text-pretty">{cs.contribution}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {cs.coverImage && (
        <div className="mt-16">
          <ViewTransition name={`case-${cs.slug}`} share="morph" default="none">
            <div>
              <Picture image={cs.coverImage} sizes="(min-width: 1024px) 64rem, 100vw" priority />
            </div>
          </ViewTransition>
        </div>
      )}

      {cs.diagram?.kind && (
        <div className="mt-16">
          <Diagram data={cs.diagram} />
        </div>
      )}

      <section aria-labelledby="full-case" className="mt-20">
        <h2 id="full-case" className="border-t border-rule pt-10 text-[1.375rem] font-semibold tracking-[-0.015em]">
          The full case
        </h2>
        <div className="mt-8">
          <ReasoningChain cs={cs} cols={COLS} />
        </div>
      </section>

      <DarkZone className="mt-20 pb-4">
      {cs.gallery && cs.gallery.length > 0 && (
        // Landscape images run the full width so their detail is legible;
        // portrait images pair up side by side.
        <div className="pt-4 grid gap-x-6 gap-y-12 sm:grid-cols-2">
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
      </DarkZone>
    </main>
  )
}

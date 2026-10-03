import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCaseStudies, getCaseStudy, type SanityImage } from '@/sanity/lib/caseStudies'
import { urlFor } from '@/sanity/lib/image'
import { site } from '@/lib/site'
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
  const description = cs.hook ?? cs.reframe ?? cs.businessProblem?.slice(0, 160)
  return {
    title: `${cs.title}, ${cs.client} — ${site.name}`,
    description,
    alternates: { canonical: `/work/${cs.slug}` },
    openGraph: { title: `${cs.title} · ${cs.client}`, description, type: 'article' },
  }
}

function Picture({ image, sizes, priority }: { image: SanityImage; sizes: string; priority?: boolean }) {
  const dims = image.asset?.metadata?.dimensions
  if (!image.asset || !dims) return null
  return (
    <Image
      src={urlFor(image).width(1800).auto('format').url()}
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
    <main className="mx-auto w-full max-w-5xl px-6 pt-10 pb-24">
      <nav aria-label="Breadcrumb" className="text-meta">
        <Link href="/#work" className="text-muted underline-offset-4 hover:text-ink hover:underline">
          {site.name}
        </Link>
        <span aria-hidden className="mx-2 text-rule">/</span>
        <span className="text-ink">{cs.title}</span>
      </nav>

      <header className="mt-16 max-w-4xl sm:mt-24">
        <p className="text-meta text-muted">{meta}</p>
        {cs.hook ? (
          <>
            <h1 className="mt-2 text-meta font-medium text-ink">{cs.title}</h1>
            <p className={`mt-6 ${DISPLAY}`}>{cs.hook}</p>
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
        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {cs.gallery.map((img) => (
            <figure key={img._key}>
              <Picture image={img} sizes="(min-width: 640px) 32rem, 100vw" />
              {img.caption && <figcaption className="mt-2 text-meta text-muted">{img.caption}</figcaption>}
            </figure>
          ))}
        </div>
      )}

      {next && (
        <nav aria-label="Next case study" className="mt-24 border-t border-rule pt-10">
          <Link href={`/work/${next.slug}`} className="group block">
            <span className="text-meta text-muted">Next: {next.client}</span>
            <span className="mt-2 block max-w-3xl text-[1.5rem] leading-[1.2] font-semibold tracking-[-0.02em] text-balance transition-colors group-hover:text-accent sm:text-[1.875rem]">
              {next.hook ?? next.title}
            </span>
          </Link>
        </nav>
      )}
    </main>
  )
}

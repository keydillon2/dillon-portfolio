import Link from 'next/link'
import CaseGrid from './components/CaseGrid'
import { getCaseStudies } from '@/sanity/lib/caseStudies'
import HashRedirect from './components/HashRedirect'

// Revalidate at most once a minute so Sanity edits surface without a redeploy.
export const revalidate = 60

export default async function Home() {
  const caseStudies = await getCaseStudies()

  return (
    <main className="mx-auto w-full max-w-6xl px-6 pt-32 pb-24 sm:pt-48">
      <HashRedirect slugs={caseStudies.map((cs) => cs.slug)} />

      <header className="max-w-3xl">
        {/* The pinned wordmark is the visual title; this keeps the page's heading for search and screen readers. */}
        <h1 className="sr-only">Dillon Key, Brand Strategist</h1>
        <div className="max-w-[62ch] space-y-4 text-[1.125rem] leading-[1.6]">
          <p>
            I&rsquo;m a Senior Strategist at Prosek Partners in New York. I work
            with brands that have complex products and multiple stakeholders.
            From global asset managers, family offices, and private market firms
            (VC, growth, PE, RE) &mdash; my work clarifies complexity to unlock
            audience insight, shape strategic decisions, and create commercial
            value.
          </p>
        </div>
        <p className="mt-6 flex gap-6 text-meta">
          <Link href="/about" className="text-ink underline decoration-rule underline-offset-4 hover:decoration-accent">
            About me
          </Link>
          <Link href="/resume" className="text-ink underline decoration-rule underline-offset-4 hover:decoration-accent">
            View resume
          </Link>
        </p>
      </header>

      <section id="work" aria-labelledby="work-heading" className="mt-24 scroll-mt-10">
        <h2 id="work-heading" className="text-meta font-medium text-muted">
          Selected work
        </h2>

        {caseStudies.length === 0 ? (
          <p className="mt-6 text-muted">
            No case studies published yet. Add one in{' '}
            <Link className="text-accent underline underline-offset-4" href="/studio">
              the Studio
            </Link>
            .
          </p>
        ) : (
          <div className="mt-6">
            <CaseGrid cases={caseStudies} />
          </div>
        )}
      </section>
    </main>
  )
}

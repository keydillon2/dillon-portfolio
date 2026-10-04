import Link from 'next/link'
import { getCaseStudies } from '@/sanity/lib/caseStudies'
import { site } from '@/lib/site'
import Figures from './components/Figures'
import HashRedirect from './components/HashRedirect'

// Revalidate at most once a minute so Sanity edits surface without a redeploy.
export const revalidate = 60

export default async function Home() {
  const caseStudies = await getCaseStudies()

  return (
    <main className="mx-auto w-full max-w-5xl px-6 pt-20 pb-24 sm:pt-28">
      <HashRedirect slugs={caseStudies.map((cs) => cs.slug)} />

      <header className="max-w-3xl">
        <h1 className="text-[2.5rem] leading-none font-semibold tracking-[-0.03em] sm:text-name">
          {site.name}
        </h1>
        <div className="mt-8 max-w-[62ch] space-y-4 text-[1.125rem] leading-[1.6]">
          <p>
            I&rsquo;m a Senior Strategist at Prosek Partners in New York. I work
            with brands that have complex products and multiple stakeholders.
            From global asset managers, family offices, and private market firms
            (VC, growth, PE, RE) &mdash; my work clarifies complexity to unlock
            audience insight, shape strategic decisions, and create commercial
            value.
          </p>
          <p className="text-muted">
            I started in client services and came to strategy through VCU
            Brandcenter. Since then I&rsquo;ve worked across small, medium, and
            global agencies with brands like Diageo, American Express, and
            Apollo Global Management, mostly across finance, enterprise tech,
            and healthcare.
          </p>
        </div>
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
          <ol className="mt-4 border-t border-rule">
            {caseStudies.map((cs) => (
              <li key={cs._id} className="border-b border-rule">
                <Link
                  href={`/work/${cs.slug}`}
                  className="case-row group grid gap-4 py-10 md:grid-cols-[13rem_1fr] md:gap-10"
                >
                  <div className="text-meta">
                    <p className="font-medium text-ink">{cs.client}</p>
                    {cs.headline && <p className="text-muted">{cs.title}</p>}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[1.5rem] leading-[1.2] font-semibold tracking-[-0.02em] sm:text-[1.875rem] text-balance transition-colors group-hover:text-accent">
                      {cs.headline ?? cs.title}
                    </p>
                    {cs.reframe && (
                      <p className="mt-3 max-w-[60ch] text-muted text-pretty">{cs.reframe}</p>
                    )}
                    {cs.figures?.length ? (
                      <div className="mt-6">
                        <Figures figures={cs.figures.slice(0, 3)} compact />
                      </div>
                    ) : null}
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  )
}

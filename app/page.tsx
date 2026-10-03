import { client } from '@/sanity/lib/client'
import CaseStudyNav, { type NavItem } from './components/CaseStudyNav'

// Revalidate at most once a minute so Sanity edits surface without a redeploy.
export const revalidate = 60

interface CaseStudy {
  _id: string
  title: string
  client?: string
  industry?: string
  businessProblem?: string
  strategicInsight?: string
  slug?: { current: string }
}

const CASE_STUDIES_QUERY = `*[_type == "caseStudy"] | order(publishedAt desc) {
  _id,
  title,
  client,
  industry,
  businessProblem,
  strategicInsight,
  slug
}`

export default async function Home() {
  const caseStudies = await client.fetch<CaseStudy[]>(CASE_STUDIES_QUERY)

  const navItems: NavItem[] = caseStudies.map((cs, i) => ({
    id: `work-${cs.slug?.current ?? cs._id}`,
    index: String(i + 1).padStart(2, '0'),
    title: cs.title,
    client: cs.client,
  }))

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 font-sans">
      <header className="mb-12 max-w-3xl">
        <h1 className="text-4xl font-semibold">Dillon Key</h1>
        <div className="mt-4 max-w-2xl space-y-4 text-lg leading-relaxed text-zinc-800">
          <p>
            I&rsquo;m a Senior Strategist at Prosek Partners in New York. I work
            with brands that have complex products and multiple stakeholders.
            From global asset managers, family offices, and private market firms
            (VC, growth, PE, RE) &mdash; my work clarifies complexity to unlock
            audience insight, shape strategic decisions, and create commercial
            value.
          </p>
          <p>
            I started in client services and came to strategy through VCU
            Brandcenter. Since then I&rsquo;ve worked across small, medium, and
            global agencies with brands like Diageo, American Express, and
            Apollo, mostly across finance, enterprise tech, and healthcare.
          </p>
        </div>
      </header>

      <div className="lg:flex lg:items-start lg:gap-12">
        <CaseStudyNav items={navItems} />

        <section aria-label="Selected work" className="min-w-0 flex-1 max-w-3xl">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-600">
            Selected Work
          </h2>

        {caseStudies.length === 0 ? (
          <p className="text-zinc-600">
            No case studies published yet. Add one in <a className="underline" href="/studio">the Studio</a>.
          </p>
        ) : (
          <ul className="mt-6 space-y-10">
            {caseStudies.map((cs, i) => (
              <li
                key={cs._id}
                id={navItems[i].id}
                className="border-t border-zinc-200 pt-8 scroll-mt-24"
              >
                <p className="text-sm uppercase tracking-widest text-zinc-600">
                  {[cs.client, cs.industry].filter(Boolean).join(' — ')}
                </p>
                <h2 className="mt-1 text-2xl font-semibold">{cs.title}</h2>
                {cs.businessProblem && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-600">
                      Business problem
                    </h3>
                    <p className="mt-1 text-zinc-800">{cs.businessProblem}</p>
                  </div>
                )}
                {cs.strategicInsight && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-600">
                      Strategic insight
                    </h3>
                    <p className="mt-1 text-zinc-800">{cs.strategicInsight}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
        </section>
      </div>
    </main>
  )
}

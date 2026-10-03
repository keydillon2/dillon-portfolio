import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import CaseStudyNav, { type NavItem } from './components/CaseStudyNav'
import CaseStudy, { type CaseStudyData } from './components/CaseStudy'

// Revalidate at most once a minute so Sanity edits surface without a redeploy.
export const revalidate = 60

// Image fields pull asset dimensions so next/image can reserve space (no layout shift).
const IMAGE_FIELDS = `alt, caption, asset->{ _id, metadata { dimensions { width, height } } }`

const CASE_STUDIES_QUERY = `*[_type == "caseStudy"] | order(publishedAt desc) {
  _id,
  title,
  client,
  industry,
  businessProblem,
  strategicInsight,
  framework,
  decisionProcess,
  execution,
  coverImage { ${IMAGE_FIELDS} },
  gallery[] { _key, ${IMAGE_FIELDS} },
  slug
}`

export default async function Home() {
  const caseStudies = await client.fetch<CaseStudyData[]>(CASE_STUDIES_QUERY)

  const navItems: NavItem[] = caseStudies.map((cs) => ({
    id: `work-${cs.slug?.current ?? cs._id}`,
    title: cs.title,
    client: cs.client,
  }))

  return (
    <main className="mx-auto w-full max-w-6xl px-6 pt-20 pb-32">
      <header className="mb-20 max-w-3xl">
        <h1 className="text-[2.5rem] leading-none sm:text-name font-semibold tracking-[-0.03em]">
          Dillon Key
        </h1>
        <div className="mt-8 max-w-[62ch] space-y-4">
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

      <div className="lg:flex lg:items-start lg:gap-16">
        <CaseStudyNav items={navItems} />

        <section aria-labelledby="work-heading" className="min-w-0 flex-1 max-w-3xl">
          <h2 id="work-heading" className="sr-only">
            Selected work
          </h2>

          {caseStudies.length === 0 ? (
            <p className="text-muted">
              No case studies published yet. Add one in{' '}
              <Link className="text-accent underline underline-offset-4" href="/studio">
                the Studio
              </Link>
              .
            </p>
          ) : (
            <div className="space-y-20">
              {caseStudies.map((cs, i) => (
                <CaseStudy key={cs._id} cs={cs} id={navItems[i].id} first={i === 0} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

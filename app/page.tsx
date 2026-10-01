import { client } from '@/sanity/lib/client'

// Revalidate at most once a minute so Sanity edits surface without a redeploy.
export const revalidate = 60

interface CaseStudy {
  _id: string
  title: string
  client?: string
  industry?: string
  businessProblem?: string
  strategicInsight?: string
}

const CASE_STUDIES_QUERY = `*[_type == "caseStudy"] | order(publishedAt desc) {
  _id,
  title,
  client,
  industry,
  businessProblem,
  strategicInsight
}`

export default async function Home() {
  const caseStudies = await client.fetch<CaseStudy[]>(CASE_STUDIES_QUERY)

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 font-sans">
      <header className="mb-12">
        <p className="text-sm uppercase tracking-widest text-zinc-500">Dillon — Strategy Portfolio</p>
        <h1 className="mt-2 text-4xl font-semibold">Selected Work</h1>
        <p className="mt-3 text-zinc-600">
          Case studies served live from structured content. Edit in the CMS, see it here.
        </p>
      </header>

      {caseStudies.length === 0 ? (
        <p className="text-zinc-500">
          No case studies published yet. Add one in <a className="underline" href="/studio">the Studio</a>.
        </p>
      ) : (
        <ul className="space-y-10">
          {caseStudies.map((cs) => (
            <li key={cs._id} className="border-t border-zinc-200 pt-8">
              <p className="text-sm uppercase tracking-widest text-zinc-500">
                {[cs.client, cs.industry].filter(Boolean).join(' — ')}
              </p>
              <h2 className="mt-1 text-2xl font-semibold">{cs.title}</h2>
              {cs.businessProblem && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
                    Business problem
                  </h3>
                  <p className="mt-1 text-zinc-700">{cs.businessProblem}</p>
                </div>
              )}
              {cs.strategicInsight && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
                    Strategic insight
                  </h3>
                  <p className="mt-1 text-zinc-700">{cs.strategicInsight}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

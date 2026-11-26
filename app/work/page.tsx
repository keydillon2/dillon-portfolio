import type { Metadata } from 'next'
import { getCaseStudies } from '@/sanity/lib/caseStudies'
import CaseGrid from '../components/CaseGrid'
import HoverList from '../components/HoverList'
import WorkViews from '../components/WorkViews'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Work',
  description: 'Case studies by brand strategist Dillon Key: positioning, messaging and narrative for HSFT, American Express, Apollo, Fetch, Hackensack Meridian Health and Diageo.',
  alternates: { canonical: '/work' },
}

export default async function WorkPage() {
  const cases = await getCaseStudies()
  return (
    <main className="mx-auto w-full max-w-6xl px-6 pt-32 pb-24 sm:pt-44">
      <h1 className="text-meta font-medium text-muted">Work</h1>
      <div className="mt-8">
        <WorkViews
          grid={<CaseGrid cases={cases} />}
          list={
            <HoverList
              label="Case studies"
              items={cases.map((cs) => ({
                key: cs._id,
                href: `/work/${cs.slug}`,
                title: cs.client,
                detail: cs.headline ?? cs.title,
                meta: cs.skills?.slice(0, 2).join(' · '),
              }))}
            />
          }
        />
      </div>
    </main>
  )
}

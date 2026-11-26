import type { Metadata } from 'next'
import Link from 'next/link'
import { resume } from '@/lib/resumeData'
import { site } from '@/lib/site'
import HoverList from '../components/HoverList'

export const metadata: Metadata = {
  title: 'About',
  description: `About ${site.name}, a New York brand strategist: positioning, messaging and narrative for complex brands in financial services, enterprise tech, healthcare and consumer.`,
  alternates: { canonical: '/about' },
}

const LINK = 'text-ink underline decoration-rule underline-offset-4 hover:decoration-accent'

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 pt-32 pb-24 sm:pt-44">
      <h1 className="text-meta font-medium text-muted">About</h1>
      <p className="mt-4 max-w-[24ch] text-[2rem] leading-[1.1] font-semibold tracking-[-0.03em] sm:text-[3.25rem] text-balance">
        I help companies with complex products decide what to stand for and how to say it.
      </p>

      <div className="mt-16 grid gap-10 md:grid-cols-[1fr_1.6fr] md:gap-16">
        <p className="text-meta text-muted">Background</p>
        <div className="max-w-[62ch] space-y-4 text-[1.125rem] leading-[1.6]">
          <p>
            I&rsquo;m a Senior Strategist at Prosek Partners in New York. I work with brands that have complex products and
            multiple stakeholders, from global asset managers, family offices and private market firms to enterprise tech,
            healthcare and consumer brands.
          </p>
          <p className="text-muted">{resume.summary}</p>
          <p className="flex flex-wrap gap-x-6 gap-y-2 text-meta">
            <Link className={LINK} href="/resume">
              Full resume
            </Link>
            <a className={LINK} href={`mailto:${site.email}`}>
              {site.email}
            </a>
            <a className={LINK} href={site.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
        </div>
      </div>

      <section aria-labelledby="experience" className="mt-24">
        <h2 id="experience" className="text-meta font-medium text-muted">
          Experience
        </h2>
        <div className="mt-6">
          <HoverList
            label="Experience"
            items={resume.roles.map((r) => ({
              key: r.company + r.years,
              href: '/resume',
              title: r.company,
              detail: `${r.title}. ${r.focus}`,
              meta: r.years,
            }))}
          />
        </div>
      </section>

      <section aria-labelledby="education" className="mt-24">
        <h2 id="education" className="text-meta font-medium text-muted">
          Education
        </h2>
        <ul className="mt-6 space-y-3">
          {resume.education.map((e) => (
            <li key={e.school} className="grid gap-1 sm:grid-cols-[1fr_auto] sm:gap-x-6">
              <p>
                <span className="font-medium">{e.school}</span>, {e.degree}
              </p>
              <p className="text-meta text-muted sm:text-right">{e.years}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

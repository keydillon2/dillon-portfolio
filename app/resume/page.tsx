import type { Metadata } from 'next'
import Link from 'next/link'
import { site } from '@/lib/site'
import { resume } from '@/lib/resumeData'

export const metadata: Metadata = {
  title: 'Resume',
  description: `Resume of ${site.name}, a New York brand strategist: positioning, messaging and product marketing for financial services, enterprise tech and consumer brands.`,
  alternates: { canonical: '/resume' },
}

const LINK = 'underline decoration-rule underline-offset-4 hover:text-accent hover:decoration-accent'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-4 border-t border-rule pt-8 md:grid-cols-[13rem_1fr] md:gap-10">
      <h2 className="text-meta font-medium text-muted">{title}</h2>
      <div className="min-w-0">{children}</div>
    </section>
  )
}

export default function ResumePage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 pt-32 pb-24 sm:pt-44">
      <header>
        <h1 className="text-[2.5rem] leading-none font-semibold tracking-[-0.03em] sm:text-name">Resume</h1>
        <p className="mt-4 text-[1.125rem]">
          {site.role}, Prosek Partners <span className="text-muted">· New York</span>
        </p>
        <p className="mt-6 max-w-[62ch] text-muted text-pretty">{resume.summary}</p>
        <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-meta">
          <a className={LINK} href={`mailto:${site.email}`}>
            {site.email}
          </a>
          <a className={LINK} href={site.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </p>
      </header>

      <div className="mt-16 space-y-10">
        <Section title="What I do">
          <ul className="grid gap-8 sm:grid-cols-3 sm:gap-6">
            {resume.practice.map((p) => (
              <li key={p.label}>
                <p className="font-medium">{p.label}</p>
                <p className="mt-1 text-muted text-pretty">{p.text}</p>
                <p className="mt-2 text-meta text-muted">{p.examples}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Experience">
          <ol className="space-y-12">
            {resume.roles.map((r) => (
              <li key={r.company + r.years}>
                <div className="grid gap-1 sm:grid-cols-[1fr_auto] sm:gap-x-6">
                  <p className="text-[1.125rem]">
                    <span className="font-medium">{r.title}</span>, {r.company}
                  </p>
                  <p className="text-meta text-muted sm:text-right sm:pt-[0.2rem]">
                    {r.years} · {r.place}
                  </p>
                </div>
                <p className="mt-1 max-w-[60ch] text-muted">{r.focus}</p>
                <ul className="mt-5 space-y-5">
                  {r.work.map((w) => (
                    <li key={w.client + w.tag} className="border-l-2 border-rule pl-4">
                      <p className="text-meta">
                        <span className="font-medium text-ink">
                          {w.slug ? (
                            <Link href={`/work/${w.slug}`} className={LINK}>
                              {w.client}
                            </Link>
                          ) : (
                            w.client
                          )}
                        </span>
                        <span className="text-muted"> · {w.tag}</span>
                      </p>
                      <p className="mt-1 max-w-[64ch] text-pretty">{w.text}</p>
                    </li>
                  ))}
                </ul>
                {r.more && <p className="mt-4 text-meta text-muted">{r.more}</p>}
              </li>
            ))}
          </ol>
        </Section>

        <Section title="Education">
          <ul className="space-y-3">
            {resume.education.map((e) => (
              <li key={e.school} className="grid gap-1 sm:grid-cols-[1fr_auto] sm:gap-x-6">
                <p>
                  <span className="font-medium">{e.school}</span>, {e.degree}
                </p>
                <p className="text-meta text-muted sm:text-right sm:pt-[0.15rem]">{e.years}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Skills">
          <dl className="space-y-3">
            {resume.skills.map((c) => (
              <div key={c.label} className="sm:grid sm:grid-cols-[11rem_1fr] sm:gap-4">
                <dt className="font-medium">{c.label}</dt>
                <dd className="text-muted">{c.items}</dd>
              </div>
            ))}
          </dl>
        </Section>
      </div>
    </main>
  )
}

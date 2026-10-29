import type { Metadata } from 'next'
import Link from 'next/link'
import { Fragment } from 'react'
import { site } from '@/lib/site'
import { resume, type Client } from '@/lib/resumeData'

export const metadata: Metadata = {
  title: `Resume — ${site.name}`,
  description: `${site.name}, ${site.role} at Prosek Partners. ${resume.summary}`,
  alternates: { canonical: '/resume' },
}

const LINK = 'underline decoration-rule underline-offset-4 hover:text-accent hover:decoration-accent'

function ClientName({ client }: { client: Client }) {
  return client.slug ? (
    <Link href={`/work/${client.slug}`} className={LINK}>
      {client.name}
    </Link>
  ) : (
    <>{client.name}</>
  )
}

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
    <main className="mx-auto w-full max-w-5xl px-6 pt-10 pb-24">
      <nav aria-label="Breadcrumb" className="text-meta">
        <Link href="/" className="text-muted underline-offset-4 hover:text-ink hover:underline">
          {site.name}
        </Link>
        <span aria-hidden className="mx-2 text-rule">/</span>
        <span className="text-ink">Resume</span>
      </nav>

      <header className="mt-16 sm:mt-24">
        <h1 className="text-[2.5rem] leading-none font-semibold tracking-[-0.03em] sm:text-name">{site.name}</h1>
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
        <Section title="Highlights">
          <ul className="space-y-4">
            {resume.highlights.map((h) => (
              <li key={h.client}>
                <p className="font-medium">
                  <ClientName client={{ name: h.client, slug: h.slug }} />
                </p>
                <p className="mt-1 max-w-[60ch] text-muted text-pretty">{h.text}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Experience">
          <ol className="space-y-7">
            {resume.roles.map((r) => (
              <li key={r.company + r.years} className="grid gap-1 sm:grid-cols-[1fr_auto] sm:gap-x-6">
                <p>
                  <span className="font-medium">{r.title}</span>, {r.company}
                </p>
                <p className="text-meta text-muted sm:text-right sm:pt-[0.15rem]">{r.years}</p>
                <p className="max-w-[60ch] text-muted sm:col-span-2">
                  {r.focus}
                  {r.clients?.length ? (
                    <>
                      {' '}
                      <span className="text-ink">
                        {r.clients.map((c, i) => (
                          <Fragment key={c.name}>
                            {i > 0 && ', '}
                            <ClientName client={c} />
                          </Fragment>
                        ))}
                      </span>
                    </>
                  ) : null}
                </p>
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

        <Section title="Capabilities">
          <dl className="space-y-3">
            {resume.capabilities.map((c) => (
              <div key={c.label} className="sm:grid sm:grid-cols-[9rem_1fr] sm:gap-4">
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

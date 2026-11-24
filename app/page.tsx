import Image from 'next/image'
import Link from 'next/link'
import CaseRow from './components/CaseRow'
import Logo from './components/Logo'
import { getCaseStudies, type CaseStudy } from '@/sanity/lib/caseStudies'
import { urlFor } from '@/sanity/lib/image'
import HashRedirect from './components/HashRedirect'

// Revalidate at most once a minute so Sanity edits surface without a redeploy.
export const revalidate = 60

/** The card image, or the cover image when there isn't one. */
function coverSrc(cs: CaseStudy) {
  const image = cs.cardImage?.asset ? cs.cardImage : cs.coverImage
  if (!image?.asset) return null
  return urlFor(image).width(1600).auto('format').url()
}

export default async function Home() {
  const caseStudies = await getCaseStudies()

  return (
    <main className="mx-auto w-full max-w-6xl px-6 pt-20 pb-24 sm:pt-28">
      <HashRedirect slugs={caseStudies.map((cs) => cs.slug)} />

      <header className="max-w-3xl">
        <h1>
          <Logo />
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
        </div>
        <p className="mt-6 text-meta">
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
          <ol className="mt-6 grid gap-x-8 gap-y-14 md:grid-cols-2">
            {caseStudies.map((cs) => (
              <li key={cs._id} className="flex">
                <CaseRow
                  href={`/work/${cs.slug}`}
                  className="group flex w-full flex-col gap-4"
                >
                  <div className="text-meta">
                    <p className="font-medium text-ink">{cs.client}</p>
                    {cs.headline && <p className="text-muted">{cs.title}</p>}
                  </div>
                  {/*
                    The preview image covers the copy. Hovering the image (or
                    focusing the link with a keyboard) fades it out to reveal it.
                    On touch screens the copy sits under the image instead.
                  */}
                  <div className="case-card case-card--compact min-w-0 flex-1">
                    <div className="case-card-sizer" aria-hidden />
                    <div className="case-card-cover" aria-hidden>
                      {coverSrc(cs) ? (
                        <Image
                          src={coverSrc(cs)!}
                          alt=""
                          fill
                          sizes="(min-width: 1152px) 34rem, (min-width: 768px) 50vw, 100vw"
                          className="object-cover"
                        />
                      ) : (
                        <p className="case-card-type">{cs.headline ?? cs.title}</p>
                      )}
                    </div>
                    <div className="case-card-copy">
                      <p className="text-[1.25rem] leading-[1.2] font-semibold tracking-[-0.02em] text-balance">
                        <Link href={`/work/${cs.slug}`} className="case-row" draggable={false}>
                          {cs.headline ?? cs.title}
                        </Link>
                      </p>
                      {cs.reframe && (
                        <p className="mt-3 text-[0.9375rem] leading-[1.55] text-muted text-pretty">{cs.reframe}</p>
                      )}
                      {cs.skills?.length ? (
                        <ul className="mt-5 flex flex-wrap gap-x-2 gap-y-1.5" aria-label="Skills">
                          {cs.skills.map((skill) => (
                            <li key={skill} className="rounded-full border border-rule px-2.5 py-0.5 text-[0.75rem] leading-5 text-muted">
                              {skill}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </div>
                </CaseRow>
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  )
}

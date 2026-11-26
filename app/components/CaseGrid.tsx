import Image from 'next/image'
import { ViewTransition } from 'react'
import Link from 'next/link'
import CaseRow from './CaseRow'
import { urlFor } from '@/sanity/lib/image'
import type { CaseStudy } from '@/sanity/lib/caseStudies'

/** The card image, or the cover image when there isn't one. */
function coverSrc(cs: CaseStudy) {
  const image = cs.cardImage?.asset ? cs.cardImage : cs.coverImage
  if (!image?.asset) return null
  return urlFor(image).width(1600).auto('format').url()
}

/*
 * The two-column grid of case cards. Each card shows its image; hovering the
 * image (or focusing the link) fades it out to reveal the headline, reframe
 * and skills. On touch screens the copy sits under the image instead.
 */
export default function CaseGrid({ cases }: { cases: CaseStudy[] }) {
  return (
    <ol className="grid gap-x-8 gap-y-14 md:grid-cols-2">
      {cases.map((cs) => {
        const src = coverSrc(cs)
        return (
          <li key={cs._id} className="flex">
            <CaseRow href={`/work/${cs.slug}`} className="group flex w-full flex-col gap-4">
              <div className="text-meta">
                <p className="font-medium text-ink">{cs.client}</p>
                {cs.headline && <p className="text-muted">{cs.title}</p>}
              </div>
              <div className="case-card case-card--compact min-w-0 flex-1">
                <div className="case-card-sizer" aria-hidden />
                <div className="case-card-cover" aria-hidden>
                  {src ? (
                    <ViewTransition name={cs.cardImage?.asset ? undefined : `case-${cs.slug}`} share="morph" default="none">
                      <Image src={src} alt="" fill sizes="(min-width: 1152px) 34rem, (min-width: 768px) 50vw, 100vw" className="object-cover" />
                    </ViewTransition>
                  ) : (
                    <p className="case-card-type">{cs.headline ?? cs.title}</p>
                  )}
                </div>
                <div className="case-card-copy">
                  <p className="font-serif text-[1.375rem] leading-[1.2] font-semibold tracking-[-0.01em] text-balance">
                    <Link href={`/work/${cs.slug}`} className="case-row" draggable={false}>
                      {cs.headline ?? cs.title}
                    </Link>
                  </p>
                  {cs.reframe && <p className="mt-3 text-[0.9375rem] leading-[1.55] text-muted text-pretty">{cs.reframe}</p>}
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
        )
      })}
    </ol>
  )
}

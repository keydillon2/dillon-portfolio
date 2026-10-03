import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

export interface SanityImage {
  asset?: { _ref?: string; metadata?: { dimensions?: { width: number; height: number } } }
  alt?: string
  caption?: string
}

export interface CaseStudyData {
  _id: string
  title: string
  client?: string
  industry?: string
  businessProblem?: string
  strategicInsight?: string
  framework?: string
  decisionProcess?: string
  execution?: string
  coverImage?: SanityImage
  gallery?: (SanityImage & { _key: string })[]
  slug?: { current: string }
}

/*
 * The reasoning chain. Order matters: each stage follows from the one
 * before it, which is why this is rendered as a sequence. Empty stages
 * are skipped, so a case can be published with only problem + insight.
 */
const STAGES = [
  { key: 'businessProblem', label: 'Problem' },
  { key: 'strategicInsight', label: 'Insight' },
  { key: 'framework', label: 'Framework' },
  { key: 'decisionProcess', label: 'Decision' },
  { key: 'execution', label: 'Execution' },
] as const

function SanityPicture({ image, sizes, priority }: { image: SanityImage; sizes: string; priority?: boolean }) {
  const dims = image.asset?.metadata?.dimensions
  if (!image.asset || !dims) return null
  return (
    <Image
      src={urlFor(image).width(1600).auto('format').url()}
      width={dims.width}
      height={dims.height}
      alt={image.alt ?? ''}
      sizes={sizes}
      priority={priority}
      className="h-auto w-full rounded-sm bg-wash"
    />
  )
}

export default function CaseStudy({ cs, id, first }: { cs: CaseStudyData; id: string; first?: boolean }) {
  const stages = STAGES.filter((s) => cs[s.key]?.trim())
  const meta = [cs.client, cs.industry].filter(Boolean).join(', ')

  return (
    <article id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24 border-t border-rule pt-10 max-lg:first:border-t-0 max-lg:first:pt-0">
      {meta && <p className="text-meta text-muted">{meta}</p>}
      <h3 id={`${id}-title`} className="mt-1 text-case font-semibold tracking-tight text-balance">
        {cs.title}
      </h3>

      {cs.coverImage && (
        <figure className="mt-8">
          <SanityPicture image={cs.coverImage} sizes="(min-width: 1024px) 48rem, 100vw" priority={first} />
        </figure>
      )}

      {stages.length > 0 && (
        <dl className="mt-8 space-y-6">
          {stages.map(({ key, label }) => {
            const insight = key === 'strategicInsight'
            return (
              <div key={key} className="md:grid md:grid-cols-[7rem_1fr] md:gap-6">
                <dt className={`text-meta font-medium md:pt-[0.2rem] ${insight ? 'text-accent' : 'text-muted'}`}>
                  {label}
                </dt>
                <dd
                  className={
                    insight
                      ? 'mt-1 md:mt-0 border-l-2 border-accent pl-5 font-serif text-[1.1875rem] leading-[1.5] sm:text-insight max-w-[60ch] text-pretty'
                      : 'mt-1 md:mt-0 max-w-[66ch] text-pretty whitespace-pre-line'
                  }
                >
                  {cs[key]}
                </dd>
              </div>
            )
          })}
        </dl>
      )}

      {cs.gallery && cs.gallery.length > 0 && (
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {cs.gallery.map((img) => (
            <figure key={img._key}>
              <SanityPicture image={img} sizes="(min-width: 640px) 24rem, 100vw" />
              {img.caption && <figcaption className="mt-2 text-meta text-muted">{img.caption}</figcaption>}
            </figure>
          ))}
        </div>
      )}
    </article>
  )
}

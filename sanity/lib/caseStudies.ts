import { readFile } from 'node:fs/promises'
import { client } from './client'
import copyPass from '../content/copy-v3.json'

export interface SanityImage {
  asset?: { _id?: string; metadata?: { dimensions?: { width: number; height: number } } }
  alt?: string
  caption?: string
}

export type QuadrantPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

export interface Diagram {
  kind?: 'quadrant' | 'shifts' | 'sequence'
  title?: string
  caption?: string
  xAxis?: { low?: string; high?: string }
  yAxis?: { low?: string; high?: string }
  crowded?: { position?: QuadrantPosition; label?: string }
  open?: { position?: QuadrantPosition; label?: string }
  shifts?: { _key: string; from?: string; to?: string }[]
  steps?: string[]
}

export interface Figure {
  _key: string
  value: string
  label: string
}

export interface CaseStudy {
  _id: string
  title: string
  slug: string
  client?: string
  industry?: string
  headline?: string
  brief?: string
  reframe?: string
  role?: string
  contribution?: string
  figures?: Figure[]
  businessProblem?: string
  strategicInsight?: string
  framework?: string
  decisionProcess?: string
  execution?: string
  diagram?: Diagram
  coverImage?: SanityImage
  gallery?: (SanityImage & { _key: string })[]
}

// Image fields pull asset dimensions so next/image can reserve space (no layout shift).
const IMAGE = `alt, caption, asset->{ _id, metadata { dimensions { width, height } } }`

const FIELDS = `
  _id, title, "slug": slug.current, client, industry,
  headline, brief, reframe, role, contribution, figures,
  businessProblem, strategicInsight, framework, decisionProcess, execution,
  diagram,
  coverImage { ${IMAGE} },
  gallery[] { _key, ${IMAGE} }
`

const ALL = `*[_type == "caseStudy" && defined(slug.current)] | order(publishedAt desc) { ${FIELDS} }`

/**
 * All case studies, newest first.
 * For local design work without network access to Sanity, set
 * PORTFOLIO_FIXTURE to a JSON file of case studies in the same shape.
 */
export async function getCaseStudies(): Promise<CaseStudy[]> {
  const fixture = process.env.PORTFOLIO_FIXTURE
  const all = fixture
    ? (JSON.parse(await readFile(fixture, 'utf8')) as CaseStudy[])
    : await client.fetch<CaseStudy[]>(ALL)
  // Preview deployments show the proposed copy pass so it can be compared with
  // the live site before anything is written to Sanity. Production is untouched.
  return process.env.VERCEL_ENV === 'preview' || process.env.COPY_PREVIEW === '1' ? all.map(applyCopyPass) : all
}

type Plain = Record<string, unknown>
const isPlain = (v: unknown): v is Plain => typeof v === 'object' && v !== null && !Array.isArray(v)

function merge(base: Plain, patch: Plain): Plain {
  const out: Plain = { ...base }
  for (const [k, v] of Object.entries(patch)) out[k] = isPlain(v) && isPlain(out[k]) ? merge(out[k] as Plain, v) : v
  return out
}

function applyCopyPass(cs: CaseStudy): CaseStudy {
  const patch = copyPass.patches.find((p) => p.id === cs._id)
  return patch ? (merge(cs as unknown as Plain, patch.set as Plain) as unknown as CaseStudy) : cs
}

/** One case study plus the next one in the list (wrapping around), for the "next case" link. */
export async function getCaseStudy(slug: string) {
  const all = await getCaseStudies()
  const i = all.findIndex((cs) => cs.slug === slug)
  if (i === -1) return null
  return { cs: all[i], next: all.length > 1 ? all[(i + 1) % all.length] : null }
}

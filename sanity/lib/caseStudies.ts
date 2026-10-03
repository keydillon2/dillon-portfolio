import { readFile } from 'node:fs/promises'
import { client } from './client'

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
  hook?: string
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
  hook, brief, reframe, role, contribution, figures,
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
  if (fixture) return JSON.parse(await readFile(fixture, 'utf8')) as CaseStudy[]
  return client.fetch<CaseStudy[]>(ALL)
}

/** One case study plus the next one in the list (wrapping around), for the "next case" link. */
export async function getCaseStudy(slug: string) {
  const all = await getCaseStudies()
  const i = all.findIndex((cs) => cs.slug === slug)
  if (i === -1) return null
  return { cs: all[i], next: all.length > 1 ? all[(i + 1) % all.length] : null }
}

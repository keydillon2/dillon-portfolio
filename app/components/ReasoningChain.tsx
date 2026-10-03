import type { CaseStudy } from '@/sanity/lib/caseStudies'

/*
 * The full reasoning chain for close readers. Order matters: each stage
 * follows from the one before it. Empty stages are skipped.
 */
const STAGES = [
  { key: 'businessProblem', label: 'Problem' },
  { key: 'strategicInsight', label: 'Insight' },
  { key: 'framework', label: 'Framework' },
  { key: 'decisionProcess', label: 'Decision' },
  { key: 'execution', label: 'Execution' },
] as const

export default function ReasoningChain({ cs }: { cs: CaseStudy }) {
  const stages = STAGES.filter((s) => cs[s.key]?.trim())
  if (stages.length === 0) return null
  return (
    <dl className="space-y-8">
      {stages.map(({ key, label }) => (
        <div key={key} className="md:grid md:grid-cols-[8rem_1fr] md:gap-8">
          <dt className="text-meta font-medium text-muted md:pt-[0.2rem]">{label}</dt>
          <dd className="mt-1 max-w-[66ch] text-pretty whitespace-pre-line md:mt-0">{cs[key]}</dd>
        </div>
      ))}
    </dl>
  )
}

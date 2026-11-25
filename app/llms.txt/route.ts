import { getCaseStudies } from '@/sanity/lib/caseStudies'
import { resume } from '@/lib/resumeData'
import { site, siteUrl } from '@/lib/site'

// llms.txt: a plain-language map of the site for AI assistants (llmstxt.org).
export const revalidate = 3600

export async function GET() {
  const url = siteUrl()
  const cases = await getCaseStudies()
  const text = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    resume.summary,
    '',
    '## Case studies',
    ...cases.map((cs) => `- [${cs.client}: ${cs.title}](${url}/work/${cs.slug}): ${cs.headline ?? ''}${cs.skills?.length ? ` Skills: ${cs.skills.join(', ')}.` : ''}`),
    '',
    '## About',
    `- [Resume](${url}/resume): experience, skills and education.`,
    `- [LinkedIn](${site.linkedin})`,
    `- Contact: ${site.email}`,
    '',
  ].join('\n')
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}

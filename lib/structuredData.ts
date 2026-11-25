import { site, siteUrl } from '@/lib/site'
import { resume } from '@/lib/resumeData'

// schema.org records that tell search engines and AI assistants who Dillon is
// and that his profiles elsewhere are the same person.

export function personSchema() {
  const url = siteUrl()
  return {
    '@type': 'Person',
    '@id': `${url}/#person`,
    name: site.name,
    url,
    jobTitle: 'Brand Strategist',
    description: site.description,
    worksFor: { '@type': 'Organization', name: 'Prosek Partners', url: 'https://www.prosek.com' },
    alumniOf: resume.education.map((e) => ({ '@type': 'CollegeOrUniversity', name: e.school })),
    address: { '@type': 'PostalAddress', addressLocality: 'New York', addressRegion: 'NY', addressCountry: 'US' },
    knowsAbout: ['Brand strategy', 'Brand positioning', 'Messaging architecture', 'Product marketing', 'Launch narratives', 'Audience segmentation', 'Buyer journeys', 'Financial services marketing'],
    sameAs: site.sameAs,
  }
}

export function siteSchema() {
  const url = siteUrl()
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': `${url}/#website`, url, name: site.name, publisher: { '@id': `${url}/#person` } },
      personSchema(),
    ],
  }
}

/** For a <script type="application/ld+json">: escapes "<" so the JSON can't close the tag. */
export function jsonLd(data: object) {
  return { __html: JSON.stringify(data).replace(/</g, '\\u003c') }
}

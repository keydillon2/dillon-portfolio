import type { CaseStudy, SanityImage } from '../lib/caseStudies'

/*
 * PREVIEW ONLY. The HSFT case, shown on Vercel preview deployments so Dillon
 * can review it before anything is published to Sanity. The images are
 * already uploaded to Sanity as unreferenced assets (not visible anywhere).
 * On approval this becomes a published Sanity document and this file is deleted.
 */

const img = (id: string, w: number, h: number, alt: string): SanityImage => ({
  asset: { _id: id, metadata: { dimensions: { width: w, height: h } } },
  alt,
})

export const HSFT_PREVIEW: CaseStudy = {
  _id: 'preview-hsft',
  title: 'Friction-Free Investment Management',
  slug: 'hsft-friction-free-investment-management',
  client: 'HS Financial Technologies (formerly HedgeServ)',
  industry: 'Fund administration',
  headline: 'HedgeServ outgrew its name. The new brand sells faster capital decisions, not fund administration.',
  brief:
    'HedgeServ was renaming itself HS Financial Technologies. It needed a brand strategy, a visual identity and a website that would carry a respected hedge fund specialist into private equity, private credit, real estate and endowments, on an accelerated timeline.',
  reframe:
    'Every fund administrator in the category talks about itself: who it is, or what it offers. HSFT would talk about the friction slowing its clients down, and position its teams and technology as the system that removes it, so complexity can grow without slowing capital decisions.',
  role: 'Strategist, Prosek Partners',
  contribution:
    'I led discovery interviews with leadership and COO-level clients, and wrote the value proposition, messaging architecture and launch narrative. I partnered with our design and verbal identity teams to carry the strategy into the new identity system.',
  figures: [
    { _key: 'f1', value: '$900B', label: 'Assets under administration' },
    { _key: 'f2', value: '10', label: 'Leadership and client interviews' },
    { _key: 'f3', value: '3', label: 'Frictions the brand promises to remove' },
  ],
  businessProblem:
    'Alternative investment managers are diversifying fast: new strategies, new structures, new markets. As they grow, their back office fragments. Systems multiply, reconciliation becomes routine and scrutiny rises. HedgeServ had built its reputation solving this for hedge funds, and that reputation had become a ceiling. Private equity firms do not want to buy “hedge fund software.” Meanwhile every competitor, from Citco and SS&C to Apex, Arcesium and SEI, sounded the same: either a “who we are” brand selling expertise and partnership, or a “what we offer” brand selling capability.',
  strategicInsight:
    'In ten interviews with HedgeServ leadership and with CFOs at client firms, nobody described buying software or buying service. They described confidence. Clients talked to experts who knew their funds, without a relationship manager in between, and the numbers were right. Teams plus technology is table stakes in this category. The difference was that HedgeServ had fused the two into one operating system, which gave clients a second engine for their business. We framed it as Teams × Technology = The Engine.',
  framework:
    'We organized the platform around the frictions clients feel rather than the products HSFT sells. The positioning, Friction-Free Investment Management, rests on a purpose: to increase the velocity and quality of capital decisions by eliminating operational drag at scale. Three messaging pillars each remove one kind of friction. Confidence in the data removes data friction. Smarter Leverage removes scaling friction. Compounding Capability removes change friction. Each pillar carries three reasons to believe and speaks to three audiences: decision makers (CEO, COO, CFO), program users (controllers and heads of fund accounting) and investors (LPs and investment committees).',
  decisionProcess:
    'The perception shift I set for the brand was from “an alternative fund specialist with a hedge fund heritage” to “the institutional operating platform for control and insight in investment management.” That meant leading with business decisions instead of product features, on the website as much as in the messaging, because senior operators evaluate a firm in minutes. It also set the personality: calm under pressure, serious about the work and easy to work with, in a tone that is assured, clear and present.',
  execution:
    'The design team translated the strategy into a visual identity called Velocity, Engineered, where directional motion shows complexity moving through the system instead of piling up. The line Complexity, Absorbed. Decisions, Accelerated. carries across out of home, social, templates, merchandise and the new website. HS Financial Technologies launched at hsft.com in October 2026. The CEO cited the work as the reason his leadership team saw “exciting times ahead.”',
  diagram: {
    kind: 'shifts',
    title: 'Three frictions, three promises',
    caption: 'Each messaging pillar is defined by the friction it removes.',
    shifts: [
      { _key: 's1', from: 'Data friction', to: 'Confidence in the data' },
      { _key: 's2', from: 'Scaling friction', to: 'Smarter leverage' },
      { _key: 's3', from: 'Change friction', to: 'Compounding capability' },
    ],
  },
  coverImage: img('image-5eb181b476a8d3ade8bca0ecf4b63cb5784698c9-2012x1133-jpg', 2012, 1133, 'HSFT billboard: Complexity, Absorbed. Decisions, Accelerated.'),
  gallery: [
    ['image-4772b52c5261460bb74deb434cacd2105963f8f3-2010x1133-jpg', 2010, 1133, 'HSFT identity summary: wordmark, palette and line'],
    ['image-6a4d6a185b76a4a0c446ea9105a7b89d505b3fbb-2012x1133-jpg', 2012, 1133, 'HSFT website homepage'],
    ['image-7c999f3fcdfc89f70ee8f88fe9cd022a7e9da127-2012x1133-jpg', 2012, 1133, 'HSFT out-of-home: Decisions. Faster. Clearer.'],
    ['image-8b2d2b7a81a250830116da0032e90ccfbefe6b4e-2012x1133-jpg', 2012, 1133, 'HSFT event screen: Scale Without Fragmentation'],
    ['image-a14470ea281b7e1319f16bf892858f95802d6352-2012x1133-jpg', 2012, 1133, 'HSFT social posts'],
    ['image-c692c9b02b224955459fc76ee417a9738a02494d-2002x1125-jpg', 2002, 1125, 'HSFT presentation template'],
    ['image-810685fa68e92a4ec9b1b9471dffcb90227f2d76-2012x1133-jpg', 2012, 1133, 'HSFT business cards'],
    ['image-e00cf07b2278e695f1db2c424efaf509b1ba6ca6-2002x1125-jpg', 2002, 1125, 'HSFT notebook, mug and coasters'],
  ].map(([id, w, h, alt], i) => ({ _key: `g${i}`, ...img(id as string, w as number, h as number, alt as string) })),
}

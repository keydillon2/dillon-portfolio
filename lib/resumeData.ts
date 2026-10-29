// The resume page: short and scannable. The detailed version lives in the PDF.
// Clients with a case study on the site link to it.

export type Client = { name: string; slug?: string }

export interface Role {
  title: string
  company: string
  place: string
  years: string
  focus: string
  clients?: Client[]
}

export const resume = {
  summary:
    'Brand strategist with 7+ years across agencies and consultancies, working on positioning, brand architecture, messaging, and identity for financial services, enterprise technology, healthcare, and consumer brands.',

  highlights: [
    { client: 'HedgeServ', text: 'Repositioned a fund administrator beyond hedge funds; the CEO credited the work for “exciting times ahead.”' },
    { client: 'Apollo Global Management', slug: 'apollo-audience-segmentation', text: 'Audience one-sheeters and the Audience Decision Journey for a $500B AUM alternatives manager.' },
    { client: 'Fetch Pet Insurance', slug: 'fetch-love-longer', text: 'The insight behind Love Longer, which contributed to $500K raised at Fetch’s first NYC gala.' },
  ],

  roles: [
    {
      title: 'Senior Strategist',
      company: 'Prosek Partners',
      place: 'New York',
      years: '2025 to now',
      focus: 'Brand strategy, positioning, messaging, and identity.',
      clients: [
        { name: 'HedgeServ' },
        { name: 'Apollo Global Management', slug: 'apollo-audience-segmentation' },
        { name: 'Fetch Pet Insurance', slug: 'fetch-love-longer' },
        { name: 'Hackensack Meridian Health', slug: 'hmh-dont-mind-your-own-business' },
        { name: 'AlTi Tiedemann Global' },
        { name: 'Baron Capital' },
        { name: 'Heitman' },
      ],
    },
    {
      title: 'Strategist',
      company: 'Dentsu Creative',
      place: 'New York',
      years: '2023 to 2024',
      focus: 'Brand, product, and sales enablement strategy.',
      clients: [{ name: 'American Express Global Commercial Services', slug: 'amex-b2b-payments-messaging' }],
    },
    {
      title: 'Associate Strategist (contract)',
      company: 'AKQA & The Mix Global',
      place: 'New York',
      years: 'Summers 2022 and 2023',
      focus: 'Cultural research and brand positioning.',
      clients: [
        { name: 'Diageo', slug: 'diageo-stages-not-ages' },
        { name: 'Verizon Prepaid' },
        { name: 'Maserati' },
        { name: 'McCormick' },
      ],
    },
    {
      title: 'Digital Marketing Specialist',
      company: 'The Communications Group',
      place: 'Little Rock',
      years: '2020 to 2021',
      focus: 'Digital strategy and web experience projects.',
    },
    {
      title: 'Account Coordinator',
      company: 'Flypaper Digital Marketing',
      place: 'Fayetteville',
      years: '2019 to 2020',
      focus: 'Client relationships and performance marketing.',
    },
  ] satisfies Role[],

  education: [
    { school: 'VCU Brandcenter', degree: 'MS, Business', years: '2021 to 2023' },
    { school: 'University of Central Arkansas', degree: 'BA, Public Relations', years: '2015 to 2018' },
  ],

  capabilities: [
    { label: 'Brand strategy', items: 'Positioning, brand architecture, brand platforms, messaging frameworks, tone and voice' },
    { label: 'Research', items: 'Stakeholder interviews, digital ethnography, survey design, competitive audits, cultural analysis' },
    { label: 'Delivery', items: 'Executive workshops, client presentations, workstream leadership, AI-assisted research' },
  ],
}

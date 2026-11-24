// The resume page. Focused on brand strategy and product marketing:
// positioning, messaging and narrative. Clients with a case study link to it.

export interface WorkItem {
  client: string
  tag: string
  text: string
  slug?: string
}

export interface Role {
  title: string
  company: string
  place: string
  years: string
  focus: string
  work: WorkItem[]
  more?: string
}

export const resume = {
  summary:
    'Brand strategist with 7+ years across agencies and consultancies. I help companies with complex products decide what to stand for and how to say it: positioning, messaging architecture and launch narratives for financial services, enterprise technology, healthcare and consumer brands.',

  practice: [
    {
      label: 'Positioning',
      text: 'Finding the claim a company or product can own, and the reasons to believe it.',
      examples: 'HSFT, Fetch, American Express One AP',
    },
    {
      label: 'Messaging',
      text: 'Turning positioning into message architecture, pillars and proof that marketing, sales and product teams can use.',
      examples: 'HSFT, American Express, Project Orange',
    },
    {
      label: 'Narratives',
      text: 'Launch stories, campaign platforms and audience journeys that carry the strategy into market.',
      examples: 'HSFT launch, Love Longer, Apollo',
    },
  ],

  roles: [
    {
      title: 'Senior Strategist',
      company: 'Prosek Partners',
      place: 'New York',
      years: '2025 to now',
      focus: 'Brand strategy and messaging for financial services, enterprise technology, healthcare and consumer clients.',
      work: [
        {
          client: 'HS Financial Technologies (formerly HedgeServ)',
          tag: 'Brand positioning',
          slug: 'hsft-friction-free-investment-management',
          text: 'Repositioned an enterprise fund administration platform beyond its hedge fund origins. Interviews with leadership and COO-level clients led to the value proposition, messaging architecture and launch narrative, and I partnered with design and verbal identity teams on the new identity. The CEO cited the work as the reason his team saw “exciting times ahead.”',
        },
        {
          client: 'Apollo Global Management',
          tag: 'Audience strategy',
          slug: 'apollo-audience-segmentation',
          text: 'For a $500B AUM alternatives manager, built the audience one-sheeters behind the team’s messaging playbook, and the Audience Decision Journey that put it to work for wealth advisors and institutional investors.',
        },
        {
          client: 'Fetch Pet Insurance',
          tag: 'Brand strategy',
          slug: 'fetch-love-longer',
          text: 'Reframed pet insurance from a necessary evil into an investment in more healthy years together. The insight behind the Love Longer platform, which contributed to $500K raised at Fetch’s first NYC gala.',
        },
        {
          client: 'Hackensack Meridian Health',
          tag: 'Campaign strategy',
          slug: 'hmh-dont-mind-your-own-business',
          text: 'Developed “Don’t Mind Your Own Business,” the FIFA World Cup sponsorship platform that used a familiar idiom to engage New Yorkers on human trafficking.',
        },
        {
          client: 'Project Orange (Prosek)',
          tag: 'Messaging and brand governance',
          text: 'Led Prosek’s internal brand repositioning from discovery to a firm-wide messaging playbook adopted across practice areas, covering narrative hierarchy, tone and voice.',
        },
        {
          client: 'AI-accelerated discovery',
          tag: 'Research operations',
          text: 'Built generative AI workflows for research synthesis, competitive monitoring and briefing, and taught the methods internally.',
        },
      ],
      more: 'Also: AlTi Tiedemann Global, Baron Capital, Heitman Investment Management, Meritage.',
    },
    {
      title: 'Strategist',
      company: 'Dentsu Creative',
      place: 'New York',
      years: '2023 to 2024',
      focus: 'Brand, product and sales enablement strategy for American Express Global Commercial Services.',
      work: [
        {
          client: 'American Express',
          tag: 'Product positioning',
          slug: 'amex-b2b-payments-messaging',
          text: 'Built positioning and messaging frameworks for two global B2B payments products, Buyer Initiated Payments and One AP, each laddering to the Amex masterbrand.',
        },
        {
          client: 'American Express',
          tag: 'Sales enablement',
          text: 'Translated enterprise payments capabilities into long-term customer benefits for sales and marketing teams.',
        },
        {
          client: 'American Express',
          tag: 'Competitive intelligence',
          text: 'Produced monthly competitive intelligence across nine major financial services brands for senior Amex marketers.',
        },
      ],
    },
    {
      title: 'Associate Strategist (contract)',
      company: 'AKQA & The Mix Global',
      place: 'New York',
      years: 'Summers 2022 and 2023',
      focus: 'Cultural research and brand positioning.',
      work: [
        {
          client: 'Diageo',
          tag: 'Cultural research',
          slug: 'diageo-stages-not-ages',
          text: 'Led digital ethnography on Gen Z culture and consumption, and facilitated client workshops in New York and Phoenix.',
        },
        {
          client: 'Verizon Prepaid',
          tag: 'Brand positioning',
          text: 'Analyzed cultural and competitive dynamics to shape Verizon Prepaid’s positioning, and supported new business pitches.',
        },
      ],
      more: 'Also: Maserati, McCormick Business Solutions.',
    },
    {
      title: 'Digital Marketing Specialist',
      company: 'The Communications Group',
      place: 'Little Rock',
      years: '2020 to 2021',
      focus: 'Digital strategy and web experience.',
      work: [
        {
          client: 'Web and digital',
          tag: 'Digital strategy',
          text: 'Led web projects from strategy through launch, advising on UX and information architecture, and trained account managers on digital channels.',
        },
      ],
    },
    {
      title: 'Account Coordinator',
      company: 'Flypaper Digital Marketing',
      place: 'Fayetteville',
      years: '2019 to 2020',
      focus: 'Client relationships and performance marketing.',
      work: [
        {
          client: 'Client portfolio',
          tag: 'Account growth',
          text: 'Managed 30 client relationships and sold an additional $45,000 in annualized revenue through account growth.',
        },
      ],
    },
  ] satisfies Role[],

  education: [
    { school: 'VCU Brandcenter', degree: 'MS, Business and Branding', years: '2021 to 2023' },
    { school: 'University of Central Arkansas', degree: 'BA, Public Relations', years: '2015 to 2018' },
  ],

  skills: [
    { label: 'Brand strategy', items: 'Positioning, brand architecture, brand platforms, value propositions, creative briefs' },
    { label: 'Product marketing', items: 'Product positioning, messaging frameworks, launch narratives, go-to-market strategy, sales enablement, audience segmentation, buyer journeys' },
    { label: 'Research and insight', items: 'Stakeholder and customer interviews, discussion guides, survey design, digital ethnography, competitive intelligence, cultural analysis' },
    { label: 'Delivery', items: 'Executive workshops, client presentations, workstream leadership, coaching junior strategists, AI-assisted research' },
  ],
}

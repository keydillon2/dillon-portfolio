import { defineArrayMember, defineField, defineType } from 'sanity'

// Case Study.
// Fields are grouped by the job they do for a reviewer:
//  - "Summary" is what someone skimming for 30 seconds sees: the hook, the
//    brief versus the reframe, the role, and the figures.
//  - "Reasoning" is the full chain for someone reading closely.
//  - "Visuals" holds the framework diagram and any images.
export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  groups: [
    { name: 'summary', title: 'Summary', default: true },
    { name: 'reasoning', title: 'Reasoning' },
    { name: 'visuals', title: 'Visuals' },
  ],
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', group: 'summary', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'summary',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'client', title: 'Client / Company', type: 'string', group: 'summary' }),
    defineField({ name: 'industry', title: 'Industry', type: 'string', group: 'summary' }),
    defineField({
      name: 'hook',
      title: 'Hook',
      type: 'string',
      group: 'summary',
      description: 'One line that makes a reviewer want to read on. Shown large on the index and the case page.',
      validation: (r) => r.max(120).warning('Keep the hook under 120 characters.'),
    }),
    defineField({
      name: 'brief',
      title: 'The brief',
      type: 'text',
      rows: 2,
      group: 'summary',
      description: 'What the client asked for, in one or two sentences.',
    }),
    defineField({
      name: 'reframe',
      title: 'The reframe',
      type: 'text',
      rows: 2,
      group: 'summary',
      description: 'What the real problem turned out to be, in one or two sentences.',
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      group: 'summary',
      description: 'Your title and where, e.g. "Senior Strategist, Prosek Partners".',
    }),
    defineField({
      name: 'contribution',
      title: 'What I owned',
      type: 'text',
      rows: 2,
      group: 'summary',
      description: 'What you personally led or delivered. Use "I".',
    }),
    defineField({
      name: 'figures',
      title: 'Figures',
      type: 'array',
      group: 'summary',
      description: 'Up to four numbers that show scale or outcome. Only real figures.',
      validation: (r) => r.max(4),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'figure',
          fields: [
            defineField({ name: 'value', title: 'Value', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
          ],
          preview: { select: { title: 'value', subtitle: 'label' } },
        }),
      ],
    }),

    defineField({ name: 'businessProblem', title: 'Business Problem', type: 'text', rows: 4, group: 'reasoning' }),
    defineField({ name: 'strategicInsight', title: 'Strategic Insight', type: 'text', rows: 4, group: 'reasoning' }),
    defineField({ name: 'framework', title: 'Framework', type: 'text', rows: 4, group: 'reasoning' }),
    defineField({ name: 'decisionProcess', title: 'Decision Process', type: 'text', rows: 4, group: 'reasoning' }),
    defineField({ name: 'execution', title: 'Execution', type: 'text', rows: 4, group: 'reasoning' }),

    defineField({
      name: 'diagram',
      title: 'Framework diagram',
      type: 'object',
      group: 'visuals',
      description: 'Draws the framework as a diagram on the case page.',
      fields: [
        defineField({
          name: 'kind',
          title: 'Kind',
          type: 'string',
          options: {
            list: [
              { title: '2×2 map', value: 'quadrant' },
              { title: 'From → to shifts', value: 'shifts' },
              { title: 'Ordered sequence', value: 'sequence' },
            ],
            layout: 'radio',
          },
        }),
        defineField({ name: 'title', title: 'Title', type: 'string' }),
        defineField({ name: 'caption', title: 'Caption', type: 'text', rows: 2 }),
        // 2×2
        defineField({
          name: 'xAxis',
          title: 'Horizontal axis (left → right)',
          type: 'object',
          hidden: ({ parent }) => parent?.kind !== 'quadrant',
          fields: [
            defineField({ name: 'low', title: 'Left end', type: 'string' }),
            defineField({ name: 'high', title: 'Right end', type: 'string' }),
          ],
        }),
        defineField({
          name: 'yAxis',
          title: 'Vertical axis (bottom → top)',
          type: 'object',
          hidden: ({ parent }) => parent?.kind !== 'quadrant',
          fields: [
            defineField({ name: 'low', title: 'Bottom end', type: 'string' }),
            defineField({ name: 'high', title: 'Top end', type: 'string' }),
          ],
        }),
        defineField({
          name: 'crowded',
          title: 'Crowded quadrant',
          type: 'object',
          hidden: ({ parent }) => parent?.kind !== 'quadrant',
          fields: [
            defineField({
              name: 'position',
              title: 'Position',
              type: 'string',
              options: { list: ['top-left', 'top-right', 'bottom-left', 'bottom-right'] },
            }),
            defineField({ name: 'label', title: 'Label', type: 'string' }),
          ],
        }),
        defineField({
          name: 'open',
          title: 'Open quadrant',
          type: 'object',
          hidden: ({ parent }) => parent?.kind !== 'quadrant',
          fields: [
            defineField({
              name: 'position',
              title: 'Position',
              type: 'string',
              options: { list: ['top-left', 'top-right', 'bottom-left', 'bottom-right'] },
            }),
            defineField({ name: 'label', title: 'Label', type: 'string' }),
          ],
        }),
        // Shifts
        defineField({
          name: 'shifts',
          title: 'Shifts',
          type: 'array',
          hidden: ({ parent }) => parent?.kind !== 'shifts',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'shift',
              fields: [
                defineField({ name: 'from', title: 'From', type: 'string' }),
                defineField({ name: 'to', title: 'To', type: 'string' }),
              ],
              preview: { select: { title: 'to', subtitle: 'from' } },
            }),
          ],
        }),
        // Sequence
        defineField({
          name: 'steps',
          title: 'Steps',
          type: 'array',
          hidden: ({ parent }) => parent?.kind !== 'sequence',
          of: [defineArrayMember({ type: 'string' })],
        }),
      ],
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      group: 'visuals',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      group: 'visuals',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
            defineField({ name: 'caption', title: 'Caption', type: 'string' }),
          ],
        },
      ],
    }),
    defineField({ name: 'publishedAt', title: 'Published At', type: 'datetime', group: 'summary' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'client' },
  },
})

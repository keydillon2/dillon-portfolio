import { defineField, defineType } from 'sanity'

// Case Study — the first content type for the platform.
// Each field maps to an element of strategic judgment from the project vision:
// problem, insight, framework, decision process, execution, outcome, reflection.
export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'client', title: 'Client / Company', type: 'string' }),
    defineField({ name: 'industry', title: 'Industry', type: 'string' }),
    defineField({ name: 'businessProblem', title: 'Business Problem', type: 'text', rows: 4 }),
    defineField({ name: 'strategicInsight', title: 'Strategic Insight', type: 'text', rows: 4 }),
    defineField({ name: 'framework', title: 'Framework', type: 'text', rows: 4 }),
    defineField({ name: 'decisionProcess', title: 'Decision Process', type: 'text', rows: 4 }),
    defineField({ name: 'execution', title: 'Execution', type: 'text', rows: 4 }),
    defineField({ name: 'commercialOutcome', title: 'Commercial Outcome', type: 'text', rows: 4 }),
    defineField({
      name: 'reflection',
      title: 'Reflection — What I Would Do Differently Today',
      type: 'text',
      rows: 4,
    }),
    defineField({ name: 'publishedAt', title: 'Published At', type: 'datetime' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'client' },
  },
})

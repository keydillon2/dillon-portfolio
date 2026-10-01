import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './sanity/schemaTypes'
import { dataset, projectId } from './sanity/env'

export default defineConfig({
  name: 'dillon-portfolio',
  title: 'Dillon Portfolio',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [structureTool()],
  schema: { types: schemaTypes },
})

import { defineCliConfig } from 'sanity/cli'

// Lets `npx sanity ...` commands (login, exec, deploy) find this project.
// The project ID is public; it already appears in every image URL.
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '7sgn2ssa',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  },
})

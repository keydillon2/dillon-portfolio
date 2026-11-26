import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

// Server-side client. Reads published content directly from Sanity (no CDN)
// so edits are visible quickly. The production dataset is public, so no API
// token is needed; leaving it out means no write-capable key sits on Vercel.
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
})

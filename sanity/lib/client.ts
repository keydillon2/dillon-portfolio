import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

// Server-side client. Reads published content directly from Sanity (no CDN)
// so edits are visible quickly. The API token never leaves the server.
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

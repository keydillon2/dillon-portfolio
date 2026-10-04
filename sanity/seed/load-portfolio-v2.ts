/**
 * Loads the drafted v2 fields (headline, brief, reframe, role, figures, diagram)
 * into the existing case study documents. Existing text is not touched.
 *
 * Run once, signed in to Sanity:
 *   npx sanity login
 *   npx sanity exec sanity/seed/load-portfolio-v2.ts --with-user-token
 *
 * Safe to re-run: it overwrites only these fields with the values in
 * portfolio-v2.json, so edit that file (or edit in Studio afterwards).
 */
import { getCliClient } from 'sanity/cli'
import data from './portfolio-v2.json'

const client = getCliClient({ apiVersion: '2026-01-01' })

async function main() {
  const tx = client.transaction()
  for (const p of data.patches) tx.patch(p.id, { set: p.set })
  const res = await tx.commit()
  console.log(`Updated ${res.documentIds.length} case studies:`, data.patches.map((p) => p.slug).join(', '))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

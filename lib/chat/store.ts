/*
 * Optional Redis storage (Upstash, via the Vercel Marketplace) for logging
 * visitor questions and rate limiting. Everything here is a no-op when the
 * store isn't connected, so the chat still works without it.
 */
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN

export const storeConnected = Boolean(URL_ && TOKEN)

async function redis<T = unknown>(commands: (string | number)[][]): Promise<T[] | null> {
  if (!storeConnected) return null
  try {
    const res = await fetch(`${URL_}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(commands),
      cache: 'no-store',
    })
    if (!res.ok) return null
    const out = (await res.json()) as { result: T }[]
    return out.map((r) => r.result)
  } catch {
    return null
  }
}

// In-memory fallback for rate limiting when Redis isn't connected (per server instance).
const memory = new Map<string, { n: number; reset: number }>()

/** True if this visitor is still under the limit for the window. */
export async function underLimit(visitor: string, limit: number, windowSeconds: number) {
  const key = `chat:rl:${visitor}:${Math.floor(Date.now() / 1000 / windowSeconds)}`
  const r = await redis<number>([
    ['INCR', key],
    ['EXPIRE', key, windowSeconds],
  ])
  if (r) return r[0] <= limit
  const now = Date.now()
  const m = memory.get(key)
  if (!m || m.reset < now) {
    memory.set(key, { n: 1, reset: now + windowSeconds * 1000 })
    return true
  }
  m.n += 1
  return m.n <= limit
}

const normalize = (q: string) =>
  q.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200)

/** Save a question anonymously: the text, the page it was asked on, and when. */
export async function logQuestion(question: string, page: string) {
  await redis([
    ['LPUSH', 'chat:questions', JSON.stringify({ q: question, page, at: new Date().toISOString() })],
    ['LTRIM', 'chat:questions', 0, 4999],
    ['ZINCRBY', 'chat:question-counts', 1, normalize(question)],
  ])
}

export async function readQuestions(limit = 200) {
  const r = await redis<unknown>([
    ['LRANGE', 'chat:questions', 0, limit - 1],
    ['ZREVRANGE', 'chat:question-counts', 0, 49, 'WITHSCORES'],
  ])
  if (!r) return null
  const recent = ((r[0] as string[]) ?? []).map((s) => JSON.parse(s) as { q: string; page: string; at: string })
  const flat = (r[1] as string[]) ?? []
  const top: { q: string; n: number }[] = []
  for (let i = 0; i < flat.length; i += 2) top.push({ q: flat[i], n: Number(flat[i + 1]) })
  return { recent, top }
}

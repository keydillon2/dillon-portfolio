import { after } from 'next/server'
import { createHash } from 'node:crypto'
import { getCaseStudies } from '@/sanity/lib/caseStudies'
import { systemPrompt } from '@/lib/chat/knowledge'
import { logQuestion, underLimit } from '@/lib/chat/store'

/*
 * The portfolio chat. Sends the visitor's question, with the site content and
 * resume as context, to Claude Haiku (falling back to gpt-oss-120b on Groq if
 * Claude is unavailable or the monthly spend limit is reached), and streams
 * the answer back as plain text.
 *
 * Costs: the site context is sent as a cached system prompt, so follow-up
 * questions within five minutes pay a tenth of the input price for it. The
 * monthly cap is the spend limit set in the Claude Console, not in this code.
 */

const CLAUDE_MODEL = 'claude-haiku-5-5'
const GROQ_MODEL = 'openai/gpt-oss-120b'
const MAX_ANSWER_TOKENS = 700
const MAX_QUESTION = 500
const MAX_TURNS = 8

type Turn = { role: 'user' | 'assistant'; content: string }

// Keep the assembled context warm between questions so most answers skip the Sanity fetch.
let cached: { prompt: string; at: number } | null = null
async function context() {
  if (cached && Date.now() - cached.at < 5 * 60_000) return cached.prompt
  cached = { prompt: systemPrompt(await getCaseStudies()), at: Date.now() }
  return cached.prompt
}

export async function POST(request: Request) {
  if (!claudeKey() && !process.env.GROQ_API_KEY) {
    return new Response('The chat isn’t set up yet.', { status: 503 })
  }

  let body: { messages?: Turn[]; page?: string }
  try {
    body = await request.json()
  } catch {
    return new Response('Bad request', { status: 400 })
  }
  const turns = (body.messages ?? [])
    .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, m.role === 'user' ? MAX_QUESTION : 2000) }))
    .filter((m) => m.content.trim())
  // The conversation must open with the visitor.
  while (turns[0]?.role === 'assistant') turns.shift()
  const question = turns.at(-1)
  if (!question || question.role !== 'user' || !question.content.trim()) {
    return new Response('Bad request', { status: 400 })
  }

  // Rate limit by a hashed IP, never stored in the clear.
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const visitor = createHash('sha256').update(ip).digest('hex').slice(0, 16)
  const ok = (await underLimit(visitor, 15, 600)) && (await underLimit(visitor, 60, 86400))
  if (!ok) {
    return new Response('That’s a lot of questions. Please try again a little later, or email dillon.key@gmail.com.', {
      status: 429,
    })
  }

  const page = typeof body.page === 'string' ? body.page.slice(0, 100) : '/'
  after(() => logQuestion(question.content.trim(), page))

  const system = await context()
  // Kept separate from the cached context so every page shares one cache entry.
  const where = page.startsWith('/work/')
    ? `The visitor is reading the case study at ${page} right now. Don't link to that page or suggest they read it; they are already there. You may still link other cases.`
    : `The visitor is on the page ${page}.`
  const answer = (await askClaude(system, where, turns)) ?? (await askGroq(`${system}\n\n${where}`, turns))
  if (answer instanceof Response) return answer
  if (!answer) {
    return new Response('The assistant is unavailable right now. Please email dillon.key@gmail.com.', { status: 502 })
  }
  return new Response(answer, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
  })
}

// The key is stored in Vercel as Claude_API_Key (secret names can't be changed);
// ANTHROPIC_API_KEY is the conventional name, accepted too.
function claudeKey() {
  return process.env.ANTHROPIC_API_KEY || process.env.Claude_API_Key
}

/** Claude Haiku, streamed. Returns null (so Groq takes over) on any failure. */
async function askClaude(system: string, where: string, turns: Turn[]) {
  const key = claudeKey()
  if (!key) return null
  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: MAX_ANSWER_TOKENS,
      // The site context is identical for every visitor, so cache it.
      system: [
        { type: 'text', text: system, cache_control: { type: 'ephemeral' } },
        { type: 'text', text: where },
      ],
      messages: turns,
      stream: true,
      thinking: { type: 'disabled' },
      output_config: { effort: 'low' },
    }),
  }).catch(() => null)
  if (!upstream?.ok || !upstream.body) {
    console.error('claude upstream error', upstream?.status, await upstream?.text().catch(() => ''))
    return null
  }
  return textStream(upstream.body, (event) =>
    event.type === 'content_block_delta' && event.delta?.type === 'text_delta' ? event.delta.text : undefined,
  )
}

/** gpt-oss-120b on Groq's free tier, the fallback. */
async function askGroq(system: string, turns: Turn[]) {
  const key = process.env.GROQ_API_KEY
  if (!key) return null
  const upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: 'system', content: system }, ...turns],
      stream: true,
      temperature: 0.3,
      max_completion_tokens: 600,
      reasoning_effort: 'low',
    }),
  })
  if (!upstream.ok || !upstream.body) {
    console.error('groq upstream error', upstream.status, await upstream.text().catch(() => ''))
    const busy = upstream.status === 429
    return new Response(
      busy
        ? 'The assistant is busy right now. Try again in a minute, or email dillon.key@gmail.com.'
        : 'The assistant is unavailable right now. Please email dillon.key@gmail.com.',
      { status: busy ? 503 : 502 },
    )
  }
  return textStream(upstream.body, (event) => event.choices?.[0]?.delta?.content)
}

/** Turns a server-sent event stream into a plain text stream of answer tokens. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function textStream(body: ReadableStream<Uint8Array>, pick: (event: any) => string | undefined) {
  const decoder = new TextDecoder()
  const encoder = new TextEncoder()
  let buffer = ''
  return body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''
        for (const line of lines) {
          if (!line.startsWith('data:')) continue
          const data = line.slice(5).trim()
          if (!data || data === '[DONE]') continue
          try {
            const text = pick(JSON.parse(data))
            // House style: plain hyphens, and no em dashes.
            if (text) controller.enqueue(encoder.encode(text.replace(/[\u2010\u2011]/g, '-').replace(/\s*\u2014\s*/g, ', ')))
          } catch {
            // Ignore keep-alives and partial lines.
          }
        }
      },
    }),
  )
}

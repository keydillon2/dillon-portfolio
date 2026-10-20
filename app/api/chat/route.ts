import { after } from 'next/server'
import { createHash } from 'node:crypto'
import { getCaseStudies } from '@/sanity/lib/caseStudies'
import { systemPrompt } from '@/lib/chat/knowledge'
import { logQuestion, underLimit } from '@/lib/chat/store'

/*
 * The portfolio chat. Sends the visitor's question, with the site content and
 * resume as context, to gpt-oss-120b on Groq, and streams the answer back as
 * plain text.
 */

const MODEL = 'openai/gpt-oss-120b'
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
  const key = process.env.GROQ_API_KEY
  if (!key) return new Response('The chat isn’t set up yet.', { status: 503 })

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

  const upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'system', content: await context() }, ...turns],
      stream: true,
      temperature: 0.3,
      max_completion_tokens: 600,
      reasoning_effort: 'low',
    }),
  })
  if (!upstream.ok || !upstream.body) {
    console.error('chat upstream error', upstream.status, await upstream.text().catch(() => ''))
    const busy = upstream.status === 429
    return new Response(
      busy
        ? 'The assistant is busy right now. Try again in a minute, or email dillon.key@gmail.com.'
        : 'The assistant is unavailable right now. Please email dillon.key@gmail.com.',
      { status: busy ? 503 : 502 },
    )
  }

  // Turn the server-sent events into a plain text stream of answer tokens.
  const decoder = new TextDecoder()
  const encoder = new TextEncoder()
  let buffer = ''
  const stream = upstream.body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''
        for (const line of lines) {
          const data = line.replace(/^data:\s*/, '').trim()
          if (!data || data === '[DONE]' || !line.startsWith('data:')) continue
          try {
            const text = JSON.parse(data).choices?.[0]?.delta?.content
            if (text) controller.enqueue(encoder.encode(text.replace(/[\u2010\u2011]/g, '-').replace(/\s*\u2014\s*/g, ', ')))
          } catch {
            // Ignore keep-alives and partial lines.
          }
        }
      },
    }),
  )
  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
  })
}

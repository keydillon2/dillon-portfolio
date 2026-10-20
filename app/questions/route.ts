import { readQuestions } from '@/lib/chat/store'

/*
 * Private list of the questions visitors ask the chat, most common first.
 * Protected by a password (QUESTIONS_PASSWORD in Vercel). Without one set,
 * the page doesn't exist.
 */

export const dynamic = 'force-dynamic'

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)

export async function GET(request: Request) {
  const password = process.env.QUESTIONS_PASSWORD
  if (!password) return new Response('Not found', { status: 404 })

  const auth = request.headers.get('authorization') ?? ''
  const given = auth.startsWith('Basic ') ? Buffer.from(auth.slice(6), 'base64').toString().split(':').slice(1).join(':') : ''
  if (given !== password) {
    return new Response('Password required', { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Chat questions"' } })
  }

  const data = await readQuestions()
  const body = !data
    ? '<p>The question log isn’t connected yet.</p>'
    : `<h2>Most asked</h2><ol>${data.top.map((t) => `<li>${esc(t.q)} <span>× ${t.n}</span></li>`).join('') || '<li>No questions yet.</li>'}</ol>
       <h2>Most recent</h2><ul>${data.recent
         .map((r) => `<li>${esc(r.q)} <span>${esc(r.page)} · ${new Date(r.at).toLocaleString('en-US', { timeZone: 'America/New_York' })}</span></li>`)
         .join('') || '<li>No questions yet.</li>'}</ul>`

  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Chat questions</title>
<style>body{font:16px/1.5 system-ui,sans-serif;max-width:720px;margin:40px auto;padding:0 16px;color:#16161a;background:#fbfbf9}h1{font-size:24px}h2{font-size:15px;color:#6b6b72;margin-top:32px}li{margin:8px 0}span{color:#6b6b72;font-size:13px;margin-left:6px}@media(prefers-color-scheme:dark){body{background:#111113;color:#ececef}h2,span{color:#9a9aa3}}</style></head>
<body><h1>What visitors ask the chat</h1>${body}</body></html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } },
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react'

type Turn = { role: 'user' | 'assistant'; content: string }

const SUGGESTIONS = [
  'What kind of strategist is Dillon?',
  'Walk me through the Apollo work',
  'How does he approach a brief?',
]

// Render the assistant's light Markdown: [links](/path) and **bold**.
function rich(text: string): ReactNode[] {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g)
  return parts.map((p, i) => {
    const link = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (link) {
      const [, label, href] = link
      return href.startsWith('/') ? (
        <Link key={i} href={href} className="text-accent underline underline-offset-4">
          {label}
        </Link>
      ) : (
        <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-4">
          {label}
        </a>
      )
    }
    const bold = p.match(/^\*\*([^*]+)\*\*$/)
    if (bold) return <strong key={i} className="font-semibold">{bold[1]}</strong>
    return <Fragment key={i}>{p}</Fragment>
  })
}

export default function ChatBar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [turns, setTurns] = useState<Turn[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const scroller = useRef<HTMLDivElement>(null)
  const field = useRef<HTMLInputElement>(null)

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight })
  }, [turns])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (pathname?.startsWith('/studio')) return null

  async function ask(question: string) {
    const q = question.trim()
    if (!q || busy) return
    const history: Turn[] = [...turns, { role: 'user', content: q }]
    setTurns([...history, { role: 'assistant', content: '' }])
    setInput('')
    setOpen(true)
    setBusy(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, page: pathname }),
      })
      if (!res.ok || !res.body) throw new Error(await res.text())
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let answer = ''
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        answer += decoder.decode(value, { stream: true })
        setTurns([...history, { role: 'assistant', content: answer }])
      }
      if (!answer.trim()) throw new Error('')
    } catch (e) {
      const msg = e instanceof Error && e.message ? e.message : 'Something went wrong. Please try again, or email dillon.key@gmail.com.'
      setTurns([...history, { role: 'assistant', content: msg }])
    } finally {
      setBusy(false)
      field.current?.focus()
    }
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-4 sm:pb-6">
      <div className="pointer-events-auto mx-auto w-full max-w-xl">
        {open && (
          <div
            role="dialog"
            aria-label="Ask about Dillon's work"
            className="mb-2 overflow-hidden rounded-2xl border border-rule bg-paper shadow-[0_8px_40px_-12px_rgb(0_0_0/0.25)]"
          >
            <div className="flex items-center justify-between border-b border-rule px-4 py-2.5">
              <p className="text-meta text-muted">Dillon&rsquo;s assistant</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="-mr-1 rounded-md px-2 py-1 text-meta text-muted hover:text-ink"
                aria-label="Close chat"
              >
                Close
              </button>
            </div>
            <div ref={scroller} className="max-h-[min(55vh,28rem)] space-y-4 overflow-y-auto px-4 py-4" aria-live="polite">
              {turns.length === 0 ? (
                <div>
                  <p className="text-muted text-pretty">
                    Ask about Dillon&rsquo;s clients, how he works, or his background. Answers come from this site and his resume.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => ask(s)}
                        className="rounded-full border border-rule px-3 py-1.5 text-meta text-ink hover:border-accent hover:text-accent"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                turns.map((t, i) =>
                  t.role === 'user' ? (
                    <p key={i} className="ml-auto w-fit max-w-[85%] rounded-2xl bg-wash px-3.5 py-2 text-pretty">
                      {t.content}
                    </p>
                  ) : (
                    <p key={i} className="max-w-[95%] whitespace-pre-line text-pretty">
                      {t.content ? rich(t.content) : <span className="text-muted">Thinking…</span>}
                    </p>
                  ),
                )
              )}
            </div>
            <p className="border-t border-rule px-4 py-2 text-[0.75rem] leading-snug text-muted">
              AI assistant. Answers can be wrong. Questions are saved anonymously so Dillon can improve the site.
            </p>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault()
            ask(input)
          }}
          className="flex items-center gap-2 rounded-full border border-rule bg-paper py-1.5 pr-1.5 pl-5 shadow-[0_8px_30px_-12px_rgb(0_0_0/0.25)] focus-within:border-accent"
        >
          <label htmlFor="chat-input" className="sr-only">
            Ask about Dillon&rsquo;s work
          </label>
          <input
            id="chat-input"
            ref={field}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setOpen(true)}
            maxLength={500}
            autoComplete="off"
            placeholder="Ask about Dillon’s work"
            className="min-w-0 flex-1 bg-transparent py-1.5 text-ink outline-none placeholder:text-muted"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            aria-label="Send"
            className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-paper transition-opacity disabled:opacity-40"
          >
            <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react'

type Turn = { role: 'user' | 'assistant'; content: string }

const SUGGESTIONS = [
  // Fetch
  'What was the insight behind Love Longer?',
  'How did Dillon find white space in pet insurance?',
  'What did the Fetch competitive audit show?',
  'How do most pet insurers market themselves?',
  'What four criteria shaped the Fetch platform?',
  'How did the Fetch work rewrite the reasons to believe?',
  'What does the Love Longer creative look like?',
  'What role did Dillon play on Fetch?',
  // Hackensack Meridian Health
  'Why “Don’t Mind Your Own Business”?',
  'How did the Hackensack campaign turn staring into action?',
  'Where did the World Cup campaign run?',
  'Why not use “see something, say something”?',
  'What behavior was the Hackensack campaign trying to change?',
  'Why is minding your own business so strong in New York?',
  'What did the campaign give people to do next?',
  'How big was the audience for the World Cup campaign?',
  // American Express
  'How did Dillon reframe Amex’s B2B payments?',
  'What were the three shifts for Buyer Initiated Payments?',
  'Why build the One AP message around control?',
  'What was wrong with how Amex sold B2B payments?',
  'How do CFOs think about working capital?',
  'What went into the Amex messaging playbooks?',
  'How did field interviews shape the Amex work?',
  'What competitive intelligence did Dillon run for Amex?',
  // Diageo
  'What does “stages, not ages” mean?',
  'How was the Diageo research structured?',
  'What surprised the team about young drinkers?',
  'How do young drinkers relate to brands?',
  'What are mid-tempo third spaces?',
  'What did Dillon lead on the Diageo project?',
  'How did the OODA loop shape the Diageo findings?',
  'What does authenticity mean to this audience?',
  // Apollo
  'How did Dillon simplify Apollo for ten audiences?',
  'What is the audience decision journey?',
  'When does Apollo’s messaging shift from firm to product?',
  'How do wealth advisors and institutions decide differently?',
  'Who are Apollo’s ten audiences?',
  'What was wrong with Apollo’s old materials?',
  'What happens at the “moment of stress” stage?',
  'Which Apollo materials were rewritten?',
  'Why is wealth a two-step sale?',
  // Across the work
  'What do these five cases have in common?',
  'How does Dillon turn research into strategy?',
  'Which cases are in financial services?',
  'Which case shows his research skills best?',
  'How does Dillon use competitive audits?',
  'Which cases led to a campaign in market?',
  'How does Dillon make complex products simple?',
  'What kinds of frameworks does Dillon build?',
  'Which case is the best example of a reframe?',
]

const SHOWN = 5
// First set, one per case, so the server and browser render the same thing.
const FIRST_SET = [0, 8, 16, 24, 32]

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
  const [shown, setShown] = useState<number[]>(FIRST_SET)
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

  // Five new questions, none repeated from the current set.
  function shuffle() {
    const pool = SUGGESTIONS.map((_, i) => i).filter((i) => !shown.includes(i))
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[pool[i], pool[j]] = [pool[j], pool[i]]
    }
    setShown(pool.slice(0, SHOWN))
  }

  // Put the suggestion in the box for the visitor to edit; they choose when to send.
  function applySuggestion(text: string) {
    setInput(text)
    requestAnimationFrame(() => {
      const el = field.current
      if (!el) return
      el.focus()
      el.setSelectionRange(el.value.length, el.value.length)
    })
  }

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
            <div className="flex items-center gap-3 border-b border-rule px-4 py-2.5">
              <button
                type="button"
                onClick={shuffle}
                className="shrink-0 rounded-full border border-rule px-3 py-1 text-meta text-ink hover:border-accent hover:text-accent"
              >
                Shuffle questions
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="-mr-1 ml-auto rounded-md px-2 py-1 text-meta text-muted hover:text-ink"
                aria-label="Close chat"
              >
                Close
              </button>
            </div>
            <div ref={scroller} className="max-h-[min(55vh,28rem)] space-y-4 overflow-y-auto px-4 py-4" aria-live="polite">
              {turns.map((t, i) =>
                  t.role === 'user' ? (
                    <p key={i} className="ml-auto w-fit max-w-[85%] rounded-2xl bg-wash px-3.5 py-2 text-pretty">
                      {t.content}
                    </p>
                  ) : (
                    <p key={i} className="max-w-[95%] whitespace-pre-line text-pretty">
                      {t.content ? rich(t.content) : <span className="text-muted">Thinking…</span>}
                    </p>
                  ),
              )}
              {!busy && (
                <ul aria-label="Suggested questions" className={`-mx-2 ${turns.length ? 'border-t border-rule pt-3' : ''}`}>
                  {shown.map((i) => (
                    <li key={i}>
                      <button
                        type="button"
                        onClick={() => applySuggestion(SUGGESTIONS[i])}
                        className="w-full rounded-lg px-2 py-1.5 text-left text-[0.8125rem] leading-snug text-muted hover:bg-wash hover:text-ink"
                      >
                        {SUGGESTIONS[i]}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault()
            ask(input)
          }}
          className="flex items-center gap-2 rounded-full border border-rule bg-paper py-1.5 pr-1.5 pl-5 shadow-[0_8px_30px_-12px_rgb(0_0_0/0.25)]"
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
            className="min-w-0 flex-1 bg-transparent py-1.5 text-ink caret-accent outline-none placeholder:text-muted"
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

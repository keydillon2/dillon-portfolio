'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { site } from '@/lib/site'
import { track } from '@/lib/analytics'
import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react'

type Turn = { role: 'user' | 'assistant'; content: string }

/** What the chat needs to show a case as a card. */
export interface ChatCase {
  slug: string
  client: string
  title: string
  skills: string[]
  thumb: string | null
}

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

const SHOWN = 4
// First set, one per case, so the server and browser render the same thing.
const FIRST_SET = [0, 8, 16, 24]

// Shortcuts into the most common recruiter questions.
const CHIPS = [
  { label: 'Fit for a role', q: 'I’m hiring for a brand strategy role. Which of Dillon’s work is most relevant?' },
  { label: 'Positioning', q: 'Show me Dillon’s positioning work.' },
  { label: 'Product marketing', q: 'What product marketing has Dillon done?' },
  { label: 'Financial services', q: 'What has Dillon done in financial services?' },
  { label: 'Resume', q: 'Give me a quick summary of Dillon’s experience.' },
]

// The placeholder types these out in turn, so visitors see what they can ask.
const TEASERS = [
  'Is Dillon a fit for a fintech brand role?',
  'Show me his positioning work',
  'What did he do for HSFT?',
  'Has he done product marketing?',
  'How does he run discovery?',
]

const MARKER = 'FOLLOWUPS:'

/** Splits an answer into the text to show and the suggested follow-ups. */
function parse(raw: string) {
  const at = raw.indexOf(MARKER)
  if (at !== -1) {
    const followups = raw
      .slice(at + MARKER.length)
      .split('|')
      .map((q) => q.trim().replace(/^[-*\d.\s]+/, ''))
      .filter((q) => q.length > 3)
      .slice(0, 3)
    return { text: raw.slice(0, at).trimEnd(), followups }
  }
  // While streaming, hide a marker that has only partly arrived.
  for (let k = MARKER.length - 1; k > 0; k--) {
    if (raw.endsWith(MARKER.slice(0, k))) return { text: raw.slice(0, -k).trimEnd(), followups: [] }
  }
  return { text: raw, followups: [] }
}

/** Case pages the answer links to, in order, without repeats. */
function citedSlugs(text: string) {
  return [...new Set([...text.matchAll(/\]\(\/work\/([a-z0-9-]+)\)/g)].map((m) => m[1]))]
}

// Render the assistant's light Markdown: [links](/path) and **bold**.
function rich(text: string, current?: string): ReactNode[] {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g)
  return parts.map((p, i) => {
    const link = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (link) {
      const [, label, href] = link
      // Links come from model output, so only two kinds are clickable: a page
      // on this site (a single leading slash) or Dillon's LinkedIn profile.
      // Anything else, or the page the visitor is already on, shows as text.
      const internal = /^\/(?!\/)[\w\-/#?=&.]*$/.test(href)
      const external = href.replace(/\/$/, '') === site.linkedin.replace(/\/$/, '')
      if ((!internal && !external) || href === current) return <Fragment key={i}>{label}</Fragment>
      return internal ? (
        <Link key={i} href={href} className="text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent">
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

/** Types the teaser questions into the placeholder, one after another. */
function useTypedPlaceholder(enabled: boolean, fallback: string) {
  const [text, setText] = useState<string | null>(null)
  useEffect(() => {
    if (!enabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let i = 0
    let n = 0
    let deleting = false
    let timer: ReturnType<typeof setTimeout>
    const tick = () => {
      const full = TEASERS[i]
      n += deleting ? -1 : 1
      setText(full.slice(0, n))
      let wait = deleting ? 28 : 55
      if (!deleting && n === full.length) {
        deleting = true
        wait = 2200
      } else if (deleting && n === 0) {
        deleting = false
        i = (i + 1) % TEASERS.length
        wait = 400
      }
      timer = setTimeout(tick, wait)
    }
    timer = setTimeout(tick, 1200)
    return () => clearTimeout(timer)
  }, [enabled])
  return enabled && text ? text : fallback
}

function CaseCard({ c }: { c: ChatCase }) {
  return (
    <Link
      href={`/work/${c.slug}`}
      onClick={() => track('chat_case_card', { case: c.slug })}
      className="group/card flex w-60 shrink-0 flex-col overflow-hidden rounded-xl border border-rule bg-paper transition-colors hover:border-accent"
    >
      <div className="relative aspect-[16/9] bg-ink">
        {c.thumb ? (
          <Image src={c.thumb} alt="" fill sizes="240px" className="object-cover transition-transform duration-500 group-hover/card:scale-[1.03]" />
        ) : (
          <p className="absolute inset-x-0 bottom-0 p-3 text-[0.8125rem] leading-tight font-semibold text-paper">{c.title}</p>
        )}
      </div>
      <div className="p-3">
        <p className="text-[0.8125rem] font-medium leading-snug">{c.client}</p>
        <p className="mt-0.5 text-[0.75rem] text-muted">{c.skills.slice(0, 2).join(' · ') || c.title}</p>
      </div>
    </Link>
  )
}

function Typing() {
  return (
    <span className="inline-flex items-center gap-1 py-2" aria-label="Thinking">
      {[0, 1, 2].map((i) => (
        <span key={i} className="chat-dot size-1.5 rounded-full bg-accent" style={{ animationDelay: `${i * 150}ms` }} />
      ))}
    </span>
  )
}

export default function ChatBar({ cases }: { cases: ChatCase[] }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [turns, setTurns] = useState<Turn[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [focused, setFocused] = useState(false)
  const [shown, setShown] = useState<number[]>(FIRST_SET)
  const scroller = useRef<HTMLDivElement>(null)
  const field = useRef<HTMLInputElement>(null)

  // On a case page, the chat is about that case.
  const here = cases.find((c) => pathname === `/work/${c.slug}`)
  const fallback = here ? `Ask about the ${here.client} work` : 'Ask about Dillon’s work'
  const placeholder = useTypedPlaceholder(!here && !focused && !input && !open, fallback)

  // When a question is asked, bring it to the top of the panel; the answer fills in below it.
  const asked = turns.filter((t) => t.role === 'user').length
  useEffect(() => {
    const box = scroller.current
    const latest = box?.querySelector<HTMLElement>('[data-question]:last-of-type')
    if (box && latest) box.scrollTo({ top: latest.offsetTop - 8, behavior: 'smooth' })
  }, [asked])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(true)
        field.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (pathname?.startsWith('/studio')) return null

  // New questions, none repeated from the current set.
  function shuffle() {
    const pool = SUGGESTIONS.map((_, i) => i).filter((i) => !shown.includes(i))
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[pool[i], pool[j]] = [pool[j], pool[i]]
    }
    setShown(pool.slice(0, SHOWN))
  }

  // Put a question in the box for the visitor to edit; they choose when to send.
  function prefill(text: string) {
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
    // Count the question and its place in the conversation; never send the text.
    track('chat_question', { turn: history.filter((t) => t.role === 'user').length, from: pathname ?? '' })
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

  const bySlug = new Map(cases.map((c) => [c.slug, c]))
  const lastAnswer = turns.at(-1)?.role === 'assistant' ? parse(turns.at(-1)!.content) : null

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-0 pb-0 sm:px-4 sm:pb-6">
      {open && (
        <button
          type="button"
          aria-label="Close chat"
          onClick={() => setOpen(false)}
          className="chat-fade pointer-events-auto fixed inset-0 -z-10 bg-ink/10 backdrop-blur-[2px]"
        />
      )}
      <div className="pointer-events-auto mx-auto w-full max-w-2xl">
        {open && (
          <div
            role="dialog"
            aria-label="Ask about Dillon's work"
            className="chat-rise fixed inset-0 flex flex-col overflow-hidden border-rule bg-paper/90 backdrop-blur-2xl sm:static sm:mb-3 sm:max-h-[min(72vh,44rem)] sm:rounded-3xl sm:border sm:shadow-[0_24px_80px_-24px_rgb(0_0_0/0.35)]"
          >
            <div className="flex items-center gap-3 px-5 pt-4 pb-3 sm:px-6">
              <p className="text-[0.6875rem] font-semibold tracking-[0.18em] text-accent uppercase">Ask Dillon&rsquo;s portfolio</p>
              <div className="ml-auto flex items-center gap-1">
                {turns.length > 0 && !busy && (
                  <button
                    type="button"
                    onClick={() => setTurns([])}
                    className="rounded-full px-3 py-1 text-meta text-muted hover:bg-wash hover:text-ink"
                  >
                    New chat
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="grid size-8 place-items-center rounded-full text-muted hover:bg-wash hover:text-ink"
                  aria-label="Close chat"
                >
                  <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 2l10 10M12 2 2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>

            <div ref={scroller} className="relative min-h-0 flex-1 overflow-y-auto px-5 pb-5 sm:px-6" aria-live="polite">
              {turns.length === 0 ? (
                <div className="chat-fade pt-2 pb-2">
                  <p className="max-w-[22ch] text-[1.75rem] leading-[1.1] font-semibold tracking-[-0.025em] text-balance sm:text-[2.125rem]">
                    {here ? `What would you like to know about the ${here.client} work?` : 'What would you like to know about Dillon’s work?'}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {CHIPS.map((c) => (
                      <button
                        key={c.label}
                        type="button"
                        onClick={() => {
                          track('chat_suggestion', { kind: 'chip', label: c.label })
                          prefill(c.q)
                        }}
                        className="rounded-full border border-rule bg-paper px-3.5 py-1.5 text-[0.8125rem] transition-colors hover:border-accent hover:text-accent"
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                  <div className="mt-8 border-t border-rule pt-4">
                    <div className="flex items-center">
                      <p className="text-meta text-muted">Or try one of these</p>
                      <button type="button" onClick={shuffle} className="ml-auto text-meta text-accent hover:underline">
                        More questions
                      </button>
                    </div>
                    <ul className="mt-2 -mx-2">
                      {shown.map((i) => (
                        <li key={i}>
                          <button
                            type="button"
                            onClick={() => {
                              track('chat_suggestion', { kind: 'starter' })
                              prefill(SUGGESTIONS[i])
                            }}
                            className="group/q flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-wash"
                          >
                            <span className="flex-1">{SUGGESTIONS[i]}</span>
                            <span aria-hidden className="text-muted transition-transform group-hover/q:translate-x-0.5 group-hover/q:text-accent">→</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-10 pt-2">
                  {turns.map((t, i) =>
                    t.role === 'user' ? (
                      <p key={i} data-question className="chat-fade text-[1.375rem] leading-[1.15] font-semibold tracking-[-0.02em] text-balance sm:text-[1.625rem]">
                        {t.content}
                      </p>
                    ) : (
                      <Answer key={i} raw={t.content} bySlug={bySlug} current={pathname ?? undefined} />
                    ),
                  )}
                  {!busy && lastAnswer && lastAnswer.followups.length > 0 && (
                    <div className="chat-fade -mt-4 flex flex-wrap gap-2" aria-label="Suggested follow-up questions">
                      {lastAnswer.followups.map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => {
                            track('chat_suggestion', { kind: 'followup' })
                            prefill(q)
                          }}
                          className="rounded-full border border-rule bg-paper px-3.5 py-1.5 text-left text-[0.8125rem] transition-colors hover:border-accent hover:text-accent"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault()
            ask(input)
          }}
          className={`relative mx-4 mb-4 flex items-center gap-2 rounded-full border border-rule bg-paper/90 py-1.5 pr-1.5 pl-5 shadow-[0_10px_40px_-14px_rgb(0_0_0/0.3)] backdrop-blur-xl transition-[border-color] focus-within:border-accent sm:mx-0 sm:mb-0 ${open ? 'max-sm:fixed max-sm:inset-x-0 max-sm:bottom-0 max-sm:z-10' : ''}`}
        >
          <label htmlFor="chat-input" className="sr-only">
            Ask about Dillon&rsquo;s work
          </label>
          <input
            id="chat-input"
            ref={field}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => {
              setFocused(true)
              if (!open) track('chat_open', { from: pathname ?? '' })
              setOpen(true)
            }}
            onBlur={() => setFocused(false)}
            maxLength={500}
            autoComplete="off"
            placeholder={placeholder}
            className="min-w-0 flex-1 bg-transparent py-1.5 text-ink caret-accent outline-none placeholder:text-muted"
          />
          {!open && (
            <kbd className="hidden shrink-0 rounded-md border border-rule px-1.5 py-0.5 font-sans text-[0.6875rem] text-muted sm:block">⌘K</kbd>
          )}
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

/** One answer: the text as it streams, then cards for the cases it cites. */
function Answer({ raw, bySlug, current }: { raw: string; bySlug: Map<string, ChatCase>; current?: string }) {
  const { text } = parse(raw)
  if (!text) return <Typing />
  // No card for the case the visitor is already reading.
  const cards = citedSlugs(text)
    .filter((s) => `/work/${s}` !== current)
    .map((s) => bySlug.get(s))
    .filter((c): c is ChatCase => Boolean(c))
  return (
    <div className="chat-fade">
      <p className="max-w-[62ch] whitespace-pre-line text-pretty leading-[1.65]">{rich(text, current)}</p>
      {cards.length > 0 && (
        <div className="-mx-5 mt-5 flex gap-3 overflow-x-auto px-5 pb-1 sm:-mx-6 sm:px-6">
          {cards.map((c) => (
            <CaseCard key={c.slug} c={c} />
          ))}
        </div>
      )}
    </div>
  )
}

import type { Metadata } from 'next'
import ScrollText from '../components/ScrollText'

export const metadata: Metadata = {
  title: 'Side Projects',
  description: 'Side projects by Dillon Key: writing and tools built outside client work. Coming soon.',
  alternates: { canonical: '/side-projects' },
}

export default function SideProjectsPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-6xl flex-col px-6 pt-32 pb-24 sm:pt-44">
      <h1 className="text-meta font-medium text-muted">Side Projects</h1>
      <ScrollText
        className="mt-4 max-w-[20ch] text-[2rem] leading-[1.1] font-semibold tracking-[-0.03em] sm:text-[3.25rem] text-balance"
        text="Writing and tools I build outside client work."
      />
      <p className="mt-10 inline-flex items-center gap-3 text-meta text-muted">
        <span aria-hidden className="size-2 animate-pulse rounded-full bg-accent" />
        Coming soon
      </p>
    </main>
  )
}

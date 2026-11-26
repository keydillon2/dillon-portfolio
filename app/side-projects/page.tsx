import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Side Projects',
  description: 'Side projects by Dillon Key. Coming soon.',
  alternates: { canonical: '/side-projects' },
}

export default function SideProjectsPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-6xl flex-col px-6 pt-32 pb-24 sm:pt-44">
      <h1 className="text-meta font-medium text-muted">Side Projects</h1>
      <p className="mt-4 inline-flex items-center gap-4 text-[2rem] leading-[1.1] font-semibold tracking-[-0.03em] sm:text-[3.25rem]">
        <span aria-hidden className="size-3 animate-pulse rounded-full bg-accent sm:size-4" />
        Coming soon
      </p>
    </main>
  )
}

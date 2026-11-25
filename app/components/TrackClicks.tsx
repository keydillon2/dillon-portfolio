'use client'

import { useEffect } from 'react'
import { track } from '@/lib/analytics'

/*
 * One listener for the clicks worth counting: email, LinkedIn, the resume page
 * and case studies (with where the click came from). Google's enhanced
 * measurement already records page views, scrolling and outbound links.
 */
export default function TrackClicks() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a')
      if (!a) return
      const href = a.getAttribute('href') ?? ''
      const from = window.location.pathname
      if (href.startsWith('mailto:')) track('contact_email', { from })
      else if (href.includes('linkedin.com')) track('contact_linkedin', { from })
      else if (href === '/resume') track('resume_open', { from })
      else if (href.startsWith('/work/')) track('case_open', { case: href.slice(6), from })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
  return null
}

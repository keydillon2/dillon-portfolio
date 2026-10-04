'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Links shared before case pages existed point at /#work-<slug>.
 * The hash never reaches the server, so redirect on the client.
 */
export default function HashRedirect({ slugs }: { slugs: string[] }) {
  const router = useRouter()
  useEffect(() => {
    const m = window.location.hash.match(/^#work-(.+)$/)
    if (m && slugs.includes(m[1])) router.replace(`/work/${m[1]}`)
  }, [router, slugs])
  return null
}

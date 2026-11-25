import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/studio', '/questions', '/api/'] },
      // AI search and assistant crawlers are welcome: being cited by them is the point.
      {
        userAgent: ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended'],
        allow: '/',
        disallow: ['/studio', '/questions', '/api/'],
      },
    ],
    sitemap: `${siteUrl()}/sitemap.xml`,
  }
}

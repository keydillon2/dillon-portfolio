import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { site } from './site'

// Share images (LinkedIn, Slack, iMessage previews) use the site's own
// typefaces, vendored as .woff because the image renderer can't read woff2.
const font = (file: string) => readFile(join(process.cwd(), 'assets/fonts', file))

export const ogSize = { width: 1200, height: 630 }

export async function renderOg({ eyebrow, headline }: { eyebrow: string; headline: string }) {
  const [semibold, medium] = await Promise.all([
    font('schibsted-grotesk-latin-600-normal.woff'),
    font('schibsted-grotesk-latin-500-normal.woff'),
  ])
  const size = headline.length > 70 ? 60 : 72

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: '#fbfbf9',
          color: '#1a1d24',
          fontFamily: 'Schibsted',
        }}
      >
        <div style={{ display: 'flex', fontSize: 28, fontWeight: 500, color: '#5b606b' }}>{eyebrow}</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: 72, height: 6, background: '#2b3fd6', marginBottom: 36 }} />
          <div style={{ fontSize: size, fontWeight: 600, lineHeight: 1.08, letterSpacing: '-0.03em', maxWidth: 1000 }}>
            {headline}
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: 26, fontWeight: 500 }}>
          {site.name}
          <span style={{ color: '#5b606b', marginLeft: 10 }}>{site.role}</span>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: 'Schibsted', data: semibold, weight: 600, style: 'normal' },
        { name: 'Schibsted', data: medium, weight: 500, style: 'normal' },
      ],
    }
  )
}

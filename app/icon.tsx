import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// Browser-tab icon: a "D" monogram in the site's typeface, ink on paper
// with a cobalt underline, legible at 16px.
export const size = { width: 64, height: 64 }
export const contentType = 'image/png'

export default async function Icon() {
  const semibold = await readFile(join(process.cwd(), 'assets/fonts/schibsted-grotesk-latin-600-normal.woff'))
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1a1d24',
          borderRadius: 14,
          color: '#fbfbf9',
          fontFamily: 'Schibsted',
        }}
      >
        <div style={{ fontSize: 44, fontWeight: 600, lineHeight: 1, marginTop: -2 }}>D</div>
        <div style={{ width: 26, height: 5, background: '#8f9dff', marginTop: 3 }} />
      </div>
    ),
    { ...size, fonts: [{ name: 'Schibsted', data: semibold, weight: 600, style: 'normal' }] }
  )
}

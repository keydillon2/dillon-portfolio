import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// Home-screen icon on iOS: the "DK" monogram.
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default async function AppleIcon() {
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
          color: '#fbfbf9',
          fontFamily: 'Schibsted',
        }}
      >
        <div style={{ fontSize: 84, fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1 }}>DK</div>
        <div style={{ width: 64, height: 9, background: '#8f9dff', marginTop: 10 }} />
      </div>
    ),
    { ...size, fonts: [{ name: 'Schibsted', data: semibold, weight: 600, style: 'normal' }] }
  )
}

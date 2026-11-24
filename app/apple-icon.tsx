import { ImageResponse } from 'next/og'

// Home-screen icon on iOS: a plain cobalt square, matching the browser tab icon.
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(<div style={{ width: '100%', height: '100%', background: '#2b3fd6' }} />, size)
}

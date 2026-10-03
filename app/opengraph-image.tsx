import { renderOg, ogSize } from '@/lib/og'
import { site } from '@/lib/site'

export const alt = `${site.name}, ${site.role}`
export const size = ogSize
export const contentType = 'image/png'

export default function Image() {
  return renderOg({ eyebrow: 'Strategy portfolio', headline: site.lede })
}

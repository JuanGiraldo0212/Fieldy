import { ImageResponse } from 'next/og'
import { HOME_DESCRIPTION } from '@/lib/seo'

/*
  The card a link to the catalog shows in a text message or a staff-room
  chat. Generated rather than a checked-in PNG so the copy stays with the
  copy in src/lib/seo, and so an outing page without a usable venue photo
  inherits it (metadata images cascade from the root segment).

  Same sun as src/app/icon.svg and SunMark in src/components/ui/logo.tsx, the
  colours written out because this renders in the image runtime, which reads
  no CSS.
*/
export const alt = 'Fieldy. Field trips for Victoria BC classrooms and daycares.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const RAYS = [0, 45, 90, 135, 180, 225, 270, 315]

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '72px 88px',
          background: 'linear-gradient(135deg, #f5f9ff 0%, #ffffff 60%)',
          color: '#16202b',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <svg width="112" height="112" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="7.2" fill="#f6c445" />
            <g stroke="#1668d6" strokeWidth="3.4" strokeLinecap="round">
              {RAYS.map((deg) => (
                <line
                  key={deg}
                  x1="24"
                  y1="11.5"
                  x2="24"
                  y2="6.7"
                  transform={`rotate(${deg} 24 24)`}
                />
              ))}
            </g>
          </svg>
          <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -2 }}>Fieldy</div>
        </div>
        <div style={{ fontSize: 44, fontWeight: 600, marginTop: 40, lineHeight: 1.2 }}>
          Field trips for Victoria BC classrooms and daycares
        </div>
        <div style={{ fontSize: 28, color: '#5b6b7c', marginTop: 24, lineHeight: 1.4, maxWidth: 960 }}>
          {HOME_DESCRIPTION}
        </div>
      </div>
    ),
    size,
  )
}

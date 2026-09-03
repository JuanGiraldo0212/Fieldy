/*
  The Fieldy logo: a sun mark and the wordmark beside it.

  Drawn as vectors rather than shipped as a bitmap so it stays sharp at every
  size, inherits the type scale, and costs no network request. The wordmark is
  the display face already loaded for headings — one font, not two.

  Colours are tokens (see globals.css, "Logo"). src/app/icon.svg is the same
  eight rays as a static file for the favicon; change one and change the other.
*/

/* Eight rays at 45°, four colours cycling twice, so no two neighbours match
   and the mark stays balanced however it is rotated in someone's memory. */
const RAYS = [
  { angle: 0, color: 'var(--color-sun-ray-amber)' },
  { angle: 45, color: 'var(--color-sun-ray-lavender)' },
  { angle: 90, color: 'var(--color-sun-ray-teal)' },
  { angle: 135, color: 'var(--color-sun-ray-coral)' },
  { angle: 180, color: 'var(--color-sun-ray-amber)' },
  { angle: 225, color: 'var(--color-sun-ray-lavender)' },
  { angle: 270, color: 'var(--color-sun-ray-teal)' },
  { angle: 315, color: 'var(--color-sun-ray-coral)' },
]

export function SunMark({
  size = 34,
  className,
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      /* Decorative next to the wordmark; the text carries the name. Callers
         that use the mark alone pass their own label. */
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="24" cy="24" r="7.2" fill="var(--color-sun-core)" />
      {/* The gap is the mark. Round caps reach half the stroke width past each
          endpoint, so the drawn ray runs radius 10.8 to 19 — a clear 3.6 of
          air off the 7.2 core. Move an endpoint and check the caps, not the
          numbers. */}
      {RAYS.map((r) => (
        <line
          key={r.angle}
          x1="24"
          y1="11.5"
          x2="24"
          y2="6.7"
          stroke={r.color}
          strokeWidth="3.4"
          strokeLinecap="round"
          transform={`rotate(${r.angle} 24 24)`}
        />
      ))}
    </svg>
  )
}

/*
  Mark plus wordmark. `size` drives the mark; the wordmark keeps its own type
  token so the two stay in proportion wherever this sits.
*/
export function Logo({
  size = 34,
  className,
}: {
  size?: number
  className?: string
}) {
  return (
    /* Tight gap on purpose. The mark's own viewBox carries ~5 units of padding
       on every side, so anything roomier reads as two separate things sitting
       near each other rather than one logo. */
    <span className={`flex items-center gap-1 ${className ?? ''}`}>
      <SunMark size={size} />
      <span className="font-display text-brand-size text-text font-bold">
        Fieldy
      </span>
    </span>
  )
}

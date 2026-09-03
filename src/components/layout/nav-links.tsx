'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cx } from '@/components/ui'

/*
  The nav items. A client component only because it needs to know which route
  is current; the bar around it stays a Server Component so a signed-out
  visitor's HTML arrives complete.

  Selection is a ring over a white fill rather than a coloured pill, which is
  how the design marks every other active thing.
*/

type Item = { href: string; label: string; count?: number }

export function NavLinks({ signedIn }: { signedIn: boolean }) {
  const pathname = usePathname()

  const items: Item[] = [
    { href: '/', label: 'Find outings' },
    ...(signedIn
      ? [
          { href: '/trips', label: 'My trips' },
          { href: '/rooms', label: 'Groups' },
        ]
      : []),
  ]

  return (
    <>
      {items.map((item) => {
        const active =
          item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cx(
              'text-body-sm text-text-strong relative flex items-center gap-[7px] rounded-pill px-3.5 py-2.5 font-semibold no-underline',
              active ? 'bg-surface' : 'hover:bg-surface-3',
            )}
          >
            {active ? (
              <span
                aria-hidden
                className="absolute inset-0 rounded-pill"
                style={{ boxShadow: 'inset 0 0 0 1.5px var(--color-brand)' }}
              />
            ) : null}
            <span className="relative">{item.label}</span>
            {item.count != null ? (
              <span className="bg-brand-tint text-text-muted text-label relative min-w-[21px] rounded-pill px-1.5 py-px text-center font-bold">
                {item.count}
              </span>
            ) : null}
          </Link>
        )
      })}
    </>
  )
}

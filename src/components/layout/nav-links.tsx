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

type Item = {
  href: string
  label: string
  count?: number
  /* The design's two pills: grey for a plain count, brand for something
     that needs her. */
  tone?: 'grey' | 'brand'
}

export function NavLinks({
  signedIn,
  tripCount = 0,
  unreadCount = 0,
}: {
  signedIn: boolean
  tripCount?: number
  unreadCount?: number
}) {
  const pathname = usePathname()

  /*
    The design puts the unread count on My trips, because it has no inbox.
    Spec §5.7 gives the inbox its own nav item "with an unread count", so the
    brand pill moves there and My trips keeps the design's grey trip count.
    Logged in docs/design-gaps.md. Inbox shows no pill at all when there is
    nothing unread: a grey zero is a nag.
  */
  const items: Item[] = [
    { href: '/', label: 'Find outings' },
    ...(signedIn
      ? [
          { href: '/trips', label: 'My trips', count: tripCount, tone: 'grey' as const },
          {
            href: '/inbox',
            label: 'Inbox',
            count: unreadCount > 0 ? unreadCount : undefined,
            tone: 'brand' as const,
          },
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
              'text-body-sm text-text-strong relative flex items-center gap-[7px] rounded-pill px-3 py-2.5 font-semibold whitespace-nowrap no-underline sm:px-3.5',
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
              <span
                className={cx(
                  'text-label relative min-w-[21px] rounded-pill px-1.5 py-px text-center font-bold',
                  item.tone === 'brand'
                    ? 'bg-brand text-white'
                    : 'bg-disabled text-text-muted',
                )}
              >
                {item.count}
              </span>
            ) : null}
          </Link>
        )
      })}
    </>
  )
}

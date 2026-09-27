'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
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

export type NavProps = {
  signedIn: boolean
  isAdmin?: boolean
  tripCount?: number
  unreadCount?: number
}

/*
  The design puts the unread count on My trips, because it has no inbox.
  Spec §5.7 gives the inbox its own nav item "with an unread count", so the
  brand pill moves there and My trips keeps the design's grey trip count.
  Logged in docs/design-gaps.md. Inbox shows no pill at all when there is
  nothing unread: a grey zero is a nag.
*/
function navItems({
  signedIn,
  isAdmin = false,
  tripCount = 0,
  unreadCount = 0,
}: NavProps): Item[] {
  return [
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
    /* Only for us, for now. The catalog editor; see src/app/admin. */
    ...(isAdmin ? [{ href: '/admin', label: 'Admin' }] : []),
  ]
}

function isCurrent(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href)
}

function CountPill({ count, tone }: { count: number; tone?: 'grey' | 'brand' }) {
  return (
    <span
      className={cx(
        'text-label relative min-w-[21px] rounded-pill px-1.5 py-px text-center font-bold',
        tone === 'brand' ? 'bg-brand text-white' : 'bg-disabled text-text-muted',
      )}
    >
      {count}
    </span>
  )
}

export function NavLinks(props: NavProps) {
  const pathname = usePathname()

  return (
    <>
      {navItems(props).map((item) => {
        const active = isCurrent(pathname, item.href)
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
              <CountPill count={item.count} tone={item.tone} />
            ) : null}
          </Link>
        )
      })}
    </>
  )
}

/*
  The phone's nav. The design's mobile bar is a lockup, the region, and a
  hamburger — nothing else — because five pills and an avatar do not fit a
  390px row and wrapping them costs a whole line above the fold, which is the
  line the search field wants.

  The panel is a plain list under the bar rather than a full-screen overlay:
  it is at most six rows, and covering the catalog to show six rows is a
  bigger gesture than the job needs.
*/
export function MobileNav({
  account,
  ...props
}: NavProps & {
  /* Signed in but with no group yet still has an account to reach; that is
     not the same question as whether the trip and inbox items exist. */
  account?: { email: string; initials: string | null } | null
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const items = navItems(props)

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? 'Close menu' : 'Menu'}
        className="border-border-strong bg-surface text-text flex h-avatar w-avatar items-center justify-center rounded-control border"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open ? (
        <div
          id="mobile-nav"
          /* A tap that navigates would otherwise leave the panel open over
             the page it just opened. */
          onClick={() => setOpen(false)}
          className="border-border bg-surface shadow-popover absolute top-[calc(100%+6px)] right-5 left-5 z-50 rounded-card border p-2"
        >
          {items.map((item) => {
            const active = isCurrent(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cx(
                  'text-body text-text-strong flex items-center gap-2 rounded-control px-3 py-3 font-semibold no-underline',
                  active && 'bg-brand-tint text-brand',
                )}
              >
                <span className="flex-1">{item.label}</span>
                {item.count != null ? (
                  <CountPill count={item.count} tone={item.tone} />
                ) : null}
              </Link>
            )
          })}

          <div className="border-border mt-2 border-t pt-2">
            {account ? (
              <Link
                href="/account"
                className="text-body text-text-strong flex items-center gap-3 rounded-control px-3 py-3 font-semibold no-underline"
              >
                <span className="border-border-strong bg-surface font-display text-meta flex h-avatar w-avatar flex-none items-center justify-center rounded-pill border font-semibold">
                  {account.initials ?? '?'}
                </span>
                <span className="min-w-0">
                  <span className="block">Your account</span>
                  <span className="text-meta text-text-muted block truncate">
                    {account.email}
                  </span>
                </span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-body text-text-strong block rounded-control px-3 py-3 font-semibold no-underline"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}

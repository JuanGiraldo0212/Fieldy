import Link from 'next/link'
import { getViewer } from '@/lib/auth'
import { navCounts } from '@/lib/trips/fetch'
import { NavLinks } from './nav-links'
import { Logo } from '@/components/ui/logo'

/*
  The top bar. Sticky, translucent, and the only way to reach anything that is
  not the catalog.

  My trips carries the design's grey count of trips in flight; Inbox, which
  the design does not have, carries the brand pill with the unread count
  (spec §5.7). Both numbers come from one cheap query per page.

  A signed-out visitor gets "Sign in" where the avatar would be. The design
  only ever draws the signed-in state, but the catalog is public and most
  first-time visitors arrive from a link in a text message, so they see this
  bar before they have an account.
*/
export async function TopNav() {
  const viewer = await getViewer()
  const counts = viewer?.centreId ? await navCounts(viewer.centreId) : null

  const initials =
    viewer?.name
      ?.split(/\s+/)
      .filter((w) => /^[A-Za-z]/.test(w))
      .slice(0, 2)
      .map((w) => w[0]!.toUpperCase())
      .join('') || null

  return (
    <header className="border-border sticky top-0 z-40 border-b bg-[rgb(255_255_255_/_0.96)] backdrop-blur-[8px]">
      <div className="mx-auto flex max-w-page flex-wrap items-center gap-4 px-5 py-3.5">
        {/* The region sits beside the lockup, on its row, centred against it.
            It briefly sat stacked underneath; that grew the bar's height for a
            label that is not part of the name and does not need its own line. */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <Logo />
          <span className="text-label text-text-muted tracking-[0.04em] uppercase">
            Vancouver Island
          </span>
        </Link>

        <div className="flex-1" />

        {/* Five items no longer fit a 375px row once Inbox exists, and a
            wrapped nav item reads as two. The row scrolls sideways instead,
            bleeding to the page edge so the last item is not cut off. */}
        <nav className="-mx-5 flex max-w-[calc(100%+40px)] items-center gap-1.5 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <NavLinks
            signedIn={Boolean(viewer?.centreId)}
            isAdmin={viewer?.isAdmin ?? false}
            tripCount={counts?.trips ?? 0}
            unreadCount={counts?.unread ?? 0}
          />

          {viewer ? (
            <Link
              href="/account"
              aria-label="Your account"
              title={viewer.email}
              className="border-border-strong bg-surface hover:border-brand font-display ml-1 flex h-avatar w-avatar items-center justify-center rounded-pill border text-meta font-semibold no-underline"
            >
              {initials ?? '?'}
            </Link>
          ) : (
            <Link
              href="/login"
              className="border-border-strong bg-surface hover:border-brand text-body-sm text-text-strong ml-1 rounded-pill border px-4 py-2.5 font-semibold no-underline"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

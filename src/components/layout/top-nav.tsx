import Link from 'next/link'
import { getViewer } from '@/lib/auth'
import { NavLinks } from './nav-links'
import { Logo } from '@/components/ui/logo'

/*
  The top bar. Sticky, translucent, and the only way to reach anything that is
  not the catalog.

  Two departures from the design, both because the app is not finished yet:

  "My trips" is not here. The design shows it between Find outings and Groups
  with a count pill, but /trips does not exist until slice 7, and a nav item
  that 404s is worse than one that is not there yet. It goes back in with the
  route, and NavLinks already has the shape for it.

  A signed-out visitor gets "Sign in" where the avatar would be. The design
  only ever draws the signed-in state, but the catalog is public and most
  first-time visitors arrive from a link in a text message, so they see this
  bar before they have an account.
*/
export async function TopNav() {
  const viewer = await getViewer()

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
        <Link href="/" className="flex items-center gap-2 no-underline">
          <Logo />
          <span className="text-label text-text-muted tracking-[0.04em] uppercase">
            Greater Victoria
          </span>
        </Link>

        <div className="flex-1" />

        <nav className="flex items-center gap-1.5">
          <NavLinks signedIn={Boolean(viewer?.centreId)} />

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

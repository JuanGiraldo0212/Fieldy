import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Mail } from 'lucide-react'
import { getViewer } from '@/lib/auth'
import { LoginForm } from './login-form'

/*
  Magic link only. spec §5.10: "Email plus magic link. No passwords." The
  design has no frame for this screen (docs/design-gaps.md), so it is built in
  the design's language and kept to one field.
*/

const ERRORS: Record<string, string> = {
  expired:
    'That link has expired or was already used. Links last an hour and work once. Send yourself a new one.',
  missing: 'That link was incomplete. Send yourself a new one.',
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const next = typeof params.next === 'string' ? params.next : '/'
  const errorKey = typeof params.error === 'string' ? params.error : null

  /* Already signed in: nothing to do here. */
  const viewer = await getViewer()
  if (viewer) redirect(viewer.centreId ? next : '/welcome')

  return (
    <main className="mx-auto max-w-[440px] px-5 py-16">
      <Link
        href="/"
        className="text-body-sm text-brand inline-block py-2 font-semibold no-underline"
      >
        ← All outings
      </Link>

      <div className="bg-surface border-border mt-2 rounded-panel border p-6">
        <span className="bg-brand-tint text-brand mb-4 flex h-avatar w-avatar items-center justify-center rounded-pill">
          <Mail size={18} />
        </span>

        <h1 className="font-display text-display-md">Sign in to Fieldy</h1>
        <p className="text-body text-text-muted mt-2">
          We email you a link. No password to forget at 7:40 am.
        </p>

        {errorKey && ERRORS[errorKey] ? (
          <p
            className="bg-warn-tint text-warn text-meta mt-4 rounded-control px-3.5 py-3"
            role="alert"
          >
            {ERRORS[errorKey]}
          </p>
        ) : null}

        <LoginForm next={next} />
      </div>

      <p className="text-meta text-text-faint mt-4 px-1 leading-relaxed">
        You only need an account to plan a trip or save an outing. Browsing is
        open to everyone.
      </p>
    </main>
  )
}

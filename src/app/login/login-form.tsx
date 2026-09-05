'use client'

import { useActionState } from 'react'
import { CircleCheck } from 'lucide-react'
import { requestMagicLink, type LoginState } from './actions'

export { sendError } from './send-error'

/*
  One field. The "check your email" state matters as much as the form: sending
  a link and showing nothing is how people end up requesting four of them, and
  only the newest works.

  The request goes through a server action rather than the browser client, so
  our own rate limits (login/actions.ts) sit in front of Supabase's. Without
  JavaScript the form still posts and the page re-renders with the result.
*/
export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    requestMagicLink,
    {},
  )

  if (state.sent) {
    return (
      <div className="bg-success-tint text-success mt-5 rounded-card px-4 py-4">
        <span className="text-body-sm flex items-center gap-2.5 font-bold">
          <CircleCheck size={18} />
          Check your email
        </span>
        <p className="text-body-sm mt-1.5">
          We sent a link to <strong>{state.sent}</strong>. It works once and
          lasts an hour. If several arrive, use the newest.
        </p>
        <form action={action} className="mt-3">
          <input type="hidden" name="next" value={next} />
          {/* Re-submitting with an empty address fails validation and drops
              back to the form: "use a different address" is one tap. */}
          <button type="submit" className="text-body-sm font-semibold underline">
            Use a different address
          </button>
        </form>
      </div>
    )
  }

  return (
    <form action={action} className="mt-5">
      <input type="hidden" name="next" value={next} />
      <label className="block">
        <span className="text-label text-text-muted font-bold uppercase">
          Your email
        </span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          autoFocus
          placeholder="you@yourcentre.ca"
          className="border-border-strong bg-surface text-body mt-1.5 h-control-lg w-full rounded-control border px-4 outline-none focus:border-brand"
        />
      </label>

      {state.error ? (
        <p className="text-meta text-warn mt-2" role="alert">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="bg-brand-solid hover:bg-brand-solid-hover text-body mt-4 h-control-lg w-full rounded-control font-bold text-white disabled:opacity-60"
      >
        {pending ? 'Sending' : 'Email me a link'}
      </button>
    </form>
  )
}

'use client'

import { useState } from 'react'
import { CircleCheck } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

/*
  Two rate limits sit behind this form and they want different advice.

  Per address: too many links to one inbox. On the built-in email provider
  that ceiling is two an hour for the whole project, so "wait a minute" is
  wrong — the wait is long, and the way out is a different address.

  Per client: too many requests from one IP, which clears in a few minutes.

  Both arrive as a 429 that reads like a server fault. We branch on the error
  code, and fall back to the message text for the older shapes that carry no
  code. When the server names a wait, we repeat it rather than guessing.
*/
export function sendError(err: { message: string; code?: string }): string {
  const seconds = err.message.match(/after (\d+) seconds?/)?.[1]
  if (seconds) {
    return `That link was just sent. Try again in ${seconds} seconds.`
  }

  if (err.code === 'over_email_send_rate_limit' || /email rate/i.test(err.message)) {
    return 'Too many links have gone to that address. Try again later, or use a different one.'
  }

  if (err.code === 'over_request_rate_limit' || /rate|limit/i.test(err.message)) {
    return 'Too many tries from here. Wait a few minutes and try again.'
  }

  return 'We could not send that. Check the address and try again.'
}

/*
  One field. The "check your email" state matters as much as the form: sending
  a link and showing nothing is how people end up requesting four of them, and
  only the newest works.
*/
export function LoginForm({ next }: { next: string }) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const address = email.trim()
    if (!address) return

    setState('sending')
    setError('')

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    )

    /*
      The origin we are actually running on, so a link sent from a preview
      deploy comes back to that preview and not to production.

      Supabase only honours this if it matches the project's Redirect URLs
      allow-list; anything else is silently replaced with the project's Site
      URL. A link that arrives pointing somewhere unexpected is that list
      being wrong, not this line — the setting lives in the dashboard, under
      Authentication → URL Configuration.
    */
    const { error: err } = await supabase.auth.signInWithOtp({
      email: address,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    })

    if (err) {
      setError(sendError(err))
      setState('error')
      return
    }
    setState('sent')
  }

  if (state === 'sent') {
    return (
      <div className="bg-success-tint text-success mt-5 rounded-card px-4 py-4">
        <span className="text-body-sm flex items-center gap-2.5 font-bold">
          <CircleCheck size={18} />
          Check your email
        </span>
        <p className="text-body-sm mt-1.5">
          We sent a link to <strong>{email.trim()}</strong>. It works once and
          lasts an hour. If several arrive, use the newest.
        </p>
        <button
          type="button"
          onClick={() => setState('idle')}
          className="text-body-sm mt-3 font-semibold underline"
        >
          Use a different address
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="mt-5">
      <label className="block">
        <span className="text-label text-text-muted font-bold uppercase">
          Your email
        </span>
        <input
          type="email"
          required
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@yourcentre.ca"
          className="border-border-strong bg-surface text-body mt-1.5 h-control-lg w-full rounded-control border px-4 outline-none focus:border-brand"
        />
      </label>

      {error ? (
        <p className="text-meta text-warn mt-2" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={state === 'sending'}
        className="bg-brand-solid hover:bg-brand-solid-hover text-body mt-4 h-control-lg w-full rounded-control font-bold text-white disabled:opacity-60"
      >
        {state === 'sending' ? 'Sending' : 'Email me a link'}
      </button>
    </form>
  )
}

'use client'

import { useState } from 'react'
import { CircleCheck } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

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

    const { error: err } = await supabase.auth.signInWithOtp({
      email: address,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    })

    if (err) {
      /* The common one is the provider's rate limit, which reads as a server
         error unless we translate it. */
      setError(
        /rate|limit|seconds/i.test(err.message)
          ? 'That is a few too many in a row. Wait a minute and try again.'
          : 'We could not send that. Check the address and try again.',
      )
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

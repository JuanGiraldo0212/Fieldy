import { describe, expect, it } from 'vitest'
import { sendError } from './login-form'

/*
  The two rate limits are the whole point of this helper: told to "wait a
  minute" when the real wait is an hour, someone sits there retrying.
*/
describe('sendError', () => {
  it('repeats the wait the server named', () => {
    const m = sendError({
      message: 'For security purposes, you can only request this after 51 seconds.',
    })
    expect(m).toMatch(/51 seconds/)
  })

  it('does not promise a short wait for the per-address ceiling', () => {
    const m = sendError({
      message: 'email rate limit exceeded',
      code: 'over_email_send_rate_limit',
    })
    expect(m).toMatch(/different one/)
    expect(m).not.toMatch(/minute/)
  })

  it('sends the per-client limit somewhere else', () => {
    const m = sendError({
      message: 'Request rate limit reached',
      code: 'over_request_rate_limit',
    })
    expect(m).toMatch(/few minutes/)
  })

  /* Older responses carry no code, which is why the message text is still
     read as a fallback. */
  it('still recognises a rate limit with no code', () => {
    expect(sendError({ message: 'email rate limit exceeded' })).toMatch(
      /different one/,
    )
  })

  it('falls back to something a person can act on', () => {
    const m = sendError({ message: 'Database error saving new user' })
    expect(m).toMatch(/Check the address/)
  })
})

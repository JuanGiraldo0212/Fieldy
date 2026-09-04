import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/*
  What we actually hand to Resend.

  Plan §5.3 fixes these headers, and slice 5's inbound routing depends on two
  of them: Reply-To is how a venue's answer comes back to us at all, and
  X-Fieldy-Trip is the fallback when a mail system rewrites the recipient. A
  silent change to either would not fail any other test and would not be
  visible until a real venue replied into nothing.

  The Resend client is mocked, so this asserts our side of the contract. That
  the message then arrives intact is the dashboard's job, not a test's.
*/

const sendMock = vi.fn()
vi.mock('resend', () => ({
  Resend: class {
    emails = { send: sendMock }
  },
}))

const { sendRelayMessage, sendingConfigured } = await import('./send')

const ARGS = {
  token: 'aaj1hd3sm5',
  messageRowId: '01M1N813V95ZEY4B166H6JZZ04',
  senderName: 'Dana Mireau',
  centreName: 'Garry Oak Childcare',
  venueEmail: 'admin@christchurchcathedral.bc.ca',
  subject: 'Group visit request: Garry Oak Childcare, 10 children ages 1 to 3, 2026-10-15',
  body: 'Hi Christ Church Cathedral team,',
}

const env = { ...process.env }
beforeEach(() => {
  sendMock.mockReset()
  sendMock.mockResolvedValue({ data: { id: 'res_1' }, error: null })
  process.env.RESEND_API_KEY = 're_test'
  process.env.MAIL_DOMAIN = 'mail.fieldy.ca'
  delete process.env.DEV_EMAIL_OVERRIDE
})
afterEach(() => {
  process.env = { ...env }
})

describe('sendingConfigured', () => {
  it('needs both the key and the domain', () => {
    expect(sendingConfigured()).toBe(true)
    delete process.env.MAIL_DOMAIN
    expect(sendingConfigured()).toBe(false)
  })
})

describe('sendRelayMessage headers', () => {
  it('sends the headers plan 5.3 specifies', async () => {
    const r = await sendRelayMessage(ARGS)
    expect(r).toEqual({ ok: true, externalMessageId: 'res_1', redirectedTo: null })

    const payload = sendMock.mock.calls[0]![0]
    expect(payload.from).toBe(
      '"Dana Mireau (Garry Oak Childcare) via Fieldy" <trip-aaj1hd3sm5@mail.fieldy.ca>',
    )
    /* The venue answers to the trip address. Anything else and the reply goes
       somewhere Fieldy never sees, and the app is the only copy of the thread. */
    expect(payload.replyTo).toBe('trip-aaj1hd3sm5@mail.fieldy.ca')
    expect(payload.to).toEqual(['admin@christchurchcathedral.bc.ca'])
    expect(payload.subject).toBe(ARGS.subject)
    expect(payload.headers['X-Fieldy-Trip']).toBe('aaj1hd3sm5')
    expect(payload.headers['Message-ID']).toBe(
      '<trip-aaj1hd3sm5.01M1N813V95ZEY4B166H6JZZ04@mail.fieldy.ca>',
    )
  })

  it('never puts the educator’s own address in the headers', async () => {
    await sendRelayMessage({ ...ARGS, senderName: 'Dana Mireau' })
    const p = sendMock.mock.calls[0]![0]
    const headers = JSON.stringify([p.from, p.replyTo, p.to, p.headers])
    expect(headers).not.toMatch(/garryoakchildcare\.(ca|test)/)
  })

  it('threads a later message onto the first', async () => {
    await sendRelayMessage({
      ...ARGS,
      inReplyTo: '<venue-1@example.org>',
      references: ['<trip-aaj1hd3sm5.first@mail.fieldy.ca>', '<venue-1@example.org>'],
    })
    const h = sendMock.mock.calls[0]![0].headers
    expect(h['In-Reply-To']).toBe('<venue-1@example.org>')
    expect(h['References']).toBe(
      '<trip-aaj1hd3sm5.first@mail.fieldy.ca> <venue-1@example.org>',
    )
  })

  it('omits threading headers on a first message', async () => {
    await sendRelayMessage(ARGS)
    const h = sendMock.mock.calls[0]![0].headers
    expect('In-Reply-To' in h).toBe(false)
    expect('References' in h).toBe(false)
  })
})

describe('DEV_EMAIL_OVERRIDE', () => {
  it('redirects the send and makes it obvious in the mailbox', async () => {
    process.env.DEV_EMAIL_OVERRIDE = 'me@example.com'
    const r = await sendRelayMessage(ARGS)

    const p = sendMock.mock.calls[0]![0]
    expect(p.to).toEqual(['me@example.com'])
    expect(p.subject).toMatch(/^\[dev → admin@christchurchcathedral\.bc\.ca\] /)
    expect(p.headers['X-Fieldy-Redirected-From']).toBe(
      'admin@christchurchcathedral.bc.ca',
    )
    expect(r).toMatchObject({ ok: true, redirectedTo: 'me@example.com' })
  })

  it('keeps the relay address on a redirected send', async () => {
    // The whole point is to see what a venue would have seen.
    process.env.DEV_EMAIL_OVERRIDE = 'me@example.com'
    await sendRelayMessage(ARGS)
    expect(sendMock.mock.calls[0]![0].replyTo).toBe('trip-aaj1hd3sm5@mail.fieldy.ca')
  })
})

describe('failure', () => {
  it('reports a Resend error instead of throwing', async () => {
    sendMock.mockResolvedValue({ data: null, error: { message: 'domain not verified' } })
    expect(await sendRelayMessage(ARGS)).toEqual({
      ok: false,
      error: 'Could not send: domain not verified',
    })
  })

  it('survives the network going away', async () => {
    // A thrown error here would roll the caller back. The trip must survive.
    sendMock.mockRejectedValue(new Error('ECONNRESET'))
    expect(await sendRelayMessage(ARGS)).toEqual({
      ok: false,
      error: 'Could not send: ECONNRESET',
    })
  })

  it('says so plainly when nothing is configured', async () => {
    delete process.env.RESEND_API_KEY
    expect(await sendRelayMessage(ARGS)).toEqual({
      ok: false,
      error: 'Not sent yet. Fieldy is not connected to an email service.',
    })
    expect(sendMock).not.toHaveBeenCalled()
  })
})

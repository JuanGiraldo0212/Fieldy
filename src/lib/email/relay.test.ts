import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  deliverTo,
  fromHeader,
  messageId,
  relayAddress,
  replySubject,
  requestSubject,
  tokenFromAddress,
} from './relay'

const D = 'mail.fieldy.ca'

describe('relayAddress', () => {
  it('is what the venue replies to', () => {
    expect(relayAddress('rpdakxw7gh', D)).toBe('trip-rpdakxw7gh@mail.fieldy.ca')
  })
})

describe('fromHeader', () => {
  it('says who is writing and that it came through us', () => {
    expect(
      fromHeader({
        senderName: 'Dana Mireau',
        centreName: 'Garry Oak Childcare',
        token: 'abc123',
        domain: D,
      }),
    ).toBe('"Dana Mireau (Garry Oak Childcare) via Fieldy" <trip-abc123@mail.fieldy.ca>')
  })

  it('strips characters that would break out of the header', () => {
    // A quote or a newline in a display name is header injection, and no real
    // name needs either.
    const h = fromHeader({
      senderName: 'Eve"\r\nBcc: attacker@example.com',
      centreName: 'X',
      token: 't',
      domain: D,
    })
    expect(h).not.toMatch(/[\r\n]/)
    expect(h.match(/"/g)!.length).toBe(2)
  })

  it('leaves an apostrophe alone', () => {
    expect(
      fromHeader({ senderName: "Siobhan O'Brien", centreName: 'X', token: 't', domain: D }),
    ).toMatch(/Siobhan O'Brien/)
  })
})

describe('messageId', () => {
  it('carries the token so a reply can be traced back', () => {
    expect(messageId('abc123', '01M1MH', D)).toBe(
      '<trip-abc123.01M1MH@mail.fieldy.ca>',
    )
  })
})

describe('requestSubject', () => {
  it('lets a venue triage without opening it', () => {
    expect(
      requestSubject({
        centreName: 'Garry Oak Childcare',
        childrenCount: 16,
        ageMin: 3,
        ageMax: 5,
        firstDate: '2026-11-19',
      }),
    ).toBe('Group visit request: Garry Oak Childcare, 16 children ages 3 to 5, 2026-11-19')
  })

  it('does not print a whole age as 3.0', () => {
    const s = requestSubject({
      centreName: 'X',
      childrenCount: 10,
      ageMin: 1.5,
      ageMax: 3,
      firstDate: null,
    })
    expect(s).toMatch(/ages 1.5 to 3$/)
  })
})

describe('replySubject', () => {
  it('threads without stacking Re: forever', () => {
    expect(replySubject('Group visit request: X')).toBe('Re: Group visit request: X')
    expect(replySubject('Re: Group visit request: X')).toBe('Re: Group visit request: X')
    expect(replySubject('RE: something')).toBe('RE: something')
  })
})

describe('tokenFromAddress', () => {
  it('reads our own address back', () => {
    expect(tokenFromAddress('trip-rpdakxw7gh@mail.fieldy.ca', D)).toBe('rpdakxw7gh')
  })

  it('survives what real mail systems do to an address', () => {
    expect(tokenFromAddress('Karen <TRIP-RPDAKXW7GH@Mail.Fieldy.CA>', D)).toBe(
      'rpdakxw7gh',
    )
    expect(tokenFromAddress('trip-rpdakxw7gh+auto@mail.fieldy.ca', D)).toBe(
      'rpdakxw7gh',
    )
  })

  it('refuses anything that is not ours', () => {
    // Unroutable is the honest answer. Guessing would deliver a stranger's
    // mail into a centre's thread.
    expect(tokenFromAddress('hello@mail.fieldy.ca', D)).toBeNull()
    expect(tokenFromAddress('trip-abc@evil.example', D)).toBeNull()
    expect(tokenFromAddress('trip-@mail.fieldy.ca', D)).toBeNull()
    expect(tokenFromAddress('not-an-address', D)).toBeNull()
    /* i, l, o and u are not in the token alphabet. */
    expect(tokenFromAddress('trip-illooluu@mail.fieldy.ca', D)).toBeNull()
  })
})

describe('deliverTo', () => {
  const prior = process.env.DEV_EMAIL_OVERRIDE
  beforeEach(() => {
    delete process.env.DEV_EMAIL_OVERRIDE
  })
  afterEach(() => {
    if (prior === undefined) delete process.env.DEV_EMAIL_OVERRIDE
    else process.env.DEV_EMAIL_OVERRIDE = prior
  })

  it('mails the venue when no override is set', () => {
    expect(deliverTo('admin@venue.example')).toEqual({
      to: 'admin@venue.example',
      redirected: false,
    })
  })

  it('redirects every send when one is', () => {
    // The catalog holds real booking addresses. A stray send in development is
    // not recoverable.
    process.env.DEV_EMAIL_OVERRIDE = 'me@example.com'
    expect(deliverTo('admin@venue.example')).toEqual({
      to: 'me@example.com',
      redirected: true,
    })
  })
})

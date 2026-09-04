import { describe, expect, it } from 'vitest'
import { authorNameFrom, routeInbound, type InboundMessage } from './inbound'

/*
  The routing rules, tested without a webhook. Plan §5.4 steps 1 and 2, and the
  loop guard §5.4a repeats for both paths.

  Everything here is pure: `routeInbound` decides where a message belongs from
  its addresses and headers alone, which is exactly the part where a mistake is
  expensive — a wrong drop means a venue's reply that nobody ever sees.
*/

const DOMAIN = 'mail.fieldy.ca'

function inbound(over: Partial<InboundMessage> = {}): InboundMessage {
  return {
    emailId: 'inb_1',
    from: 'Margaret Doyle <margaret@royalbcmuseum.bc.ca>',
    to: [`trip-k4m2p8x1qr@${DOMAIN}`],
    cc: [],
    receivedFor: [`trip-k4m2p8x1qr@${DOMAIN}`],
    subject: 'Re: Group visit request',
    messageId: '<abc@royalbcmuseum.bc.ca>',
    text: 'Tuesday works.',
    html: null,
    headers: null,
    attachments: [],
    receivedAt: new Date('2026-09-23T15:00:00Z'),
    ...over,
  }
}

describe('routeInbound — finding the trip', () => {
  it('resolves the token from the envelope recipient', () => {
    expect(routeInbound(inbound(), DOMAIN)).toEqual({
      kind: 'trip',
      token: 'k4m2p8x1qr',
    })
  })

  it('falls back to To when the envelope recipient is missing', () => {
    const msg = inbound({ receivedFor: [] })
    expect(routeInbound(msg, DOMAIN)).toEqual({
      kind: 'trip',
      token: 'k4m2p8x1qr',
    })
  })

  it('finds our address in Cc when the venue replies to all', () => {
    const msg = inbound({
      receivedFor: [],
      to: ['principal@school.ca'],
      cc: [`"Sunnyside via Fieldy" <trip-k4m2p8x1qr@${DOMAIN}>`],
    })
    expect(routeInbound(msg, DOMAIN)).toEqual({
      kind: 'trip',
      token: 'k4m2p8x1qr',
    })
  })

  it('falls back to X-Fieldy-Trip when the recipient was rewritten', () => {
    const msg = inbound({
      receivedFor: ['relay@some-gateway.example'],
      to: ['relay@some-gateway.example'],
      headers: { 'X-Fieldy-Trip': 'k4m2p8x1qr' },
    })
    expect(routeInbound(msg, DOMAIN)).toEqual({
      kind: 'trip',
      token: 'k4m2p8x1qr',
    })
  })

  it('tolerates plus-addressing and case, as tokenFromAddress does', () => {
    const msg = inbound({
      receivedFor: [`TRIP-K4M2P8X1QR+spam@${DOMAIN.toUpperCase()}`],
      to: [],
    })
    expect(routeInbound(msg, DOMAIN)).toEqual({
      kind: 'trip',
      token: 'k4m2p8x1qr',
    })
  })
})

describe('routeInbound — the loop guard', () => {
  it('drops anything sent from our own relay domain', () => {
    const msg = inbound({ from: `"Fieldy" <noreply@${DOMAIN}>` })
    const route = routeInbound(msg, DOMAIN)
    expect(route.kind).toBe('drop')
    expect(route.kind === 'drop' && route.reason).toContain('loop')
  })

  it('drops a message that has already been round-tripped twice', () => {
    const msg = inbound({ headers: { 'X-Fieldy-Hops': '2' } })
    const route = routeInbound(msg, DOMAIN)
    expect(route.kind).toBe('drop')
    expect(route.kind === 'drop' && route.reason).toContain('X-Fieldy-Hops')
  })

  it('lets one hop through — that is our own notification, not a loop', () => {
    const msg = inbound({ headers: { 'x-fieldy-hops': '1' } })
    expect(routeInbound(msg, DOMAIN).kind).toBe('trip')
  })

  it('runs before routing, so our own mail cannot be filed as a reply', () => {
    /* The shape a loop actually takes: it carries a perfectly good token. */
    const msg = inbound({ from: `bounce@${DOMAIN}` })
    expect(routeInbound(msg, DOMAIN).kind).toBe('drop')
  })
})

describe('routeInbound — the no-reply address', () => {
  it('answers someone who replied to a notification', () => {
    const msg = inbound({
      from: 'Sarah Chen <sarah@sunnyside.ca>',
      receivedFor: [`noreply@${DOMAIN}`],
      to: [`noreply@${DOMAIN}`],
    })
    expect(routeInbound(msg, DOMAIN)).toEqual({ kind: 'noreply' })
  })

  it('prefers the trip when a reply-all carries both addresses', () => {
    /* A director who replies-all to a notification that also quotes the trip
       address is trying to reach the venue. File it, do not answer it. */
    const msg = inbound({
      from: 'Sarah Chen <sarah@sunnyside.ca>',
      receivedFor: [`noreply@${DOMAIN}`],
      to: [`noreply@${DOMAIN}`, `trip-k4m2p8x1qr@${DOMAIN}`],
    })
    expect(routeInbound(msg, DOMAIN)).toEqual({
      kind: 'trip',
      token: 'k4m2p8x1qr',
    })
  })

  it('ignores a noreply address on somebody else’s domain', () => {
    const msg = inbound({ receivedFor: ['noreply@example.com'], to: [] })
    expect(routeInbound(msg, DOMAIN).kind).toBe('drop')
  })
})

describe('routeInbound — what it will not guess', () => {
  it('drops mail to an address that is not ours', () => {
    const msg = inbound({
      receivedFor: ['hello@mail.fieldy.ca'],
      to: ['hello@mail.fieldy.ca'],
    })
    const route = routeInbound(msg, DOMAIN)
    expect(route.kind).toBe('drop')
    expect(route.kind === 'drop' && route.reason).toContain('unroutable')
  })

  it('drops a trip address on a domain we do not own', () => {
    const msg = inbound({
      receivedFor: ['trip-k4m2p8x1qr@mail.notfieldy.ca'],
      to: [],
    })
    expect(routeInbound(msg, DOMAIN).kind).toBe('drop')
  })

  it('drops a token with characters the alphabet excludes', () => {
    /* `i`, `l`, `o` and `u` are not in the token alphabet, so this is not one
       of ours however much it looks like one. */
    const msg = inbound({ receivedFor: [`trip-illouilloi@${DOMAIN}`], to: [] })
    expect(routeInbound(msg, DOMAIN).kind).toBe('drop')
  })

  it('drops a message with no recipients at all', () => {
    const msg = inbound({ receivedFor: [], to: [], cc: [] })
    expect(routeInbound(msg, DOMAIN).kind).toBe('drop')
  })

  it('ignores a junk X-Fieldy-Trip header', () => {
    const msg = inbound({
      receivedFor: [],
      to: [],
      headers: { 'X-Fieldy-Trip': '../../etc/passwd' },
    })
    expect(routeInbound(msg, DOMAIN).kind).toBe('drop')
  })
})

describe('authorNameFrom', () => {
  it('uses the display name, because it reads like a person', () => {
    expect(
      authorNameFrom('Margaret Doyle <m@rbcm.ca>', 'Royal BC Museum'),
    ).toBe('Margaret Doyle')
  })

  it('strips the quotes a client adds around a name with a comma', () => {
    expect(
      authorNameFrom('"Doyle, Margaret" <m@rbcm.ca>', 'Royal BC Museum'),
    ).toBe('Doyle, Margaret')
  })

  it('falls back to the venue when there is no display name', () => {
    expect(authorNameFrom('bookings@rbcm.ca', 'Royal BC Museum')).toBe(
      'Royal BC Museum',
    )
    expect(authorNameFrom('<bookings@rbcm.ca>', 'Royal BC Museum')).toBe(
      'Royal BC Museum',
    )
  })

  it('does not use an address that was put in the display slot', () => {
    expect(
      authorNameFrom('bookings@rbcm.ca <bookings@rbcm.ca>', 'Royal BC Museum'),
    ).toBe('Royal BC Museum')
  })
})

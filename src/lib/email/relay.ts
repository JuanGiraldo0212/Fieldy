/*
  Relay addressing. Plan §5.3 and §5.4.

  Every trip has a token, and `trip-<token>@mail.<domain>` is the address the
  venue sees and replies to. Resolving that address back to a trip is the whole
  routing mechanism for inbound mail, so the parsing here is the inverse of the
  formatting here and the two must never drift. They live in one file for that
  reason.

  Nothing in this file talks to Resend or to the database. It is string work,
  which means it is testable without either.
*/

export function mailDomain(): string {
  const d = process.env.MAIL_DOMAIN
  if (!d) throw new Error('MAIL_DOMAIN is not set')
  return d
}

/* The address a venue replies to. */
export function relayAddress(token: string, domain = mailDomain()): string {
  return `trip-${token}@${domain}`
}

/*
  The From display name. The educator's name and centre, then "via Fieldy" so
  the venue knows what this is and does not read it as a spoof of her own
  address. Her real address is never in the headers; it appears once, in the
  body, below the signature.

  Quotes and backslashes are stripped rather than escaped. A centre named
  O'Brien's is fine; one containing a quote character is a header injection
  waiting to happen, and no real name needs one.
*/
export function fromHeader({
  senderName,
  centreName,
  token,
  domain = mailDomain(),
}: {
  senderName: string
  centreName: string
  token: string
  domain?: string
}): string {
  const clean = (s: string) => s.replace(/["\\\r\n]/g, '').trim()
  const display = `${clean(senderName)} (${clean(centreName)}) via Fieldy`
  return `"${display}" <${relayAddress(token, domain)}>`
}

/*
  Message-ID we mint ourselves, so a reply's In-Reply-To points at something we
  can recognise. Angle brackets are added by the transport, not here.
*/
export function messageId(
  token: string,
  messageRowId: string,
  domain = mailDomain(),
): string {
  return `<trip-${token}.${messageRowId}@${domain}>`
}

/*
  The threading chain for a follow-up. Plan §5.3, and spec §6: "the thread reads
  like a conversation… the subject exists only in the venue's inbox."

  That last clause is the point. Our thread is the record; the venue's mail
  client has to do its own threading, and it does that on `References` and
  `In-Reply-To`. Get these wrong and a follow-up arrives as a new, unrelated
  email in a mailbox that already has the conversation open.

  Our own Message-IDs are derived rather than stored — `messageId()` above mints
  them from the token and the row id, so any of our messages can be named again
  later. The venue's are stored, because we did not choose them.

  Capped at the last twenty. Some clients truncate a long References header,
  and the recent end of the chain is the part that does the threading.
*/
const REFERENCES_LIMIT = 20

export function threadingHeaders({
  token,
  messages,
  domain = mailDomain(),
}: {
  token: string
  /* In send order, oldest first. */
  messages: { id: string; party: string; rfcMessageId: string | null }[]
  domain?: string
}): { inReplyTo: string | null; references: string[] } {
  const ids = messages
    .map((m) =>
      m.party === 'educator' ? messageId(token, m.id, domain) : m.rfcMessageId,
    )
    .filter((id): id is string => Boolean(id))

  return {
    /* The message we are actually answering: the most recent one in the
       thread, whoever sent it. */
    inReplyTo: ids.at(-1) ?? null,
    references: ids.slice(-REFERENCES_LIMIT),
  }
}

/*
  Subject lines. The first message says everything a venue needs to triage it
  without opening it; later messages are a plain "Re:" so mail clients thread
  them.
*/
export function requestSubject({
  centreName,
  childrenCount,
  ageMin,
  ageMax,
  firstDate,
}: {
  centreName: string
  childrenCount: number
  ageMin: number
  ageMax: number
  firstDate: string | null
}): string {
  const ages = `ages ${trimAge(ageMin)} to ${trimAge(ageMax)}`
  const when = firstDate ? `, ${firstDate}` : ''
  return `Group visit request: ${centreName}, ${childrenCount} children ${ages}${when}`
}

export function replySubject(firstSubject: string): string {
  return /^re:/i.test(firstSubject) ? firstSubject : `Re: ${firstSubject}`
}

/* Ages are stored as reals because a room can be "1.5 to 3". A whole number
   should not print as 3.0 in a subject line a stranger reads. */
function trimAge(n: number): string {
  return Number.isInteger(n) ? String(n) : String(Math.round(n * 10) / 10)
}

/*
  Inbound: turn a recipient address back into a token.

  Tolerates the two things real mail systems do to an address, because a reply
  that cannot be routed is a reply the educator never sees:
  plus-addressing (`trip-abc+something@`) and case folding. Returns null for
  anything that is not one of ours, which the webhook treats as unroutable
  rather than guessing.
*/
export function tokenFromAddress(
  address: string,
  domain = mailDomain(),
): string | null {
  /* "Name <addr>" or a bare address. */
  const bracket = address.match(/<([^>]+)>/)
  const bare = (bracket ? bracket[1]! : address).trim().toLowerCase()

  const at = bare.lastIndexOf('@')
  if (at === -1) return null
  if (bare.slice(at + 1) !== domain.toLowerCase()) return null

  const local = bare.slice(0, at).split('+')[0]!
  if (!local.startsWith('trip-')) return null

  const token = local.slice('trip-'.length)
  /* The alphabet newRelayToken draws from. Anything else is not ours. */
  return /^[a-hjkmnp-tv-z0-9]{6,32}$/.test(token) ? token : null
}

/*
  Where an outbound message actually goes.

  DEV_EMAIL_OVERRIDE redirects every send to one mailbox. The catalog holds
  real booking addresses for real venues; a stray send during development is
  not recoverable and costs us a venue's goodwill before we have any. Set it in
  every environment that is not production.
*/
export function deliverTo(venueEmail: string): {
  to: string
  redirected: boolean
} {
  const override = process.env.DEV_EMAIL_OVERRIDE?.trim()
  return override
    ? { to: override, redirected: true }
    : { to: venueEmail, redirected: false }
}

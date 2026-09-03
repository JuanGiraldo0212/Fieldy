/*
  Where a login link is allowed to send someone afterwards.

  Without this the magic link is an open redirect: an attacker mails "sign in
  to Fieldy" with ?next=https://look-alike.example, the victim really does sign
  in, and then lands on a page that is not ours while feeling that it is. Same
  reasoning for a protocol-relative //host, which browsers treat as absolute.
*/
export function safeNext(raw: string | null | undefined): string {
  if (!raw) return '/'
  if (!raw.startsWith('/')) return '/'
  if (raw.startsWith('//')) return '/'
  /* A backslash is normalised to a slash by some browsers, so /\evil.example
     can escape the origin too. */
  if (raw.startsWith('/\\')) return '/'
  return raw
}

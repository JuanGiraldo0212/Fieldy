import { ulid } from 'ulid'

/* ULIDs as text primary keys, generated in the app (plan section 4.1). */
export function newId(): string {
  return ulid()
}

/* Base32 lowercase, Crockford's alphabet minus the ambiguous characters, so a
   token is safe to read aloud down a phone and safe in an email local part. */
const TOKEN_ALPHABET = 'abcdefghjkmnpqrstvwxyz0123456789'
const TOKEN_LENGTH = 10

/*
  A trip's relay token. The trip's address is trip-<token>@mail.<domain>, and
  resolving that address back to a trip is the whole routing mechanism for
  inbound mail. Unique, checked at insert.
*/
export function newRelayToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(TOKEN_LENGTH))
  let out = ''
  for (const b of bytes) out += TOKEN_ALPHABET[b % TOKEN_ALPHABET.length]
  return out
}

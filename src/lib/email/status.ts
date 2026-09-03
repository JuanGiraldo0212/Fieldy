/*
  Whether Fieldy can actually put mail on the wire.

  False today. Slice 4 built everything up to the point of sending: the plan
  screen, the request, the trip and its checklist. The send itself needs a
  domain to send from and a Resend account to send through, and neither exists
  yet, so a request is written and stored rather than delivered.

  This is one constant rather than an env check because the sender is not
  written either. Slice 5 (`lib/email/send.ts`) replaces it with a real
  capability check and deletes this file.

  Everything that would otherwise tell a director her mail is on its way reads
  this first. A screen that looks like it sent when it did not is the one
  failure this product cannot afford: she would stop chasing the venue.
*/
export const SENDING_ENABLED = false

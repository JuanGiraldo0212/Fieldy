# Decisions

Choices that were made deliberately, with the reasoning, so they can be
revisited rather than rediscovered. Plan §10 is the source for most of these.

---

## Catalog photographs are rendered, credited, and proxied

*Slice 1. `src/lib/catalog/search.ts`, `next.config.ts`.*

**The situation.** Every one of the 23 catalog images carries
`usage: "unverified"`, and `outing-schema.md` says only `licensed`,
`venue_supplied` and `public_domain` render — `unverified` "holds the image back
for review". So the catalog had no photography at all, on any card or any outing
page, and every venue fell back to an initials tile.

They are all the venues' own photographs, published on the venues' own public
websites. The extraction rule required staying on the venue's domain, so nothing
came from a stock library or a third-party listing. `rights_note` is empty on all
23, because nobody asked for permission — nobody had a conversation to ask in.

**The decision.** Render them. A venue's own photograph, on a page whose purpose
is to send that venue a booking, credited to that venue, is about the most
defensible use there is. Weighed against a catalog with no pictures, which is a
worse product for the director and no better for the venue.

**What was NOT done, and why it matters.** The `usage` value was not rewritten
to `licensed` to make the existing gate open. Nobody licensed these. A false
provenance claim sitting in the data would outlive whoever made it and be much
harder to unpick than a missing photograph. `usage` stays `unverified`, which is
true, and the *render rule* is what changed — one condition, in one function,
trivially reversible.

**Three things this obliges us to do**, all done:

1. **Credit.** The design's own line on the outing page — "Photos from
   {venue}'s website" — is the attribution, and it lands there in slice 2.
2. **Proxy, not hotlink.** Images go through `next/image`, so our server fetches
   and caches them. Otherwise every visitor's browser would contact thirteen
   venue domains, spending their bandwidth on our traffic and telling each of
   them who is browsing our catalog. `remotePatterns` is an explicit allowlist
   of those thirteen hosts; a wildcard would make our optimizer an open proxy.
3. **Fail quietly.** These URLs point at sites we do not control and will rot.
   A failed load falls back to the initials tile rather than showing a broken
   image.

**Revisit when** a venue objects, or when onboarding gives us a conversation in
which to ask properly — at which point `usage` can become truthfully
`venue_supplied` and the render rule can go back to the schema's.

**Do not** self-host copies. Serving a copy from our own storage is a stronger
claim over someone else's photograph than passing it through, and it removes the
venue's ability to change or withdraw it.

---

## The inbound webhook answers 200 to almost everything

*Slice 5. `src/app/api/email/inbound/route.ts`.*

**The situation.** Svix retries any delivery that does not answer 2xx. Several
things that arrive at the webhook are not errors and never will be: mail to an
address that resolves to no trip, our own mail coming back at us, a reply to a
trip that is already done, a second delivery of a message we already stored.

**The decision.** All of those answer 200 with a reason in the body and a log
line. Only two things get a non-2xx: a bad signature (401 — somebody is posting
who should not be) and a failed Resend fetch or database write (500 — a retry
could genuinely succeed).

Retrying an unroutable message just produces the same unroutable message eight
more times, and a retry queue full of permanent failures hides the transient
one that mattered.

**Nothing is bounced**, either. A bounce to a venue that mistyped an address
teaches them nothing and makes Fieldy look broken.

---

## Idempotency is a unique index, not a check

*Slice 5. Migration `0005`, `src/lib/email/inbound.ts`.*

A retried webhook must not put the venue's reply in the thread twice. The
handler does look for an existing row first — it makes the common case cheap
and lets the log say what happened — but the thing that actually guarantees it
is a partial unique index on `message.external_message_id`, with the insert
doing `on conflict do nothing`.

A select-then-insert has a gap between the two statements, and two deliveries
arriving together fit through it. The index does not have a gap.

Partial, because an unsent outbound message has no external id and there can be
many of those.

---

## `auto_response` is a table, not an in-memory map

*Slice 5. Migration `0006`, `src/lib/email/notify.ts`.*

Plan §5.4a asks for one auto-response per sender address per 24 hours. The
throttle has to be durable: the webhook runs on whichever instance answers, so
an in-process map would let a director who replies three times get three
robots, and would forget everything on deploy.

One row per address, rewritten in place, claimed by the same statement that
checks it — `on conflict do update … where last_sent_at < cutoff`, returning
nothing when the row is still fresh. No gap between the check and the claim.

The claim is written **before** the send. A send that fails then costs one lost
auto-response; a claim written after a crash would let the next delivery send
another.

It is not an entity in `data-model.md` and does not want to be. It is
mechanism, and it carries RLS with no policies at all: a list of addresses that
have emailed us is not something a signed-in user has any business reading.

---

## `message.rfc_message_id` exists so follow-ups thread

*Slice 5. Migration `0007`, `threadingHeaders()` in `src/lib/email/relay.ts`.*

Spec §6: "the subject exists only in the venue's inbox." Which means the
venue's mail client does its own threading, on `References` and `In-Reply-To`.
Get those wrong and a follow-up arrives as a new, unrelated email in a mailbox
that already has the conversation open.

Our own Message-IDs are derived, not stored — `messageId()` mints them from the
token and the row id, so any of our messages can be named again later. The
venue's are stored, because we did not choose them.

Distinct from `external_message_id`, which is Resend's id for the same message.
Two different namespaces; conflating them would have been the cheaper-looking
mistake.

---

## Reply stripping prefers untidy over lossy

*Slice 5. `src/lib/email/strip.ts`.*

Every heuristic in there requires strong evidence before it cuts: an
attribution line must actually end in "wrote:", a `From:` must be followed by
`Sent:` and `Subject:`, a quoted line only counts when everything after it is
quoted too. A message that would strip to nothing is returned whole.

The asymmetry is the point. A quoted paragraph left in the thread is untidy. An
answer cut out of it is a director ringing a venue to ask a question they
already answered — and she has no way to know that is what happened.

`body_full` is stored always, and "Show full message" reads it, so no cut is
ever final.

---

## Every Resend call goes through one client with a `RESEND_BASE_URL`

*Slice 5. `src/lib/email/client.ts`.*

Pointed at a fixture server, the whole relay is answerable locally: the
received-email fetch the webhook makes, the attachment download, and the
notification the webhook then sends. `scripts/simulate-venue-reply.ts` stands
that server up.

This is what makes slice 5 demonstrable at all — Resend posts inbound to a
public URL, so real inbound cannot reach `localhost` without a tunnel — and it
means a demo run spends none of the Free tier's hundred daily emails and cannot
reach a real venue.

Unset in production, where the SDK's own base URL applies.

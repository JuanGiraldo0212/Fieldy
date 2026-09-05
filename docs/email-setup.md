# Email setup

Fieldy sends on the educator's behalf and receives the venue's reply. Both legs
run through Resend, on subdomains of `fieldy.ca`.

Three domains, which is exactly Resend's free-tier limit:

| Domain | Carries | Why it is its own domain |
|---|---|---|
| `mail.fieldy.ca` | The venue relay, out and in | Inbound needs an MX record, and an MX on the apex would make `fieldy.ca` itself receive mail |
| `auth.fieldy.ca` | Supabase magic links | A relay that annoys a venue must never take the login mail down with it |
| `fieldy.ca` | Nothing yet | Already verified in Resend; left alone |

Reputation separation is the point of the split. The relay writes to strangers
who did not ask to hear from us, which is exactly the traffic that earns spam
complaints. Magic links are mail a user just asked for, seconds ago, and they
must arrive.

## DNS, as Namecheap rows

Namecheap's Host field is **relative to the apex**, so every host Resend shows
for `mail.fieldy.ca` gains a `.mail` suffix here. Resend says
`resend._domainkey`, you type `resend._domainkey.mail`.

Resend labels the two CNAMEs under a heading called "SPF". They are Type
**CNAME**, not TXT. Namecheap has separate menu entries; picking TXT is the
mistake that costs an afternoon.

### `mail.fieldy.ca` — verified

| Type | Host | Value | Notes |
|---|---|---|---|
| TXT | `resend._domainkey.mail` | `p=MIGfMA0GCSqG…CDhbHlQIDAQAB` | DKIM. Distinct from the apex key |
| CNAME | `rsend.mail` | `rsend.forge.rmta.net.` | |
| CNAME | `send.mail` | `send.forge.rmta.net.` | |
| MX | `mail` | `inbound-smtp.us-east-1.amazonaws.com.` priority 10 | Inbound. Only appears after **Enable Receiving** is on |

The MX is the record that matters most to us: it is what makes
`mail.fieldy.ca` receive at *any* address, which is what the catch-all
`trip-<token>@mail.fieldy.ca` needs. Sending verifies green without it, so a
green badge is not the same as being done.

The region in the MX target must match the domain's region in Resend
(North Virginia / `us-east-1` here). Copy it from the dashboard rather than
from this file.

### `auth.fieldy.ca` — not set up yet

Same three sending records with `.auth` in place of `.mail`, and a third DKIM
key. No MX: magic links are outbound only.

Then point Supabase Auth's SMTP settings at Resend on this domain.

### Verifying from a terminal

Ask the authoritative nameservers, not a public resolver. A cached negative
answer will have you re-adding a record that is already there:

```bash
dig +short @dns1.registrar-servers.com mail.fieldy.ca MX
```

Namecheap usually publishes within two or three minutes. Resend's checker runs
on its own schedule; "Verify" on the domain page skips the wait.

## Environment

```bash
MAIL_DOMAIN=mail.fieldy.ca
AUTH_DOMAIN=auth.fieldy.ca
RESEND_API_KEY=            # Resend → API Keys. Sending permission is enough
RESEND_WEBHOOK_SECRET=     # only exists once the inbound webhook is created
DEV_EMAIL_OVERRIDE=        # see below
```

`sendingConfigured()` in `src/lib/email/send.ts` reads `RESEND_API_KEY` and
`MAIL_DOMAIN`. Without both, the plan screen says "Save request" rather than
"Send request", the trip page shows an amber banner naming the address the
request will go to, and `message.send_error` records why. Nothing anywhere
claims mail went out when it did not.

### DEV_EMAIL_OVERRIDE

**Set this in every environment that is not production.** With it set, every
outbound message goes to that one mailbox instead of the venue, the subject is
prefixed `[dev → real@address]`, and an `X-Fieldy-Redirected-From` header
records the real recipient.

The catalog holds real booking addresses for real organisations.
`admin@christchurchcathedral.bc.ca` is a cathedral office in Victoria. A stray
send during development is not recoverable, and it spends a venue's goodwill
before we have any.

## Headers

Plan §5.3. Built in `src/lib/email/relay.ts`, which is pure string work and
therefore tested without a network.

```
From:       "Dana Mireau (Garry Oak Childcare) via Fieldy" <trip-<token>@mail.fieldy.ca>
Reply-To:   trip-<token>@mail.fieldy.ca
To:         program.booking_email, or venue.booking_email
Message-ID: <trip-<token>.<message.id>@mail.fieldy.ca>
X-Fieldy-Trip: <token>
Subject:    Group visit request: <centre>, <n> children ages <a> to <b>, <first date>
            later: "Re: " + the first subject, stored on message.subject
```

The educator's own address is **never in the headers**. It appears once, in the
body, below the signature, so a venue can always reach her directly if it
prefers. Putting it in Reply-To would send the venue's answer somewhere Fieldy
never sees, and the app is the only copy of the thread.

`X-Fieldy-Trip` is a second way to resolve the trip. Some mail systems rewrite
the envelope recipient; when that happens the address is gone and this header
survives.

Display names are stripped of quotes, backslashes and newlines before being
interpolated. A quote in a centre name is header injection, and no real name
needs one.

## Inbound

`tokenFromAddress()` is the inverse of `relayAddress()` and lives in the same
file so the two cannot drift. It tolerates case folding and plus-addressing,
both of which real mail systems do, and returns null for anything else. An
unroutable reply is dropped rather than guessed at: guessing puts a stranger's
mail in a centre's thread.

### The webhook

Resend → Webhooks → add an endpoint at `https://<host>/api/email/inbound`,
subscribed to **`email.received`**. Creating it produces the signing secret;
put it in `RESEND_WEBHOOK_SECRET`.

Every delivery is verified with Svix (`src/app/api/email/inbound/route.ts`).
An unsigned or wrongly signed POST gets a 401 and nothing else happens. That
check is the entire reason the route can be trusted: the URL is public, and
without it anyone could write into any centre's thread.

The webhook payload carries **metadata only** — no body, no headers, no
attachments. The route fetches the message with
`resend.emails.receiving.get(id)` before doing anything with it.

**Status codes are deliberate**, because Svix retries anything that is not
2xx:

| Situation | Code | Why |
|---|---|---|
| Unroutable, a loop, a finished trip, an already-stored message | 200 | Retrying changes nothing; the retries would fail identically |
| A webhook type that is not `email.received` | 200 | Not ours |
| Bad signature | 401 | Somebody is posting who should not be |
| Resend fetch failed, or the database write failed | 500 | A retry could genuinely succeed |

Nothing is ever bounced back to the sender. A bounce to a venue that mistyped
an address teaches them nothing and makes us look broken; a log line tells us.

### Testing inbound without a tunnel

Resend posts to a **public URL**, so real inbound cannot reach `localhost`.
`scripts/simulate-venue-reply.ts` exists so that does not block anything:

```bash
# .env.local
RESEND_BASE_URL=http://127.0.0.1:4599
RESEND_WEBHOOK_SECRET=whsec_<any base64; the script and dev server just have to agree>

pnpm simulate:reply                     # newest trip awaiting a reply
pnpm simulate:reply <tripId> --decline
pnpm simulate:reply <tripId> --dates
```

It stands up a fixture server on port 4599 that answers the received-email
fetch and **swallows the notification the webhook then sends**, then posts a
genuinely Svix-signed `email.received` to the local route. The real signature
check, the real fetch, the real storage writes and the real notification path
all run. Nothing reaches Resend, so a demo run costs none of the hundred daily
emails.

`RESEND_BASE_URL` must be unset in production.

### The retry job

`POST /api/jobs/retry`, behind `CRON_SECRET` as a bearer token. Schedule it
from Supabase with pg_cron every five minutes:

```sql
select cron.schedule(
  'fieldy-retry', '*/5 * * * *',
  $$select net.http_post(
      url := 'https://<host>/api/jobs/retry',
      headers := '{"Authorization": "Bearer <CRON_SECRET>"}'::jsonb
    )$$
);
```

It pushes through requests that never left (`send_error`) and notifications
that never arrived (`notify_error`), and gives up on anything that has been
failing for seven days — a message that has failed for a week is a thing to
look at, not a thing to keep mailing.

## The notification, and the no-reply address

Plan §5.4a. When a venue message is stored, every account at the centre with
`email_notifications` on gets one short email:

```
From:            "Fieldy" <noreply@mail.fieldy.ca>
Reply-To:        (none — deliberately)
X-Fieldy-Hops:   1
Auto-Submitted:  auto-generated
Subject:         <venue> replied about <program>
```

It carries who replied, the trip and its first date, the first 200 characters,
and a button to `/trips/<id>#msg-<message_id>`. It does **not** carry the
suggestion: a wrong reading pushed into an inbox has no Dismiss button next to
it.

`noreply@mail.fieldy.ca` receives at the same webhook, because the MX is a
catch-all. Mail to it resolves no trip and stores nothing; the sender gets one
auto-response, at most once per address per 24 hours, saying where the reply
belongs. Someone typing a real answer to their venue and getting silence is the
failure worth preventing.

### The loop guard

Applied to both paths, before anything is stored:

- `From` on `mail.fieldy.ca` → dropped.
- `X-Fieldy-Hops` present and ≥ 2 → dropped.

The notification goes out at 1 hop and the auto-response at 2, so a loop dies
on its second pass.

## Known unknowns

Resend documents the outbound size cap (40 MB) and not the inbound one.
Attachments are therefore capped at **10 MB** in
`src/lib/email/inbound.ts` (`MAX_ATTACHMENT_BYTES`) — anything larger is
recorded by name so the educator knows it exists, without the bytes being
pulled into a webhook that has a response deadline. Raise it once the real cap
is measured.

Whether a venue's reply-all with CCs counts as several received emails against
the quota is also undocumented. Still a test item, and one that only a real
venue reply will answer.

Free tier: 3,000 emails/month, **100/day**, 3 domains, 10 requests/second,
30-day log retention.

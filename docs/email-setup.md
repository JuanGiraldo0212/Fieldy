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

The webhook itself, its Svix signature check, the loop guard and attachment
handling are slice 5.

Resend posts to a **public URL**, so inbound cannot be tested against
`localhost` without a tunnel. Outbound works locally today.

## Known unknowns

Resend documents the outbound size cap (40 MB) and not the inbound one. Whether
a venue's reply-all with CCs counts as several received emails against the
quota is also undocumented. Both are test items for slice 5, not assumptions.

Free tier: 3,000 emails/month, **100/day**, 3 domains, 10 requests/second,
30-day log retention.

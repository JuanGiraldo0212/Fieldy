# Build order

How the milestones in `fieldy-implementation-plan.md` §7 get executed, and how the work splits across agents.

Two principles, in priority order.

**1. Every slice ends in something a director could look at.** The work is cut vertically — data, logic, components and a route, together — so that each slice can be demoed and judged by someone who does not read code. A layer of tested library functions with no screen attached is not progress anyone can validate. Where a slice ends, there is a demo script in this file, and running it is the acceptance test.

**2. Inside a slice, partition agents by file ownership, not by task.** Two agents that never touch the same file need no coordination, no locking and no git worktrees. Every split below is chosen so each agent owns a set of paths outright and reads everything else.

The slices below map onto the spec's own "key interactions to prototype" (`fieldy-mvp-spec.md` §7) and its success criteria (§8). That is deliberate: the spec already describes what a good demo looks like, so the build should arrive at those moments in order.

---

## Slice map

| # | Slice | You can demo | Agents | Blocked on |
|---|---|---|---|---|
| 0 | Thin thread | one real venue card, real tokens, real data, on a real page | 3 | nothing |
| 1 | Browse the catalog | filter by age and travel, watch it refilter and re-rank | 5 | Mapbox token |
| 2 | Read an outing | open a card, read the practical block, report a correction | 3 | slice 1 |
| 3 | Become a user | magic link, create a centre and a room, catalog re-ranks for it | 4 | Supabase project |
| 4 | Send a request | plan a trip, send it, land on a trip page with a checklist | 5 | domain, Resend |
| 5 | Get a reply | simulated venue reply appears in the thread, notification arrives | 3 | slice 4 |
| 6 | Confirm in one tap | suggestion banner, Mark confirmed, status and timeline update | 3 | slice 5 |
| 7 | Run eight trips at once | My trips buckets, Inbox, unread, saved outings | 4 | slice 6 |
| 8 | Ship it | empty and error states, responsive pass, rate limits, privacy, demo seed | 2 + reviewers | everything |

Slices 0 through 2 need nothing from outside the repo except the Mapbox token, and that only at slice 1.

---

## Slice 0 — Thin thread

The smallest thing that proves the whole stack is wired: one page, styled from real tokens, rendering one real venue read from Postgres, imported from `outputs/`.

Not a layer — a walking skeleton. It exists so that the first time scaffold, tokens, schema, migrations and the import script meet each other is on day one, not in slice 4.

**Agents**

| Agent | Owns | Acceptance |
|---|---|---|
| `scaffold` | Next.js 15 App Router, TypeScript, Tailwind, shadcn, Drizzle, Vitest, Playwright, `.env.example`, the tree from plan §3, `app/layout.tsx`, empty `/dev/components` | `pnpm dev` serves a page |
| `tokens` | `globals.css`, `tailwind.config.ts`, shadcn theme, self-hosted Bricolage Grotesque and Nunito Sans, token swatch page | swatch page matches design-map §3; spacing normalised to 4pt with the drift logged |
| `data-layer` | `db/schema.ts`, first migration, ULID helper, Zod for `date_option` `ask` `task` `suggestion` `attachment` `room_snapshot`, `lib/catalog/schema.ts`, `scripts/import-catalog.ts` | `pnpm import:catalog` loads all 15 files with zero validation errors |

`db/schema.ts` covers **both** model files in one pass even though this slice only reads the catalog tables. It is the one genuine bottleneck in the build — nearly every later module reads it, and an error there means rework from slice 3 onward. Write it once, review it before slice 1 starts, then treat it as read-only. Migrations stay additive per slice.

Also here: create `docs/design-gaps.md` from design-map §9 and `docs/decisions.md` from plan §10.

**Demo** — open `/`, see one outing card with the right typeface, colours and radii, its name and venue read from the database.

---

## Slice 1 — Browse the catalog

Spec §7 interaction 1, and the first half of Playwright flow 1. This is the slice that makes the product legible: everything else is downstream of a director believing the catalog is real.

**Agents**

| Agent | Owns | Acceptance |
|---|---|---|
| `geocode` | `scripts/geocode-catalog.ts` | 13 venues gain `lat`/`lng` written back into `outputs/*.json` |
| `catalog-logic` | `lib/catalog/{distance,feasibility,search}.ts` | unit tests per plan §5.1 and §5.1a |
| `c-primitives` | `components/ui/` — badge, chip, pill, avatar, card, checkbox, popover, empty-state | every state on `/dev/components` |
| `c-catalog` | `components/catalog/` (15 components) | every state in design-map §5, copy verbatim from §7 |
| `route-catalog` | `app/page.tsx`, search state in the URL, the Leaflet map iframe | the demo below passes |

`geocode` is a **one-time enrichment**, kept separate from the import because plan §4.3 requires the import to validate and load without transforming. Ten of the thirteen venues geocode cleanly from their address; three have no address and need filling by hand first: Bateman Foundation Gallery of Nature, Beacon Hill Children's Farm, Chinese Consolidated Benevolent Association.

**Demo** — open `/` on a 390px screen. Set age to 1–3 and travel to walking. The list refilters and re-ranks, green cards first. One card reads "One thing to check" with a real reason. Toggle the map, see pins. Copy the URL, open it in another tab, get the same view.

---

## Slice 2 — Read an outing

**Agents** — `c-program` (`components/program/`, 14 components) · `route-outing` (`app/outing/[programSlug]/page.tsx`) · `reports` (`/api/reports`, the report table and form — the design has only a one-tap link, so the form is a logged gap)

**Demo** — tap a card. Read the four fact tiles, the photo strip (initials tiles for now — every image in the catalog is `usage: unverified` and withheld by the schema), our note, the practical list with its honest "not stated on the site" rows, the travel block, and the freshness line. Report a correction and see the thanks state.

---

## Slice 3 — Become a user

The first slice with a session. Its point is that feasibility stops being a guess against defaults and starts being real against a room.

**Agents** — `auth` (Supabase magic link, `@supabase/ssr`, login route and callback) · `supabase-infra` (RLS per §4.1, the `auth.users` to `account` trigger, private `mail` bucket, `pg_cron` schedules) · `c-rooms-account` (`components/rooms/`, `components/account/`) · `route-onboarding` (centre and first-room setup, `/rooms`, `/account`)

Login, onboarding and the room modal are **undesigned** — build them in the design's language and log every invention.

**Demo** — Playwright flow 1 end to end. Anonymous on `/`, tap Plan, get asked to log in, complete the magic link, create a centre and a room, land back where you were with the room selected and the catalog re-ranked for it. Archive a room and watch the at-least-one-room rule hold.

**Blocked on** — Supabase project.

---

## Slice 4 — Send a request

Spec §7 interaction 2, Playwright flow 2. The first slice where an email actually leaves the building.

**Agents**

| Agent | Owns |
|---|---|
| `trip-logic` | `lib/trips/{tasks,derived}.ts` |
| `c-plan` | `components/plan/` (7) |
| `c-trip` | `components/trip/` (10, thread components excluded) |
| `route-plan-trip` | `app/plan/[programSlug]`, `app/trips/[tripId]`, the trip creation transaction |
| `email-out` | `lib/email/send.ts`, `relay/token.ts`, the request template, `docs/email-setup.md` |

In development every send goes to a Resend test address. Never a real venue.

**Demo** — plan a trip with two date options and two asks, send it, land on the trip page: status Asked, the `send_request` task already done, the request summary card at the top of the thread, the checklist dated backwards from the trip date, the ratio helper. Then open the Resend dashboard and see the mail with the right From, Reply-To, Message-ID and `X-Fieldy-Trip`.

**Blocked on** — domain name, Resend account.

**Status: the demo passes end to end.** Planned two dates and two asks through
the plan screen, sent, landed on the trip page with status Asked, the
`send_request` task already done, the request card, the checklist counted
backwards and the ratio helper. Resend id `d0d554c5`. From, Reply-To,
Message-ID and `X-Fieldy-Trip` confirmed on the received message, and pinned in
`src/lib/email/send.test.ts` against the payload we hand Resend.

`trip-logic`, `c-plan`, `c-trip`, `route-plan-trip` and `email-out` are all
done. Every screen reads `sendingConfigured()`, so with no API key the request
is written and stored rather than delivered and the copy says so.

The two M3 items that were outstanding are now done: the **manual status
selector** (with its source line and the `system` message it writes into the
thread) and **My trips** with the design's five tabs, counts, urgency sort,
New reply dot and four bucket empty states. Saving an outing was wired at the
same time, because a Saved tab that nothing can fill is not a tab.

The only thing left on the M3 list is **Playwright**: there is no config and no
specs anywhere in this repo, so "flow 2 passes" cannot be true. That predates
slice 4 and is its own piece of work.

---

## Slice 5 — Get a reply

**Agents** — `email-in` (`/api/email/inbound`, `lib/email/{inbound,strip,notify}.ts`, the notification template, the `noreply@` auto-response, `/api/jobs/retry`) · `c-thread` (thread message, compose box, attachment chip, unread dot) · `simulate` (`scripts/simulate-venue-reply.ts` posting a signed payload with a fixture)

`send.ts`, `inbound.ts`, `notify.ts` and `token.ts` are **deliberately not split** — threading headers, token resolution and the loop guard all reference each other, so splitting buys nothing and costs integration bugs.

Two Resend unknowns are **test items here, not assumptions**: the inbound message and attachment size cap, and whether a venue's reply-all with CCs counts as several received emails against the quota.

**Demo** — run the simulate script. Within two seconds the reply is in the thread with an unread dot, the trip moves to They answered, the waiting pill flips to Your turn, and a notification email arrives with a working deep link and no Reply-To. Reply to that notification from a real mail client and get the auto-response, with nothing stored.

---

## Slice 6 — Confirm in one tap

Spec §7 interactions 4 and 5, Playwright flow 3, and success criterion "a confirmation becomes a confirmed trip in one tap, with the evidence visible".

**Agents** — `classify` (`lib/classify/{provider,rules,dates}.ts`) · `suggestions` (the `SuggestionCard`, `applySuggestion`, task regeneration, the system message, the manual status selector) · `evals` (30 hand-written replies in `tests/fixtures/replies/`, the accuracy script)

**Demo** — a simulated reply confirming the first date. The banner appears with its evidence line in curly quotes. Tap Mark confirmed: status becomes Confirmed, the date collapses, unedited tasks move with it, a system message appears in the thread. Then a reply proposing two other dates — pick one, see the prefilled acceptance in the compose box.

The eval target — 90 percent on confirmed and declined with zero false confirmations — is a tuning goal, not a release gate. Nothing auto-applies, so `unclear` is always the safe failure.

---

## Slice 7 — Run eight trips at once

The slice for the director with several trips in flight, and the one that makes success criterion "see which trips are waiting on her in one glance" true.

**Agents** — `c-trips` (`components/trips/`, 6) · `route-trips` (`/trips` with the five bucket tabs and counts) · `inbox` (`/inbox` and the nav unread badge — undesigned, build in the design's language) · `saved` (Saved tab, its empty state with three suggestions, `/saved` redirect)

**Demo** — three replies across three trips. My trips shows them under Needs action with New reply dots. Open Inbox, tap one, land on the right trip scrolled to that message with the dot cleared.

---

## Slice 8 — Ship it

Screen-by-screen comparison against the running prototype at 390, 620 and 768px. Empty states per spec §6. Error states: send failure shows on the trip and offers retry, classifier failure is invisible. Rate limits on report POST and login. Privacy page and terms covering stored correspondence and the 90-day raw email retention. Domain warmup and bounce monitoring. A demo seed script — which **must not send real mail**, or a reseed burns twenty of the free tier's hundred daily emails.

**Demo** — all three Playwright flows green in CI, Lighthouse mobile above 85 on the catalog.

---

## What carries across slices

**`components/ui/`** is created in slice 1 and **extended, never rewritten**, by later slices. The agent that first needs a primitive owns adding it.

**`db/schema.ts`** is written once in slice 0 and read-only thereafter. Migrations are additive per slice.

**Copy** always comes from `docs/design-map.md` §7. No agent writes microcopy. Anything not in §7 is either a logged gap or invented text to remove.

---

## Standard agent briefing

Every agent gets the same five-part brief. Nothing else.

1. **Plan section** — the behaviour it must implement
2. **Spec section** — the product intent behind it
3. **Design-map section** — the states and the exact copy
4. **Files you own** — the only paths it may write
5. **Acceptance** — the tests that must pass, or the part of the slice demo it is responsible for

---

## Review passes

**At the end of every slice**, run the demo script. If it does not run, the slice is not done, regardless of what the tests say.

**After each fan-out**, one reviewer agent reads the batch against the plan, the spec and the design map and reports deviations. This catches the classic failure of parallel component work: several agents each subtly reinterpreting the same token.

**After any component slice**, grep for string literals and diff against design-map §7.

---

## Worktrees

Not needed, because the split is by directory ownership. They are only worth their cost when two agents must edit the same file concurrently — which this plan avoids by construction. If that situation appears, the fix is to re-cut the split, not to add isolation.

---

## Traceability

| Slice | Plan milestone | Spec interaction |
|---|---|---|
| 0 | M0 | — |
| 1 | M0, M1 | 1 |
| 2 | M1 | — |
| 3 | M2 | 8 |
| 4 | M3 | 2, 3 |
| 5 | M4 | 4 (arrival) |
| 6 | M5 | 4, 5, 7 |
| 7 | M4, M5 | 6 |
| 8 | M6 | — |

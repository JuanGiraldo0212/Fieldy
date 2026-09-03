# Fieldy data model

Everything the app needs **except** the outing catalog — venues, programs and images live in `outing-schema.md` and are maintained by us, not by users. This file covers the records a user creates or that the system creates on their behalf.

Conventions match the outing schema: ids are stable slugs or ULIDs, dates are ISO `YYYY-MM-DD`, timestamps are ISO 8601 with timezone, times are 24h `HH:MM` local, money is CAD numbers, and `null` means "not known" while `false`/`[]` mean "known to be none".

---

## 1. `account`

One per person. Auth is email + magic link, so there is no password field by design.

| Field | Type | Notes |
|---|---|---|
| `id` | ulid | |
| `email` | string | unique, the login identity |
| `name` | string | used in the request signature ("Thank you, Dana") |
| `role` | enum | `ece` · `director` · `teacher` · `other` — appears in the request message ("director at …") |
| `phone` | string·null | offered to the venue as a contact |
| `centre_id` | ref → `centre` | |
| `email_notifications` | bool | default true — a short "the venue replied" email with a link to the trip. **Not** a forwarded copy of the message: the thread lives in the app, and the educator never replies by email. Renamed from `email_forwarding` when the relay became send-only |
| `created_at` / `last_seen_at` | timestamp | |

Deliberately absent: any role/permission model. The MVP has no multi-user accounts, so there is nothing to authorise.

## 2. `centre`

The daycare, preschool or school. Separate from `account` because several educators will eventually share one centre, and because `type` changes what the app shows.

| Field | Type | Notes |
|---|---|---|
| `id` | ulid | |
| `name` | string | free text, e.g. `Garry Oak Childcare, Fairfield` |
| `type` | enum | `daycare_preschool` · `elementary` · `middle` · `secondary` · `other` |
| `rate_class` | enum | derived from `type`: `daycare` · `school`. Drives whether a program's `school_rate_only` banner is shown at all |
| `address` | string | default home base for new rooms |
| `lat` / `lng` | number | every distance and travel time is measured from here |
| `created_at` | timestamp | |

## 3. `room` (group profile)

One per class or room. Everything in the catalog filters from the active room.

| Field | Type | Notes |
|---|---|---|
| `id` | ulid | |
| `centre_id` | ref | |
| `name` | string | e.g. `Preschool room` |
| `icon` | enum | `baby` · `backpack` · `cap` · `users` — the tinted avatar |
| `age_min` / `age_max` | number | years. Feeds the age filter and the feasibility check |
| `size` | number | children |
| `ratio_children_per_adult` | number | licensed ratio for **this** room. Never averaged across rooms — a multi-room trip sums each room's requirement separately |
| `budget_per_child` | number | |
| `transport` | enum[] | `walking` · `bus` · `parent_drivers` · `none` |
| `address` | string | home base; defaults from `centre` but can differ |
| `lat` / `lng` | number | |
| `notes` | string·null | max 300 chars — naps, allergies, who drives |
| `archived_at` | timestamp·null | **soft delete only.** Trips reference rooms; a hard delete would silently relabel historical trips with another room's name and numbers. An archived room renders as "Preschool room (deleted)" and stops appearing in pickers |
| `created_at` / `updated_at` | timestamp | |

Rule: a centre must always have at least one non-archived room.

## 4. `trip`

The heart of the product. One per program + room-set + date-set.

| Field | Type | Notes |
|---|---|---|
| `id` | ulid | |
| `centre_id` | ref | |
| `program_id` | ref → outing catalog | |
| `room_ids` | ref[] | **array** — several rooms can go together |
| `status` | enum | `requested` · `replied` · `confirmed` · `done` · `cancelled`. There is no `idea` state any more: a trip is created by sending a request |
| `status_source` | enum | `system` · `manual` — whether the last change came from a message or a human override. Lets the UI say "moved here when the venue replied" honestly |
| `relay_token` | string | unique, 10 chars, base32 lowercase, generated at creation. The trip's address is `trip-<relay_token>@mail.<domain>`; it is how an inbound reply finds its way back to this row |
| `venue_email` | string | the booking address **resolved at creation** — program level if the catalog has one, else venue level. Snapshotted so a later catalog edit never redirects an open thread |
| `last_venue_reply_at` | timestamp·null | set on every inbound venue message; drives "waiting on" and the days count without scanning the thread |
| `room_snapshots` | object[] | `{id, name, size, ratio}` per room, copied at creation. Required adults is computed from these, not from the live rooms, for the same reason `children_count` is copied |
| `date_options` | `date_option[]` | ordered; index 0 is the first choice. See below |
| `confirmed_date` | date·null | set when the venue agrees; collapses `date_options` to one |
| `confirmed_time` | time·null | |
| `children_count` | number | **copied** from the rooms at creation, not read live — the trip must survive a room being edited or archived |
| `adults_count` | number | same |
| `cost_child` / `cost_adult` / `cost_group_fee` / `cost_transport` | number·null | seeded from the program, then editable, because reality differs |
| `asks` | `ask[]` | the questions sent with the request |
| `notes` | string·null | team notes |
| `tasks` | `task[]` | the checklist |
| `created_at` / `updated_at` | timestamp | |

Derived, never stored: total cost, per-child cost, required adults (sum of per-room `ceil(children / ratio)`), ratio compliance, `waiting_on`, days until each task. Storing any of these guarantees they eventually disagree with the inputs.

### 4a. `date_option`

| Field | Type | Notes |
|---|---|---|
| `date` | date | |
| `slot` | enum | `morning` · `afternoon` · `either` |
| `rank` | number | 1 = first choice; the request message asks in this order |

### 4b. `task`

Generated from the program's `lead_time_days` and the trip date, then editable.

| Field | Type | Notes |
|---|---|---|
| `id` | ulid | |
| `title` | string | |
| `kind` | enum | `send_request` · `book_transport` · `approval` · `consent_out` · `consent_in` · `headcount` · `day_before` · `custom` — drives the icon and the default offset |
| `due_date` | date | |
| `offset_days` | number·null | days before the trip date this was generated from; `null` once a human edits the date, so regeneration stops overwriting their choice |
| `done` | bool | |
| `done_at` | timestamp·null | |

Default offsets: send request = `−(lead_time_days + buffer)`, book transport = −14 (bus only), approval = −10, consent out = −10, consent in = −3, headcount = −2, day before = −1. Buffer is a system setting, default 3 days.

### 4c. `ask`

| Field | Type | Notes |
|---|---|---|
| `key` | string | `fact:Washrooms`, `conflict`, `fees`, or a generic topic key |
| `label` | string | short chip label, reused in the trip's request summary |
| `question` | string | the sentence that goes in the message |
| `source` | enum | `gap` (derived from something the venue does not publish) · `conflict` · `generic` · `custom` |

The gap-derived ones are pre-selected when the plan screen opens, because those are exactly the things the catalog could not answer.

## 5. `message`

The conversation. Fieldy sends on the educator's behalf and stores both sides.

| Field | Type | Notes |
|---|---|---|
| `id` | ulid | |
| `trip_id` | ref | |
| `party` | enum | `educator` · `venue` · `system` |
| `author_name` | string | person or venue team name |
| `body` | string | plain text, **stripped** — quoted history and signatures removed |
| `body_full` | string·null | the unstripped text, kept always. "Show full message" reads it, and it means a stripping miss is ugly rather than lossy |
| `is_request` | bool | the opening request renders as a summary card, not a bubble |
| `sent_at` | timestamp | |
| `read_at` | timestamp·null | drives the unread dot and the My trips count |
| `attachments` | `attachment[]` | `{name, url, mime, size}` where `url` is a private object key, not a public URL; signed at render |
| `raw_ref` | string·null | object key of the raw inbound email (headers plus text and html bodies as JSON) in the private `mail` bucket, under `raw/<trip_id>/<ulid>.json`. Deleted after 90 days; the message survives |
| `channel` | enum | `email` · `web_form` · `phone_log` — a phone call logged by hand is still part of the thread |
| `external_message_id` | string·null | provider id, for threading replies back to the right trip |
| `send_error` | string·null | last failure sending this message to the venue, cleared on success. Non-null means the trip page shows a retry |
| `notify_error` | string·null | last failure sending the educator's notification for this message, cleared on success. Never surfaced to the user — a missed nudge is not their problem, and the message is in the app either way |
| `suggestion` | `suggestion`·null | see below |

### 5a. `suggestion`

The parsed intent of a venue reply. Stored so the banner is auditable and dismissals stick.

| Field | Type | Notes |
|---|---|---|
| `intent` | enum | `confirmed` · `proposed_dates` · `declined` · `unclear` |
| `dates` | date[]·null | dates the venue offered |
| `time` | time·null | |
| `evidence` | string | the quoted sentence the reading came from. Always shown — the user must be able to check the machine's work |
| `confidence` | number·null | 0–1; below a threshold, fall back to `unclear` and show no action buttons |
| `dismissed_at` | timestamp·null | per message, so a dismissed banner never returns |

## 6. `saved_outing`

| Field | Type | Notes |
|---|---|---|
| `account_id` | ref | |
| `program_id` | ref | |
| `saved_at` | timestamp | |

Composite key on `(account_id, program_id)`.

## 7. `search_state` (client only)

Never persisted server-side; it belongs to the session, and writing it to the server makes shared links behave unpredictably.

`query`, `age_bands[]`, `children`, `transport`, `budget_max`, `radius_km`, `categories[]`, `moods[]`, `environment[]`, `accessibility[]`, `formats[]`, `sort`.

`sort` ∈ `best_match` · `distance` · `duration` · `price`.

## 8. `report` (data correction)

Behind the "Something wrong? Tell us" link. The catalog is only trustworthy if correcting it is one tap.

| Field | Type | Notes |
|---|---|---|
| `id` | ulid | |
| `program_id` / `venue_id` | ref | |
| `account_id` | ref·null | anonymous reports allowed |
| `field` | string·null | which fact is wrong, when known |
| `note` | string·null | |
| `status` | enum | `new` · `checked` · `fixed` · `rejected` |
| `created_at` | timestamp | |

---

## Relationships

```
account ──┬─→ centre ──→ room[]
          ├─→ saved_outing[]
          └─→ trip[] ──┬─→ date_option[]
                       ├─→ task[]
                       ├─→ ask[]
                       └─→ message[] ──→ suggestion?
trip ─── program_id ──→ (outing catalog, see outing-schema.md)
trip ─── room_ids[] ──→ room[]   (copy of counts kept on the trip)
```

## Three rules worth defending

1. **Trips copy, rooms don't cascade.** `children_count`, `adults_count` and the cost fields are snapshotted onto the trip. Editing a room next term must not silently rewrite the budget of a trip that already happened.
2. **Rooms archive, never delete.** Any trip referencing a hard-deleted room would fall back to another room's name and ratio — a wrong number presented confidently.
3. **Nothing derived is stored.** Totals, required adults, waiting-on, overdue counts and status labels are all computed from the fields above. One source of truth per fact, or the card contradicts itself.

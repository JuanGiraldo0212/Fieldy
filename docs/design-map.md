# Design map

The M0 deliverable named in `fieldy-implementation-plan.md` §2a and §6. It maps the design export that actually exists in this repo onto the plan's routes, components and tokens, and records every place the plan's assumptions about the export are wrong.

Read this before writing any component. When this file and the plan disagree about *where a thing lives*, this file wins. When they disagree about *behaviour*, the plan wins.

---

## 1. What the export actually is

The plan (§2a) expects a `design/` folder with `tokens/`, `components/` and `screens/` subfolders. **That folder does not exist.** The design source of truth is a working Claude Design prototype:

```
Full prototype build complete/
  Field Trip Planner Bright.dc.html   274 KB, 2858 lines  ← THE DESIGN
  venue-map-bright.html                                   ← Leaflet map iframe
  support.js                                              ← generated dc-runtime, do not read as design
  image-slot.js                                           ← placeholder-image runtime
  data-model.md                                           ← the plan's `fieldy-data-model.md`
  outing-schema.md                                        ← the plan's `outing-schema.md`
  uploads/                                                ← source PDFs, screenshots, one sample venue JSON
  scraps/                                                 ← 9 PNG frames of earlier iterations
  .thumbnail                                              ← WEBP preview, not content

  Field Trip Planner.dc.html          OUT OF SCOPE — superseded warm variant
  venue-map.html                      OUT OF SCOPE — its map
```

Format: a single-file Claude Design document. Markup uses `<x-dc>` with `sc-if` / `sc-for` control tags and `{{ binding }}` expressions; all styling is **inline hardcoded hex**, no CSS variables. The logic (state, mock catalog, feasibility, task generation, suggestion banners) lives in one `<script type="text/x-dc">` block at the bottom.

**Do not port the markup.** Per plan §2a, use it as a reference for structure, states and copy, then rebuild against tokens and real data.

### 1.1 Path corrections

These are the corrections that were applied to `fieldy-implementation-plan.md`; the plan now names the right paths. Kept here as the record of what moved.

| Plan originally said | Reality |
|---|---|
| `design/tokens`, `design/components`, `design/screens/*` | none exist — see §2, §5, §6 of this file |
| `fieldy-data-model.md` at repo root | `Full prototype build complete/data-model.md` |
| `outing-schema.md` at repo root | `Full prototype build complete/outing-schema.md` (titled "Fieldy outing schema v2") |
| `data/outings/*.json` | `outputs/*.json` — 15 venue records + 15 `.verification.md` + `batch-summary.md`. Older cut in `archive/outputs-v1/` (15 files). |
| `fieldtrip-mvp-spec.md` + `fieldtrip-mvp-spec-addendum-messaging.md` | merged into one file, `fieldy-mvp-spec.md` at the repo root. The plan's A2–A6 addendum references map onto its §5.4, §5.5 and §5.7. |

The plan was fixed rather than the files moved, with one thing left open: whether `data-model.md` and `outing-schema.md` should move out of the prototype folder into `docs/`.

---

## 2. Theme

**Bright only. Decided.** A second file in the folder holds an earlier warm palette; it is superseded and does not ship. One theme, no alternate, no theme switch, no second set of token values.

Bright is also the more complete document — 55% larger, and the only one with mood chips, the map toggle, the filter drawer, the trip status rail, the checklist and the room dialog.

Fonts: **Bricolage Grotesque** 400/500/600/700 for display, **Nunito Sans** 400/500/600/700 + italic 400 for body. Loaded from Google Fonts in the prototype; self-host in the real build.

---

## 3. Tokens

No token files exist — these were extracted from inline styles by frequency. Every value below is a real value in the prototype. Add these to `src/app/globals.css` and `tailwind.config.ts` in M0; no component may use a raw hex after that.

### 3.1 Colour

| Token | Value | Used for |
|---|---|---|
| `--bg` | `#F2F6FB` | page background |
| `--surface` | `#FFFFFF` | cards, nav, inputs |
| `--surface-2` | `#F7FAFE` | pressed/active chip fill |
| `--surface-3` | `#F5F9FF` `#F4F7FB` `#EDF2F8` | section fills, hover rows |
| `--border` | `#DBE3EC` | section dividers, nav underline |
| `--border-strong` | `#C9D5E2` | input and control borders |
| `--border-soft` | `#E6EDF5` `#E2E8F0` `#E8EFF7` | inner rules, chip borders |
| `--text` | `#16202B` | body and headings |
| `--text-strong` | `#33414F` | nav labels, secondary buttons |
| `--text-muted` | `#546475` `#5A6B80` | supporting copy, field labels |
| `--text-faint` | `#5F7085` `#78899C` `#93A3B5` | placeholder, meta, captions |
| `--brand` | `#1668D6` | links, icons, selection rings |
| `--brand-hover` | `#0F4E9E` | link hover |
| `--brand-solid` | `#1D4E9B` | primary button fill |
| `--brand-solid-hover` | `#16407F` | primary button hover |
| `--brand-tint` | `#E7F0FD` `#E2EDFC` | selected chip fill, badges |
| `--success` | `#146C47` `#1E8A4E` | "Fits your group", confirmed |
| `--success-tint` | `#E3F5EA` `#E7F6EC` | feasible badge fill |
| `--warn` | `#85610F` `#7D5F12` `#8A6410` | "One thing to check", rate flag |
| `--warn-tint` | `#FFF3D6` `#FFF2D4` `#FFF9E9` | amber badge fill |
| `--warn-border` | `#F0DFA6` `#E7C36A` `#E0A62A` | amber banner border |
| `--danger` | `#D0342B` | delete confirm, over-budget |
| `--danger-strong` | `#AE271F` | destructive button |

Where a row lists several hexes, they are near-duplicates in the prototype — collapse each row to one token value and pick the most-used hex (the first listed).

Mood-chip accents (one pair per mood — fill / ink):

`fun` `#FDEDF3`/`#D4478B` · `explore` `#FDEEE1`/`#DD7326` · `active` `#E7F6EC`/`#1E8A4E` · `creative` `#F3EDFD`/`#7A4FD1` · `learn` `#E7F0FD`/`#1668D6` · `surprise` `#FDF2E0`/`#D0951B`

Room-avatar tints (`PROFILE_TINT`, fill / ink): `baby` `#EEF0FE`/`#4A55C7` · `backpack` `#E7F5EC`/`#22794F` · `cap` `#FFF3D6`/`#8A6410` · `users` `#E7F0FD`/`#1668D6`

Map pins: home `#16202B`, venue `#1668D6`, tile canvas `#E6EDF5`, route polyline `#1668D6` dashed `6 6`.

### 3.2 Type scale

| Token | Size | Family / weight | Where |
|---|---|---|---|
| `display-lg` | 34px / 1.12 / `-0.025em` | Bricolage 700 | catalog h1 |
| `display-md` | 28px, 26px | Bricolage 700 | screen h1s |
| `display-sm` | 22px / `-0.015em` | Bricolage 600–700 | section h2, trip name |
| `brand` | 21px / `-0.02em` | Bricolage 700 | wordmark |
| `body-lg` | 17px / 1.5 | Nunito 400 | lede paragraph |
| `body` | 16px / 1.5–1.6 | Nunito 400–600 | inputs, buttons, prose |
| `body-sm` | 15px / 1.45 | Nunito 600 | controls, card titles, list rows |
| `meta` | 14px / 1.4 | Nunito 400–600 | timestamps, secondary rows |
| `meta-sm` | 13px | Nunito 400–600 | helper text |
| `label` | 12px / `0.05em`–`0.08em` uppercase 700 | Nunito | field labels, section eyebrows |

Weights in use: 400 (prose only), 600, 700. Nothing else.

### 3.3 Radius, shadow, layout

- Radii: `6px` checkbox · `10px` menu row · `12px` input, primary button · `14px` chip, photo, map frame, card · `16px` mood chip · `18px`/`20px` panel, dialog · `999px` pill, avatar, nav item. Split radii exist on the joined "Leaving from" control (`12px 0 0 12px` / `0 12px 12px 0`) and the sticky compose bar (`12px 12px 0 0`).
- Shadows: card `0 1px 2px rgba(22,32,43,0.04)` · popover `0 12px 28px rgba(22,32,43,0.14)` · modal `0 24px 60px rgba(22,32,43,0.22)` · floating pill `0 2px 6px rgba(22,32,43,0.18)` · scrim `rgba(22,32,43,0.42)`.
- Selection is a **ring, not a fill**: `inset 0 0 0 1.5px var(--brand)` for nav/chips, `inset 0 0 0 2px <mood ink>` for mood chips. Focus uses `0 0 0 2px var(--brand)`.
- Sticky nav: `rgba(255,255,255,0.96)` + `backdrop-filter: blur(8px)`, `z-index: 40`. Popovers `z-index: 30`.
- Widths: page container `1080px`; content columns `900–1000px`; reading measure `520–640px`; controls grid `repeat(auto-fit, minmax(180px, 1fr))`.
- Control heights: `52px` search field and Search button, `46px` filter controls, `44px` selects, `38px` avatar and small inputs.
- Spacing rhythm: 4 / 6 / 7 / 8 / 9 / 10 / 11 / 12 / 14 / 16 / 18 / 20 / 22 / 24 / 30. Not a clean 4pt scale — normalise to 4pt when building tokens and note any visible drift as a gap.
- Motion: exactly one keyframe, `riseIn` (`opacity 0 → 1`, `translateY(6px) → none`). Everything else is instant. Keep it that way.

### 3.4 Breakpoints

The prototype switches on a single JS breakpoint: `window.innerWidth < 620` sets `state.narrow`, which collapses the trip header rail and the room stat row to stacked layout. The plan (§2a, M6) requires 390px and 768px passes. Build mobile-first at 390px, verify at 620px (the prototype's own break) and 768px.

---

## 4. Icons

All icons are inline Lucide 24×24 stroke paths, `stroke-width: 2`, round caps and joins, rendered at 15–20px. The logic block carries a hand-rolled `LU` path registry with these names, which is the de-facto icon inventory:

`mail toilet utensils umbrella baby bus trees dollar clock users calendar footprints car info shield message heart tag box wifi accessibility circles filetext paw leaf landmark palette flask alert cap house backpack checkcircle clipboard truck`

`LU_CIRCLE` marks which of these draw an enclosing circle (`clock`, `dollar`, `info`, `circles`). Use `lucide-react` and keep these names; do not invent new glyphs.

Semantic maps worth preserving verbatim:

- `CAT_ICON`: animals→paw, nature→leaf, museums→landmark, arts→palette, science→flask, civic→landmark, comesto→truck
- `CAT_SHORT`: animals→Animals, nature→Nature, museums→Museums, arts→Arts, science→Science, civic→Community, comesto→At your place
- `FACT_ICON` (practical block): Washrooms→toilet, Lunch space→utensils, Rain backup/Rain plan→umbrella, Strollers→baby, Bus parking→bus, Nearby park→trees, Youngest age→baby, Price→dollar, Adults needed/Capacity/Group size→users, Bags→box, You need→wifi, Loan terms→calendar, Discount→tag, Rural note→car, Accessibility→accessibility
- Travel mode: walk→footprints, bus→bus, drivers→car, comes-to-you→truck

---

## 5. Component inventory

Design name → proposed path under `src/components/` → states the prototype actually shows. States marked **(gap)** are required by the plan but absent from the design; build them in the design's language and log them in `docs/design-gaps.md`.

### Shell

| Design element | Component | States |
|---|---|---|
| Top nav / wordmark | `layout/TopNav` | active per tab (ring), unread count (brand pill) vs trip count (grey pill), avatar initials, avatar active |
| Privacy footnote | `layout/PrivacyNote` | single state — "Only you and your team can see this trip." |

### Catalog

| Design element | Component | States |
|---|---|---|
| Search field + Search button | `catalog/SearchBar` | empty (placeholder "Search a place or activity"), filled |
| Age / Grade dropdown | `catalog/AgeBandPicker` | closed with summary label, open, band checked / unchecked, multi-band summary joined by `+` |
| Children stepper | `catalog/GroupSizeField` | numeric input only |
| Travel select | `catalog/TravelSelect` | walk / bus / parent drivers |
| Budget dropdown | `catalog/BudgetPicker` | closed, open, quick option active, "Or type a max" custom |
| Leaving-from + radius | `catalog/OriginField` | joined control, radius options 3/5/10/30/any |
| Mood chip | `catalog/MoodChip` | 6 moods × {default, active ring}; `surprise` is exclusive and reseeds a random 3 |
| Category chip | `catalog/CategoryChip` | default, active (tint + ring) |
| Filters toggle | `catalog/FilterToggle` | "closed with count label", "Hide filters" |
| Filter drawer | `catalog/FilterDrawer` | Environment / Accessibility / Program type checkbox groups; footer Clear all / Cancel / Apply. Edits a **draft** — Cancel discards |
| Results header | `catalog/ResultsHeader` | result line, sort select (Best match / Distance / Duration / Price), map toggle |
| Map panel | `catalog/CatalogMap` | hidden, shown (iframe to `venue-map*.html`), caption |
| Outing card | `catalog/OutingCard` | photo vs no-photo (initials + category label), green "Fits your group", amber "One thing to check" + issue line, rate flag row, big total + per-child line, quoted note |
| Feasibility badge | `catalog/FeasibilityBadge` | green, amber. There is no red level — plan §5.1 now matches |
| Empty results | `catalog/CatalogEmpty` | **(gap)** — the prototype never renders a no-results state |

### Program detail

| Design element | Component | States |
|---|---|---|
| Back link | `ui/BackLink` | "← All outings", "Back to outing details", "Back to outings" |
| Program header | `program/ProgramHeader` | category eyebrow, name, venue + travel line, green "✓ Fits {room}" / amber "! {issue}" |
| Hero image | `program/ProgramHero` | photo, no-photo initials block, save toggle overlay |
| Practical quad | `program/FactQuad` | Cost / Ages & size / Duration / Book by; fees note; school-rate flag |
| Primary actions | `program/ProgramActions` | "Plan this trip", "Save" / "Saved" |
| Relay explainer | `program/RelayNote` | collapsed one-liner, expanded paragraph |
| Photo strip | `program/PhotoStrip` | real photos, or 3 `image-slot` placeholders with captions |
| Our note | `program/OurNote` | single state |
| Conflict banner | `program/ConflictBanner` | "Sources disagree." + note |
| Practical list | `program/PracticalList` | fact known vs unknown (unknown detected by `/not stated|not published|confirm when you book|ask when you/i`) |
| Getting there | `program/TravelBlock` | 3 modes, primary highlighted, caveats ("too far with this group", "includes a 9 min wait"); map frame + "View larger map →" |
| Comes-to-you note | `program/ComesToYouNote` | replaces the travel block entirely |
| Freshness + report | `program/FreshnessLine` | default, reported ("Thanks — we will re-check this venue this week."); optional venue-page link, optional phone |
| Report form | `program/ReportForm` | **(gap)** — the prototype fakes it with a one-tap link, no form, no fields |

### Plan flow

| Design element | Component | States |
|---|---|---|
| Group summary bar | `plan/GroupSummaryBar` | collapsed with name + detail + "Change", expanded picker |
| Group picker | `plan/GroupPicker` | room selected / unselected, multi-select, capacity warning, "Done" |
| Numbered step header | `plan/StepHeader` | steps 1 and 2 |
| Date option rows | `plan/DateOptionList` | read mode (ordinal + short date), edit mode (date input, slot select Morning/Afternoon/Either, Remove), "Add another date (optional)", "Pick at least one date.", lead-time warning |
| Ask chips | `plan/AskChips` | on / off; pre-selected from the program's unpublished facts (max 4); "Add your own" → free-text input |
| Message preview | `plan/MessagePreview` | auto-growing textarea, editable |
| Send block | `plan/SendBlock` | enabled "Send request & build my trip", disabled "Pick a group and a date", reassurance copy |

### Trip page

| Design element | Component | States |
|---|---|---|
| Trip header | `trip/TripHeader` | category icon, name, venue, room + children meta |
| Status rail | `trip/StatusRail` | 4 steps (Idea dropped), reached / future; collapses on narrow. **Read only in the design** — the spec's manual status selector and its "set by you" source line have no control drawn (gap) |
| Suggestion banner | `trip/SuggestionCard` | `confirmed` (1 button "Mark confirmed"), `proposed_dates` (one "Move to {date}" per date, dismiss "Neither"), `declined` ("Mark cancelled" + "Find a similar program"), dismissed (hidden). **`unclear` is not drawn** — it renders no banner at all (plan §5.6) |
| Trip dates | `trip/TripDates` | read, edit (Make 1st / Remove), "1st choice" badge |
| Cost card | `trip/CostCard` | unknown ("Not confirmed yet" + "We'll update this once the venue replies."), known (editable per-line inputs + per-child line) |
| Checklist | `trip/TaskList` | done / not done, overdue, summary count, per-task icon by title match |
| Thread | `trip/Thread` | request summary message (dates + asks + body), plain message (educator/venue, initials avatar, "Newest reply" highlight, attachment chips), system message (centred rule), "Waiting for venue reply…" tail |
| Compose | `trip/ComposeBox` | empty (Send disabled), typed (Send enabled), placeholder "Add a follow-up message…" |
| Relay note | `trip/RelayFootnote` | design says "Replies will appear here and in your email." — **stale**, the relay is send-only. Use "Replies appear here, and we'll email you when one arrives." |
| Team notes | `trip/TeamNotes` | textarea, ratio warning line |
| Simulate reply row | — | **prototype only, do not build.** Its replacement is `scripts/simulate-venue-reply.ts` (plan M4) |

### My trips

| Design element | Component | States |
|---|---|---|
| Bucket tabs | `trips/BucketTabs` | Saved / Needs action / Waiting / Upcoming / Past, each with count, active ring |
| Saved row | `trips/SavedRow` | icon, name, venue · cost · travel, amber issue, Remove, "Plan this trip" |
| Saved empty | `trips/SavedEmpty` | "Nothing saved yet" + 3 suggested programs |
| Trip section | `trips/TripSection` | group icon, label, count |
| Trip row | `trips/TripRow` | day/month block, name, venue · room, "New reply" dot, "Confirmed" badge, past status text |
| Bucket empty | `trips/BucketEmpty` | one title+body pair per bucket (see §7) |
| Help footer | `trips/HelpFooter` | "Need help? Visit our help center" — **points nowhere** (gap) |

### Rooms ("Group profiles")

| Design element | Component | States |
|---|---|---|
| Room card | `rooms/RoomCard` | "In use" vs "Use this group", Edit, stat row, home base, notes |
| Room dialog | `rooms/RoomDialog` | new ("New room" / "Create room") vs edit ("Edit room" / "Save changes"); icon picker (4 looks); name, age min/max selects (1–12), size, budget, address, notes with 300-char counter; delete idle / armed / blocked ("Your last room cannot be deleted.") with usage warning |
| Room avatar | `rooms/RoomAvatar` | 4 tints × 4 icons (`baby`, `backpack`, `cap`, `users`) |

### Account

| Design element | Component | States |
|---|---|---|
| Account form | `account/AccountForm` | name, email, role radio group, centre-type radio group + per-type note, centre name |
| Relay explainer | `account/RelayExplainer` | paragraph + toggle on/off. **The design's copy is stale** — it promises forwarded copies and the relay is now send-only. Keep the layout, take the wording from §7 "Account, relay block" |

### Missing from the export entirely

Nothing in the prototype covers: `/inbox` and the nav unread badge as its own screen, `/login` and the magic-link flow, centre + first-room onboarding, `/saved` as a standalone route, loading skeletons, network errors, form validation beyond "Pick at least one date.", the send-failure retry state (plan M6), or `/dev/components`. All are plan requirements. Log each in `docs/design-gaps.md` and build them in the design's language.

---

## 6. Screen map

| Plan route | Prototype section | Lines | Notes |
|---|---|---|---|
| `/` | `<!-- CATALOG -->` | 63–426 | complete, richest screen |
| `/outing/[programSlug]` | `<!-- PROGRAM DETAIL -->` | 427–631 | complete except a real report form |
| `/plan/[programSlug]` | `<!-- PLAN FLOW -->` | 632–764 | complete |
| `/trips/[tripId]` | `<!-- TRIP PAGE -->` | 765–998 | complete; drop the simulate row |
| `/trips` | `<!-- MY TRIPS -->` | 999–1117 | includes Saved as a tab |
| `/rooms`, `/rooms/[roomId]` | `<!-- GROUP PROFILES -->` + room dialog | 1118–1170, 1166–1251 | editor is a modal; `/rooms/[roomId]` deep-links into it |
| `/account` | `<!-- ACCOUNT -->` | 1171–1253 | no centre section beyond the name field |
| `/saved` | — | — | redirects to `/trips?tab=saved` (decided) |
| `/inbox` | — | — | **not designed.** Plan §6 and M4 require it |
| `/login`, centre setup | — | — | **not designed.** Plan M2 requires it |
| `/api/*` | — | — | no UI |

---

## 7. Copy inventory

Verbatim from the bright prototype. Per plan §2a.4 these strings are authoritative — do not paraphrase. `{…}` marks an interpolation.

Four strings are marked **↻ ships as** — those are the ones the send-only relay changed after the design was drawn. The replacement is what goes in the build; §7.1 keeps the original for the record.

**Nav** — `Fieldy` · `Greater Victoria` · `Find outings` · `My trips` · `Groups`

**Catalog** — h1 `Every outing in Victoria that actually works for your group.` · lede `Tell us about the room once. We keep the details checked and get you booked on time.` · `Search a place or activity` · `Search` · labels `Age / Grade` `Children` `Travel` `Budget per child` `Leaving from` · `Pick more than one if the rooms go together.` · `Or type a max` · `What are you in the mood for?` (`Fun` `Explore` `Active` `Creative` `Learn` `Surprise me`) · `Browse by type` (`Animals & Farms` `Nature` `Museums` `Arts` `Science`) · `Hide filters` · `Environment` (`Indoor` `Outdoor` `Comes to you` `Free or low cost`) · `Accessibility` (`Wheelchair accessible` `Sensory friendly` `Neurodiversity friendly` `Low noise`) · `Program type` (`Guided programs` `Hands-on` `Interactive` `Self-guided`) · `Clear all filters` `Cancel` `Apply filters` · `Sort by` (`Best match` `Distance: nearest` `Duration: shortest` `Price: lowest`) · `Show map` · map caption `One pin per venue in this list. The dark pin is {home}. Programs that come to you have no pin.`

**Feasibility** — badges `Fits your group` / `One thing to check` / `✓ Fits {room}` / `! {issue}`. Issue strings, joined with ` · `:
- `ages are set by grade here, not years — phone to confirm they take under-fives`
- `built for {n}+, your youngest are {n}`
- `capacity is {n}, your group is {n} — ask about splitting`
- `{$} a child is over your {$} budget`

The design's `fit()` raised three more, for facts the venue simply had not published — `no youngest age published — email to ask before you plan`, `capacity is not published — ask when you book`, `no price published`. **These no longer fire.** On the real catalog they made every one of 39 programs amber, because 33 publish no capacity. Unknowns now surface as the "not published" derived labels below, and as pre-selected asks on the request. See plan §5.1.

**Derived labels** — `{$} per class` / `Free` / `Price not published` · `{$} a child for {n}` / `{$} for {n} children` / `no cost at all` / `ask the venue` · `Up to {n} children` / `Capacity not published` · `Ages {a} to {b}` / `Ages not published` · `Length not published` · `{n} days ahead` / `Not published` · `they come to you` / `{time} {on foot|by bus|driving} · {km} km` · travel caveats `too far with this group`, `includes a 9 min wait`

**Program detail** — `Plan this trip` · `Save` / `Saved` · `Fieldy handles all communication and booking for you.` · `Learn how it works →` · ↻ ships as `You pick dates, we write and send the request in your name, chase the reply, and put their answer on your trip page. We email you the moment they answer, and you reply right here.` · `What it actually looks like` · `Photos from {venue}'s website` · placeholders `Wide shot of the space` `The bit children remember` `Lunch spot or washrooms` `Category illustration` · `Our note` · `What the children do` · `Good to know` · `Sources disagree. {note}` · `Getting there` · `On foot` `By bus` `Driving` · `View larger map →` · `No travel. They come to you at {home} — nothing to book, no ratio change on the road.` · `School rate. Daycares are quoted through group visits — phone before you budget.` · `Details checked on {date} against the venue's own pages. Something wrong? Tell us — takes one tap.` · `Venue page` · `Thanks — we will re-check this venue this week.`

**Plan** — `Plan your request` · `Choose your dates and tell us anything else you'd like us to ask. We'll send the request and build your trip.` · `Change` · `Which groups are going?` · `Done` · `Preferred dates` · `We'll ask the venue in this order.` · `Edit dates` / `Done editing` · ordinals `1st choice`…`5th choice` (long form `Second choice` `Third choice` `Fourth choice` also present) · slots `Morning` `Afternoon` `Either` · `Add another date (optional)` · `Pick at least one date.` · `Add a second or third option and the venue can pick what suits them.` · `Anything else to ask? (optional)` · ask labels `Lunch space` `Washrooms` `Bus parking` `Accessibility` `Indoor space available?` · `Add your own` · placeholder `Is there a quiet corner for a nap?` · `Preview message` · `Send request & build my trip` · `Pick a group and a date` · `We'll create the message for you and start the conversation.` / `This sends a request — nothing is booked yet.` · `Only you and your team can see this trip.`

**Ask questions** (sent in the email body, keyed by fact label): `Where are the closest washrooms to the program space?` · `Is there somewhere we can use for lunch?` / `Is there space we can use for lunch?` · `Is there indoor space if the weather turns?` · `Is the space stroller and wheelchair accessible?` · `Where can a school bus park or drop off?` · `Do you take children as young as ours?` · `What would the total be for our group?` · `How many children can you take at once?` · `How many adults should we bring?` · `Where can the children leave bags and coats?` · `Is there a park nearby we could use for lunch?` · `Can you confirm the loan dates and the return deadline?` · `Can you confirm what we need to have ready?` · `Is there a discount we should ask for?` · `How does delivery work for our address?`

**Trip** — `Trip dates` · `1st choice` · `Make 1st` · `Remove` · `Estimated cost` · `Not confirmed yet` / `We'll update this once the venue replies.` · `Checklist` · `Conversation` · `Waiting for venue reply` / `Waiting for venue reply…` · `Request sent` · `Newest reply` · `Add a follow-up message…` · `Send` · relay footnote ↻ ships as `Replies appear here, and we'll email you when one arrives.` · `Team notes` · `Add a note for your team…` · ratio lines `This room requires 1 adult for every {n}…` / `{n} adults for {n} children — ratio met` / `You need {n}… You have {n}`

**Suggestion banner** — `Looks like the venue confirmed {date}{ at time}.` → `Mark confirmed`, dismiss `Not quite` · `The venue suggested {date} or {date} instead.` → `Move to {date}`, dismiss `Neither` · `It sounds like the venue cannot take this booking.` → `Mark cancelled`, link `Find a similar program`, dismiss `Not quite`. Evidence renders in curly quotes: `“{evidence}”`.

**My trips** — `My trips` · tabs `Saved` `Needs action` `Waiting` `Upcoming` `Past` · `New reply` · `Confirmed` · `Plan this trip` · `Remove` · `Nothing saved yet` / `Tap Save on any outing and it waits here until you are ready. Three that fit {room} right now:` · empties:
- needs — `Nothing needs you right now` / `When a venue replies, the trip moves here so you know it is your turn.`
- waiting — `No requests out` / `Trips you have asked about but not heard back on will wait here.`
- upcoming — `No confirmed trips yet` / `Once a venue confirms a date, the trip shows up here with its checklist.`
- past — `No history yet` / `Trips you have been on, and any you cancelled, collect here.`
- `Need help? Visit our help center`

**Rooms** — `Group profiles` · `One per room. Everything else in the app filters from these.` · `Add a room` · `In use` / `Use this group` / `Edit` · `Home base` · `Notes` · dialog `New room` / `Edit room`, `Create room` / `Save changes` · `Room icon` · `Room name` (placeholder `Preschool room`) · `Ages` · `Group size` · `Budget per child` · placeholder `Street, city` · notes placeholder `Naps, allergies, who drives — anything the app should remember` · `Delete room` · `Delete this room?` · `Yes, delete` / `Keep it` · `Your last room cannot be deleted.` · `{n} planned trip(s) use this room. They will keep their own numbers and show it as deleted.` / `Nothing is planned with this room yet.`

**Account** — `Your account` · `Email and a link. No password to forget at 7:40 am.` · field labels `Name` `Email` `Role` `Type of centre` `Centre or school` · `Save and keep planning` · centre-type notes:
- daycare — `Venue school rates often do not apply — we flag those so you can ask for a quote.`
- school — `School and district rates apply, and grade-based programs are shown as published.`
- other — `We will show every rate we have and flag the ones written for schools.`

**Account, relay block** — heading `How your requests are sent`, then ↻ ships as:
- paragraph — `Requests are sent from your name through a Fieldy address. The venue sees your name and centre, and your email is in the message so they can always reach you directly. Their replies come back here, and we email you when one arrives.`
- toggle — `Email me when a venue replies`, default on, bound to `account.email_notifications`

Same layout as the design: heading, paragraph, then the toggle row with the label on the left and the switch on the right. Only the words change.

**Reply notification email** — not in the design at all; copy set by plan §5.4a, build it plain from the tokens:
- subject — `{venue name} replied about {program name}`
- body — who replied, the trip and its first date, the first 200 characters of the stripped message, a button `Open the trip`, and the line `You can't reply to this email — open the trip to answer.`
- auto-response to anyone who replies anyway — `Fieldy doesn't read replies to this address. Open your trip to answer the venue: {link}`

No suggestion text in the email. The banner is the reason to open the app, and a wrong reading is much worse pushed into an inbox than shown next to a Dismiss button.

### 7.1 Copy the design has, that no longer ships

The relay became send-only after the design was drawn (spec §3, §5.10; plan §5.4a). Four strings are stale. Keep the design's layout and weight, swap the words:

| Design says | Ships as |
|---|---|
| `Requests are sent from your name through a Fieldy address. The venue sees your name and centre, and can always reach you directly. Copies of every message are forwarded to your email.` | `Requests are sent from your name through a Fieldy address. The venue sees your name and centre, and your email is in the message so they can always reach you directly. Their replies come back here, and we email you when one arrives.` |
| `Also forward venue replies to my email` | `Email me when a venue replies` |
| `Replies will appear here and in your email.` (trip page) | `Replies appear here, and we'll email you when one arrives.` |
| `You pick dates, we write and send the request in your name, chase the reply, and put their answer on your trip page. Every message is copied to your email — you can always write to the venue yourself.` (outing page, "Learn how it works") | `You pick dates, we write and send the request in your name, chase the reply, and put their answer on your trip page. We email you the moment they answer, and you reply right here.` |

---

## 8. Behaviour the design encodes

Extracted from the prototype logic. The plan (§5.1, §5.1a, §5.2, §5.6, §10) has been updated to match all of it, except where noted below.

- **Feasibility is two-level, not three.** `green = issues.length === 0`, `amber = issues.length > 0`. Red is gone from the plan. **Settled.**
- **Feasibility checks are age, capacity, budget only.** Distance and season are filters, not reasons. **Settled** — plan §5.1 rewritten.
- **Statuses: data model wins, design labels win.** The prototype's rail has six states (`idea · contacted · replied · confirmed · done · cancelled`) but `data-model.md` deliberately dropped `idea` ("a trip is created by sending a request") and names the first state `requested`. Ship the data model's enum with the design's words: **Asked** (requested) → **They answered** (replied) → **Confirmed** → **Done**, sublines "Request sent to the venue" / "Waiting on your call" / "Date is locked in" / "You went". The Idea step is dropped; Saved on `/trips` is that state. Logged as a gap.
- **Rooms are called "Groups" / "Group profiles" in the UI.** Keep the data-model name `room` in code, use the design's word in copy.
- **Buckets are derived, not stored**: `past` if done/cancelled, otherwise `needs` if the last message is from the venue, `waiting` if awaiting a reply, `upcoming` if confirmed. `saved` is a separate list, not a trip status.
- **Task defaults** (`buildTrip`, buffer prop default 3 days, lead default 14 when unpublished): `Send request to {venue}` at `−(lead + buffer)` · `Book the bus` at `−14` (only when a room's transport is bus and the program does not come to you) · `Director approval signed off` `−10` · `Parent consent forms out` `−10` · `Consent forms back in` `−3` · `Confirm headcount with the venue` `−2` · `Pack list, weather check, emergency contacts` `−1`. Sorted by date. Regeneration keeps done tasks untouched.
- **Ask pre-selection**: the plan screen pre-picks up to 4 asks from the program's facts whose value matches `/not stated|not published|confirm when you book|ask when you/i`, then appends the standard five topics if not duplicated. This is the mechanism behind plan M3's "asks pre selected from program gaps".
- **Travel estimates**: walk 4.6 km/h, bus 15 km/h + 9 min wait, parent drivers 32 km/h + 4 min. Walking is filtered out beyond 2.5 km. **Settled** — these replaced the plan's 4.5 / 30.
- **Radius options**: 3, 5, 10, 30 km, and 0 for "any". Default 5 km. **Settled** — replaced the plan's proposed 2 km.
- **Age bands**: `1–3`, `3–5, Grade 1`, `5–8, Grades 1–3`, `8–12, Grades 4–7`. Multi-select, summary joined with `+`.
- **Sort**: `Best match` puts green before amber (`rankFeasibleFirst` prop, default true) then nearest; `Distance` ignores the green ranking entirely.
- **Surprise me** is exclusive of other moods and returns a seeded random 3.
- **Grade-based programs are shown to daycares**, flagged with the school-rate line rather than hidden. **Settled.**
- **Filter drawer edits a draft**; Cancel discards, Apply commits. The top-row controls (age, size, travel, budget, origin) apply immediately.
- **The room dialog blocks deleting the last room** in the UI, matching plan §4.1's "enforce in the server action".
- Two configurable props are declared on the design document itself: `rankFeasibleFirst` (boolean, default true) and `taskBufferDays` (int, default 3, 0–14). Treat both as real settings.

---

## 9. Gaps to seed `docs/design-gaps.md`

1. Status rail has no "Idea" step — dropped from the design's five, since a trip only exists once a request is sent.
2. Manual status selector and the "moved here when the venue replied" / "set by you" source line — required by spec §5.4.1 and interaction 7, no control in the design.
3. `unclear` suggestion intent renders no banner — the design draws three of the four intents, and that is the decided behaviour, not an omission.
4. Catalog no-results empty state.
5. Report form — design has a one-tap link, plan §8 and `/api/reports` need fields.
6. `/inbox` screen and nav unread badge as something other than the My trips pill.
7. `/login`, magic-link sent/expired states, centre + first-room onboarding.
8. Loading skeletons for catalog, trip and thread.
9. Network and validation error states; the "sending" moment after tapping Send; send-failure retry on the trip page (plan M6).
10. `/dev/components` token and state gallery (plan §2a.2).
11. Help centre destination for "Visit our help center".
12. Spacing scale is not a clean 4pt grid; normalising will shift some frames.
13. Account and trip-page relay copy overridden — the design promises forwarded email copies, the relay is send-only (see §7.1).
14. Reply notification email — no template designed; build it plain, from the tokens.

---

## 10. Decisions and remaining questions

Settled, and written into the plan:

1. **Bright only.** The warm variant is out of scope, not an alternate theme.
2. **Statuses**: data model's enum (`requested…`), design's labels (Asked / They answered / …), no Idea step.
3. **Distance**: the design's 4.6 / 15 (+9 min) / 32 km/h, with the 2.5 km walk cut-off.
4. **Radius**: 3/5/10/30/any, default 5 km.
5. **Feasibility**: two levels, three checks, the design's issue sentences verbatim.
6. **`/saved`** redirects into `/trips?tab=saved`; the room editor is a modal, not a route.
7. **Grade-based programs** are shown to daycares with the school-rate flag.
8. **`booking_email`** exists at both venue and program level in schema v2; resolve at import, snapshot on the trip as `venue_email`.
9. **Catalog path** is `outputs/`; there is no `data/outings/`.

Still open:

1. Domain and sending subdomain name.
2. Where `fieldtrip-mvp-spec.md` and the messaging addendum are — the inbox screen (A5) and the magic-link flow are described in neither the design nor this plan.
3. Whether `data-model.md` and `outing-schema.md` move out of `Full prototype build complete/` into `docs/`.

# Fieldy outing schema v2

What the scraper/curation pipeline should emit so a venue drops into the app with no hand-editing.
`+` marks fields added in v2. Everything else already exists in v1 and keeps its meaning.

## Conventions

- **Nulls are data.** Never guess a value to fill a hole. `null` renders as an amber "not stated on the site" row, which is a feature — it tells the director what to ask. A wrong number is worse than a blank.
- **Money** is CAD, tax excluded unless `tax_included` is true. Numbers, not strings.
- **Dates** are ISO `YYYY-MM-DD`. **Times** are 24h `HH:MM` local.
- **`days_offered`** is ISO-8601 weekday numbers: **1 = Monday … 7 = Sunday**.
- **`months_offered`** is 1–12. `null` means year-round, not unknown — use `"unknown"` in `gaps` if it genuinely wasn't published.
- **Ids** are stable slugs, lowercase, hyphenated. They must survive a venue renaming a program.

---

## `venue`

| Field | Type | Notes |
|---|---|---|
| `+ id` | string | slug, e.g. `art-gallery-greater-victoria` |
| `name` | string | |
| `website` | url | |
| `description` | string | 2–4 sentences, factual |
| `category` | enum | `animals_farms` · `nature_outdoors` · `museums_history` · `arts_performance` · `science` · `community_civic` · `comes_to_you` |
| `+ address` | string | full street address, e.g. `1040 Moss St, Victoria, BC V8V 4P1` |
| `+ lat` | number | **required** — distance, travel time, radius filter and the map all depend on it |
| `+ lng` | number | **required** |
| `hosts_school_groups` | bool | |
| `+ hosts_daycare_groups` | bool·null | separate from the above; most venues answer these differently |
| `youngest_age_welcomed_years` | number·null | |
| `booking_email` / `booking_phone` / `booking_url` | string·null | venue-level default |
| `booking_method` | enum | `email` · `phone` · `web_form` · `shop` |
| `has_washrooms`, `has_lunch_space`, `has_rain_backup`, `stroller_accessible`, `wheelchair_accessible`, `bus_parking` | bool·null | |
| `+ facility_notes` | object·null | free text per practical fact, e.g. `{"washrooms": "Beside the studio, change table", "bus_parking": "Moss St, curbside only"}` — the Good-to-know tiles show this line under each label; without it the tile is just Yes/No |
| `+ nearby_park` | string·null | lunch-nearby line |
| `+ restrictions` | string[]·null | e.g. `["No food, drinks or backpacks in the exhibitions"]` |
| `+ languages` | string[]·null | tours offered in |
| `general_admission_child_cad` / `general_admission_adult_cad` | number·null | |
| `hours_notes`, `seasonal_notes` | string·null | |
| `price_year_or_season` | string·null | |
| `+ checked_on` | date | **required** — powers "Details checked on …" |
| `+ checked_by` | string·null | `scraper` · person's name |

## `programs[]`

| Field | Type | Notes |
|---|---|---|
| `+ id` | string | **required** — slug, unique within the venue, e.g. `school-tour-workshop` |
| `name`, `description` | string | |
| `+ what_children_do` | string·null | the concrete, physical account — "sit on the floor to look and talk, then paint in the studio". Rendered as its own section; `description` is not a substitute |
| `+ our_note` | string·null | 1–3 sentences of our own advice, written like a friend, never marketing. The italic line on every card and the "Our note" callout |
| `+ practical_summary` | string·null | 1–2 sentences summarising the practical facts and their gaps. Sits above the Good-to-know tiles. Generate from the facility fields + `gaps`, then have a human read it |
| `comes_to_you` | bool | |
| `age_min_years` / `age_max_years` | number·null | |
| `grade_min` / `grade_max` | number·null | K = 0 |
| `+ age_basis` | enum | `years` · `grades` — which the venue actually publishes. Drives "Ages 3 to 5" vs "Grades 2–12" and the honest "ages are set by grade here" flag |
| `duration_min` | number·null | minutes |
| `capacity_max` | number·null | |
| `+ capacity_min` | number·null | some venues have a floor |
| `cost_per_child_cad`, `cost_per_group_cad`, `cost_per_adult_cad`, `free_adults_per_children`, `is_free` | number/bool·null | one of per-child or per-group, not both |
| `+ tax_included` | bool·null | `false` renders "+ GST" |
| `+ extra_fees_note` | string·null | e.g. `"plus group admission, rate not published"` |
| `+ school_rate_only` | bool | true when the published price is written for schools/districts. Shows the "daycares are quoted separately" banner — only to daycare accounts |
| `+ deposit_required` | bool·null | |
| `+ payment_timing` | string·null | e.g. `"advance payment required"` |
| `+ cancellation_note` | string·null | e.g. `"booking fee non-refundable within 14 days"` |
| `months_offered` | int[]·null | |
| `days_offered` | int[]·null | ISO weekdays, see conventions |
| `+ time_slots` | string[]·null | `["09:30", "12:15"]` — the plan screen asks morning/afternoon; if the venue publishes exact slots, offer them instead |
| `lead_time_days` | number·null | |
| `+ chaperone_ratio` | object·null | `{"children_per_adult": 6, "applies_to": "elementary"}`; array if the venue states several. Feeds the adults/ratio helper |
| `+ adults_free` | bool·null | whether chaperones pay admission |
| `indoor` / `outdoor` | bool | |
| `+ format` | enum[] | `guided` · `self_guided` · `hands_on` · `interactive` — the Program type filter |
| `+ sensory_friendly`, `+ low_noise`, `+ neurodiversity_friendly` | bool·null | the Accessibility filter. `null` ≠ `false`; unknown stays out of results only when the filter is on |
| `+ mood_tags` | enum[]·null | `fun` · `explore` · `active` · `creative` · `learn`. Derivable from category, but override here when the category misleads |
| `curriculum_tags` | string[]·null | |
| `+ booking_email` / `+ booking_url` / `+ booking_method` | string·null | program-level override — a venue's free self-guided visit and its paid workshop rarely book the same way |
| `source_url`, `evidence` | string | keep: `evidence` is what makes a claim auditable |
| `+ checked_on` | date | per program, since programs change at different times |
| `image_ids` | string[]·null | replaces `image_url`; see below |

## `images[]`

| Field | Type | Notes |
|---|---|---|
| `+ id` | string | referenced by `programs[].image_ids` |
| `url` | url | |
| `role` | enum | `hero` · `program` · `space` · `activity`. **At least one `hero` per venue** — the card thumbnail and the outing header both read it, and without it most cards fall back to an initials tile |
| `+ alt` | string | **required** — currently null everywhere; it's the accessibility text and the fallback caption |
| `caption` | string·null | |
| `found_on_url` | url | |
| `width` / `height` | number·null | |
| `rights_note` | string | prints as the photo credit |
| `+ usage` | enum | `licensed` · `venue_supplied` · `public_domain` · `unverified`. Only the first three render; `unverified` holds the image back for review |

## Provenance

| Field | Type | Notes |
|---|---|---|
| `gaps` | string[] | keep as-is — genuinely useful, and already drives the amber "not stated" rows |
| `+ conflicts` | object[] | `{"field": "chaperone_ratio", "values": ["3 adults", "up to 6 adults"], "sources": ["…/school-programs/", "…/school-program-guidelines/"], "note": "pages disagree"}`. Today these are buried in `gaps` prose; as structured data the UI can show "sources disagree — confirm when booking" instead of quietly picking one |
| `pages_opened` / `pages_useful` | url[] | |
| `+ extracted_at` | datetime | |
| `+ extractor_version` | string | so a bad run is identifiable later |

---

## Screen → field map

| Screen | Reads |
|---|---|
| Catalog card | `name`, `venue.name`, `lat`/`lng` (travel), `duration_min`, age/grade + `age_basis`, `capacity_max`, cost fields, `our_note`, `school_rate_only`, hero image, `category` |
| Filters | `category`, `indoor`/`outdoor`, `comes_to_you`, cost, `format`, accessibility booleans, `mood_tags`, `lat`/`lng` (radius) |
| Outing page | everything above plus `what_children_do`, `practical_summary`, facility fields + `facility_notes`, `nearby_park`, `restrictions`, `hours_notes`, `seasonal_notes`, `lead_time_days`, booking fields, `checked_on`, images |
| Plan request | `time_slots`, `lead_time_days`, `capacity_max`/`_min`, booking fields |
| Trip page | cost fields, `tax_included`, `extra_fees_note`, `chaperone_ratio`, `adults_free`, `lead_time_days` (timeline offsets), `cancellation_note` |

## Minimum viable record

A venue is publishable with: `venue.id`, `name`, `address`, `lat`, `lng`, `category`, `checked_on`, one `hero` image with `alt`, and one program carrying `id`, `name`, `age_basis` + whichever range is published, `comes_to_you`, a cost field or `is_free`, and `our_note`. Everything else may be `null` — the app is designed to say "not published, ask when you book" and to rank an honest gap above a confident guess.

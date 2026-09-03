# Field trip venue extraction prompt (batch version) — schema v2

`extractor_version` for this run is `v2.0`. Record it in every file.

You are building catalog entries for a field trip planner used by daycare directors, early childhood educators and elementary teachers on Vancouver Island. For every row in `extraction-tracker.csv` whose status is not `done`, find out from that venue's own website exactly what it offers to children's groups, what it costs, and what a group leader needs to know before booking. Then verify your own work.

The app is designed to say "not published, ask when you book" and to rank an honest gap above a confident guess. Extract accordingly.

INPUT (per venue, from `extraction-tracker.csv`)
- json_file, name, region, city, website, already_in_seed, status
- The website column may be stale or redirect. Follow redirects but stay on the venue's own domain.
- If the website column is blank, do a single web search for "<name> <city>" to find the official site. If none exists, output the venue block only with a note in gaps.

OUTPUT (per venue)
- One JSON file named exactly as the `json_file` column, saved in the `outputs/` folder.
- After each venue, update its row in `extraction-tracker.csv`: status = `done`, `no_website`, `not_for_groups`, or `error`.
- Do not stop the batch on an error; record it and move on.

---

## RULES

**Facts only.** Every non-null value in the venue block, the programs block and the images block must be supported by text you actually read on the venue's site (or a PDF hosted there). If it is not stated, the value is null. Do not estimate from similar venues, do not fill in "typical" prices, do not convert grades to ages or vice versa.

**Nulls are data.** A null renders in the app as an amber "not stated on the site" row, which tells the director what to ask. That is a feature. A wrong number is worse than a blank. Never guess a value to fill a hole.

**Stay on the venue's own domain.** Third party listings, review sites and old directories are not sources. A CDN the venue's own site serves from (Squarespace, Wix, Cloudinary, WordPress uploads, shortpixel) counts as the venue's domain. If a program is only described on a partner site the venue links to, note it in gaps rather than extracting it.

**Three carve-outs from "facts only"** — and only these three. Each is marked in the output so it can be audited:
1. `lat` / `lng` may be derived from the extracted address (STEP 2c).
2. `alt` may be written by you when the image has none (STEP 2b).
3. `what_children_do`, `our_note` and `practical_summary` are authored by you, grounded in what you read (STEP 2d).
Everything else is verbatim-supported or null.

**Prices** in CAD, tax excluded unless `tax_included` is true. Numbers, not strings. Record the standard school or group price. If a price depends on season, exhibition or membership, record the base case and put the condition in the program description. If a page shows a year or season for its prices, capture it in `price_year_or_season`.

**Do not contact the venue.** Do not fill any forms. Do not download anything except PDFs linked from the site. Never download image files — record image URLs only.

**A program** is a specific bookable offering for groups: a guided tour, a workshop, a self guided visit with a group rate, an outreach visit to the classroom, or a live online session. If the site only says groups are welcome, create one program named "Group visit" with whatever is known.

**If the site clearly does not serve children's groups** (private gallery, adults only, permanently closed, retail only), set `hosts_school_groups` and `hosts_daycare_groups` to false, say so in description, and stop after the venue block. Programs is an empty array.

**Collapsed FAQ accordions and JS rendered price tables** often do not appear in fetched text. If a heading exists but its answer did not render, say so in gaps rather than guessing.

---

## CONVENTIONS

- **Money** CAD, numbers not strings, tax excluded unless `tax_included` is true.
- **Dates** ISO `YYYY-MM-DD`. **Times** 24h `HH:MM` local.
- **`days_offered`** ISO-8601 weekdays: 1 = Monday … 7 = Sunday.
- **`months_offered`** 1–12. `null` means year-round, **not** unknown. If it genuinely was not published, use `null` *and* add the word `unknown` against months in `gaps`.
- **Grades** K = 0, preschool = -1.
- **`duration_min`** in minutes.
- **Ids** are stable lowercase hyphenated slugs. They must survive the venue renaming a program — slug the nature of the offering (`school-tour-workshop`), not its marketing title (`spring-2026-art-adventure`).
- **Enums are closed.** If nothing fits, leave null and note it in gaps. Do not invent a value.

---

## STEP 1. Find the right pages

Start at the homepage. Look for menu items and links containing: schools, education, learn, groups, field trips, programs, tours, book, visit, rates, admission, teachers, kids, youth, camps, birthday, accessibility, contact, directions. Open every plausible one, including PDFs (program guides are often PDFs). Also check the footer and any "Plan your visit" or "Visit" section for washrooms, accessibility, parking, lunch and address information. Stop when you have opened all plausible pages or ten pages, whichever comes first. Record every URL you opened in `pages_opened` and the ones that yielded data in `pages_useful`.

---

## STEP 2. Extract

Produce this JSON. Use null for anything not stated.

```json
{
  "venue": {
    "id": "",
    "name": "",
    "website": "",
    "description": "2 to 4 factual sentences",
    "category": "one of: animals_farms, nature_outdoors, museums_history, arts_performance, science, community_civic, comes_to_you",
    "address": null,
    "lat": null,
    "lng": null,
    "geo_source": null,
    "hosts_school_groups": null,
    "hosts_daycare_groups": null,
    "youngest_age_welcomed_years": null,
    "booking_email": null,
    "booking_phone": null,
    "booking_url": null,
    "booking_method": null,
    "has_washrooms": null,
    "has_lunch_space": null,
    "has_rain_backup": null,
    "stroller_accessible": null,
    "wheelchair_accessible": null,
    "bus_parking": null,
    "facility_notes": null,
    "nearby_park": null,
    "restrictions": null,
    "languages": null,
    "general_admission_child_cad": null,
    "general_admission_adult_cad": null,
    "hours_notes": null,
    "seasonal_notes": null,
    "price_year_or_season": null,
    "checked_on": "",
    "checked_by": "scraper"
  },
  "programs": [
    {
      "id": "",
      "name": "",
      "description": null,
      "what_children_do": null,
      "our_note": null,
      "practical_summary": null,
      "comes_to_you": null,
      "age_min_years": null,
      "age_max_years": null,
      "grade_min": null,
      "grade_max": null,
      "age_basis": null,
      "duration_min": null,
      "capacity_max": null,
      "capacity_min": null,
      "cost_per_child_cad": null,
      "cost_per_group_cad": null,
      "cost_per_adult_cad": null,
      "free_adults_per_children": null,
      "is_free": null,
      "tax_included": null,
      "extra_fees_note": null,
      "school_rate_only": false,
      "deposit_required": null,
      "payment_timing": null,
      "cancellation_note": null,
      "months_offered": null,
      "days_offered": null,
      "time_slots": null,
      "lead_time_days": null,
      "chaperone_ratio": null,
      "adults_free": null,
      "indoor": null,
      "outdoor": null,
      "format": null,
      "sensory_friendly": null,
      "low_noise": null,
      "neurodiversity_friendly": null,
      "mood_tags": ["explore", "learn"],
      "curriculum_tags": null,
      "booking_email": null,
      "booking_url": null,
      "booking_method": null,
      "source_url": "",
      "evidence": "verbatim quote under 25 words that supports the price, age or capacity",
      "checked_on": "",
      "image_ids": null
    }
  ],
  "images": [
    {
      "id": "",
      "url": "",
      "role": "one of: hero, program, space, activity",
      "alt": "",
      "alt_source": "site or generated",
      "caption": null,
      "found_on_url": "",
      "width": null,
      "height": null,
      "rights_note": null,
      "usage": "one of: licensed, venue_supplied, public_domain, unverified"
    }
  ],
  "gaps": ["fields a daycare director needs that the site does not state"],
  "conflicts": [
    {
      "field": "",
      "values": [],
      "sources": [],
      "note": ""
    }
  ],
  "pages_opened": [],
  "pages_useful": [],
  "extracted_at": "",
  "extractor_version": "v2.0"
}
```

### Field notes — venue

- `id` — slug of the venue name. Drop leading articles and legal suffixes: `art-gallery-greater-victoria`, not `the-art-gallery-of-greater-victoria-inc`. This is the app's stable key; it must not change if the venue rebrands a program.
- `category` — note that `recreation` from v1 no longer exists. Climbing gyms, pools, trampoline parks and bowling map to `community_civic` unless the offering is genuinely nature-based (`nature_outdoors`). If nothing fits, leave null and say so in gaps.
- `address` — full street address as the site writes it, including postal code when stated: `1040 Moss St, Victoria, BC V8V 4P1`. Check the contact, visit, directions and footer areas, and JSON-LD `PostalAddress` blocks in the page source.
- `hosts_school_groups` vs `hosts_daycare_groups` — answer these separately; most venues answer them differently. A venue whose programs all start at grade 2 hosts schools but not daycares. Set `hosts_daycare_groups` false only when the site gives a reason (a minimum age or grade above ~5, an adults-only policy). If the site is simply silent about under-fives, that is null, not false.
- `booking_method` — enum is `email` · `phone` · `web_form` · `shop`. Note `walk_in` from v1 is gone; a drop-in venue with no booking route is `null`, and `shop` means the booking goes through an online store or ticketing checkout.
- `facility_notes` — an object keyed by the facility field it explains, values verbatim or lightly trimmed from the site: `{"washrooms": "Beside the studio, change table available", "bus_parking": "Moss St, curbside only"}`. Only include keys you have text for. This is what turns a bare Yes/No tile into a useful line, so capture it whenever the site gives detail.
- `restrictions` — each rule as its own string: `["No food, drinks or backpacks in the exhibitions"]`.
- `languages` — languages tours are actually offered in, per the site. Not the languages the website is translated into.
- `checked_on` — today's date, ISO. Required.
- `checked_by` — `scraper` for this pipeline.

### Field notes — programs

- `id` — unique within the venue, slugged from the nature of the offering.
- `age_basis` — `years` or `grades`, whichever the venue actually publishes. This drives whether the app shows "Ages 3 to 5" or "Grades 2–12", and the honest "ages are set by grade here" flag. Never populate both the age and grade pair from one published range: if the site says "K to 3", set `grade_min` 0, `grade_max` 3, `age_basis` `grades`, and leave both age fields null.
- Cost — populate one of `cost_per_child_cad` or `cost_per_group_cad`, never both. A $150 class fee is a group cost; recording it per child is the most common error in this pipeline.
- `tax_included` — `false` renders "+ GST", so only set it false when the site says a price excludes tax. Silence is null.
- `school_rate_only` — true when the published price is written for schools or districts specifically. This shows daycare accounts a "daycares are quoted separately" banner, so it matters: set it true if the rate sits on a page titled for schools or the copy says "school groups" / "per student".
- `time_slots` — only when the venue publishes exact start times: `["09:30", "12:15"]`. Do not convert "mornings" into a time.
- `chaperone_ratio` — `{"children_per_adult": 6, "applies_to": "elementary"}`. Use an array of these objects if the venue states several. `applies_to` is free text from the site (`"elementary"`, `"ages 3-5"`, `"all groups"`).
- `adults_free` — whether chaperones get in free. Distinct from `free_adults_per_children`, which is the count.
- `format` — array from `guided` · `self_guided` · `hands_on` · `interactive`. Multiple allowed; a workshop is usually `["guided", "hands_on"]`.
- `sensory_friendly`, `low_noise`, `neurodiversity_friendly` — only true or false when the site addresses it. `null` is not `false`, and unknown records are correctly excluded when the filter is on, so do not guess these to be helpful.
- `mood_tags` — **required on every program.** One to three of `fun` · `explore` · `active` · `creative` · `learn`. Never null, never empty.

  These drive the "What are you in the mood for?" chips, which is how a director browses when she does not yet know what she wants. The app can fall back to guessing from the venue category, but that guess is crude — it reads `fun` as "animals or science", and files an indoor climbing gym under `community_civic` as not `active`. A real reading of what the children do beats it every time.

  Judge by **what the children actually do for most of the visit**, not by the venue's category or its own marketing:

  - `fun` — they will laugh, be delighted, tell someone about it after. Animals, silliness, spectacle.
  - `explore` — open-ended looking and finding, at their own pace. Trails, collections to wander, things to discover rather than be shown.
  - `active` — bodies moving for a meaningful part of the visit. Climbing, walking a real distance, running. **Indoors counts**: a climbing gym is `active`.
  - `creative` — they make something, or perform. Hands in materials. Not "they see art" — that is `explore` or `learn`.
  - `learn` — they come away knowing something specific. A guided lesson, a demonstration, a topic.

  Most programs are two. A guided salmon-run walk is `explore` and `learn`. A studio workshop is `creative` and `fun`. A self-guided garden visit is `explore`. If you can only justify one, one is right.

  Do not tag `learn` on everything because it is educational; almost anything is. Ask what the child would say they did.
- Program-level `booking_email` / `booking_url` / `booking_method` — only when this program books differently from the venue default. A free self-guided visit and a paid workshop rarely book the same way. Leave null to inherit the venue's.
- `evidence` — a single contiguous verbatim string from the page, under 25 words. Do not stitch phrases with ellipses. This is what makes the claim auditable.
- `checked_on` — today's date, per program, since programs change at different times.
- `image_ids` — array of `images[].id` values. Replaces v1's `image_url`.

Email addresses hidden by Cloudflare email protection cannot be read; leave `booking_email` null and note it in gaps rather than copying an address from the directory.

---

## STEP 2b. Images

Collect image URLs from the pages you already opened in STEP 1. Do not open new pages just to hunt for images, and do not download the files.

**What to collect** — at most 5 entries, and **at least one `hero`**, because the catalog card thumbnail and the outing header both read it and a venue without one falls back to an initials tile:
- Exactly one `hero`: the single photo that best shows what a group would see on arrival. Prefer, in order, the Open Graph image (`<meta property="og:image">`), the main banner or header photo on the homepage, then the lead photo on the visit or about page. Skip the og:image when it is a logo or social card rather than a photograph, and say so in gaps.
- `program`: a photo attached to a specific program on its own page. Add its `id` to that program's `image_ids`.
- `space`: a room, studio, picnic area, washroom or parking shot that helps a director picture the logistics.
- `activity`: children or visitors doing the thing.

If there is genuinely no suitable image, `images` is an empty array — say so in gaps.

**Rules**
- Venue's own domain or its own site's CDN only. A photo hotlinked from a tourism board or review site is not eligible.
- Absolute URLs only. Resolve relative `src` values against the page they were found on. If a `srcset` offers several sizes, take the largest.
- Skip logos, wordmarks, icons, sponsor and partner badges, social media buttons, staff headshots, spacer and tracking pixels, and anything under roughly 400px on its longest side where a dimension is stated.
- `id` — slug, unique within the venue: `hero-exterior`, `program-school-tour`, `space-studio`.
- `alt` is **required**. Use the image's alt attribute verbatim when it exists and is non-empty, and set `alt_source` to `site`. When there is no alt, write one plain factual sentence describing only what is visibly in the frame, and set `alt_source` to `generated`. Do not infer the season, the occasion, the program, or who the people are. "A stone castle with a turret, seen from the lawn" — not "Children arriving for a school tour".
- `caption` is nearby figcaption or caption text, verbatim, or null. Never write your own caption.
- `width` / `height` only when the page states them in the markup; otherwise null. Do not infer dimensions.
- `rights_note` prints in the app as the photo credit, so it must be image-specific: a verbatim credit line next to or beneath the image ("Photo: Jane Doe"), or a verbatim image-reuse statement from the site's terms or image licensing page. **A site-wide footer copyright line is not a photo credit — leave `rights_note` null in that case.**
- `usage` — `licensed` · `venue_supplied` · `public_domain` · `unverified`. Default to `unverified`, which holds the image back for review and is the correct answer for a photo simply found on a venue's website. Use `venue_supplied` only where the site explicitly invites press or partner reuse (a media kit, a "downloadable images" page), and `public_domain` or `licensed` only where the site states the licence.
- If a page's images did not render in the fetched text (lazy loading, JS galleries, `data-src` placeholders), note it in gaps rather than guessing at URLs.

---

## STEP 2c. Location

`lat` and `lng` are required by the app — distance, travel time, the radius filter and the map all depend on them. Fill them in this order of preference, and record which one you used in `geo_source`:

1. `site_embed` — the site publishes coordinates directly. Check for a Google Maps iframe (`!3dLAT!4dLNG` or `?q=LAT,LNG` in the embed URL), a JSON-LD `GeoCoordinates` block, `og:latitude` / `og:longitude` meta tags, or a store-locator data attribute. These are on-domain facts and are the best source.
2. `geocoded` — no published coordinates, but you have a full street address. Geocode it and record the coordinates to 5 decimal places. Set `geo_source` to `geocoded`.
3. `null` — no address and no published coordinates. Leave `lat`, `lng` and `geo_source` all null and add `"no address published — cannot geocode"` to gaps.

Never hand-place a pin from a landmark, a city name, or your own knowledge of where a place is. A city-centroid coordinate is worse than null: it puts the venue on the map in the wrong spot with no visible warning, whereas null is honest.

If no geocoding service is available in the run environment, still extract the address, leave `lat`/`lng` null, and set `geo_source` to `geocode_pending` so the records can be backfilled in one pass later without re-reading the sites.

---

## STEP 2d. Authored text

Three fields are your own writing rather than extraction. They are what makes a record feel like advice instead of a database row, and they are the reason a record needs a human read before publish. Write them only after STEP 2 is complete, so they rest on the facts you gathered.

- **`what_children_do`** — the concrete, physical account of the visit, in one to three sentences. What a child's body actually does: "Sit on the floor in the gallery to look and talk about two or three works, then move to the studio to paint at low tables." Ground every clause in something the site said. If the site never describes the activity, leave this null — do not imagine a plausible visit. `description` is not a substitute and does not replace this field.
- **`our_note`** — one to three sentences of our own practical advice, written like a friend who has been there. Never marketing. Useful shapes: the catch that isn't obvious ("The tour is 90 minutes with no seating — long for under-fives."), who it suits ("Best for groups already comfortable indoors and quiet."), or the thing to ask about ("Ask about the lunch room when you book; it isn't on the site and the park across the street is the fallback."). Do not repeat a fact already shown elsewhere on the card. Do not use exclamation marks or words like "wonderful", "magical" or "perfect".
- **`practical_summary`** — one to two sentences summarising the practical facts *and their gaps*, generated from the facility fields plus `gaps`. It sits above the Good-to-know tiles: "Washrooms and indoor lunch space on site, and the whole route is step-free. Bus parking and rain backup aren't stated — worth a call."

Write all three in plain language at the level of a busy director skimming on a phone. Because these are authored, every record carrying them needs a human pass before publish; the `checked_by: scraper` value is what flags that.

---

## STEP 3. Verify your own extraction

Do this as a separate pass after the JSON is complete. Do not skip it.

For each program, reopen its `source_url` and check every non-null field against the page:
- Is the evidence quote actually on the page, word for word? If not, fix it or set the field to null.
- Does the price match, including whether it is per student, per class, or per group? Per-class prices recorded as per-child is the most common error.
- Does the age or grade range match exactly, and does `age_basis` reflect which one the site actually published? "K to 3" is grades 0–3, not ages 5–9.
- Is `capacity_max` a per-booking maximum rather than a minimum group size? A stated minimum belongs in `capacity_min`.
- Is the lead time a minimum notice, or a recommendation? Record the minimum; put the recommendation in description.
- Is `school_rate_only` right? Check whether the price was published for schools specifically.
- Is the page dated? If prices are from a past school year, add that to `price_year_or_season`.

For the images array, confirm each URL is absolute, sits on the venue's own domain or its own site's CDN, and was present on the `found_on_url` you recorded. Confirm `alt_source` is honest, that no `caption` was invented, and that no `rights_note` is merely a site-wide footer copyright line. Confirm at least one `hero` exists or that gaps explains why not. Drop any entry you cannot confirm.

For the venue block, reopen the visit or accessibility page and confirm each practical field and its `facility_notes` line. If you inferred washrooms or lunch space from a photo or a general phrase like "family friendly," set it back to null.

For the location, confirm `geo_source` matches how you actually obtained the coordinates.

**Cross-check across pages.** Where two pages disagree, do not quietly pick one. Record it in `conflicts`:

```json
{
  "field": "chaperone_ratio",
  "values": ["3 adults", "up to 6 adults"],
  "sources": ["https://example.org/school-programs/", "https://example.org/school-program-guidelines/"],
  "note": "pages disagree"
}
```

Then set the field itself to the more recently dated page's value, or to null if neither is dated. The app shows "sources disagree — confirm when booking" from this array, which is more useful than a confident wrong number. Conflicts belong here as structured data, not buried in `gaps` prose.

Finally set `extracted_at` to the current datetime and `extractor_version` to `v2.0`.

Then write a short verification report and save it as `<slug>.verification.md` next to the JSON:

VERIFICATION
- Fields checked: N
- Fields corrected: N (list each as field: old -> new, reason)
- Fields set to null after review: N (list)
- Conflicts recorded: N
- Authored fields written: which of what_children_do / our_note / practical_summary, and what they rest on
- Meets minimum viable record: yes / no (if no, which required field is missing)
- Confidence: high / medium / low, with one sentence on why
- Recommended follow up by phone or email: (the gaps list, in priority order for a daycare director: price, youngest age, capacity, lead time, lunch space, washrooms, rain backup)

---

## MINIMUM VIABLE RECORD

A venue is publishable with:

**Venue:** `id`, `name`, `address`, `lat`, `lng`, `category`, `checked_on`, and one `hero` image with `alt`.
**At least one program:** `id`, `name`, `age_basis` plus whichever range the venue publishes, `comes_to_you`, a cost field or `is_free`, and `our_note`.

Everything else may be null. Do not pad a record to clear this bar — a venue that misses it should miss it visibly, so it can be filled by a phone call rather than by invention. Record in the verification report which required field is missing.

---

## BATCH SUMMARY

When all rows are processed, write `batch-summary.md` listing: venues done, venues with no website, venues that do not serve children's groups, venues that errored (with the error), how many records meet the minimum viable bar, how many are `geocode_pending`, how many have no hero image, and the 20 venues with the lowest confidence.

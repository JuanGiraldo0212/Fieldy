# VERIFICATION — Freshwater Fisheries Society of B.C.

Verified 2026-09-03 by re-fetching every program `source_url` with a `?v=1` cache-buster (a
previous run of this pipeline was served a stale cached page carrying prices the live page did
not have, so every price-bearing page was re-read rather than trusted).

- **Fields checked:** 61 (5 programs × the non-null fields on each, plus the venue block, the
  single image entry and the location fields)

- **Fields corrected:** 1
  - `programs[school-field-trip-learn-to-fish].tax_included: true -> null` — the page's
    "*All prices include GST/PST" line covers the prices printed on it, but this program has no
    printed price ("Location dependent"), so a tax flag on a non-existent number was misleading.
    The GST/PST wording was moved into `extra_fees_note` instead.

- **Fields set to null after review:** 0 (nothing else failed re-reading)

- **Confirmed unchanged on re-fetch:**
  - "Price: $5 per child" for It's a Trout's Life — confirmed **per child**, not per class.
    Grade Level "Preschool, Kindergarten to 2" (recorded as grades -1 to 2, `age_basis` grades,
    age fields left null). Duration "1 – 2 hours" — `duration_min` records the lower bound, 60,
    and the range is repeated in the description.
  - Learn to Fish school field trip: "Grade Level: Kindergarten to 12" (grades 0–12),
    "Duration: 3 – 4 hours" (`duration_min` 180), "Price: Location dependent".
  - Birthday party: "PRICE: $200 for up to 15 children. $10/ child for additional children."
    Recorded as `cost_per_group_cad` 200 — a flat party fee, **not** per child — with the
    per-extra-child rate in `extra_fees_note`. Duration 2.5 hours (150 minutes).
  - Group Bookings: "Price: Location-dependent" (hyphenated on that page, unhyphenated on the
    field-trips page — a spelling difference, not a conflict).
  - Rod Loan: "At no cost, you can borrow spinning rods with reels and a basic box of tackle."
    and both Vancouver Island rows of the location table (Victoria corporate office, Duncan
    hatchery), each marked "Contact us in advance to coordinate."
  - Capacity: the only capacity sentence is hedged — "For most programs we can accommodate up to
    two classes at the same time" — with no number, so `capacity_max` stays null.
  - Lead time: no minimum notice is stated on any of the four program pages. `lead_time_days` null.
  - `school_rate_only` re-checked: true only on It's a Trout's Life, whose $5 sits on a page
    titled School Field Trips. The other programs publish no price, so the flag is false.
  - Page dating: none of the program pages carries a visible date or a school-year label on its
    prices, so `price_year_or_season` stays null. (Metadata modified times: field trips and group
    bookings 2026-05-11, birthday parties 2026-05-11, rod loan 2026-09-03.)

- **Images:** the hero URL was re-confirmed as the homepage `og:image`, absolute, https, on
  `www.gofishbc.com`, and present in the homepage body beside the LEARN TO FISH section. It has an
  **empty alt attribute** there, so `alt_source` is honestly `generated` and the alt text says so.
  No caption exists and none was written; `rights_note` is null (the site carries only a footer
  copyright line, which is not a photo credit). None of the four program pages carries any body
  photograph at all, so no `program` image could be attached — recorded in gaps rather than filled.

- **Location:** no coordinates are published anywhere on the site — no Maps embed, no JSON-LD
  GeoCoordinates, no og:latitude. The corporate office street address was extracted verbatim from
  the Contact page and `geo_source` is `geocode_pending`; no pin was hand-placed.

- **Conflicts recorded:** 0. The locations lists differ *by program* (It's a Trout's Life at
  Abbotsford/Summerland/Fort Steele; Learn to Fish at Abbotsford/Clearwater/Fort Steele) rather
  than disagreeing about the same field, so this is described in each program's description, not
  as a conflict.

- **Authored fields written:** `what_children_do`, `our_note` and `practical_summary` on all five
  programs except `what_children_do` on Rod Loan, which is left null because a rod loan is an
  equipment pickup and the site never describes what a child does with it. The rest rest on the
  site's own activity wording — interactive story board, role playing, drawing, hatchery tour,
  nature walk to the ponds; fish identification, tackle set-up, casting, catch and release — plus
  the snack/lunch, rain-or-shine and location lines. The recurring warning in `our_note` that
  these programs do not run on Vancouver Island rests on the published location lists and on the
  Who We Are page, which places only Corporate Services in Victoria.

- **Meets minimum viable record:** no — `venue.lat` and `venue.lng` are missing (geocode_pending,
  to be filled by the backfill script). Everything else on the bar is present: venue id, name,
  address, category, checked_on, a hero image with alt, and two programs carrying id, name,
  `age_basis` + grade range, `comes_to_you`, a cost field and `our_note`.

- **Confidence:** medium-high. Prices, grades and durations are printed plainly and survived a
  cache-busted re-read; the uncertainty is not about the facts but about the fit — the Society's
  Victoria address is an office, and every program on the site except the rod loan happens off
  Vancouver Island.

- **Recommended follow up by phone or email** (in priority order for a daycare director):
  1. **Price** — what a Learn to Fish school or group session actually costs for your headcount
     and location.
  2. **Location** — whether anything at all runs at the Vancouver Island Trout Hatchery in Duncan,
     the nearest site to Victoria (it is a separate catalog record).
  3. **Youngest age** — the only under-five signal is the word "Preschool" in a grade band.
  4. **Capacity** — the real headcount behind "up to two classes".
  5. **Lead time** — how far ahead to submit the form for a specific date.
  6. **Lunch space and washrooms** — nothing is published for any hatchery.
  7. **Rain backup** — outdoor programs run rain or shine; ask what happens in a storm.
  8. **Rod Loan practicalities** — how many rods, for how long, and whether a deposit is needed
     when collecting from the Victoria office.

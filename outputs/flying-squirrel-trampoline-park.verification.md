# VERIFICATION — Flying Squirrel Trampoline Park (Victoria)

- **Fields checked:** 68 non-null fields — venue block (26), three programs (35), one image (7) — each re-read against the page recorded in `source_url` / `found_on_url`.
- **Fields corrected:** 0 during the review pass. Two things were corrected during extraction itself:
  - Website: the tracker URL `www.flyingsquirrelsports.ca/victoriabritish-columbia` returns an empty page; the live location page is `/victoria-british-columbia/`, reached from the national site's own Locations menu. `venue.website` records the working URL and gaps records the broken one.
  - Group capacity: the group buyouts page's "25, 100, 200 — or Even 1,000?" was not used. The home page's "groups of 20-300" was used instead because that page was modified more recently (2026-06-29 vs 2025-04-24). Both are in `conflicts`.
- **Fields set to null after review:** `time_slots` on the summer camp (the camp page gives two different start times — see conflicts), and a grip-sock price was never recorded for the same reason. `has_washrooms` was left null: the FAQ covers lockers, cubbies and the cafe but never mentions washrooms, and inferring them from "family fun centre" would have been a guess.
- **Conflicts recorded:** 4
  1. Group size — home page 20-300 vs group buyouts page 25-1,000.
  2. Camp daily hours — "8:00 AM - 4:00 PM" vs "9:00 AM - 4:00 PM" on the same page; the page's own schedule shows 8:00 as a paid early drop-off. `time_slots` left null.
  3. Grip sock price — $4/pair vs $3.50/pair, both on the FAQ page. No price recorded.
  4. Ropes course hours — the tickets page adds Friday 2pm-8pm that the home page does not list; the more recently modified home page version is in `hours_notes`.
- **Price re-check (cache-busted):** the tickets page and the summer camp page were both fetched with a `?v=1` cache-buster, so the recorded prices ($25/$32/$40 general, $15/$20/$25 toddler, $24 ropes course, camp $399.99 / $449.99) come from a fresh response, not a cached one. No stale-cache discrepancy was found.
- **Cost-field check:** $15 is per child per hour and is recorded as `cost_per_child_cad` on the toddler program; $449.99 is per camper per week and is recorded as `cost_per_child_cad` on the camp. No per-group figure exists — there is no published group price at all, which is why the group program carries `is_free: false` with both cost fields null.
- **Age check:** the toddler program's `age_max_years: 6` comes from the site's own words, "Children 6 years of age and under qualify", and the camp's 6-12 from "Camps are open to children ages 6-12". `age_basis` is `years` in both cases because the site publishes ages, never grades. The group event program has no published age range and is honestly left with `age_basis` null.
- **`school_rate_only`:** false on all three — no price on the site is written for schools specifically.
- **Authored fields written:**
  - `what_children_do` for all three, grounded in the FAQ's statement that "we offer free-play at our facilities" and that Court Monitors "do not teach or guide guests", the Kiddie Court reserved for 6 and under, and the camp page's hour-by-hour schedule.
  - `our_note` for all three, resting on the no-outside-food rule, the no-table-for-group-events answer, the free Parent wristband that still needs a waiver and socks, and the camp's cap of two trampoline sessions a day.
  - `practical_summary` for all three, built from the facility fields plus gaps.
- **Location:** `geo_source` is `site_embed`. The coordinates are the `!3d48.4337948!4d-123.3947392` pair inside the Google Maps place link published on the venue's own Victoria page, rounded to 5 decimals. No geocoder, no hand-placed pin.
- **Images:** 1 entry, on the venue's own WordPress uploads path, confirmed present as a full-size link on the gallery page recorded in `found_on_url`. Every `og:image` on the Victoria site is the Flying Squirrel wordmark, and every in-body photo is lazy-loaded behind a blank `data:` placeholder, so the gallery was the only place a real image URL could be confirmed — both facts are in gaps. The alt is `generated` from the file name (`ropecourse`) plus the site's own description of its ropes course, and gaps says so; the gallery's other files are named with Facebook photo IDs that give no clue to their contents, so none of them were recorded. No caption invented, no `rights_note` taken from the footer.
- **Meets minimum viable record:** yes. Venue has id, name, address, lat/lng, category, checked_on and a hero with alt; both the toddler jump time and the summer camp programs carry id, name, `age_basis` plus a range, `comes_to_you: false`, a cost and an `our_note`.
- **Confidence:** medium. Ticket prices, ages and the FAQ rules are unambiguous and freshly fetched, but the actual field-trip offering — the group event — has no published price, no published duration and two contradictory group sizes, and the site says nothing about washrooms or physical accessibility.
- **Recommended follow up by phone (778-404-1778) or email (alex@flyingsquirrelsports.com), in priority order:**
  1. Price for a school or daycare group — per child, and whether jump time is capped.
  2. Youngest age accepted; the FAQ only says a child must "walk confidently unassisted".
  3. Real maximum group size for the Victoria park, given the two published figures.
  4. Lead time and whether a 50% deposit applies to a small daycare group.
  5. Somewhere to eat — outside food is banned and group events do not normally get a table.
  6. Washrooms and change facilities, which the site never mentions.
  7. Wheelchair and stroller access to the courts, and bus parking or drop-off.

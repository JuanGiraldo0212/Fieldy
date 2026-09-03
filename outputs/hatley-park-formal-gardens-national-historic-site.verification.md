# VERIFICATION — Hatley Park Formal Gardens – National Historic Site

Checked 2026-09-03 against www.hatleypark.ca (Royal Roads University operates the site; hatleypark.ca and royalroads.ca are both operator domains). This record is scoped to Hatley Park and its gardens, castle tour and museum. Royal Roads University itself has a separate tracker row and nothing university-specific was pulled in here.

- **Fields checked:** 96 (33 venue, 3 programs x ~20 non-null fields each, 5 images, plus provenance)

- **Fields corrected:** 3
  - `programs[0].time_slots`: `["10:30","11:45","13:45","15:00","16:15"]` -> `["10:30","11:45","13:45","15:00"]` — the 4:15 p.m. departure runs Monday to Thursday only, so it is not a time offered on every day the program runs. The Monday-to-Thursday extra slot is stated in the program description instead.
  - `programs[0].cost_per_child_cad`: kept at 15.00 (youth 6–17) rather than 0 (child 5 and under free). Both tiers are recorded in the description so neither reads as the single price.
  - `programs[0].evidence`: restored to the site's exact characters, `Youth (6–17 years) — $15.00`, after a prose pass had rewritten the en dash. Verbatim quotes must match the page byte for byte.

- **Fields set to null after review:** 4
  - `venue.general_admission_child_cad` / `general_admission_adult_cad` — the gardens are free but the tour and (possibly) the museum are not, so a single venue-level admission figure would misrepresent the site. The free garden visit carries `is_free: true` instead.
  - `programs[0].age_basis` — the site publishes ages only as ticket price tiers (child 5 and under, youth 6–17, adult 18–59, senior 60+), not as an eligibility range. Setting `years` with a 6–17 range would have invented a minimum age that the site does not impose.
  - `venue.has_lunch_space` — the Habitat Café is a service counter with published hours, not a stated group lunch space. Not inferred.
  - `programs[1].months_offered` — the gardens are open every day with no season stated, so null correctly means year-round here.

- **Conflicts recorded:** 1 — `castle_museum_access`. The museum page body says "We welcome visitors to explore the Hatley Castle museum located in the lower level of Hatley Castle from May to September (subject to change)", while the same page's own summary describes the museum as "part of a guided walking estate tour". Neither is dated, so no museum admission or standalone-access rule was recorded and `is_free` on that program stays null.

- **Authored fields written:** `what_children_do`, `our_note` and `practical_summary` on all three programs.
  - The tour's `what_children_do` rests on "a one-hour journey to the first floor of Hatley Castle and surrounding Italian Gardens" plus the "living building" paragraph.
  - The tour's `our_note` rests on "Tickets are not sold in advance and will be processed on a first-come, first-served basis, subject to capacity" and on the one-hour duration with no seating mentioned anywhere on the page.
  - The garden visit's `what_children_do` rests on the three named gardens and the pond/bridge/water-wheel alt text on the gardens page; its `our_note` rests on the café hours, the pay-parking line and the wind-closure banner posted on 2026-09-02.
  - The museum's `what_children_do` rests on the two named rooms and their listed contents (cadet uniforms, trophies, photographs, documents, Dunsmuir family artifacts).
  - `practical_summary` on each is generated from the facility fields plus the gaps list.

- **Price freshness:** the guided tour page was re-fetched with a cache-buster in STEP 3. Prices were identical on both reads; the only difference was the cancellation line ("August 31: 4:15 p.m." -> "No cancellations at this time."), which confirms the page served live rather than from a stale cache.

- **Images:** 5, all absolute https URLs on www.hatleypark.ca, all present in the homepage gallery, all with the site's own non-empty alt text (`alt_source: site`). Exactly one hero. The homepage has no og:image and its header is a video file, so the hero is the castle photograph from the gallery. No captions were written. `rights_note` is null on every image: the site collects photographer credits on a separate page rather than printing them beside each photo, which is not an image-specific credit. Gallery links on the gardens page point at the `hatleypark.prod.acquia-sites.com` origin hostname; the www.hatleypark.ca equivalents from the homepage were used instead.

- **Location:** `geo_source: geocode_pending`. The site publishes no Maps iframe, no JSON-LD GeoCoordinates and no og:latitude. The directions page carries Google Maps *directions* links whose `@lat,lng` values are map viewport centres at zoom 10–15, not a published pin, so they were not used. Address extracted verbatim from the site footer.

- **Meets minimum viable record:** no. Missing `venue.lat`, `venue.lng` (pending the geocode backfill) and a program with `age_basis` plus a range — the site publishes no age eligibility for anything, only price tiers.

- **Confidence:** high. Prices, times, season, duration, accessibility and restrictions are all stated plainly on the venue's own pages and were confirmed on a second fetch; the gaps are genuine silences rather than pages that failed to render.

- **Recommended follow up by phone (250.391.2666) or the contact form, in priority order:**
  1. Group or school rate — none is published; ask whether a class is quoted differently from the walk-up rate card.
  2. Youngest age — no minimum is stated for the tour; confirm under-fives are welcome on it, not just free.
  3. Capacity — how many places per tour departure, given tickets are first-come first-served.
  4. Lead time — tickets are not sold in advance at all; ask whether a group can be held.
  5. Lunch space — nothing indoors is stated; ask where a class can eat if it rains.
  6. Washrooms — location and whether they are on the tour route.
  7. Rain backup — the gardens closed early for wind the day before this check.
  8. Bus parking and the pay-parking rate for a coach.

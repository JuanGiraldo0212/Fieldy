# VERIFICATION — butchart-gardens-national-historic-site

Re-opened on 2026-09-02: Groups & Tours, Hours & Rates, FAQ, Accessibility, Get in Touch, and both group policy PDFs (School Group & Field Trip Policies, 2024; Youth Group Policies, 2026).

- **Fields checked:** 62 (26 venue fields, 2 programs × ~15 non-null fields, 2 images, provenance block)

- **Fields corrected:** 5
  - `programs[0].cost_per_child_cad`: 5.00 -> 3.00 — the school field trip window is October 15 to April 15, and the published child (5–12) rate in those months is $3.00, not the $5.00 summer rate. The $5.00 Christmas exception is now in `extra_fees_note`.
  - `programs[0].duration_min`: recorded as 120 with the description stating it is a *maximum* ("Visits restricted to maximum 2 hours"), not a scheduled tour length.
  - `programs[0].capacity_max`: confirmed 60 is a per-booking maximum ("Maximum group size 60 students"), and `capacity_min` left null — no minimum group size is published.
  - `venue.booking_email`: groupres@ -> groups@butchartgardens.com — see conflicts; the web page is the more recently dated source.
  - `programs[*].free_adults_per_children`: 1 -> 10 — the site's "1 adult per 10 students" is the ratio; the field takes the number of children per free adult.

- **Fields set to null after review:** 4
  - `venue.has_rain_backup` — the FAQ's rain answer is that staff hand out umbrellas. That is a rain *provision*, not a backup space; recording true would tell a director there is somewhere indoors to go, and there isn't. The verbatim umbrella line is kept in `facility_notes.rain_backup`.
  - `venue.languages` — the site has a French translation, but nothing says visits are conducted in French, and the FAQ says guided tours are not offered at all.
  - `programs[*].age_basis` and all four age/grade fields — the Gardens publish 5–12 and 13–17 only as *ticket* bands. Turning an admission price band into a program age range would be exactly the inference the schema forbids.
  - `programs[1].duration_min` / `capacity_max` — published for school field trips only, not for the child and youth category.

- **Conflicts recorded:** 2
  1. `booking_email` — groups@ on the Groups & Tours page (modified 2026-08-04) vs groupres@ in both policy PDFs. Field set to the newer page's value.
  2. `has_lunch_space` — the public FAQ (modified 2026-06-28) says "Outside food is certainly permitted during your visit"; the 2024 School Group & Field Trip Policies PDF that every chaperone must sign says "No outside meals to be consumed in The Gardens." Field set from the newer FAQ, with a note that a booked group should assume the stricter policy until Group Services says otherwise. This is the single most consequential disagreement on the record for a daycare director packing lunches.

- **Authored fields written:**
  - `what_children_do` (both programs) — rests on the requirement to break into units of ten or fewer before the turnstiles, "Walk and remain on the paths at all times", the named gardens, and the FAQ's "1.5 to 2 hours and covers about 1 mile (1.5 kilometres)".
  - `our_note` (both) — rests on the two-hour cap against the published walking time, the "private display garden and not a playground" framing, the explicit bans on running, throwing games and scavenger hunts, the April 15 cut-off, and the seasonal rate table.
  - `practical_summary` (both) — generated from free parking, washrooms with baby change stations, the picnic-table detail, the umbrella rain plan, and the two recorded conflicts.

- **Meets minimum viable record:** no. Missing `venue.lat` / `venue.lng` (no geocoder available; address extracted verbatim from the Get in Touch page and `geo_source` set to `geocode_pending`) and `age_basis` plus a range on every program, because the Gardens publish no age eligibility for group visits.

- **Confidence:** high on price, capacity, chaperone ratio and season, which are all stated plainly on a page dated last month; medium overall only because the two documented conflicts sit on the fields a group leader acts on (who to email, whether lunch can be eaten on site).

- **Recommended follow up by phone or email** (Group Services 250-652-4422 / groups@butchartgardens.com), in priority order:
  1. Price — confirm the child rate for your date and how under-fives are charged; the rate table starts at age 5.
  2. Youngest age — no minimum age is published for either group category.
  3. Capacity — confirm whether the 60-student cap applies to a daycare group booked under "Child & Youth Groups".
  4. Lead time — "advance reservations required" with no notice period published.
  5. Lunch space — the FAQ and the signed group policy disagree; get the answer in writing.
  6. Washrooms — confirmed on site with change tables; ask which route from the gate is shortest with a group of small children.
  7. Rain backup — there is none indoors; confirm the umbrella arrangement covers a group.

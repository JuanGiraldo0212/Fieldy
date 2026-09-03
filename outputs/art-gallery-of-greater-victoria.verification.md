# art-gallery-of-greater-victoria.json

VERIFICATION

- **Fields checked:** 96 (33 venue fields plus the non-null fields of four programs and one image). The School Programs page was re-fetched with a cache-buster during this pass and every price, grade range, time, capacity, notice period and cancellation line was re-read word for word; the Guidelines, Visit, Accessibility and Tours pages were re-read for the venue block.
- **Fields corrected:** 4
  - `programs[0].cost_per_child_cad`: 150 -> null, `cost_per_group_cad`: null -> 150 — the page lists "Price: $150" against a program with "a maximum capacity of 30 students". It is a class fee, not a per-student fee. Same correction applied to the $100 Tour Only.
  - `programs[2].age_basis` / grade range — kept as grades 2–12 but re-sourced: the Self-Guided section does not restate a range, so the value comes from the "Grade 2 – 12" heading at the top of the School Programs page. Recorded in `gaps` so it can be confirmed.
  - `venue.general_admission_child_cad`: null -> 0 — the Visit page states admission is always free for "visitors aged 25 and under", which covers every child in a group.
  - `programs[3].tax_included`: null -> false — the Tours page writes "$85 + GST", so the app should print "+ GST".
- **Fields set to null after review:** 3
  - `venue.has_rain_backup` — the Gallery is indoors, but the site never addresses a wet-weather fallback. Inferring it from the building type is exactly the inference the brief forbids; the indoor point is made in each program's `practical_summary` instead.
  - `programs[*].sensory_friendly` — the Accessibility page offers free sensory kits (noise-reduction headphones, sunglasses, fidgets, a timer) at the front desk, but that is a venue service offered to any visitor, not a statement that these programs are sensory-friendly. The kits are described in the self-guided program's `our_note`.
  - `programs[0].adults_free` / `programs[1].adults_free` — the flat $150 and $100 fees do not say whether chaperones are admitted free, so this stays null rather than assuming.
- **Conflicts recorded:** 2
  - `chaperone_ratio` — School Programs (modified 2026-03-05) says "at least 3 adult chaperones"; School Program Guidelines (modified 2025-07-17) says "up to 6 adult chaperones". A minimum and a maximum with the same word count. The underlying 1:6 elementary / 1:10 secondary ratio is identical on both pages, so that is what the field holds; the disagreement over the number of adults is carried as structured data.
  - First-Saturday admission — the Visit page says free admission on the first Saturday of the month in one section and admission by donation in another. Neither section is dated, so the standard $15 is left as the base case.
- **Authored fields written:** all three on all four programs.
  - `what_children_do` rests on the site's own wording for each format (inquiry-based exploration of current exhibitions with education staff; a workshop filling the rest of the two hours; checking in at the front desk; padded benches in the exhibition spaces). It is null for the $85 Exhibition Group Tour, where the site describes the audience but never what happens in the room.
  - `our_note` rests on the flat class fee, the two-week advance payment and 14-day non-refund rule, the bag ban with lending bins, the free sensory kits, and the fact that group admission stacks on top of the $85 tour fee.
  - `practical_summary` is generated from the four washrooms with a change table, the free lockers, the two ramps to all exhibition spaces, and the unstated lunch space and bus parking.
- **Meets minimum viable record:** no — `venue.lat` and `venue.lng` only. No geocoding service was reachable in this run and the site publishes no coordinates (the Accessibility page links to a shortened Google Maps URL with no lat/lng in it), so `geo_source` is `geocode_pending` with the full postal address captured. Everything else clears the bar: three of the four programs carry `age_basis` with a published grade range, `comes_to_you`, a cost field and `our_note`, and there is one hero image with alt.
- **Confidence:** high on the programs, prices, schedules and access details, which are stated plainly on the venue's own pages and were re-read against the source; lower on the single hero image, whose alt is written from page context because the photograph carries no alt attribute and its contents could not be verified from the page text.
- **Recommended follow up by phone or email** (jengen@aggv.ca for school and group bookings, 250.384.4171):
  1. Price — does the $150 / $100 class fee include the chaperones' admission, and what does "Group Admission" add to the $85 group tour?
  2. Youngest age — grade 2 is the published floor; is there anything at all for under-sevens, given Family Sundays is billed as all ages?
  3. Capacity — is 30 students a hard cap, and can two classes be booked back to back?
  4. Chaperones — is it a minimum of 3 or a maximum of 6? The two pages disagree.
  5. Lunch space — nothing on the site mentions anywhere for a class to eat.
  6. Bus parking — only one accessible car space and a loading zone are described; where does a bus drop off on Moss Street?
  7. Rain backup — not needed indoors, but confirm where a class waits if they arrive early.

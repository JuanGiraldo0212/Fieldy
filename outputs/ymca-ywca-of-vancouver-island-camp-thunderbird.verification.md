# VERIFICATION — YMCA / YWCA of Vancouver Island Camp Thunderbird

- **Fields checked:** 118 (33 venue, 4 programs x ~20 non-null each, 2 images x 11)

- **Fields corrected:** 4
  - `programs[overnight].chaperone_ratio.children_per_adult`: 9 -> 8. The 2017 fees page says one chaperone per 9 children; the 2026 Teacher Information Booklet says a 1:8 ratio for overnight groups. Took the more recent document and recorded a conflict.
  - `programs[overnight].free_adults_per_children`: 9 -> 8, same reason.
  - `programs[mobile-teambuilding].cost_per_child_cad` 606.00 -> `cost_per_group_cad` 606.00. The table column is headed "Fee per participant" but the rows are banded by group size ("30 or fewer", "31-60"), which makes it a whole-group fee. $606 per head for 30 children would be $18,180 for three hours. Recorded as a group fee with a conflict so the labelling is auditable.
  - `venue.booking_email`: `tbirdoutdoored@vancouverislandy.com` -> `tbirdoutdoored@vancouverislandy.ca`. The costs page uses `.com`, the rentals page and the rest of the site use `.ca`. Conflict recorded.

- **Fields set to null after review:** 5
  - `programs[day].capacity_max` and `programs[overnight].capacity_max` — the activity group table runs to 140 participants with 10 staff, but that is a staffing table, not a stated per-booking maximum.
  - `programs[mobile-teambuilding].capacity_max` — 60 is the top published fee band, not a stated limit.
  - `venue.has_rain_backup` — there is indoor program space and a dining hall, and the gear list assumes rain, but no wet weather policy is published. Inferring one from a building list would be a guess.
  - `venue.wheelchair_accessible` — the booklet offers to arrange an all-terrain wheelchair rental. That is a support offer, not a claim that the site is step free. Kept as a facility note instead.
  - `programs[*].lead_time_days` — the October 15 booking-request deadline is a scheduling deadline for the following season, not a minimum notice, and the site also says they take bookings close to the start of the season.

- **Prices re-read live:** yes. The fees page was read from the live DOM in the browser, not from a cached fetch. It is headed "EDUCATION FEES – 2017", was last modified 2016-12-21, and links `OE-Fees-2017.pdf`. `price_year_or_season` is set to 2017 and the staleness is flagged in gaps and in two `our_note` lines.

- **Evidence quotes:** all four re-confirmed word for word against the live DOM, each contiguous and under 25 words. The rental minimum was corrected mid-check: the first read was truncated at "size of 20", the full sentence is "Bookings assume a minimum group size of 20."

- **Conflicts recorded:** 4 (overnight chaperone ratio, mobile teambuilding price basis, camp phone number, camp email address)

- **Images:** 2 kept, 2 dropped. The two carousel photographs on the outdoor education overview page are served only at 300x200, below the 400px floor, so they were skipped. Both kept images were opened in the browser and looked at before writing alt; neither has alt text on the site, so both are `alt_source: generated`. `width` and `height` were read from the markup attributes, not inferred. No captions exist and no rights line sits beside either image, so `rights_note` is null in both cases rather than carrying the site-wide footer copyright.

- **Authored fields written:** `what_children_do` on three of four programs, `our_note` and `practical_summary` on all four. They rest on the Teacher Information Booklet 2026 activity descriptions, the day and overnight sample schedules, the meals and cabins section, and the guidelines list. `what_children_do` is null for the site rental, because a renting group runs its own programme and the site never describes what the children would do.

- **Location:** address published, no map embed and no coordinates anywhere on the camp pages. `geo_source: geocode_pending`, `lat`/`lng` null. No pin was hand-placed.

- **Meets minimum viable record:** no — `venue.lat` and `venue.lng` are missing, pending geocoding of the published address. Everything else clears the bar: two programs carry a grade range, a per-child cost, `comes_to_you` and `our_note`, and there is one hero image with alt.

- **Confidence:** medium. The programme detail, logistics and policies are unusually rich because the 2026 teacher booklet is thorough and current, but every published price is from 2017 and cannot be trusted as a quote.

- **Recommended follow up by phone or email:**
  1. **Price** — all fees are 2017. Get a current quote for a day visit and a two night stay.
  2. **Youngest age** — nothing published below K. Ask whether a preschool or daycare group can come at all.
  3. **Mobile teambuilding price** — confirm whether $606 is the whole group or per child, and get an age range.
  4. **Capacity** — ask the maximum group they can take on your dates.
  5. **Lead time** — ask how far ahead they need you for a May or June date.
  6. **Rain backup** — ask what happens to a day programme in heavy rain.
  7. **Accessibility** — ask about step free routes and the all-terrain wheelchair if you need one.

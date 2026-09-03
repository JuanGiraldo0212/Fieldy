# VERIFICATION — b-c-aviation-museum

- **Fields checked:** 135 non-null fields (22 venue, 106 across five programs, 7 image), plus a deliberate re-check of the nulls a director would most want answered (washrooms, lunch space, capacity, lead time, chaperone ratio). Program source pages were re-opened with a cache-busting query string and every evidence quote was matched word for word against the re-fetched page.

- **Fields corrected:** 2
  - `venue.hours_notes: "The BC Aviation Museum is open from 10:00 AM to 4:00 PM, 7 days a week, September to June. 9:30 AM to 4:30 PM, July to August." -> null` — the homepage and footer publish a flat "Open Daily, from 10 AM to 4 PM" with no summer variation. Neither page is dated, so per the cross-check rule the field is nulled and the disagreement is recorded in `conflicts`.
  - `venue.bus_parking: true -> null` — the Visit page permits "oversized vehicles" in the Additional Parking Lot but never mentions buses or coaches. A Yes tile would have been an inference; the verbatim parking text is kept in `facility_notes.bus_parking` so the director still sees it.

- **Fields set to null after review:** 3
  - `venue.has_washrooms` — never mentioned anywhere on the site. Not inferred from the museum being a public building.
  - `venue.has_lunch_space` — tables, chairs and kitchen access exist, but only in the Norseman Room and only described for birthday parties, not for education visits.
  - `venue.has_rain_backup` — not described; the site says only that access inside the Hawaii Mars is weather dependent.

- **Conflicts recorded:** 1 (`hours_notes`, homepage/footer vs. Visit page — summer 9:30–16:30 hours appear on one page only).

- **Authored fields written:**
  - `what_children_do` on all five programs — each clause traces to the Education Programs page (build a glider and experiment with properties that influence flight; run the Bernoulli experiment then return to the displays; view displays, answer questions, debate) or to the Flight Deck Tours page (45 minutes on the flight deck of the Hawaii Mars).
  - `our_note` on all five programs — rests on the booked-timeslot policy ("programs cannot be extended past your booked timeslot"), the "do not arrive more than 15 minutes early" and front-garden waiting instructions, the under-16 supervision rule, the fact that the $8.50 rate is written for education bookings only, and the no-pre-booking / weather-dependent nature of the flight deck tour.
  - `practical_summary` on all five programs — built from `wheelchair_accessible` true, free on-site parking, `adults_free` true, and the gaps list (washrooms, lunch space, capacity, lead time).

- **Meets minimum viable record:** yes. `id`, `name`, `address`, `lat`/`lng`, `category`, `checked_on`, one `hero` image with `alt`, and three programs carrying `age_basis` `grades` with a published grade range, `comes_to_you` false, `cost_per_child_cad` 8.5 and an `our_note`.

- **Location:** `geo_source: site_embed`. The homepage publishes its own Google Maps place link containing `!3d48.640514!4d-123.421113`; those are the coordinates recorded. The Visit page iframe uses only `?q=BC%20Aviation%20Museum,%201910%20Norseman%20Rd` with no coordinates. Nothing was geocoded and no pin was hand-placed.

- **Images:** one entry, the homepage lead slider photo, `alt` verbatim from the site ("Snowbird arrives at the museum"), `alt_source: site`, absolute URL on `bcam.net`, confirmed present on the recorded `found_on_url`. `rights_note` is null — the only credit-like text on the site is the footer line "© 2026 All Rights Reserved.", which is a site-wide copyright, not a photo credit. `usage: unverified`. The other slider and gallery photos were dropped: their alt attributes are empty or filename-like ("splash-1280×760-03") and their content could not be confirmed without downloading, which is not permitted.

- **Price check:** $8.50 is per student, not per class — recorded in `cost_per_child_cad`, `cost_per_group_cad` left null. `school_rate_only` is true for the three education programs because the rate sits on a page written for classrooms and is quoted "per student"; it is false for the guided tour (unpriced) and the flight deck tour ($25 per person, open to the public). `tax_included` is null throughout: the general admission prices show "+ GST" but the education and tour prices are silent on tax. `price_year_or_season` is "2025-2026 school year", taken from the page's own opening line.

- **Confidence:** high — the education page is unusually explicit about price, time slots, payment, cancellation and arrival policy, and every recorded value came from a page re-read at verification time.

- **Recommended follow up by phone (250-655-3300), in priority order for a daycare director:**
  1. The booking email address — all addresses on the site are hidden by Cloudflare email protection and could not be read.
  2. Whether $8.50 per student includes GST.
  3. Maximum group size for an education booking.
  4. Minimum lead time to book (only cancellation and rescheduling notice are published).
  5. Washrooms and a place for a class to eat lunch.
  6. Whether a school bus can park on site (only "oversized vehicles" in the Additional Parking Lot is stated).
  7. Which months the programs actually run.
  8. Chaperone ratio expected, beyond "supervisors are admitted free in return for supervising".

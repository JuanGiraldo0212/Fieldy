# VERIFICATION — beacon-hill-park

Re-opened on 2026-09-02: the Beacon Hill Park page, Public Washrooms, Park Event Permits, Park Bylaws, and the BHP Activity and Event Applications PDF (November 2022).

- **Fields checked:** 41 (13 venue practical/identity fields, 2 programs × ~12 non-null fields, 1 image, provenance block)

- **Fields corrected:** 3
  - `venue.website`: www.beaconhillpark.com -> https://www.victoria.ca/parks-recreation/parks-trails/our-parks/beacon-hill-park — the tracker's URL is an unofficial third-party promotional site; the park is City of Victoria property, so victoria.ca is the venue domain.
  - `programs[1].lead_time_days`: 120 -> 60 — the four-month figure is for "larger scale events"; the minimum published notice for a gathering under 50 people is two months. The four-month recommendation now sits in the description.
  - `images[0].alt`: HTML-entity form ("A bird&#039;s eye view…") -> decoded apostrophe, otherwise verbatim from the site's alt attribute.

- **Fields set to null after review:** 4
  - `venue.hosts_school_groups`, `venue.hosts_daycare_groups` — the City page is simply silent about organised children's groups; silence is null, not false and not true.
  - `venue.wheelchair_accessible` — the amenity list says "Accessible Features" without saying which features or which routes; that is too general to record as a Yes tile.
  - `programs[0].is_free` — the City publishes no admission statement for the park. "Obviously free" is not the same as stated, so this is left null and flagged in gaps rather than assumed.
  - (`venue.booking_email` / `booking_phone` / `booking_url` were deliberately left null at venue level: the Permit Clerk's contact belongs to the permit program, not to an ordinary visit, and promoting it to the venue would tell a director to phone the City before walking a class through a public park.)

- **Conflicts recorded:** 0 — the park page, the washroom list, the permit page and the BHP applicant PDF agree with each other.

- **Authored fields written:**
  - `what_children_do` (self-guided visit) — rests on the park page's "meandering footpaths … among manicured and natural areas", the Garry oak / natural area description, the "open vista across the Strait of Juan De Fuca", and the "Play Equipment" amenity. Left null for the permit program, because the site never describes an activity.
  - `our_note` (both programs) — rests on the 740,000 m² size, the three widely separated washroom locations and their dawn-to-dusk hours, the absence of any published group-visit route, and the permit sheet's two-month timing and $2,000,000 insurance condition.
  - `practical_summary` (both) — generated from the washroom and picnic-shelter facts plus the gaps list (no park hours, no bus parking, no rain shelter, no fee figures).

- **Meets minimum viable record:** no. Missing `venue.lat` / `venue.lng` (no geocoder available in this environment; address extracted and `geo_source` set to `geocode_pending`) and, for every program, `age_basis` plus a range, because the City publishes no age guidance for the park, plus a cost field or `is_free`.

- **Confidence:** medium — everything recorded is verbatim-supported and the facility facts are unusually well sourced for a park, but the City site treats Beacon Hill Park as an asset rather than a destination, so the fields a director actually needs (hours, group route, price) are absent rather than uncertain.

- **Recommended follow up by phone or email** (250.385.5711, City of Victoria; culture@victoria.ca for permits), in priority order:
  1. Price — confirm there is no charge for a class visit, and what a permit costs if you want to reserve the picnic shelter.
  2. Youngest age — nothing is published about the play equipment's suitability.
  3. Capacity — ask at what group size the City expects a permit application rather than an informal visit.
  4. Lead time — two months for a permitted gathering under 50 people; confirm nothing is required for an ordinary walk.
  5. Lunch space — can the picnic shelter be reserved, how many does it seat, is it covered?
  6. Washrooms — confirm dawn-to-dusk opening on your date and which of the three blocks has change facilities.
  7. Rain backup — none published; assume there is none.

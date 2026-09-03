# VERIFICATION — craigflower-manor-and-school-house-national-historic-sites-of-canada

Verified 2026-09-02 by reopening the Manor operator page with a cache-busted request and re-reading the Hallmark Heritage Society pages.

**Source note.** The tracker's website column points at a `pc.gc.ca` heritage-designation record. That is a government directory, not the venue's own site, so it was not used as a source. The Manor's operator page (`victoriahighlandgames.com/craigflower-manor-museum/`, Victoria Highland Games Association) and the Schoolhouse's operator site (`hallmarkheritagesociety.ca`, Hallmark Heritage Society) were used instead, and the Manor page is recorded as `venue.website`.

- **Fields checked:** 41 (33 venue fields, 1 program, 1 image, location, provenance)

- **Fields corrected:** 0. The one evidence quote, `Admission by donation`, was found word for word on the reopened page, along with the address, the 45-minute tour length, the three start times and the four Saturday dates.

- **Fields set to null after review:** none changed on the pass, but the following were deliberately left null rather than inferred:
  - `booking_email` — the reservation address on the Manor page is behind Cloudflare email protection and cannot be read. `booking_method` is still `email` because the page states "Reservation by email". Recorded in gaps.
  - `is_free` and all cost fields — "Admission by donation" is neither a published price nor a statement that entry is free, so the program carries no cost value and the wording sits in `extra_fees_note`.
  - `hosts_school_groups`, `hosts_daycare_groups`, `youngest_age_welcomed_years` — neither operator's site mentions children, schools or daycares at all. Silence is null, not false.
  - `has_washrooms`, `has_lunch_space`, `has_rain_backup`, `stroller_accessible`, `wheelchair_accessible`, `bus_parking`, `facility_notes` — nothing on either site addresses any of these. Nothing was inferred from the building being a restored 1850s farmhouse.
  - `capacity_max` / `capacity_min` — the reservation instruction asks "how many will be attending with you" but publishes no limit, so no number was invented, and there is no stated minimum to mistake for a maximum.

- **Schedule and staleness:** `months_offered` [5,6], `days_offered` [6] and `time_slots` 12:00 / 13:00 / 14:00 all come from the page's own list, which explicitly labels each date "Saturday". The heading is "Tour Dates and Times May/June 2025" and the page's last-modified date is 2025-06-02, so the whole schedule is more than a year out of date as of the check date. That is recorded verbatim in `seasonal_notes`, flagged in `hours_notes`, called out in gaps, and named first in `our_note`. The dates were not projected forward to 2026.

- **Craigflower Schoolhouse:** the Hallmark Heritage Society's Craigflower Schoolhouse section, its homepage and its contact page were all opened. The Schoolhouse section contains only historical articles (Charles Clarke, Craigflower's Ghost, school history to 1958, and so on) with several literal "CONTENT" placeholders, and publishes no address, hours, admission, tour or booking route for visiting the building. No Schoolhouse program could be extracted and none was invented; this is recorded in gaps, as is the fact that the recorded address is the Manor's only.

- **Images:** 1 entry, the Manor exterior photograph, which is the page's Open Graph image and its lead in-page image. It is absolute and on `victoriahighlandgames.com`; it was re-confirmed present on the recorded `found_on_url`. The in-page `<img>` has no alt attribute, so the alt is `generated` and names only the subject. `width`/`height` 800×525 are taken from the site's own `og:image:width` / `og:image:height` declarations, not inferred. `caption` null, `rights_note` null (the page carries no image credit), `usage: unverified`. The sidebar `craigflower-200x129.png` thumbnail was skipped as under 400px, and the sponsor and government logos were skipped as badges.

- **Location:** `geo_source: geocode_pending`, `lat`/`lng` null. The page's address links to a shortened `maps.app.goo.gl` URL that carries no coordinates, there is no Maps iframe, no JSON-LD `GeoCoordinates` and no `og:latitude`/`og:longitude`, and no geocoding service is reachable from this run environment. The address was extracted in full so the record can be backfilled in one pass. No pin was placed from knowledge of where the site is.

- **Conflicts recorded:** 0. Only one page carries visiting information, so there is nothing to cross-check it against.

- **Authored fields written:** `what_children_do`, `our_note` and `practical_summary` on the single program.
  - `what_children_do` rests only on what the page states about the house: restored to the McKenzie family's period style, furnished as Mrs. McKenzie might have liked it in the 1860s, with a number of original McKenzie items still in the home. The page never describes a tour activity, so the sentence stays with what is in the rooms rather than imagining a visit.
  - `our_note` rests on the stale May/June 2025 schedule, the by-reservation-email booking route, and the complete absence of any statement about children's groups.
  - `practical_summary` rests on the 45-minute duration, the reservation requirement and the donation admission, plus the long list of unpublished facility fields.

- **Meets minimum viable record: no.** Missing:
  - `venue.lat` and `venue.lng` (no published coordinates and no geocoder available — `geocode_pending`)
  - a program with `age_basis` plus a range (the site publishes no age or grade range at all)
  - a program with a cost field or `is_free` (admission is by donation, with no amount and no statement that it is free)
  The record is left short rather than padded, so these can be filled by one email.

- **Confidence: low.** The historical description and the address are solid, but the only schedule on the page is a four-Saturday run in May and June 2025 on a page last modified 2025-06-02; the booking email is unreadable; nothing at all is published about children, groups, price, capacity or facilities; and the Schoolhouse half of this National Historic Site record has no visitor information published by its operator anywhere.

- **Recommended follow up by phone or email**, in priority order for a daycare director. There is no readable email or phone for the Manor on its page; the Victoria Highland Games Association contact form is the only published route, and the Hallmark Heritage Society can be reached at hallmarkheritagesociety@gmail.com / 250-382-4755 for the Schoolhouse.
  1. **Price** — what a donation is expected to be for a group, and whether children are charged at all.
  2. **Youngest age** — whether the Manor takes preschool or daycare groups, and whether there is a minimum age.
  3. **Capacity** — how many people a single 45-minute tour slot can take, and whether a class can be split across the 12/1/2 pm slots.
  4. **Lead time** — how far ahead a reservation must be made, and, first of all, whether tours are running at all this season and on what dates.
  5. **Lunch space** — nothing is published; the grounds are on a grassy knoll above the Gorge Waterway but no picnic area is mentioned.
  6. **Washrooms** — not mentioned anywhere.
  7. **Rain backup** — not mentioned; the tour itself is indoors but nothing is said about waiting or eating.
  8. Also worth asking: whether the Schoolhouse can be visited on the same trip and who to book that with, plus bus or coach parking at 110 Island Highway and step-free access into an 1850s farmhouse.

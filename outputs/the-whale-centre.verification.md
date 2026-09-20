# the-whale-centre.json

VERIFICATION

- **Fields checked:** 58 (33 venue fields, the non-null fields on all three programs re-read against their `source_url`, and all four image entries). The whale watching, bear watching, FAQ, contact and booking policy pages were each re-opened with a verbatim-quote prompt after the JSON was drafted.

- **Fields corrected:** 4
  - `bear-watching-boat-tour.capacity_max`: null -> 12 — the re-read returned "small-group tours (max 12 guests)" on the bear tour page. The whale watching page has no equivalent line, so its `capacity_max` stays null rather than being copied across.
  - `venue.has_rain_backup`: true -> null — the first pass read "Protection from wind and rain" on the cabin cruiser as a rain backup. It is not. The boat still goes out; there is no indoor alternative to the tour. The sentence is kept verbatim in `facility_notes.has_rain_backup` and the flag is null.
  - `whale-watching-boat-tour.time_slots`: ["08:30", "15:30", "16:00"] -> null — those times came off the homepage's live availability widget for one Sunday, not a published schedule. Both tour pages say "Multiple tours daily" and point at the calendar. Recording them would have invented a timetable.
  - `venue.name`: "Whale Centre" -> "The Whale Centre" — the site uses the article in its own name. The article is dropped from `id` only, which is `whale-centre`.

- **Fields set to null after review:** 4
  - `hosts_school_groups` and `hosts_daycare_groups` — no page on the site mentions schools, daycares or children's groups in any form. The bear tour calls the cabin cruisers "designed for families", which is not the same claim, and the open boat exclusion is a boat restriction rather than a venue policy. Neither flag is set false, because the site gives no reason to.
  - `youngest_age_welcomed_years` — the "Children (1–12)" band is a price band, not an eligibility floor. The FAQ says only that "age and size restrictions may apply for safety reasons".
  - `price_year_or_season` — no page carries a year or a season against the prices.
  - `whale-watching-boat-tour.capacity_min` / `bear-watching-boat-tour.capacity_min` — the FAQ confirms a minimum exists ("tours require a minimum number of guests to operate") but never gives the number, so it is a gap rather than a value.

- **Conflicts recorded:** 2
  - Children's age bands. The tour pages price children as 1 to 12; the booking policy lists infants 0 to 2 as their own category and children 2 to 12. `cost_per_child_cad` is kept at 139 from the tour pages, which is where a director will see the price.
  - Postal code. The contact page writes V0R 2Z0; the Google Maps link beside it resolves V0R 3A0. `address` is recorded as the site itself writes it.

- **A note on the museum.** The task brief described a free walk-in museum alongside the paid tours. That is not on the current site. The homepage, the "The Whale Centre Tofino" page, the "/tofino" page, community stewardship and the FAQ were all read for it, and a site-restricted search for museum, skeleton and free admission returned nothing. No museum program was created and no `is_free` flag was set true. It is recorded in `gaps` so that a phone call can settle whether the display still exists.

- **Authored fields written:** all three, on all three programs.
  - `what_children_do` rests on the tour pages and the FAQ: the 30 minute check-in with waivers and fitting, the choice between a heated cabin and a Mustang floater suit on the open boat, the 2.5 hour length, the guide's "full narrative", and the named wildlife. Nothing about the shoreline activity is described beyond what the site states.
  - `our_note` rests on the bear tour's "daily on the low tide" departures, the open boat's exclusion of infants and small children, the 2.5 hours plus check-in, and the complete absence of group-facing content.
  - `practical_summary` is generated from the published price, season, duration and dock washrooms against the age, group rate, lunch, parking and accessibility gaps.

- **Images:** four, all on `images.squarespace-cdn.com`, which is this Squarespace site's own CDN. All four URLs are absolute and https, and each was present on the `found_on_url` recorded. Every `alt` is the site's own attribute used verbatim, so `alt_source` is `site` throughout and none was generated; no image was opened or viewed, which is noted in `gaps`. No captions were written, no `rights_note` was taken from the footer, and `usage` is `unverified` on all four. One `hero` exists. The homepage banner photo carries no alt at all and was skipped rather than given an invented description; a truncated alt on a bear tour group photo was also skipped rather than recorded as verbatim.

- **Location:** `geo_source` is `geocode_pending` and `lat`/`lng` are null, matching how the coordinates were actually obtained, which is to say not at all. No geocoding service was available in this run. The contact page's map link does carry 49.1523569, -125.9042921 for 411 Campbell St; that pair is written into `gaps` verbatim so the backfill pass can use it without re-reading the site, rather than being written into `lat`/`lng` here.

- **Retrieval:** the site is Squarespace but serves full body content to a plain fetch, so no RETRIEVAL NOTE is needed. The one exception is `/tofino-private-tours`, which returned navigation and a booking button only. The private charter program is therefore built from the price line that appears on the whale and bear tour pages, not from that page.

- **Meets minimum viable record:** no. Two required fields are missing.
  1. `venue.lat` / `venue.lng` — `geocode_pending`, as above.
  2. No program carries a published age or grade range. `age_basis` is `years` on all three, because the venue talks in years and never in grades, but the site publishes no eligibility range to go with it, only price bands. Everything else on the bar is present: `id`, `name`, `address`, `category`, `checked_on`, a `hero` with `alt`, and on each program an `id`, `name`, `comes_to_you`, a cost field and an `our_note`.

- **Confidence:** medium-high on the tours, low on the fit. The prices, durations, seasons, cancellation terms and extra fees are published plainly and were confirmed word for word on a second read, so the facts in the record are solid. The uncertainty is entirely about whether this venue takes children's groups at all: there is no minimum age, no group rate and no mention of schools or daycares anywhere on the site.

- **Recommended follow up by phone or email** (1-888-474-2288, local 250-725-2132, whales@island.net):
  1. **Price** — is there any school or daycare rate, or is the $1,800 private charter the only whole-group option? Does the $3 access fee and $10 fuel surcharge apply per child as well?
  2. **Youngest age** — what is the actual minimum age on the heated cabin cruiser, and what are the "size restrictions" the FAQ refers to?
  3. **Capacity** — how many can the cabin cruiser take on a scheduled whale watching tour, and what is the minimum number needed for a tour to run?
  4. **Lead time** — how far ahead does a group of twelve need to book in July or August?
  5. **The museum** — is there still a display or walk-in exhibit at 411 Campbell Street, and is it free? Nothing on the current site mentions one.
  6. **Lunch space** — food is not allowed onboard, so where can a group eat before or after, and is there anywhere indoors?
  7. **Washrooms** — there are washrooms at the dock, but are there any at the Campbell Street office where the group checks in, and is there a change table?
  8. **Rain backup** — tours run in the rain, so what actually happens to a booking that is cancelled for weather on the day?
  9. **Access** — can a stroller or a wheelchair get to the dock and onto the cabin cruiser? The site says nothing at all about this.

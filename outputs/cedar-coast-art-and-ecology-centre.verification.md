# cedar-coast-art-and-ecology-centre.json

VERIFICATION

- **Fields checked:** 24 (the 12 non-null venue fields plus every field asserted as false, re-read against a second cold fetch of the home page and the contact page; the single image entry; and the education and rates pages that the conflict rests on). There are no programs to re-open.

- **Fields corrected:** 2
  - `venue.address`: "Cedar Coast Dock, 630 Campbell Street, Tofino, B.C., V0R 2Z0, Lot 1, Vargas Island, B.C., V0R2Z0" -> "Cedar Coast Centre, Lot 1 Vargas Island, P.O. Box 1209, Tofino, B.C., V0R 2Z0". The contact page runs two addresses together in one line. The first is the dock in Tofino where staff met guests, not the venue. The footer writes the centre's own address cleanly, so that is what is recorded, and the dock is carried in the description and in gaps.
  - `venue.website`: "www.thecedarcoast.ca" (from the tracker) -> "https://thecedarcoast.ca/". The www host redirects to the bare host, which is what the site's own `og:url` and canonical use.

- **Fields set to null after review:** 8
  - `has_washrooms`, `has_lunch_space`, `has_rain_backup`, `stroller_accessible`, `wheelchair_accessible`, `bus_parking` — the facilities page describes en-suite bathrooms, a dining hall, a library, a classroom and a gymnasium, but all of that describes the centre while it was operating. Asserting a washroom at a permanently closed site would render as a green tile for somewhere nobody can go, so every facility flag is null. The one piece of text that is still useful to a director, the note about telling staff in advance if a 24 passenger bus needs parking, is kept verbatim in `facility_notes`.
  - `price_year_or_season` — the rates page is headed "2024 Rates", but with no programs recorded there is no price for a year to qualify. The staleness is carried in the conflict note and in gaps instead.
  - `booking_method` — `email` would imply there is something to book. The published address and phone number are kept as facts; the routing is not.

- **Conflicts recorded:** 1. The home page says the centre is permanently closed. The education page still lists five ecology programs for K-12 and university groups at $250 each, and the rates page still lists 2024 accommodation and youth education group pricing. The home page is the newest thing on the site by a wide margin: its sitemap entry is dated 2026-02-20, while the education page is 2024-04-18 and the rates page 2024-09-08. Per the rule, the newer page wins, so the venue is recorded as closed and not hosting groups.

- **Authored fields written:** none of the three. `what_children_do`, `our_note` and `practical_summary` live on programs, and a permanently closed venue has no programs. The `description` and the `conflicts[].note` are the only authored prose here; both rest on the closure sentence on the home page, the property description on the location page, and the still-live education and rates pages.

- **Meets minimum viable record:** no, and it should not. Three required things are missing:
  - `lat` and `lng` — no coordinates are published on the site (no map embed, no JSON-LD `GeoCoordinates`, no `og:latitude`) and no geocoding service was available, so `geo_source` is `geocode_pending`. Note for whoever backfills: the address is a lot number on a boat access only island, so a geocoder will either fail or return a point no group can drive to. The dock at 630 Campbell Street, Tofino is the address a director would actually navigate to.
  - **At least one program** — the venue is permanently closed, so `programs` is an empty array by the rule for closed venues. This is the correct answer, not a hole to fill.
  - The one `hero` image exists and carries an `alt`, but the alt is `generated` and was written without seeing the image, because no browser was available. The URL, its 1800x1200 dimensions and its presence in the home page's `og:image` and JSON-LD were all confirmed against a live fetch, and the file returns HTTP 200 as `image/jpeg` from the venue's own domain. The alt still needs a human to look at the photo before publish.

- **Confidence:** high on the finding, low on the record. The closure sentence is unambiguous, sits on the home page, and is repeated in the page's own `meta description` and `og:description`, so there is no doubt the centre is closed. The record itself is deliberately thin because almost nothing else on the site can be relied on any more.

  One retrieval point matters more than the rest and is recorded in `gaps`: **thecedarcoast.ca serves its real site only to a browser user agent.** A plain fetch with a default user agent returns a 596 byte stub whose title and canonical link both point at cedarcoastfieldstation.org, with `lang="id"` and a favicon on the off-domain host `imgmahasuhu.io`. Everything in this record came from fetches sent with a desktop browser user agent. A re-run that does not do the same will appear to find a hijacked or empty domain and could overwrite this record with nothing.

- **Recommended follow up by phone or email** (info@thecedarcoast.ca, 1-250-726-6790, both still published on the contact page although the centre is closed):
  1. Confirm the closure is real and final, and whether the organisation still runs anything anywhere. The rest of the site still reads as though it is open, so this is the only question that matters.
  2. If it is final, this venue should be retired from the catalog rather than published with empty fields.
  3. If some successor operation exists, ask what it offers to school and daycare groups, at what price, for what ages, and from where. Every one of those is unknown for anything current.

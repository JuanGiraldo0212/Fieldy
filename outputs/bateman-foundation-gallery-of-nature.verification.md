# VERIFICATION — bateman-foundation-gallery-of-nature

- **Fields checked:** 9 non-null venue fields, plus every field that would normally be populated for an operating gallery (address, hours, admission, booking route, facilities, programs, images) — all confirmed absent from the live site.

- **Fields corrected:** 0.

- **Fields set to null after review:** 0. Nothing was populated speculatively; `hosts_school_groups` and `hosts_daycare_groups` are set to `false` rather than null because the site gives an explicit reason: "the Bateman Gallery closed its doors on February 18, 2023, and the Bateman Foundation suspended operations."

- **Conflicts recorded:** 0.

- **Authored fields written:** none. `what_children_do`, `our_note` and `practical_summary` are program-level fields and `programs` is an empty array, which is correct for a permanently closed venue. Writing advice about visiting a closed gallery would be invention.

- **Status:** `not_for_groups` — permanently closed. `www.batemanfoundation.org` now redirects to `robertbateman.ca`, a Shopify art-legacy and archive site for Robert Bateman's work. It has no Visit, Hours, Admission, Education or Group Booking section; the only mention of the gallery is in the past tense on the Legacy Network initiative page.

- **Meets minimum viable record:** no. Missing `venue.address`, `venue.lat`, `venue.lng`, a `hero` image, and at least one program. All five absences are correct rather than fixable: the successor site publishes no street address (the gallery is described only as being in "Victoria's historic Steamship Terminal building overlooking the Inner Harbour"), and a closed venue has no programs to record.

- **Location:** `lat`, `lng` and `geo_source` are all null, per rule 3 of STEP 2c — no published coordinates and no street address to geocode. There is no Google Maps embed, no JSON-LD `GeoCoordinates` and no `og:latitude`/`og:longitude` on the site. No pin was hand-placed from knowledge of where the Steamship Terminal is.

- **Images:** empty array, explained in gaps. The site's `og:image` (`Index2014_02_...jpg`) is the same social card served on every page rather than a photograph of the venue, so it was skipped per STEP 2b. The single picture on the Bateman Foundation legacy page (`5.-16-bateman-branding-gallery-of-nature-...jpg`) has no alt attribute and no caption, and its contents could not be confirmed without downloading it, so no honest `alt` could be written and the entry was dropped. There is therefore no hero image.

- **Confidence:** high on the closure and on the absence of group programming — the venue's own successor site states the closing date and the suspension of operations in its own words. Low on anything else, because the site publishes nothing else about the physical venue.

- **Recommended follow up:** none by phone or email. The organisation has suspended operations and publishes no contact route for the gallery. The record should be kept as a closed venue so it does not resurface in searches, and re-checked only if `batemanfoundation.org` stops redirecting.

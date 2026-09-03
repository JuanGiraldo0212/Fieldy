# VERIFICATION — Gonzales Hill Observatory (Walbran Park)

Verified 2026-09-03 by re-fetching the park page with a `?v=1` cache-buster.

**Source note.** The website in the tracker, `www.tourismvictoria.com`, is a third-party tourism
board and was not used as a source. A single search for the official operator found the Capital
Regional District's own park page, which is recorded as the website. An older CRD URL
(`crd.bc.ca/parks-recreation-community/parks-trails/find-park-trail/gonzales-hill`) returned an
empty page and is listed in `pages_opened` only.

- **Fields checked:** 27 (the venue block, the one program, the image entry and the location
  fields)

- **Fields corrected:** 0

- **Fields set to null after review:** 0. Several fields were left null from the start and the
  re-read confirmed they should stay that way:
  - `has_washrooms`, `has_lunch_space`, `has_rain_backup` — the Amenities list contains exactly two
    items, "Parking lot" and "Public transit". Absence from a list is not the CRD saying there are
    none, so these stay null rather than false, with the point made in gaps.
  - `is_free` — the page states no admission and no parking fee, and never says the park is free.
  - `hosts_school_groups` / `hosts_daycare_groups` — the page is silent on groups.
  - `wheelchair_accessible`, `stroller_accessible` — the only signal is "Difficulty Rating: Easy",
    which is not an accessibility statement.

- **Confirmed unchanged on re-fetch:** "Size: 1.80 hectares", "Location: Denison Road in
  Victoria/Oak Bay", "Established: 1992", "Hours: Sunrise to Sunset"; the Activities list (Hiking,
  Walking/Running, Wildflowers) and the Amenities list; all six "To help preserve the park"
  bullets, which are recorded verbatim in `restrictions`; and the driving and BC Transit route 7
  directions, which sit in the program description.

- **Programs:** there is no bookable offering here. The record carries one `self_guided` park
  visit, which is what the site actually describes. To check whether the CRD runs anything guided
  at this park, its Regional Parks Interpretive School Programs page was opened: those programs
  run at Island View Beach, Elk/Beaver Lake, Francis/King and Witty's Lagoon, and Gonzales Hill is
  not mentioned. That is recorded in gaps, and no program was invented from it.

- **Images:** one hero, re-confirmed present on the page, absolute and https:
  `https://cdn.intelligencebank.com/.../Gonzales+Hill+Park_Observatory_CRD+(6).jpg`. This is the
  digital-asset CDN the CRD's own site serves its park photos from, so it counts as the operator's
  own domain. The alt text, "A white observatory with a big dome on a rocky hill.", is the site's
  own and is real alt text rather than a filename, so `alt_source` is `site`. No caption was
  invented and `rights_note` is null (the page carries only a site-wide "© Capital Regional
  District 2026" line, which is not a photo credit).

- **Location:** `geo_source` is `geocode_pending`, which matches how the coordinates were
  obtained — they were not. There is no Maps iframe, no JSON-LD GeoCoordinates and no
  og:latitude; the only geo meta is `geo.region: CA-BC`. An outbound Google Maps *directions* link
  carries `sll=48.41432,-123.323497` and `ll=48.4161,-123.316941`, but those are map viewport
  parameters rather than a published venue coordinate, so they were deliberately not used and the
  fact is recorded in gaps. No pin was hand-placed.

- **Conflicts recorded:** 0

- **Authored fields written:** `what_children_do`, `our_note`, `practical_summary`. They rest on
  the CRD's own description (rocky knolls, ocean views from the 66-metre high point, Garry oak
  meadows and spring wildflowers, easy difficulty, hiking and walking/running), on the two-item
  amenities list, and on the fact that the observatory is described only as a historical landmark
  with nothing said about going inside. `our_note` states that uncertainty rather than resolving
  it.

- **Meets minimum viable record:** no — `venue.lat`, `venue.lng` (geocode_pending) and, on the
  program side, `age_basis` plus a published range and a cost field, none of which the CRD
  publishes for a drop-in park. Venue id, name, address, category, checked_on and a hero image
  with site alt text are present.

- **Confidence:** medium. Everything recorded is printed plainly on the operator's own page and
  survived a cache-busted re-read; the gap in confidence is scope, not accuracy — the tracker row
  names "Gonzales Hill Observatory (Walbran Park)", and the CRD page covers only Gonzales Hill
  Regional Park. Walbran Park is a District of Oak Bay park and nothing about it was extracted.

- **Recommended follow up by phone or email** (CRD Regional Parks, 250.478.3344 /
  crdparks@crd.bc.ca — a general enquiry line, not a booking route):
  1. **Price** — whether anything is charged for parking or access.
  2. **Washrooms** — whether there are any at or near the Denison Road lot; none are listed.
  3. **Capacity and parking** — how many cars the small lot holds and whether a bus can turn or
     drop off on Denison Road.
  4. **The observatory** — whether the building can be seen inside, or is exterior-only.
  5. **Group visits** — whether a booked group needs a park use permit for a class-sized visit.
  6. **Lunch space and rain backup** — nothing on site is described; the nearest fallback is not
     stated.
  7. **Walbran Park** — the adjoining Oak Bay park, which this record does not cover.

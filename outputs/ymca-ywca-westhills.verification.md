# VERIFICATION — YMCA / YWCA Westhills

- **Fields checked:** 44 (33 venue, 0 programs, 11 image)

- **Fields corrected:** 2
  - `venue.website`: changed from the bare domain to this branch's own contact page, so this record does not point at the same URL as the other two YMCA-YWCA records.
  - `venue.hours_notes`: first draft carried the Downtown hours. Corrected to the Westhills hours read from this branch's own contact page. Westhills runs Monday to Friday 6:00am to 9:00pm and Saturday to 6:00pm, where Downtown closes at 8:00pm on Friday and 5:00pm on Saturday. The two branches genuinely differ and cloning the hours would have been wrong.

- **Fields set to null after review:** 4
  - `hosts_school_groups` and `hosts_daycare_groups` — left null rather than false, for the same reason as the Downtown record. The site is silent about groups rather than excluding them.
  - `has_washrooms` and `has_lunch_space` — never stated. "Food is permitted only in the lobby" is a rule about where members may eat, not a statement that there is lunch space for a group, so it was recorded as a restriction and not converted into a facility.
  - `bus_parking` and `facility_notes` — the site says there are large public parking lots for members with no pass needed, which is about cars. It says nothing about a bus. The sentence is kept verbatim in gaps rather than being promoted into a bus parking claim.

- **Programs:** empty array, deliberately. Following the prompt's rule rather than inventing a "Group visit". Checked the Westhills child and youth page, the Westhills recreation programs page, the shared pool and aquatics page, the facilities page, and site searches for "school group" and for "birthday rental booking". The only bookable thing at this branch is Activity Room 3, and that is reserved in 30 minute slots by an individual member through their online reservation system, up to 15 days ahead. That is a member court booking, not a group visit, so it was not recorded as a programme.

- **Prices re-read live:** not applicable, no price is published for this location.

- **Conflicts recorded:** 0

- **Images:** 1 kept. The hero is the banner from the Westhills recreation programs page, opened in the browser and looked at before the alt line was written. It shows five adults with pickleball paddles, which is what this page is about; the alt says so rather than implying children. No alt on the site, so `alt_source: generated`. `width` and `height` read from the markup attributes.

- **Authored fields written:** none. No programs, so nowhere for `what_children_do`, `our_note` or `practical_summary`. The description lists what is actually offered for children and states plainly that none of it is a group booking.

- **Location:** the contact page carries a Google Maps embed whose URL contains the map coordinates, so `geo_source` is `site_embed`. Coordinates recorded to 5 decimal places as published, and they are distinct from the Downtown record's. Address recorded as the site writes it.

- **Meets minimum viable record:** no — no programs, so no publishable record. That is the correct outcome. Venue block, address, coordinates, category and hero image with alt are all present.

- **Confidence:** high, on the negative finding. Five pages plus two site searches agree there is nothing bookable by a children's group here. Low confidence on facilities, because the site publishes very little about them.

- **Recommended follow up by phone or email:**
  1. **Is a group visit possible at all** — the site never says yes or no. This is the only question that matters for this branch.
  2. **Price** — if a group visit is possible, ask whether non-member children can be admitted and at what rate.
  3. **Youngest age** — ask whether a group of under fives can use the pool, given the 3:1 in-water ratio.
  4. **Capacity and lead time** — unpublished.
  5. **Lunch space and washrooms** — unpublished.
  6. **Bus parking** — the lots are described for cars only.

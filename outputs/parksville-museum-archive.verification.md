# VERIFICATION — parksville-museum-archive

- **Fields checked:** 54 (33 venue, 1 program re-read against the exhibits page, 3 images, coordinates, 1 conflict)

- **Fields corrected:** 4
  - `venue.geo_source`: geocoded -> site_embed, and `lat`/`lng` 49.30533/-124.26039 -> 49.305482/-124.2603529. The address link in their own footer carries a Google Maps place pin at `!3d49.305482!4d-124.2603529`. The `@49.3054855,-124.2625416` earlier in the same link is only the map viewport centre and sits about 160 m west of the pin, so it was not used. Geocoding the street address independently landed within about 20 m of the pin, which confirms it.
  - `programs[0].is_free`: true -> null. "Admission by Donation" is neither free nor a price.
  - `programs[0].cost_per_child_cad`: 5 -> null. The suggested $5 per person on the contact page is a suggested donation, not an admission charge. It is described in the gaps instead, with the $125 a group of 25 would come to named as arithmetic on their suggestion rather than as a quote.
  - `venue.has_lunch_space`: true -> null. The exhibits page invites a picnic in the courtyard, but their own rental guide says no food or drink is permitted on site unless it comes from a food-safe kitchen or a licensed vendor. The two are recorded as a conflict instead of one being quietly picked.

- **Fields set to null after review:** 4
  - `wheelchair_accessible`. The only accessibility statements on the site are for the Knox Church and the Heritage Room, both of which are spaces you hire. Nothing addresses the older heritage buildings, the paths or the nature trail, so a site-wide yes would have been an inference. The detail is kept as a facility note.
  - `bus_parking`. The only parking sentence anywhere is street parking advice written for their Sunday market.
  - `has_rain_backup`. The rain plan in the rental guide is written for people paying to hire the courtyard, not for a visiting group.
  - `hosts_school_groups` and `hosts_daycare_groups` stay null, not false. The site never mentions groups of any kind, and silence is not refusal.

- **Conflicts recorded:** 1 — whether a group can bring its own food. The exhibits page invites a picnic in the courtyard; the 2026 rental guide bans food not from a food-safe kitchen.

- **Authored fields written:**
  - `what_children_do`, resting on the exhibits page (eight named heritage buildings, "hands-on, engaging exhibits", the working forge and the only traditional Japanese forge in Western Canada, the "fun and interactive exhibit all about the E & N Railway" in Craig's Cabin, the Mosaic Pavilion on forestry, the self-guided tour boards in the Marion Craig Courtyard, and the nature trail).
  - `our_note`, resting on the absence of any guided tour, the Thursday to Monday 11 am to 5 pm hours, and the "Admission by Donation, Suggested $5 per person" line on the contact page.
  - `practical_summary`, resting on the outdoor washrooms by the courtyard, the year-round courtyard, the two accessibility statements, and the gaps for rain cover and bus parking.

- **Seasons checked:** yes, and this matters here. The events page mixes current and expired listings. Ahead of today (10 September 2026) are the Second Sundays Artisan Market on 13 September, which is the last of the May to September run, and a Storyteller Series concert on 27 September at $25 a ticket, which is an adult evening event. Behind it and still on the page are a Friday evening night market from September to October 2023 and a Family Day weekend in February. None of the expired material was extracted, and the mix is flagged in the gaps and in the seasonal note.

- **Meets minimum viable record:** no. The venue block is complete, including a hero image with alt. The single program has no age or grade range, no cost and no `is_free`, because the site publishes none of them. The `our_note` and `comes_to_you` requirements are met.

- **Confidence:** high on hours, address, coordinates, contact details and facilities, all of which were re-read from the live DOM in Chrome and cross-checked against the 2026 rental guide PDF. High confidence too that no school or group offering exists: their own sitemap lists ten pages, all ten were checked, and none mentions schools, teachers, daycares, field trips or group visits.

- **Recommended follow up by phone or email** (250-248-6966, info@parksvillemuseum.com), in priority order:
  1. **Price.** What does a group of children give at the gate, and does the suggested $5 per person apply to every child?
  2. **Whether they take groups at all.** There is no booking route published; ask if a class can be booked in and whether a volunteer would show them round.
  3. **Youngest age and group size.** Neither is published anywhere.
  4. **How long to allow.** Not stated.
  5. **Lunch.** Whether packed lunches are welcome in the courtyard, given the contradiction with their room hire rules.
  6. **Washrooms.** Confirm the outdoor washrooms are open during public hours, since the two indoor ones are staff washrooms opened for renters.
  7. **Rain and bus parking.** Where a group would shelter, and where a coach can pull in on East Island Highway.

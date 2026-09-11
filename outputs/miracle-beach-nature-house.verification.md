# Miracle Beach Nature House — VERIFICATION

- **Fields checked:** 78 (33 venue, 3 programs, 2 images)

- **Fields corrected:** 3
  - `venue.website`: the tracker's URL, discoverparks.ca/parks/miraclebeach-park, is a hard 404 on the operator's own site. Corrected to discoverparks.ca/locations/miracle-beach-park, which returns 200 and renders the park. The tracker row has been corrected too.
  - `images[hero].width` / `height`: 1448 x 1086 -> null, and the same for the program image. Those numbers came from the image file itself, not from anything the page states, so they were removed.
  - `programs[nature-house-visit].is_free`: null -> true. The operator writes "Entry to the Nature House and participation in all activities is free, however donations are always appreciated!" That is free with donations invited, not admission by donation, so free is the honest reading.

- **Fields set to null after review:** 5
  - `venue.hosts_school_groups` and `venue.hosts_daycare_groups` — nothing on the operator's pages or on the BC Parks park page mentions groups here at all. Silence, not a refusal.
  - `venue.booking_email`, `venue.booking_phone`, `venue.booking_method` — no contact route is published for the Nature House. Internal staff addresses appear inside the page's own data payload, but those are content management accounts rather than published contacts and were not used.
  - `venue.wheelchair_accessible` and `venue.stroller_accessible` — the only accessibility detail is behind a link to a separate BC Parks accessibility site, off the operator's own domain.
  - `venue.has_rain_backup` — the building is indoors but is shut outside the summer season, so there is nothing to fall back on for the rest of the year.

- **Conflicts recorded:** 0. The operator's pages and the BC Parks park page agree on the seasonal opening pattern and on the day-use car park being the way in.

- **Authored fields written:** `what_children_do` on two of three programs, `our_note` and `practical_summary` on all three.
  - `what_children_do` for the Nature House visit rests on the activity page's own list of bones, interactive digital displays and ceiling murals, plus the photograph of the room, which was opened and looked at. The Mystery Box and the orca ceiling mural are visible in that photograph. For the audio tour it rests on the description of the 0.64 km forest loop with stops about plants and park history.
  - `our_note` rests on the closure notice, the absence of any published contact, the log in required for the audio and the PDF, the poor cell reception warning and the loop's length.
  - `practical_summary` rests on the activity page's line about the day-use car park having parking and washrooms, and on the park's own facility list for picnic areas and shelters.

- **Meets minimum viable record:** no. `venue.address` is missing, because no street address is published for the Nature House or for the park, and no program publishes an age or grade range. Coordinates, category, name, id, checked_on and a hero image with alt are all present.

- **Confidence:** medium. What is recorded is verified live and is specific to Miracle Beach, but the record is genuinely thin because the building is closed and its programme pages are unpublished. The map point is the weakest part: it is the operator's single point for the whole 135 hectare park rather than a pin on the Nature House, and BC Parks uses the same figure to centre its own park map, so a driver routed to it may not arrive at the building.

- **How this was kept separate from the Goldstream record:** the two venues share an operator and a website, so every fact here was traced to a page or a data record naming Miracle Beach. Miracle Beach has no school programme and no $150 fee, unlike Goldstream. Its Nature House is listed as closed until summer 2027, while Goldstream's is open seven days a week with an exhibit space shut for structural repairs. Its Jerry's Rangers, arts and crafts, trivia and MARS ambassador pages are all unpublished and return 404, which is a different set of missing pages from Goldstream's salmon run ones. Its two published activities, the Nature House visit and the interpretive loop audio tour, are its own. Its point, its 1959 tent origin, its orca ceiling mural, its amphitheatre and its 0.64 km loop are all specific to this park. No Goldstream text, price, email address or image was carried across, and the only shared image source, the four nature house gallery on the operator's Discovery Centres page, was avoided in favour of the section photograph sitting directly under the Miracle Beach heading.

- **Recommended follow up**, in priority order. There is no published phone number or email for this Nature House, so start with the park operator, Quality Recreation Ltd, on 1-250-337-8020 or info@explorebcparks.ca, and with the Nature House's own Instagram account, which is the only schedule the site points to:
  1. Whether the Nature House will open at all before summer 2027, and who to talk to about it.
  2. Whether they take school or daycare groups, and at what price if any.
  3. The youngest age they will take and how many children they can hold in the building at once.
  4. How much notice they want, and whether anything has to be booked.
  5. Whether a group may eat inside, or only at the picnic shelters.
  6. Whether the building is step free and whether the interpretive loop takes a pushchair.
  7. Where a bus can drop off and park at the day-use area, and how far the walk is from there.

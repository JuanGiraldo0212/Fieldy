# sea-wolf-adventures.json

VERIFICATION

- **Fields checked:** 78 (24 non-null venue fields including the three facility notes and six restrictions, 47 non-null fields across the four programs, both image entries, and the one conflict). Every program `source_url` was re-fetched cold with a desktop browser User-Agent after the JSON was written, and every `evidence` string plus every quoted restriction and facility note was matched back into the page text by exact substring search.

- **Fields corrected:** 4
  - `venue.website`: the tracker's `www.seawolfadventures.ca` -> `https://seawolfadventures.ca/` — the `www.` host redirects to the bare host, which is also what the site's own `og:url` gives.
  - `programs[grizzly-bear-day-tour].lead_time_days`: 30 -> null — the 30 day rule is attached only to the cheaper non-refundable seat ("Bookings must be made 30 more days in advance of the tour"). The flexible seat publishes no minimum notice, so there is no minimum notice for the tour as a whole. The 30 day rule is kept in the program description instead.
  - `programs[wilderness-lodge-package].cost_per_child_cad`: held at null. The child rate is published only as a percentage of the adult price, and the two pages that give that percentage disagree, so no number was worked out. The disagreement is recorded as a conflict instead.
  - `images[hero]`: the tour page's banner photograph (`ms-2027-hero-grizzly-scaled.jpg`) -> the grizzly and salmon photograph on the same page. The banner is a CSS background with no alt text at all, and no browser was available to look at it; the photograph chosen instead carries real alt text written by the site, so the hero alt is honest rather than guessed from a file name.

- **Fields set to null after review:** 7
  - `venue.has_washrooms` — the only washroom sentence on the site is about the vessel Mayumi 2.0, and the site never says which boat runs the scheduled day tour. The sentence is kept verbatim in the facility notes; the flag stays null.
  - `venue.has_lunch_space` — meals are included and eaten on the boat. That is not a room a group can eat in, and inferring one would be exactly the mistake the prompt warns about.
  - `venue.has_rain_backup` — "The tour runs rain or shine" says the trip goes ahead in rain, not that there is or is not shelter. Kept verbatim in the facility notes.
  - `venue.bus_parking` — the only parking line is "Parking is available near the office", written for cars arriving at the lodge meeting point. Kept in the facility notes, flag null.
  - `venue.youngest_age_welcomed_years` — the site gives two answers in words rather than one number: minimum age 10 on the scheduled tour, no minimum on the family charter. Both are carried in the restrictions and in the gaps list.
  - `venue.hosts_school_groups` and `venue.hosts_daycare_groups` were left null rather than set. The site never addresses schools or daycares at all, and the family charter explicitly takes any group size with no minimum age, so there is no published reason to say false.

- **Conflicts recorded:** 1 — the children's rate on the lodge package, 60 percent of the adult price on the Additional Information page against 40 percent on the Book Now page. Neither page is dated, so the field is null and the director is told to get the number in writing. A second, smaller disagreement (gratuity given as "18-25% standard" on one page and "18% average" on the other) was judged too far from a children's group to put in front of a director and is noted in gaps only.

- **Authored fields written:** all three, on all four programs, except `what_children_do` on the custom tours program, which is null because that page never describes an actual day.
  - `what_children_do` for the day tour rests on the tour page's own account of the eight to nine hour run, the wildlife named along the route (Pacific white sided dolphins, eagles, humpbacks, orcas), the "safe and respectful distance" wording for the bears, the cultural teachings shared through the day, and the included breakfast, lunch and snacks. Nothing about going ashore was written in, because only the Tripadvisor reviews embedded on the page mention walking to the river, and those are not the venue's own words.
  - `our_note` for the day tour rests on the published minimum age of 10, the 7:00 am departure and the eight to nine hour length. For the charter it rests on the single whole boat price, the per head stewardship fee and the "no minimum age" line. For the lodge package it rests on the per person price and the two different child rates.
  - `practical_summary` on each program is generated from what that page does publish against the washroom, lunch, rain, parking and accessibility gaps listed in `gaps`.

- **Location:** `geo_source` is `geocoded` and matches how the coordinates were obtained. The Location page carries three map embeds; two of them have real pins, but those are the Alert Bay and Alder Bay pickup docks, not the office, and the Port McNeill embed is a name search with no coordinates. The office address was geocoded through Nominatim, which resolved to Broughton Boulevard in Port McNeill rather than to the building number, so the pin is on the right street in the right town and may be a short distance off. That imprecision is recorded in gaps.

- **Meets minimum viable record:** yes. Venue id, name, address, lat, lng, category and checked_on are all set, there is one hero image with alt text taken verbatim from the site, and the day tour program carries id, name, `age_basis` years with a minimum age of 10, `comes_to_you` false, a per person cost and an `our_note`. The schema validator returns OK with no warnings.

- **Confidence:** high for the day tour and the family charter, whose prices, season, start times, group size and minimum age are printed plainly on a single well maintained page and were confirmed on a second cold fetch; medium for the lodge package, where two of their own pages disagree on the child rate and one still refers to a 2025 inaugural season; low for the custom tours page, which is not linked from the menu and publishes nothing concrete.

- **Recommended follow up by phone or email** (Info@SeaWolfAdventures.ca, 250-902-9653 local or 1-800-381-0132 toll free, phone answered 8:00 am to 2:00 pm):
  1. Price — is there any group, school or student rate, and does the 10 percent youth discount apply to a whole group of 10 to 16 year olds?
  2. Youngest age — the scheduled tour says 10 and up. On the family charter, how young will you actually take, and what do you need from the adults coming?
  3. Capacity — how many people does the Eleni Jane hold on a family charter, and how many adults do you want with a group of children?
  4. Lead time — how far ahead does a group need to book a flexible seat or a charter, and how far ahead do summer dates fill?
  5. Lunch space — meals are served on the boat. Is there anywhere at the office to eat or wait before a 7:00 am departure?
  6. Washrooms — which boat runs the day tour, and is there a washroom on board or only shore stops?
  7. Rain backup — the tour runs rain or shine. What is the shelter on the boat, and at what point do you cancel for weather?

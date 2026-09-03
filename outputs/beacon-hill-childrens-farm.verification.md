# VERIFICATION — beacon-hill-childrens-farm

- **Fields checked:** 34 non-null fields (20 venue, 14 program), plus a second pass over the fields a director needs that the site does not answer (hours, season, price for a group, capacity, lead time, duration, lunch space). The program's `source_url` (Group Visits) and the FAQ, About Us and Group Guidelines PDF were re-read and every recorded value matched.

- **Fields corrected:** 2
  - `venue.wheelchair_accessible: true -> null` — the FAQ question "Is the farm wheelchair accessible?" is answered only with "All of the paths inside the farm are gravel, with no steep inclines and no stairs." That describes the surface without answering yes or no, and gravel is not a neutral fact for a wheelchair or a stroller. The verbatim wording is kept in `facility_notes.wheelchair_accessible`.
  - `programs[0].format: ["self_guided"] -> null` — nothing on the site says whether a staff member leads a group visit. The guidelines put the group leader in charge of behaviour, but that is not a statement about format.

- **Fields set to null after review:** 3
  - `venue.hours_notes` — the Contact page, which is where hours would sit, returns an empty body on every fetch including with cache-busting query strings. No other page states opening hours.
  - `programs[0].is_free` / `cost_per_child_cad` — admission is by donation with *suggested* amounts. Recording $5.00 as a child price would misstate a suggested donation as a fee, and `is_free: true` would misstate a donation ask as free. Both stay null and the wording sits verbatim in `extra_fees_note`; the suggested amounts are also recorded at venue level as general admission.
  - `programs[0].months_offered` — the farm has a public season and an off season, but the dates are never given. Null plus "unknown" noted in gaps, per the months convention.

- **Confirmed rather than corrected:** `capacity_min: 10` is a minimum group size threshold ("any group with 10 or more participants"), not a maximum — `capacity_max` stays null because the site says a maximum exists for the farm and the goat area but never gives the number. `has_washrooms: false` is an explicit published fact ("There is no bathroom inside the farm"), not an absence of information.

- **Conflicts recorded:** 1 (`booking_method`). The Group Visits page says a booking "will be confirmed via email or phone"; the Group Guidelines PDF linked from that same page says "confirmed via phone". Neither carries a date on its face, though the PDF sits in a 2022 upload folder. Both contact routes are kept at venue level and the disagreement is flagged rather than silently resolved.

- **Authored fields written:**
  - `what_children_do` — rests on the FAQ animal list, "You may pet any animals at the fence who wish to be pet", "The only animal enclosure you can enter at this time is the goat petting area", the gravel paths answer, and the "close supervision in small groups is required while in the goat petting area" and no-feeding rules.
  - `our_note` — rests on the bathroom passage (no bathroom inside, roughly 3 minutes' walk) and on the escalation wording: "If repeated intervention from the staff is necessary, the noise level is too high, or the animals are not treated with respect, your group will be asked to leave the goat area or the farm."
  - `practical_summary` — built from `has_washrooms` false, the Circle Drive parking answer, and the gaps list (no group rate, no hours, no season dates, no capacity, no duration).

- **Meets minimum viable record:** no. Missing `venue.address`, `venue.lat`, `venue.lng`, a `hero` image, and a program with `age_basis` plus a published range. None of these can be filled honestly: the site publishes no street address, no image URL rendered on any page, and the farm's only statement about age is the FAQ answer that there is no age limit and everyone is welcome — which is not a range, so `age_basis` stays null rather than being fabricated as "ages 0+".

- **Location:** `lat`, `lng` and `geo_source` are all null per rule 3 of STEP 2c — no published coordinates (no maps embed, no JSON-LD, no og:latitude) and no street address to geocode. The farm is described only as being inside Beacon Hill Park with a parking lot along Circle Drive. No pin was hand-placed.

- **Images:** empty array, explained in gaps. Confirmed again during verification: the bare domain renders text only, and the Plan Your Visit page yields bare alt strings ("photo of donkey", "photo of chickens", "group of goats") with no `src`, so the photos are lazy-loaded or JS-rendered. Cache-busted retries of the homepage returned an empty body. No URLs were guessed from those alt strings.

- **Confidence:** medium. The behaviour rules, facilities and booking route are quoted directly from two sources that agree, but the two facts a director decides on — what it costs a class and when the farm is open — are respectively unpublished and unreadable, and the Plan Your Visit page still advertises the 2024 season, so the site as a whole may be stale.

- **Recommended follow up by phone (250-381-2532) or email (bhcfvictoria@gmail.com), in priority order for a daycare director:**
  1. What a group of children actually pays — no group or school rate is published, only a suggested donation.
  2. Opening hours and this season's start and end dates.
  3. Maximum number of children the farm and the goat petting area can take at once, and how many can be in the goat area together.
  4. How far ahead to book — the site says only "book ahead".
  5. How long a group visit typically takes.
  6. Whether there is anywhere to eat lunch (human food is banned inside the goat area).
  7. Confirmation that the nearest washroom is the Beacon Hill Park facility about three minutes' walk away, and where it is.
  8. Whether there is any shelter if it rains, and where a bus can drop off and park.

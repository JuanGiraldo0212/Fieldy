# VERIFICATION: cowichan-river-provincial-park

- **Fields checked:** 78 (33 venue, 2 programs x ~18 populated, 2 images)

- **Fields corrected: 4**
  - `venue.website`: "www.bcparks.ca/explore/parkpgs/" -> "https://bcparks.ca/cowichan-river-park/". Reason: the tracker held a retired directory path. The park's current page on the operator's own site is the one recorded. The tracker row has been corrected too.
  - `venue.name`: "Cowichan River Provincial Park" -> "Cowichan River Park". Reason: that is how BC Parks writes it on its own page. The provincial park form is kept in the description and in gaps so the record is still findable.
  - `venue.has_washrooms`: null -> true, and `facility_notes.washrooms` added. Reason: the facilities section, which does not render to a plain fetch, states there are several pit toilets throughout the park.
  - `programs[0].cost_per_child_cad`: null -> 1, with the floor and ceiling in the extra fees note. Reason: the camping section, also invisible to a plain fetch, gives youth group camping as $1 per person for minimum 12 people, $50 minimum, $150 maximum.

- **Fields set to null after review: 4**
  - `programs[1].is_free`. The page lists camping fees in detail and says nothing at all about day use fees. Silence is not a statement that the day use areas are free, so this stays blank and is flagged in gaps.
  - `programs[0].lead_time_days`. The 12 month booking window is a ceiling, not a minimum notice.
  - `programs[0].capacity_max`. BC Parks says maximum group sizes vary by park and are shown in the reservation system, not on the park page.
  - `venue.address`. No street address is published for the park.

- **Conflicts recorded: 0.**

- **Authored fields written:** `what_children_do`, `our_note` and `practical_summary` for both programs.
  - Youth group camping rests on the group camping fee table, the two group site descriptions, the boil water advisory and the BC Parks warning to watch small children by the river.
  - The day visit rests on the four day use area descriptions, the three trail descriptions with their lengths, the salmon viewing note and the cliffs advisory.

- **Meets minimum viable record: no.** Missing `venue.address` and, on both programs, an age or grade basis with a range. BC Parks publishes no age rules for this park at all: the youth group rate is defined by the type of organisation, not by the children's ages. Latitude and longitude are present, taken from the coordinates in the park page's own detailed map link, and there is a hero image with alt text.

- **Confidence: medium.** The camping prices, the group site descriptions and the facilities were all read from the live DOM and are precise and current. Confidence is held back by two things: the pin is the centre of a park that runs about 20 km along the river with three separate road accesses, and the day use price is genuinely unknown.

- **Answer to the interpretive question asked:** no interpretive, guided or school program runs here. There is no visitor centre and no staff led activity anywhere on the park page. This is self guided parkland. The one thing it offers a school group as a group is the reduced youth group camping rate.

- **Recommended follow up by phone or email** (park operator K2 Cowichan Park Services, k2cowichan@shaw.ca, 250 613 3131; reservations 1 800 689 9025):
  1. Whether a day visit and the day use car parks cost anything for a school group.
  2. Maximum party size at the Stoltz Pool and Horseshoe Bend group sites.
  3. Whether a bus or a coach can get in and turn around at each access point, since the Horseshoe Bend road is described as narrow with no turnaround.
  4. Which access point suits the group, since the pin is the middle of a long park.
  5. Whether the group sites are open outside the 1 April to 31 October season.
  6. Current state of the boil water notice on the hand pumps.
  7. Whether the shooting range near the Glenora trailhead will be operating on the day.

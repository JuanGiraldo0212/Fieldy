VERIFICATION

- Fields checked: 61 (venue block plus 3 programs plus 4 images, each non-null value reopened against its source page in a browser)
- Fields corrected: 2
  - programs[2].duration_min: 240 -> null. The four hour figure is a minimum booking length for a private charter, not the length of the trip. The customer picks the length, so a fixed duration would have been invented.
  - programs[2].evidence: "Private Tours are $450 per hour for a minimum of 4 hours and a maximum of 8 guests only" -> "We keep our tours to a maximum of 8 persons". The first string is not contiguous on the rendered page; there is a double space before "4 hours". The replacement is verbatim and supports the capacity figure that is actually recorded.
- Fields set to null after review: 1 (programs[2].duration_min, as above). has_lunch_space, stroller_accessible, wheelchair_accessible, bus_parking, lead_time_days, chaperone_ratio and the three sensory fields were left null from the start because the site never addresses them.
- Conflicts recorded: 0. The mailing address and the office location differ, but the site itself resolves that in bold on its own contact page, so it is a stated fact and not a disagreement between pages.
- Authored fields written: what_children_do, our_note and practical_summary on all three programs.
  - what_children_do rests on the covered and enclosed vessel with an onboard washroom, heater and open rear viewing deck (Your Guides page), the animal list on the tour page, and lunch being included on the five hour tour only.
  - our_note rests on the five hour length with a maximum of eight guests, the ban on tripods, metal water bottles and large backpacks, the 10 percent fuel surcharge, and the private tour being priced by the hour with a four hour minimum.
  - practical_summary rests on the onboard washroom and heater, the covered cabin, the eight person cap, and the absence of any statement about lunch space, wheelchair access or coach parking.
- Meets minimum viable record: yes. Venue id, name, address, lat, lng, category and checked_on are all present, there is one hero image with alt text, and the five hour tour carries an id, a name, an age basis with a range, a cost, comes_to_you and an our_note.
- Confidence: high. Every price, the minimum age, the capacity, the season and the departure time are published in plain text in the two price panels, and the coordinates come from a marker in the contact page markup that reverse geocodes to Discovery Harbour in Campbell River.

Recommended follow up by phone or email, in priority order:
1. Price. Ask whether any group or charter rate exists below the per person rate, and get the private charter total in writing, since it is quoted per hour with a four hour minimum and a 10 percent fuel surcharge on top.
2. Youngest age. The published minimum is 5. Ask whether they will take a group whose youngest child has just turned 5, given the trip length.
3. Capacity. Eight guests is the whole boat, adults included. Confirm whether two boats can ever go out on the same day, since the site says only one tour a day is run.
4. Lead time. Nothing is published. Only a recommendation to phone for same day or next day trips.
5. Lunch space. Lunch is included on the five hour tour, but nowhere is it said whether there is anywhere on shore to eat before or after.
6. Washrooms. There is one on the boat. Ask what is available at the marina before boarding.
7. Rain backup. The cabin is covered and heated, but ask what happens to a booking if the tour is called off for weather.
8. Access. Wheelchair access, stroller storage and where a small bus or van can park are not addressed at all.

Leads carried in from the lost run, checked:
- Minimum age of 5 in the tour price panels: confirmed, in bold in both panels.
- 27 foot covered vessel carrying 10 but capped at 8 guests: confirmed on the Your Guides page.
- A 5 hour tour, a 3.5 hour tour and a private charter: confirmed.
- The contact page map renders blank but the markup carries a genuine pin: confirmed. The map container is empty on screen, and the markup holds a marker with a latitude, a longitude and the title Aboriginal Journeys.
- The mailing address is marked "Not our office Location" so the marina is the real address: confirmed, in bold on the contact page.
- Grizzly tours: not offered and not mentioned. Black bears are the only bears named anywhere on the site. The previous run was right.

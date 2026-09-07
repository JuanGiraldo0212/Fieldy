# VERIFICATION - WildPlay Element Parks Victoria

- **Fields checked:** 31 venue fields, 2 programmes at roughly 45 fields each, 4 images.
- **Scope:** wildplay.com covers six parks. Everything recorded here is the Victoria park at 15-1767 Island Highway. The address, the phone number, the hours and the amenities all come from the Victoria page, not from the chain pages. The Thacher field trip page and the Niagara Falls group page were deliberately left unopened so their numbers could not leak in.
- **Fields corrected:** 3
  - `address`: the first pass carried no address because the Victoria page links to a shortened map URL. Re-read from the directions block, which writes it out as "15-1767 Island Highway Victoria, BC V9B 1J1 Canada".
  - `cost_per_child_cad`: confirmed as per student, not per group. The rates table is headed "Per student, plus tax. Minimum 15 participants on the same course." Kids Course from $22.99, Classic Course from $34.99. `tax_included` is false because the page says plus tax.
  - `capacity_min`: 15 is the minimum participants on the same course, so it belongs in the minimum, not the maximum. No maximum group size is published.
- **Fields set to null after review:** 6
  - `duration_min` on both programmes: the courses are given as 45 to 90 minutes and 90 to 120 minutes, and the group answer is "plan on a half day" with the exact timing set by the group host. A single number would be invented, so the ranges sit in the description.
  - `has_washrooms`: not mentioned anywhere on the site, including the park's own amenities list.
  - `chaperone_ratio`: the field trip page says the group host handles chaperone requirements. No number is published.
  - `wheelchair_accessible` and `stroller_accessible`: the site says access is dealt with case by case, which is not a yes or a no.
  - `months_offered`: published hours only run July to mid December 2026, so spring availability is genuinely unknown. Recorded as null with the word unknown against months in the gaps, per the convention.
  - `lead_time_days`: no minimum notice is published. One business day is their reply time, not a booking deadline.
- **Height and weight rules:** heights are not ages and are not recorded as ages. The minimums, 114 cm for the Kids Course and 142 cm for the Classic Course, sit in the descriptions and in the venue restrictions. The published ages, 5 to 12 and 5 to 18, are recorded on the years basis because that is what the site publishes. The full set of minimums for the zipline tour, the freefall jump and axe throwing is in the venue restrictions because for this audience they decide the trip.
- **Daycare groups:** set to false with a reason. Every element on the site starts at age 5, and the lowest course also needs 114 cm, which most five year olds have not reached. This is the published minimum age case the schema asks for, not silence.
- **Conflicts recorded:** 0. The banner at the top of the Victoria page says open seven days 9am to 8pm, and the hours block says that applies until September 7 and then drops to Thursday to Monday. Today falls inside the first window, so the two agree rather than conflict, and the full seasonal table is recorded.
- **Authored fields written:** all three, on both programmes.
  - `what_children_do` rests on the adventure course description on the Victoria page (ground training, continuous belay, tightropes, cargo nets, wobbly bridges, rope swings, ziplines) and on the field trip page (students choose their own routes and can stop at any point, guides coach from beneath).
  - `our_note` rests on the height rule being the real gate, on rates being lowest Monday to Thursday, and on chaperone numbers and washrooms being unpublished.
  - `practical_summary` rests on the amenities list, the free parking, the picnic tables, and on the rain answer, which is that they run in light rain and close and reschedule if it turns unsafe.
- **Live re-read of prices (step 3):** the field trip rates table was re-read from the live page in a browser rather than from a fetch. It returned exactly "Kids Course 5 to 12 3'9\" (114 cm) From $22.99" and "Classic Course 5 to 18 4'8\" (142 cm) From $34.99" under the heading "Per student, plus tax. Minimum 15 participants on the same course", matching the fetch. Both evidence quotes were confirmed word for word on the live page.
- **Images:** all four alts are the site's own, verbatim, including the typo "WldPlay" in one of them, which is left as written rather than silently fixed. The picture the site offers for sharing on the Victoria page is a promotional giveaway graphic rather than a photograph, so it was skipped and the hero is the park's own zipline photograph instead. Dimensions come from the markup's own image dimension attribute. Images were collected only after scrolling the page, because the gallery is lazy loaded and a first read returned nothing but the logo.
- **Meets minimum viable record:** No. Coordinates are the only missing required field; they need geocoding from the recorded address. Everything else the bar asks for is present, including two programmes with an age basis, a range, a cost and a note.
- **Confidence:** High. Prices, ages, heights, the group minimum, the address and the hours are all published plainly and were confirmed live. The only soft spots are how long a visit takes and how many adults have to come, both of which the site openly leaves to the group host.
- **Recommended follow up by phone or email** (groups@wildplay.com or 1-855-401-0123), in the order a group leader would want them:
  1. Price. Confirm the actual rate for your day, since the published figures are from prices and Monday to Thursday is cheapest.
  2. Youngest age and height. Confirm how they handle a child who is 5 but under 114 cm.
  3. How many adults have to come, which is set by the group host rather than published.
  4. Lead time and whether your month is bookable, since published hours only run July to mid December.
  5. Washrooms, which are not mentioned anywhere on the site.
  6. Bus parking or a coach drop off at the Q Centre.
  7. What happens to your booking if the forecast is bad, beyond the reschedule or refund line.

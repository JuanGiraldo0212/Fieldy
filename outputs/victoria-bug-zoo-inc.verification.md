# VERIFICATION - Victoria Bug Zoo

- **Fields checked:** 31 venue fields, 3 programs at roughly 45 fields each, 3 images.
- **Fields corrected:** 4
  - `cost_per_child_cad` on the group visit: first written as 7.20, being the $8 youth admission with the stated 10 per cent discount applied -> null, with the discount and the full price list moved into the fee note. The zoo publishes a discount off admission, not a group price, and doing the arithmetic ourselves would put a number on the card that the zoo never wrote.
  - `cost_per_group_cad` on the outreach: confirmed live as 185 for the session, not per child. This is the error the pipeline keeps making, so it was checked twice. The page reads "Cost: $185 +tax and $0.72/km both ways" against a heading of "School, Summer Camp, and Daycare Outreach!", and capacity on the same block reads "Unlimited". A per child reading is impossible.
  - `capacity_min` / `capacity_max` on the group visit: 10 is the size at which a group must book ahead and 12 is the ceiling per time slot, so 10 is the minimum and 12 the maximum, not the other way round.
  - `lead_time_days` on the outreach: 14, from "we require at least two weeks notice", which is the minimum. The "2-3 months in advance" line is a recommendation and sits in the description instead.
- **Fields set to null after review:** 5
  - `hours_notes`: three of their own pages give different opening hours and none of the pages is dated. Recorded as a conflict instead. Their own answer about hours changing through the year is kept in the seasonal note.
  - `age_basis`, `age_min_years`, `age_max_years` on all three programs: the only ages on the site are admission price bands, 5 to 17 and 4 and under, which are prices rather than a rule about who may come. No programme age was published.
  - `chaperone_ratio`: they say each lot of 10 to 12 needs at least one adult and ask daycares to bring one extra above their own ratio, which is not a ratio we can put a number on.
  - `bus_parking`: the parking page covers city parkades and street parking only.
  - `has_lunch_space`: nothing published, and food and drink other than water are banned inside.
- **Conflicts recorded:** 2. Opening hours, given three ways across the home page, the tickets page and the contact page. The Wednesday accessibility hour, given as 10 to 11 on the home page and 11 to 12 on the tickets page.
- **Authored fields written:** all three, on every programme.
  - `what_children_do` rests on the tickets page ("Hands on or hands off", the educator's continuous tour, one hour with the educator or twenty minutes alone), the about page (roughly 50 species, educator present at all times) and the groups page (which animals travel to a classroom).
  - `our_note` rests on the group rules about splitting into lots of 12 and staggering entry, on the outreach price being per session with handling falling off as the group grows, and on the kits being collected and returned at the zoo.
  - `practical_summary` rests on the accessibility block on the tickets page, the shared washroom with Nootka Court, the stroller line, the indoor temperature, and on the lunch and bus gaps.
- **Live re-read of prices (step 3):** the tickets page and the groups page were both re-read from the live page in a browser rather than from a fetch. Admission at $18 / $12 / $12 / $8 / free and the $36 annual pass all matched. On the groups page the price blocks are set to reveal on scroll and stay invisible to the page text until they do, so they had to be forced visible before reading. Once visible they matched the fetch exactly: "Cost: General Admission prices plus a 10% discount", "Duration: 30-60 minutes per 10-12 people", "Capacity: 10-12 people (including at least one adult) per 30 minutes", "Cost: $185 +tax and $0.72/km both ways", "Extra Session on same day: $100 + tax (max 3 per day)". The kit prices were re-read live too and all seven figures matched.
- **Images:** none of the three carries alt text on the site, so all three alts are written by us after opening each image in the browser and looking at it. The hero is the picture the site offers for sharing and is a photograph of a horned beetle, not a logo. The other two are a hand holding a green stick insect beside the tanks, and the gift shop with the penny press. Every URL is on the zoo's own content network and was present on the home page as recorded. No captions were taken; the site's carousel captions are unedited template text reading "Write your caption here". No rights note is recorded because the only credit line on the site is the footer copyright.
- **Meets minimum viable record:** No. Two required things are missing: coordinates, which need geocoding from the recorded address, and an age range on any programme, which the zoo does not publish.
- **Confidence:** High on prices, capacity, booking route and accessibility, all of which are stated plainly and were confirmed live. Medium on hours, which their own pages disagree about.
- **Recommended follow up by phone or email** (bugs@victoriabugzoo.ca or 250-384-2847), in the order a daycare director would want them:
  1. Youngest age. Is there a floor for a group visit or an outreach session, and what do they suggest for two and three year olds.
  2. Price. Confirm the 10 per cent group discount against the current admission prices, and confirm the mileage charge for your address.
  3. Capacity and timing. How many 12 child slots they will sell you back to back, and how long the whole thing will take for a class of 24.
  4. Lead time for a zoo visit as opposed to an outreach, which is not published.
  5. Lunch. Where a group can eat, given food is not allowed inside.
  6. Washrooms. The only one is shared with Nootka Court and is not wheelchair accessible.
  7. Bus parking or a drop off point on Courtney Street.
  8. Which set of opening hours is current.

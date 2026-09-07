VERIFICATION - Ocean River Sports, Victoria Harbour Paddle Shack (450 Swift St, Victoria)

- Fields checked: 63 venue and program fields with a non-null value, plus 4 images and 5 evidence quotes.
- Fields corrected: 2
  - venue.website kept as www.oceanriver.com, which redirects to shop.oceanriver.com. The redirect target is the same company's own store, so it was followed rather than treated as a different site.
  - programs[harbour-kayak-tour].days_offered set to all seven days on the strength of "Daily year-round at 1:30 PM" rather than left null.
- Fields set to null after review: 4
  - age_min_years, age_max_years and age_basis on every tour. The site publishes a child price band for ages 10 to 12, which is a price band and not a stated participant range. Recording 10 to 12 as the tour's age range would have said adults cannot come, and recording 10 as a minimum would have invented a rule the site does not state. The 10 to 12 band is recorded in extra_fees_note and flagged in gaps instead.
  - venue.seasonal_notes, because two of their pages contradict each other about whether rentals are running and neither is dated. The contradiction is recorded as a conflict instead.
- Conflicts recorded: 1 (whether boat rentals at the downtown dock are open now: the tours page says available from May 1st onwards, the contact page says closed until spring, and the home page was advertising a rental discount).
- Prices re-read live: yes. The whole tours and rentals page was re-fetched with the cache bypassed on 2026-09-03 and every figure matched what was first recorded. Adult $99 and child $59 for the harbour tour, adult $115 and child $69 for the sunset tour, adult $99 and child $59 for the paddleboard tour. All are per person, not per group, and no group price is published anywhere.
- Per person versus per group: checked on every price. The three tour prices are per person and are recorded in cost_per_child_cad and cost_per_adult_cad. The private tour and the group trip have no published price at all. Rental prices are per boat per hour, so they were deliberately not recorded as a program cost and are noted in gaps instead.
- Authored fields written: what_children_do, our_note and practical_summary on all five programs.
  - what_children_do rests on the tour descriptions (paddling out from the dock, spotting seals, eagles and seaplanes, guides giving commentary) and on the paddleboard tour's "learn to SUP while exploring".
  - our_note rests on the 2.5 hour length, on their own advice that families with children should take a private tour, on the child price band starting at 10, on sunset start times not being published, and on group prices being quoted case by case.
  - practical_summary rests on the absence of any washroom, changing or eating information for the dock, and on their own description of parking at the bottom of Swift Street as very limited.
- Evidence quotes: all five re-checked against a live, cache-busted read of the tours page on 2026-09-03 and found word for word, with no ellipses and all under 25 words.
- Images: 4, all on the store's own Shopify CDN, all confirmed present on the page recorded in found_on_url, all https with query strings stripped and still resolving. Every alt was written after opening the image and looking at it, so all four are marked generated. No captions existed and none were written. No rights_note recorded; the site carries only a footer copyright line. The Open Graph image on every page is the Ocean River wordmark rather than a photograph, so the hero is the dock photo from the contact page and that choice is noted in gaps.
- Location: the contact page's map link for the downtown location carries the marker coordinates, so geo_source is site_embed rather than a geocode. The point lands on the upper harbour at the foot of Swift Street, which matches the published address.
- Meets minimum viable record: no. Missing a program with a published age or grade range. Everything else is present, including address, coordinates, a hero image with alt, costs and our_note.
- Confidence: high on the tour prices, times and durations, which are plainly published and were confirmed on a live re-read. Low on anything to do with children under 10, because the site publishes no minimum age and no policy for younger children.
- Recommended follow up by phone or email (adventure@oceanriver.com, 250 381 4233):
  1. Is there a minimum age for the harbour tours, and can children under 10 go out at all. This is the question that decides whether a daycare group can use them.
  2. Price for a school or group trip, and what the education and non-profit rate actually is.
  3. Maximum group size in one booking and how many adults must come with the children.
  4. How far ahead a group trip has to be booked, and the cancellation terms if the weather turns.
  5. Washrooms, somewhere to change and somewhere dry to eat at the Swift Street dock.
  6. Whether a coach can set down near the dock, given that parking there is described as very limited.

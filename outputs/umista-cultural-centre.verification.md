# umista-cultural-centre.json

VERIFICATION

- **Fields checked:** 58 (33 venue fields, every non-null field on all four programs re-read against its `source_url`, and both image entries re-read against the page they were found on). The Cultural Tours page was re-fetched cold on a second URL form after the record was written, and all six load-bearing strings were confirmed present character for character.

- **Fields corrected:** 4
  - `programs[weekly-drop-in-tour].cost_per_child_cad`: null -> 20, and `cost_per_adult_cad`: null -> 20. The page says "$20 per person", which is a per-person price and not a per-group fee, so both sides of the per-person price are recorded rather than one. `extra_fees_note` carries the part that catches people out, that the $20 does not include admission.
  - `venue.general_admission_child_cad`: 15 -> 5. The $15 is the adult price. The child figure recorded is the $5 youth rate for ages 8 to 18. Because children under 8 are free, the $5 is only half the story and the whole band is written out in `extra_fees_note` on the self-guided visit and in gaps.
  - `programs[self-guided-visit].days_offered`: [1,2,3,4,5] -> null. Their pages disagree about which days the centre is open, so a weekday array would have asserted one side of an unsettled question. The Monday to Friday wording from the contact page is kept in the venue opening times, and the disagreement is recorded as a conflict.
  - `programs[dance-group-performance].format`: ["guided"] -> null. A dance performance the group watches is not a guided tour, hands-on, interactive or self-guided. Nothing in the closed list fits, so it is left blank rather than forced.

- **Fields set to null after review:** 5
  - `venue.has_washrooms`, `venue.has_lunch_space`, `venue.has_rain_backup` — the site does not mention any of them. Nothing was inferred from the building being a museum.
  - `venue.wheelchair_accessible`, `venue.stroller_accessible`, `venue.bus_parking` — no accessibility, parking or directions page exists on the site. `facility_notes` is null for the same reason, since there is no text to quote.
  - `venue.restrictions` — nothing on the site states a rule for visitors. The island and ferry access that decides whether a group can come at all is not stated on the site in any form, so it is recorded as a gap rather than invented as a restriction. The only trace is a directions map graphic with no accompanying text.
  - `programs[weekly-drop-in-tour].what_children_do` — the page gives the price, the day, the hour and the first come first served rule, but never describes what happens on the tour. Rather than imagine a plausible hour, it is left blank.
  - `venue.price_year_or_season` — the admission list carries no year or season, and the drop-in tour dates carry no year either. Both are noted in gaps instead.

- **Price checks in detail.** No school or per-student price exists anywhere on this site, so `school_rate_only` is false on all four programs, which is the honest answer rather than a default: nothing here is written for schools or districts. The $20 drop-in tour is explicitly per person and is recorded that way, not as a group fee. The private guided tour has no published price at all and every cost field on it is null. A site search for "student rate", "group rate" and "field trip" returned zero results, and the only two hits for "school group" were blog posts about a music and art festival, not a school offering.

- **Conflicts recorded:** 1. The contact page and the homepage both say Monday to Friday, 9:00 am to 5:00 pm, and neither carries a date. The post about the current exhibit, dated 2024-11-21, says open 7 days a week, 9 to 5. The two undated standing pages agree with each other, so their value is what is recorded in the opening times, and the weekday pattern on the programs is left blank. This is not a trivia point: the drop-in tour is advertised for Saturdays and the dance performances for Saturday afternoons, both of which fall outside the weekday hours the same site publishes.

- **Authored fields written:** all three, on all four programs, except `what_children_do` on the drop-in tour where the site describes no activity.
  - `what_children_do` rests on the About Us description of the permanent collection and exhibits, the Cultural Tours description of a private tour, the totem pole talks and artist demonstrations, and the Tʼsasała page description of the dances in the Big House.
  - `our_note` rests on the complete absence of any published tour price, the under-8 free and 8 to 18 at $5 admission band, the first come first served rule on the drop-in tour, the July and August only season for the performances, and the fact that the Big House is a separate building from the centre.
  - `practical_summary` is generated from what is published, the address, the phone number, the tourism coordinator's address and the admission prices, against the washroom, lunch, group size, chaperone, accessibility and tour price gaps.

- **Image checks.** The Open Graph image on every page is the U'mista wordmark logo, not a photograph, so it was skipped and the reason recorded in gaps. The homepage banner photograph is a CSS background with no alt text, and no browser was available in this run to view it, so it was not recorded rather than given an alt that could not rest on seeing the image. The two images recorded are photographs of the Potlatch Collection on the collection history page, both carrying the site's own non-empty alt text, both served from the site's own Shopify CDN, both confirmed present in the markup of the page recorded as `found_on_url`, and both rewritten to absolute https. No caption was written and no rights note was recorded, since the collection history page carries no per-photo credit line. One hero exists.

- **Meets minimum viable record:** no. Two things are missing.
  1. `venue.lat` and `venue.lng`. No coordinates are published on the site, there is no map embed with coordinates and no JSON-LD address block, and no geocoding service was available in this run. The full street address is captured and `geo_source` is `geocode_pending` for a later backfill pass.
  2. No program clears the program bar, because the site publishes no age or grade range for anything, so `age_basis` is null on all four. The self-guided visit and the drop-in tour otherwise clear it, with an id, a name, `comes_to_you`, a cost and `our_note`. The private guided tour, which is the offering a director actually wants, also has no cost field at all.

- **Confidence:** medium. Everything recorded is plainly stated on the venue's own pages and the site fetches cleanly without JavaScript, so nothing here is uncertain; what holds the record back is that the centre publishes no school offering, no group rate and no tour price, so the most important numbers for a director simply do not exist on the site.

- **Recommended follow up by phone or email** (Tourism Coordinator brooke.willie@umista.ca for tours, info@umista.ca or 250-974-5403 for everything else):
  1. Price — what does a private guided tour cost, and is it quoted per child or for the whole group? Is there any school or daycare rate, and does the $20 drop-in tour charge children the same as adults?
  2. Youngest age — is there a minimum age for a guided tour, and do they take preschool groups at all?
  3. Capacity — how many children can be in the galleries at once, and how many on one tour?
  4. Lead time — how much notice does a private tour need, and does it have to be a weekday?
  5. Opening days — are they open Saturdays, given the Saturday tour and the summer performances?
  6. Lunch space — is there anywhere a group can eat, indoors or outdoors, or should the group plan to eat elsewhere?
  7. Washrooms — are there any on site, and is there a change table?
  8. Rain backup — the totem pole talks and artist demonstrations are outside, so what happens to them in bad weather?
  9. Getting there — Alert Bay is on Cormorant Island and nothing on the site covers travel, so ask what they advise for a group arriving by ferry and where a bus can park.

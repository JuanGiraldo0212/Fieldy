# VERIFICATION: Horticulture Centre of the Pacific

- **Fields checked:** 74 (venue block 33, twelve programs spot checked against their source pages, 3 images, coordinates)

- **Fields corrected:** 6
  - `venue.general_admission_adult_cad`: 16 -> 17. A fetched copy of the hours and admission page served an older price table. The live page in a browser shows $17.00.
  - `self-guided-garden-visit.cost_per_adult_cad`: 16 -> 17. Same cause.
  - `self-guided-garden-visit.extra_fees_note`: senior/student $12.00 -> $13.00 and member's guest $9.00 -> $11.00. Same cause.
  - `self-guided-garden-visit.description`: admission figures rewritten to the live prices.
  - `master-gardener-guided-tour.booking_email`: null -> events@hcp.ca, read from the contact page in a browser where the Cloudflare protected addresses resolve.
  - `master-gardener-guided-tour.booking_method`: null -> email, for the same reason.

- **Fields set to null after review:** 3
  - `venue.has_lunch_space` stays null. The only lunch text is "pack a picnic and find a shady nook", which is outdoors and not a lunch room.
  - `venue.has_rain_backup` stays null. The only shelter described is the lower classroom portable, and it is described inside a listing for one specific children's program rather than as a general facility. The hours page also says the Gardens may close in inclement weather.
  - Program cost fields on all ten school and outreach programs stay null. The schools page says only that program fees include entrance into the gardens and never gives a figure.

- **Deliberately not carried across:** the home learner page prices ($90 for Garden Creatures, $115 for Our Food Web) sit against the same program names but are for multi week home learner series with published dates, not for a class visit. Recording them as school program prices would have been the per group and per child mix up this pipeline is prone to.

- **Prices re-confirmed live:** the Master Gardener tour rates were re-read in a browser after the JSON was written. $150.00 covers 6 to 12 people with one guide and $360.00 covers 13 to 24 with two guides. Both are flat group rates and are recorded as `cost_per_group_cad` with the base case at 150, not per participant.

- **Conflicts recorded:** 0. No two pages on this site contradicted each other. The one price discrepancy was between a cached copy and the live page, which is a retrieval problem rather than a disagreement between their pages, so it is recorded in gaps.

- **Authored fields written:** `what_children_do`, `our_note` and `practical_summary` on all twelve programs.
  - `what_children_do` rests on the program descriptions on the schools page, the garden list on the gardens page and the tour description on the tours page.
  - `our_note` rests on the 1.5 hour program length, the published grade ranges, the flat group tour pricing, the free admission for under 16s, and the absence of any school program price.
  - `practical_summary` rests on the accessibility line about pathways, the bus drop off rule, the classroom portable washroom line and the gaps list.

- **Location:** `geo_source` is `site_embed`. The contact page carries a Google Maps embed for The Gardens at HCP containing `!3d48.50210192264624!2d-123.414203622768`, recorded to 5 decimal places. No pin was hand placed.

- **Images:** 3 entries, all on hcp.ca, all confirmed present on the page recorded in `found_on_url`. None of them carry alt text on the site, so all three alts are `generated` and each was written after opening the image in a browser and looking at it. No captions were invented and no rights notes were recorded, because the site carries only a footer copyright line.

- **Meets minimum viable record:** no. Every required venue field and the hero image are present, but no program has both a published age or grade range and a published cost. The seven named school programs publish grade ranges with no price. The Master Gardener tour publishes a price with no age range. The missing required field is a program cost.

- **Confidence:** high on what is recorded, because the school programs, admission, hours, accessibility and tour pricing were all read directly and the prices were re-checked live. The gap is that HCP publishes no school program fee at all.

- **Recommended follow up by phone or email** (youthprograms@hcp.ca or 250-479-6162), in priority order:
  1. Price for a school or daycare class visit, and whether it is per child or per class.
  2. Price of the optional 30 minute self guided add on.
  3. Youngest age they will take for a booked program, and whether a group of three and four year olds is welcome.
  4. Maximum and minimum group size for a school program.
  5. How much notice they need, and how far ahead the spring dates fill.
  6. How many adults must come, and whether accompanying adults pay admission.
  7. Whether a visiting group can use the classroom portable washrooms, and whether there is anywhere to eat lunch out of the rain.
  8. What happens to a booking if the Gardens close for weather.

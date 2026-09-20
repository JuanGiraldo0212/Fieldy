# tofino-sea-kayaking-co.json

VERIFICATION

- **Fields checked:** about 180. Every non-null venue field (21 fields plus 10 restriction strings and 2 facility notes), every non-null field on all 5 programs, and all 5 image entries. Each program's `source_url` was re-fetched cold and every evidence quote, price, duration, age rule, cancellation line, fee line and image URL was matched against the re-fetched HTML by exact string comparison. All matched.

- **Fields corrected:** 3
  - `venue.name`: "Tofino Sea Kayaking Co." -> "Tofino Sea Kayaking" — the site, the page titles and the footer all use the name without "Co.". The tracker's version is kept in the file name only.
  - `venue.geo_source`: `geocode_pending` -> `site_embed`, with `lat` 49.15395 and `lng` -125.91074. **Worth the orchestrator's attention:** the run instruction said to leave the coordinates null because no geocoding service is available, but none was needed. The contact page embeds a Google map anchored to the place "Tofino Sea Kayaking", and the embed URL carries the coordinates directly (`!2d-125.91073502323047!3d49.153950079861175`). That is preference 1 in STEP 2c, an on-domain published fact, not a geocode and not a hand-placed pin. Rounded to 5 decimal places. If the orchestrator wants this record uniform with the rest of the batch, set `lat`/`lng` back to null and `geo_source` to `geocode_pending`; the address is captured either way.
  - `private-family-tour.age_max_years`: 12 -> null. The family tours page says the tours are designed so "kids from 9 to 12yrs old can participate", and the questions section further down the same page says "Family private tours are perfect for younger kids 9 to14yrs old." The page contradicts itself and neither statement is dated, so the top age is left blank and recorded as a conflict instead. The bottom age of 9 is the same in both, so `age_min_years` stands.

- **Fields set to null after review:** 16
  - `hosts_school_groups` — the site never uses the words school, class, student or teacher anywhere. It sells public day tours and private tours to any group. Silence is null, not false.
  - `has_washrooms`, `has_lunch_space`, `has_rain_backup`, `bus_parking`, `stroller_accessible`, `wheelchair_accessible` — none of these is addressed on any page. The parking text and the "we do not cancel for rain" line are kept verbatim in the facility notes, but neither answers the yes or no question, so both flags stay blank.
  - `tax_included` on all four day tours — only the private tour pricing table says tax is excluded. The day tour pages mark their prices with a footnote about the tribal park fee and say nothing about GST, so tax on those prices is unknown rather than excluded. It is set false on the private tour only, where the page says so.
  - `price_year_or_season` — none of the tour pages labels its prices with a year or a season.
  - `lead_time_days` — the tours page says "Reservations are recommended!" which is a recommendation, not a minimum notice.
  - `time_slots` — the harbour tour mentions morning and evening departures but publishes no clock times, and the live times sit inside a booking widget a plain fetch cannot run.
  - `months_offered`, `days_offered` — no season and no operating days are published. Flagged with the word unknown in gaps, since a blank otherwise reads as year round.
  - `adults_free`, `payment_timing`, `deposit_required` — not addressed anywhere.
  - `venue.booking_email` — every tour page shows the address through the site's email protection script, which renders as a placeholder to a fetch. The phone number and the online booking page are recorded instead.

- **Conflicts recorded:** 2
  1. The top age for a private family tour, 12 in one place and 14 in another.
  2. The tribal park fee added to the tour price, 1% on all four day tour pages and 1.5% in the private tour pricing table.

- **Authored fields written:** all three, on all five programs.
  - `what_children_do` rests on the shore lesson described on every tour page ("teach you how to paddle, steer the kayak and how to get out of the boat"), each tour's own route description, and the rule that anyone under 16 rides in the front of a double. For the family tour it rests on that page's own account of children grabbing kelp and looking at the creatures on the tidal rocks while the adult does most of the paddling.
  - `our_note` rests on the refund policy (tours run in rain, cloud and fog), the physical activity warning about uneven and slippery terrain, carrying kayaks and stairs, the six hour cap on downtown pay parking, the one adult per child under 16 rule, and the page's own contradiction about the family tour age. The remark about briefing time on the harbour tour rests on a customer review published on the venue's own homepage, which is identified as such rather than presented as the venue's statement.
  - `practical_summary` is generated from the published address, prices and parking against the washroom, lunch, shelter and bus parking gaps.

- **Meets minimum viable record:** yes. Venue id, name, address, lat, lng, category and checked date are all set, there is one hero image with alt text taken verbatim from the site, and all five programs carry an id, a name, `age_basis` with the published age, whether it comes to you, a cost figure and an our note. The schema validator returns OK with no warnings.

- **Confidence:** high. Prices, durations, the minimum age and the address are stated in plain text on the venue's own pages and every one was matched word for word against a second cold fetch. The reservations are that the four longer tour pages were last updated in January and February 2025 and carry no price year, so the fares may be a season behind, and that the site has no group or school facing content at all, so everything a director needs about washrooms, lunch and bus access has to come from a phone call.

- **Fit for the audience, stated plainly:** this venue does not take daycare groups, and that is published, not inferred. Public day tours start at 13 and the only offering below that is a private family tour for children from 9, where every child under 16 needs an adult in the same double kayak. It is a high school outing, or a nine and up outing at one adult per child. `hosts_daycare_groups` is set false on that published minimum, and `youngest_age_welcomed_years` is 9.

- **Recommended follow up by phone** (250) 725-4222, or through the booking page at tofinoseakayaking.com/reservations:
  1. Price — is the published fare current for this season, is GST on top of the day tour price as well as the private one, and is the tribal park fee 1% or 1.5%?
  2. Youngest age — is the top age for a family tour 12 or 14, and will they take a school or youth group at all?
  3. Capacity — is twelve with two guides a hard ceiling, and can two private tours run back to back for a larger class?
  4. Lead time — how far ahead does a private tour need to be booked, and how much is due at booking?
  5. Lunch space — is there anywhere a group can eat before or after, given the coffeehouse is a working cafe?
  6. Washrooms — are there any at the booking centre, and is there anywhere to change out of wet clothes?
  7. Rain backup — there is none, so ask what conditions actually cancel a tour and what happens to the money if you cancel first.
  8. Parking — where does a bus or a van drop off and wait, given downtown meters cap at six hours.

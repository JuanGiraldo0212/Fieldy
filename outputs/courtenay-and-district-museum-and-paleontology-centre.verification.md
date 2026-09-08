# VERIFICATION — courtenay-and-district-museum-and-paleontology-centre

- **Fields checked:** 483 (33 venue, 9 programs at 46 fields each, 2 image blocks, 2 conflicts)
- **Fields corrected:** 12

  The important ones first. **A plain fetch of this site returned an out-of-date copy of the education programs page.** Every school programme price on it was wrong, and it listed a programme that no longer exists. All of the following were corrected against the live DOM in a browser:

  - `programs[school-fossil-program-museum].cost_per_group_cad`: `120` -> `150`
  - `programs[school-geology-program-museum].cost_per_group_cad`: `120` -> `150`
  - `programs[school-early-settlement-program].cost_per_group_cad`: `120` -> `150`
  - `programs[school-general-museum-tour].cost_per_group_cad`: `120` -> `150`
  - `programs[school-fossil-program-river].cost_per_group_cad`: `155` -> `180`
  - `programs[school-geology-program-field].cost_per_group_cad`: `155` -> `180`
  - `programs[zoom-classroom-session].cost_per_group_cad`: `120` -> `150`
  - combined A+B figure in the fees notes: `215` -> `250` (four programs)
  - `tax_included` on all seven school programmes: `false` -> `null`. The stale copy showed "+ GST"; the live page shows a bare figure with no tax line at all, so tax treatment is now unstated.
  - **Programme dropped entirely:** "Courtenay Riverway Walk", $140 + GST, maximum 30. It appears in the fetched copy and is absent from the live page. Not recorded.
  - `venue.lat` / `venue.lng` and `geo_source`: `site_embed` at `49.69220978, -125.00032118` -> `geocoded` at `49.69215, -124.99838`. **The Google Maps embed on their directions page carries only `!2d`/`!3d`, the map viewport centre.** There is no `!3d…!4d…` place pin, and the page's JSON-LD is a WebPage block with no GeoCoordinates. The viewport centre sits about 210 m west of the building. The recorded point comes from geocoding 207 Fourth Street and matches a named place record for the museum.
  - `venue.name`: `...Paleontology Centre` (tracker) -> `...Palaeontology Centre`, the spelling the museum uses.

- **Fields set to null after review:** 6
  - **Age and grade ranges on every programme.** The fossil tour prices "Children (4-16)" with "Children under 4: Free". That is a price band, not an eligibility band, and reading it as ages 4 to 16 would tell a director with three-year-olds she cannot come when the site says the opposite. No programme anywhere on this site publishes an age or grade range. The under-4 rule is carried in the fees note and in `our_note` instead.
  - `venue.price_year_or_season` — no year or season is printed against any price.
  - `lead_time_days` on all nine — the fossil tour says pre-booking is required, which is not a minimum notice.
  - `duration_min` on Fossil A, Fossil B, Geology A and Geology B — not stated. Kept only where published: 180 for the fossil tours (9am to 12:00, 1:00 to 4:00), 90 for Early Colonial Settlement ("an hour and a half long program"), 60 for the General Tour (published as a 1 to 1.5 hour range, minimum recorded, range put in the description) and 60 for the Zoom sessions.
  - `venue.has_washrooms`, `has_lunch_space`, `has_rain_backup`, `stroller_accessible`, `wheelchair_accessible`, `bus_parking` and `facility_notes` — the site has no accessibility or plan-your-visit page covering any of this. Their "Plan Your Visit" page is about hotels and restaurants.
  - `general_admission_child_cad` / `general_admission_adult_cad` — **"Admission to the museum is by donation."** That is neither free nor a price, so both stay null, `is_free` stays null, and the donation wording is carried in text rather than in a number.

- **Per-group versus per-child — the inference, stated plainly:** the education programmes page prints a bare figure followed by a maximum, for example `$150.00 (Maximum 30 persons)`. **It never uses the words per class, per group, per person or per student.** These were recorded as `cost_per_group_cad`, a flat price for the whole group, because a per-student reading would put a class of 30 at $4,500 and the same page prices a three-hour public tour with a guide at $47.25 a head. That reasoning is sound but it is a reading, not a quote, and it is flagged as the first line of the gaps list so a director sees it. At a class of 22 the difference between the two readings is roughly $3,150. The fossil tour page, by contrast, is unambiguous: it labels Adults, Children and Family separately, so those are recorded per person.

- **Capacity check:** every "Maximum 30" is a per-booking ceiling, not a minimum group size. `capacity_min` is null throughout. The private group fossil tour's "up to 15 adults" is recorded as `capacity_max` 15, with the point that the site never says how children count against it flagged in the fees note and `our_note`.

- **`school_rate_only`:** true on all seven education and Zoom programmes. The page is titled "Education Programs", the copy says "Bring your class", "students" and "the group must provide its own transportation... by parent, car pool or bus". False on both fossil tours, which are priced for the public.

- **Conflicts recorded:** 2, both about a price that has been shown two ways on the same page, and both written for a director rather than as a note about caching. Their `sources` array carries the single URL because the disagreement is between two versions of one page, not between two pages.

- **Authored fields written:** `what_children_do`, `our_note`, `practical_summary` on all nine programmes.
  - The fossil tour accounts rest on "Hammers, chisels and goggles will be supplied", "an easy 5 minute forested walk", "a short 10 minute drive", "participants will have a chance to find a fossil of their very own" and "You will require your own transportation to the fossil site."
  - Fossil B rests on "Students are taken to the Puntledge River... students will search for fossils in the shale."
  - Geology B rests on "Participants will travel to a geologically significant site at Comox Lake" and the transport sentence.
  - Early Colonial Settlement rests on "a slide show introduction... a tour of the exhibits and an interactive session with artifacts and an activity" and "Clothing, tools, food, education, housekeeping and entertainment... examined through many hands-on experiences."
  - Zoom rests on "students will then tour the palaeontology exhibits through Zoom, have the opportunity to study fossil specimens up-close and to ask questions."
  - Every `practical_summary` is generated from the facility fields (all null here) plus the gaps list, which is why each of them names what is missing.

- **Mood tags:** judged on what the children actually do. `play` plus `learn` where they hold the tools (both fossil tours, Fossil B, Geology A's hands-on activities, Early Colonial Settlement's artifact handling). `explore` plus `learn` where they look and walk (Fossil A in the galleries, Geology B examining rocks at the lake, the General Tour). `learn` alone for the Zoom sessions, where they watch a screen.

- **Meets minimum viable record:** no. Missing a programme with `age_basis` plus a published range, and that is the only thing missing. Everything else is present and unusually complete for this catalogue: nine programmes, seven with a firm price and a capacity, four with a duration, two with exact start times and weekdays, plus cancellation terms, payment timing, a member discount and a named booking contact. The venue block has id, name, address, lat, lng, category, checked_on and a hero image with alt.

- **Confidence:** high on everything read from the live browser, which is all of the prices, capacities, times and terms. The one soft spot is the per-group reading described above, which is flagged rather than hidden.

- **Images:** the site's og:image is the museum logo, not a photograph, so it was skipped and the point is in gaps. The hero is the river photograph from the home page, which is the fossil site the tours go to; the site publishes no exterior photograph of the building. The second image is the fossil banner from the Zoom programmes page. Both confirmed present on the `found_on_url` recorded, both on the museum's own WordPress uploads path, both https. Neither carries an alt attribute, so both alts are `generated`, written after opening each image file in a browser and looking at it. No captions were invented and no rights notes were taken from the footer copyright line. The fossil tour page carries no images at all.

## Recommended follow up by phone or email, in priority order

1. **Price** — confirm in writing that $150 and $180 are for the whole group up to 30, not per student, and whether tax is on top. This is the single highest-value question on the record.
2. **Youngest age** for each programme, and whether the under-4s who come free on the public fossil tour are welcome on the school field trips.
3. **Capacity** — the Zoom sessions and the group programmes route publish none.
4. **Lead time** — how far ahead each programme needs to be booked.
5. **Transport for Fossil B** — who arranges the ride to the Puntledge River. Geology B says the group does; Fossil B is silent.
6. **Lunch space** — nothing on the site, and a three-hour fossil tour ends at a river.
7. **Washrooms** — nothing published, at the museum or at the river site.
8. **Rain backup** — the museum says spring and autumn tours are weather dependent but not what happens if a booked date is rained off.
9. **Bus parking** at 207 Fourth Street in downtown Courtenay.
10. **How many adults** they want with a group of 30. No ratio is published anywhere.

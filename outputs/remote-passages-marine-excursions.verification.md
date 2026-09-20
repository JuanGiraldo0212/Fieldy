# remote-passages-marine-excursions.json

VERIFICATION

- **Fields checked:** 118 (33 venue fields, every non-null field on all 7 programs re-read against its own `source_url`, all 5 image entries, and 32 verbatim strings from the venue block, restrictions, fee notes and cancellation notes re-matched word for word against the fetched pages). All 7 program `evidence` quotes matched their source page exactly, contiguous and under 25 words. All 5 image URLs and all 5 `alt` values were confirmed present in the markup of the `found_on_url` recorded.

- **Fields corrected:** 4
  - `programs[whale-watching].age_min_years`: one program at 3 -> split into two programs, `whale-watching-zodiac` at 5 and `whale-watching-cabin` at 3. The rate table publishes two rows with two different child brackets for the same tour, 5 to 12 on the Zodiac and 3 to 12 on the cabin vessel, and the vessels page states the cabin boat is the one suitable from age 3. A single record would have told a daycare either the wrong minimum or the wrong boat, so the offerings are recorded separately and the disagreement is also carried in `conflicts`.
  - `programs[*].chaperone_ratio`: `{"children_per_adult": 6}` -> null. The 6 to 1 figure on the kayak page is a paddlers to guide ratio, which is the operator's own staffing, not a requirement for how many adults a group must bring. It is kept in the sea kayaking descriptions instead.
  - `programs[hot-springs-day-trip].capacity_max`: 6 -> null, with 6 moved to `capacity_min`. "Requires a minimum of 6 to launch" is a floor, not a ceiling, and this is the error STEP 3 specifically warns about.
  - `programs[meares-island-big-tree-trail].cost_per_child_cad`: was recorded with an assumed 3 to 12 bracket copied from the whale table; the bracket was dropped and `age_min_years` left null, because the Meares rate table says only "Children" with no ages attached.

- **Fields set to null after review:** 6
  - `venue.has_lunch_space` — the boathouse is described as having reception, a dress-in area, restrooms and hot drinks after outings, but no eating space. The Hot Springs page tells you to pack food and carry it, which is not a lunch room. Inferring one from "hot drinks" would have been exactly the kind of guess the brief rules out.
  - `venue.has_rain_backup` — float suits, Helly Hansen jackets, hats and gloves are issued, but that is gear for going out in weather, not an indoor alternative. Nothing on the site says what happens if a group cannot sail.
  - `venue.bus_parking` — the site says free parking for cars, twice, and never mentions a bus or coach. The two verbatim lines are kept in `facility_notes.bus_parking`; the flag stays null rather than false, since the site is silent rather than refusing.
  - `venue.wheelchair_accessible` and `venue.stroller_accessible` — not addressed anywhere on the site.
  - `programs[whale-watching-*].months_offered` and `programs[bear-watching-zodiac].months_offered` — the whale page publishes when the animals are present, not when the tours run, and the bear page publishes no season at all. Both are null with `unknown` recorded against months in `gaps`. The kayak and Meares tours do publish April to October on their own pages, so those keep their arrays.
  - `venue.booking_email` — the address on the contact page is scrambled by JavaScript in the page source and cannot be read. The two phone numbers are in plain text and are recorded.

- **Conflicts recorded:** 2
  - The operating season. The about page claims February to November; the booking request form on the contact page only accepts dates from April 1 to October 15.
  - The youngest child accepted on the whale tour, which depends on which vessel you are given: 5 on the open Zodiac, 3 on the covered cabin boat.

- **Authored fields written:** all three, on all 7 programs.
  - `what_children_do` rests on the physical detail the site actually gives: padded seats with backrests and issued Mustang all weather suits on the Zodiacs, the heated cabin with glass all round and the back deck on the Star Light, the land based paddling lesson before a kayak trip, the 2 km boardwalk carried food and water at Hot Springs Cove, and the ten minute water taxi and rustic boardwalk on Meares Island.
  - `our_note` rests on the gaps a director will hit: the age 5 child fare on the Zodiac against age 3 on the cabin vessel, the 12 passenger ceiling on every boat, the bear tour departure time moving with the tide, the unpublished size of the group discount, the full adult price for children on the Hot Springs trip, and the FAQ naming a For Families paddle that does not appear in the rate table.
  - `practical_summary` is generated from the boathouse restrooms and free car parking that are published, against the lunch space, bus parking and wet weather gaps.

- **Meets minimum viable record:** yes. Venue has `id`, `name`, `address`, `lat`, `lng`, `category`, `checked_on` and a `hero` image with `alt`. Six of the seven programs carry `id`, `name`, `age_basis` with the published range, `comes_to_you`, a cost field and `our_note`; the two Zodiac whale and bear tours and the cabin whale tour are the strongest.
  - **One deviation from the run instructions, flagged for the orchestrator.** The brief said to leave `lat`/`lng` null and set `geo_source` to `geocode_pending` because no geocoding service was available. No geocoding was needed: the Getting Here page publishes a Google Maps iframe centred on their own place name, `!2d-125.90981572396413!3d49.15466817137384 ... !2sRemote%20Passages%20Marine%20Excursions`. That is STEP 2c option 1, `site_embed`, which the spec ranks above geocoding as an on domain fact, so the coordinates are read off the venue's own page rather than placed by hand. `geo_source` is `site_embed`. If the orchestrator wants the whole batch uniform, blank the two numbers and set `geocode_pending`; the address is recorded either way.
  - Two programs fall short of the program bar on age: `hot-springs-day-trip` and `sea-kayaking-islands` have `age_basis` null because the site publishes no age for either. Both are kept because they are real bookable offerings and a director needs to see they exist.

- **Confidence:** medium-high. Prices, durations, fees, capacities, the address and the cancellation terms are published in plain tables on the venue's own pages and all verified word for word, but the site is written for holidaying families and never uses the words school, daycare, class or group rate amount, so the group-facing half of the record is inference-free and therefore thin.

- **Recommended follow up by phone or email** (250-725-3330 or toll free 1-800-666-9833; the email address on their contact page cannot be read from the page source, and parties of 6 or more are asked to phone anyway):
  1. **Price** — what is the group discount for a party of 6 or more actually worth, does it apply to the child fare or only the adult fare, and is there a daycare or school rate at all?
  2. **Youngest age** — will they take three and four year olds, and is the cabin vessel Star Light guaranteed if you book a preschool group, or can they substitute a Zodiac?
  3. **Capacity** — can a group larger than 12 be split across two boats on the same departure, and what is the limit on the bear tour and the Hot Springs trip?
  4. **Lead time** — how far ahead does a group of that size need to book, and what notice do they need to cancel for weather?
  5. **Lunch space** — is there anywhere at the boathouse for a group to eat before or after, given the hot springs trip expects you to carry your own food?
  6. **Washrooms** — are the boathouse restrooms open to a waiting group, is there a change table, and is the Star Light the only boat with a washroom aboard?
  7. **Rain backup** — what happens to a booked group if the sailing is cancelled for weather, and how much notice do they get?
  8. **Chaperones** — how many adults do they want with a group of small children, and do accompanying adults pay the full fare?
  9. **Season** — can a group actually book outside the April 1 to October 15 window the booking form allows?

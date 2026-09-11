# VERIFICATION — north-island-wildlife-recovery-centre

- **Fields checked:** 71 (33 venue, 3 programs re-read against their source pages, 4 images, coordinates, conflicts)

- **Fields corrected:** 3
  - `programs[*].cost_per_child_cad`: 6 -> null. First pass carried the published general admission ($6 children 4 to 16, $15 adults) down onto the school and group programs. Both trip planner PDFs say the tour coordinator sends a payment schedule after the request goes in, and free passes and annual memberships are explicitly not valid for booked tours, so the site does not publish what a booked group pays. The join across two pages was an inference, not a quote, and it has been moved into `gaps` with the money named ($270 for 30 children and 6 adults at the published rates).
  - `programs[*].lead_time_days`: 21 -> null. "we recommend booking early—at least three weeks in advance" is a recommendation, not a minimum notice period. Moved into the program description.
  - `venue.booking_email`: wildlife@niwra.org -> tours@niwra.org. The footer address is the wildlife emergency and general inbox; the School Visit Trip Planner footer gives tours@niwra.org for tours.

- **Fields set to null after review:** 6
  - `age_basis`, `age_min_years`, `age_max_years`, `grade_min`, `grade_max` on all three programs. The request form asks which grades are coming; it does not publish a range. The adult ratios ("ages 12 & under", "13+") are supervision rules, not the program's age range.
  - `has_rain_backup`. "Open rain or shine, except in extreme weather" is a policy about cancelling, not a statement that there is somewhere indoors.

- **Conflicts recorded:** 1 — the home page prints admission as "$15+tax" and "$6+tax" while the visit page prints "$15" and "$6". The numbers agree; only the tax wording differs.

- **Authored fields written:**
  - `what_children_do` on all three programs, resting on the gravelled paths and enclosure list from the visit page, "be prepared to walk during the tour", the picnic tables "available for use after your tour", the Field of Stones playground beside the wildlife garden, and the downloadable self-guided map.
  - `our_note` on all three, resting on the 60 to 75 minute tour length, the one adult per five children rule for under 13s, "admission is charged based on the number of children and adults who are present", the minimum group of 15, and the fact that the price only arrives with the payment schedule.
  - `practical_summary` on all three, resting on the Services page (gravelled wheelchair-accessible paths, two loan wheelchairs, washrooms with one baby change station in the Eagle Flight Enclosure building, free parking, picnic and play areas) plus the bus parking line in both trip planners, and the rain gap.

- **Meets minimum viable record:** no. Venue block is complete (address, coordinates, category, hero image with alt). No program clears the bar because neither an age or grade range nor a cost is published anywhere on the site. Both absences are real and are recorded as gaps rather than filled.

- **Confidence:** high on everything the site does publish. Admission, hours, capacity, ratios, facilities, bus parking, payment timing and cancellation were all read twice, and admission, "Minimum 15 to maximum 45" and both ratio lines were re-read from the live DOM in Chrome rather than from a fetch. Confidence is low only on what a booked group is charged, which the site does not say.

- **Recommended follow up by phone or email** (250-248-8534 ext 3, tours@niwra.org), in priority order:
  1. **Price.** What does a booked school or daycare group actually pay per child and per adult, and is it the $6 and $15 on the admission page or something else? Get it in writing with the payment schedule.
  2. **Youngest age.** Will they take a group of three and four year olds, and does the guided tour work for them?
  3. **Group size.** Fifteen is their minimum. Will they take a smaller daycare room, or does it have to combine with another?
  4. **Notice.** Three weeks is a recommendation. How far ahead do the good dates actually go?
  5. **Rain.** Is there anywhere under cover to shelter or eat, or is the whole visit outdoors?
  6. **Strollers.** How the gravel paths handle a stroller or a wagon.
  7. **Days and times.** Which days and start times are actually offered, since the site only publishes when requests are processed.

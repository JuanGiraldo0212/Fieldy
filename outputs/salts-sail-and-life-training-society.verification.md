# VERIFICATION — SALTS – Sail and Life Training Society

- **Fields checked:** 61 (33 venue, 2 programs at 46 fields each spot checked against source, 4 images, location)
- **Fields corrected:** 0

  Every price, age, capacity and date was re-read live in a browser with the cache bypassed after the first pass. The group trip fees ($38,892.00 plus GST for 5 days, $30,996.00 plus GST for 4 days, Fall 2026 to Spring 2027) and the day sail fee ($125/person) came back identical on the live read, so nothing was stale. The age range 13 to 22 and the season "March to June, September and October" were also re-confirmed live.

- **Fields set to null after review:** 3
  - `lead_time_days` (group trip) — "Group bookings are finalized about one year ahead" is a description of how their calendar works, not a stated minimum notice. Moved to the description.
  - `chaperone_ratio` — the site gives a cap and a composition rule ("Up to four adults may join each trip, including a minimum of one male and one female teacher, leader or chaperone") but never a children-per-adult ratio, which is what the field means.
  - `wheelchair_accessible` — the only accessibility sentence on the site is about the shore office being a heritage building with stairs only. That says nothing about the ships, so it went to gaps rather than into a facility field.

- **Conflicts recorded:** 0

  Two near misses were checked and dismissed. The cost page says each ship takes "18-30 trainees, including both young people and leaders" while the FAQ says "each ship can accommodate 30 trainees" on group trips — these agree, so 30 is the maximum and 18 the minimum. The home page says "1700 young people ages 13-23" across all programmes while the group page says 13 to 22 for group trips specifically; different scopes, not a contradiction, and the narrower group figure is what is recorded.

- **Cost check:** the group figure is emphatically a **whole-ship charter price, not per student**. It is recorded in `cost_per_group_cad` with the per-child field left empty. The day sail fee genuinely is per person and is recorded as such in both the child and adult fields.

- **Capacity check:** 30 is a per-booking maximum and 18 a minimum group size; recorded in the right fields.

- **Authored fields written:** `what_children_do`, `our_note` and `practical_summary` on both programmes.
  - `what_children_do` rests on the group sails page ("setting the sails, navigation, and steering the ship", "Row the ship's dories to local marine parks and beaches"), the FAQ list of what trainees learn ("navigation, sailing terms, parts of the ship, wheel operation, galley chores, line and sail handling, knots"), the FAQ description of the bunks and the dining table in the hold, and, for the day sail, the "What to expect" list including climbing the rigging.
  - `our_note` rests on the charter pricing model, the one-year-ahead booking cycle with returning groups getting first refusal, the free September educator day sail, and on the day sail rules that cap children under 12 and require an adult with each child.
  - `practical_summary` rests on the fee inclusions, the head with sink and toilet in each sleeping area, the "no showers on board" answer, and the absent accessibility and wet weather information.

- **Images:** 4 recorded, all on salts.ca, all confirmed to return HTTP 200 and image/jpeg, all present on the page recorded in `found_on_url`. No image on the site carries usable alt text, so every alt is `generated`; each one was written after opening the image in a browser and looking at it, describing only what is in the frame. No captions were invented. No rights notes recorded — the site prints no credit beside these images and the footer copyright line does not count.

- **Location:** `site_embed`. The contact page embeds a Google map for the office whose URL carries `!2d-123.37245552624033!3d48.43048547643443` against the place "451 Herald St, Victoria, BC V8W 3N8". Recorded to five decimal places. Note the shore office is the geocoded point; group trips actually board at the SALTS dock at Swift Street Landing a short distance away, which is said in the programme text.

- **Meets minimum viable record:** yes.

- **Confidence:** high. The site is plainly written, publishes real numbers with the season they belong to, and every price survived a live cache-bypassed re-read.

- **Recommended follow up by phone or email** (booking@salts.ca, 250-383-6811 ext 109), in priority order:
  1. **Youngest age.** Group trips start at 13. Confirm there is no route in for younger children beyond buying individual berths on a public day sail.
  2. **Price.** The charter fee is fixed, so ask what the realistic per-student figure is at your group size, and ask about the bursaries the site advertises.
  3. **Lead time.** Ask how far ahead you actually need to be on the wait list, and whether any dates have opened up.
  4. **Cancellation.** No cancellation terms for group trips were published; ask what happens if the trip is called off.
  5. **Accessibility.** Nothing is published about getting aboard or moving around the ship with a mobility aid.
  6. **Rain backup.** There is none, by design. Confirm what happens in genuinely bad weather.
  7. **Getting there.** Ask where a coach can drop off and wait at Swift Street Landing.

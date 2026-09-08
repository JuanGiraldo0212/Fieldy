# VERIFICATION — grey-wolf-expeditions

- **Fields checked:** 55 (33 venue, 1 program re-read line by line against its source page, 3 images, 2 conflicts, location)

- **Fields corrected:** 4
  - `programs[0].age_min_years`: 3 -> 5. The frequently asked questions page says "kids ages 3 and up are welcome"; the tour page says "Kids ages 5+ are welcome." The tour page was updated in August 2026 and the questions page in September 2024, so the newer value stands. Both are recorded as a conflict.
  - `venue.youngest_age_welcomed_years`: 3 -> 5, for the same reason.
  - `programs[0].capacity_max`: confirmed at 10 against the booking page, which states it as a hard limit, rather than being left at the softer "8 to 10" wording on the tour page.
  - `venue.price_year_or_season`: null -> "2027 season". The only dates on sale are 2027, which was checked on the live booking page.

- **Fields set to null after review:** 4
  - `programs[0].duration_min` — the trip is 4 days and 3 nights. Putting that in a minutes field would be misleading, so the length is carried in the description instead.
  - `programs[0].capacity_min` — the booking page says solo travellers may have to book for a minimum of two people when the calendar shows no solo space. That is a booking rule tied to availability, not a minimum group size.
  - `programs[0].lead_time_days` — the cancellation page says a spot is held for 24 and no longer than 48 hours after an enquiry. That is a hold, not a minimum notice period.
  - `venue.has_washrooms` / `has_lunch_space` — the camp is described as having a hot shower and a heated covered dining area, but toilets are never mentioned, and eating is part of the all inclusive package rather than a room a group could use. Not inferred from the photographs.

- **Price re-read from the live DOM:** the tour page shows "C$3495 + 5% tax" followed by "Price Per Person." This is a per person figure and is recorded as such against both the child and the adult price, because the site charges everyone the same and publishes no child rate, no group rate and no single supplement. It is **not** a per group price. A party of ten is roughly C$36,700 before tax, which is stated in gaps so nobody reads C$3495 as a class fee.

- **Conflicts recorded:** 2
  1. Youngest age: three and up on one page, five and up on another.
  2. Meeting point: the itinerary says day one starts at their Black Creek office at 8 am; the questions page and the booking page say the trip starts and ends in Campbell River with a free hotel pick up. The two places are about 40 minutes apart, which is why it is worth settling.

- **Authored fields written:** all three.
  - `what_children_do` rests on the day by day itinerary: the two hour truck drive, the boat in, the walk in tents, two to four hours of kayaking a day when weather allows, the roughly 60 minute waterfall hike, shore fishing and the full day boat tour.
  - `our_note` rests on the price, the four day overnight format, the two published minimum ages, and the statement that the camp has no public or street access.
  - `practical_summary` rests on the camp description, the ten person cap from the booking page, and the age disagreement.

- **Meets minimum viable record:** yes. Venue has id, name, address, coordinates, category and date, plus a hero image with alt. The program has id, name, `age_basis` years with a minimum of 5, `comes_to_you` false, a cost, and `our_note`.

- **Confidence:** high. The site is live and current, both key pages were updated in August 2026, the booking page is selling 2027 dates and says 2028 dates open by October 2026, and the price, age, capacity and cancellation terms were all read from the live DOM rather than from a fetched copy.

- **Operating status:** trading. Not closed and not dormant.

- **Minimum age finding:** 5 years, from the tour page. This is why `hosts_daycare_groups` is set to false rather than left unknown: the site gives an age reason, and even the lower of its two published figures, 3, excludes the under threes, while the newer figure of 5 excludes a daycare group almost entirely. `hosts_school_groups` is left unknown, not false, because the site never mentions schools, classes or educational groups at all. Silence is not a refusal.

- **Recommended follow up by phone or email**, in priority order for a daycare director:
  1. **Youngest age** — get the real number, three or five, in writing. It is the difference between eligible and not.
  2. **Price** — confirm the per person figure covers children at the same rate, and what deposit is needed for a booking under the $4000 payment plan threshold.
  3. **Capacity** — ten is a hard cap, so confirm whether accompanying adults count inside that ten.
  4. **Lead time** — no minimum notice is published, and 2027 dates are already partly sold.
  5. **Lunch space and washrooms** — nothing is published about toilet arrangements at the camp, which matters for young children on a three night stay.
  6. **Wet weather** — the camp has a heated covered dining area and a sauna, but the site is frank that guests will be exposed to high winds, rain and stormy weather.

- **Retrieval note:** the site fetches fine, but the booking page returns nothing useful to the page text tool and had to be read through the browser's own text extraction. The Open Graph image on the home page is a stylised paddle graphic rather than a photograph and was deliberately skipped as the hero. Two of the three images had file names in place of alt text; both were opened and looked at before their alt lines were written.

# VERIFICATION - Log Cabin Museum, Saanich Pioneer Society

- **Fields checked:** 47 (whole venue block, the one program, the single image entry, provenance)
- **Fields corrected:** 1
  - `website`: `www.saanichpioneersociety.com` -> `https://www.logcabinmuseum.com`, because the address in our list redirects there and every page on the live site is served from logcabinmuseum.com. Both are the same organisation, so this stays on the venue's own domain.
- **Fields set to null after review:** 4
  - `booking_method`: the contact page offers a phone number and two general email addresses and says to use whichever suits, so there is no single published booking route.
  - `has_lunch_space`: nothing on the site mentions anywhere to eat. Not inferred from the picnic-friendly look of the grounds.
  - `bus_parking`: the parking lot is described as flat and paved with two accessible spots, which says nothing about a bus.
  - `general_admission_child_cad` / `general_admission_adult_cad`: admission is by donation, so there is no published price. A zero here would have been wrong.
- **Conflicts recorded:** 0. The About page mentions the cabin's 1933 site on East Saanich Road in a historical passage, while the Visit page gives 7910 Polo Park as the place to find them. That is one corner, not two answers, so it was not recorded as a disagreement.
- **Authored fields written:**
  - `our_note` rests on the Saturday 1pm to 4pm public hours, the invitation to student classes on the About page, the very small washroom on the Visit page, and the four things the site never states.
  - `practical_summary` rests on the washroom line, the ramp and curb cut description, and the gaps list.
  - `what_children_do` was left empty on purpose. The site never describes what happens on a tour, and inventing a plausible visit for a one room museum would have been a guess.
- **Meets minimum viable record:** no. Missing `lat` and `lng` (no coordinates published anywhere on the site and no geocoder in this run, so `geo_source` is `geocode_pending` and the address is recorded for backfill), and the program has no `age_basis` or range and no cost or `is_free`, because the site publishes none of those for a booked tour.
- **Confidence:** medium. Everything recorded is stated plainly on the venue's own pages and the site rendered fully to a plain fetch, but the group offering itself is one sentence on the About page with no price, age, length or day attached to it.
- **Recommended follow up by phone or email** (250.652.1116 or SaanichPioneerSociety@outlook.com), in priority order:
  1. What a booked group tour costs, given general admission is by donation.
  2. The youngest age they will take, and whether preschool and daycare groups are welcome or only school classes.
  3. How many children they can take at once in a building this size.
  4. Whether tours can run on a weekday, since public opening is Saturday afternoons only.
  5. How much notice they need.
  6. Whether there is anywhere for a group to eat, indoors or outside.
  7. Whether a bus can drop off and park.

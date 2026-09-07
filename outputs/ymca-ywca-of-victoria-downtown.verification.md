# VERIFICATION — YMCA / YWCA of Victoria Downtown

- **Fields checked:** 44 (33 venue, 0 programs, 11 image)

- **Fields corrected:** 1
  - `venue.website`: changed from the bare domain to the branch's own contact page, so this record does not point at the same URL as the other two YMCA-YWCA records.

- **Fields set to null after review:** 4
  - `hosts_school_groups` and `hosts_daycare_groups` — left null rather than false. The site is silent about groups, it does not exclude them. Everything published for children is membership gated, but that is a barrier rather than a stated policy against group visits, so null plus an explicit gap is the honest answer.
  - `has_washrooms` and `has_lunch_space` — a pool implies changerooms, but the site never states either, and inferring facilities from the presence of a pool is exactly the guess the schema is meant to prevent.
  - `facility_notes` — the useful detail here is car parking in the Bay Centre parkade and the after-hours View Street entrance, neither of which maps to a permitted facility note key. Both were moved into `restrictions` and `gaps` verbatim instead of being filed under a key they do not belong to.

- **Programs:** empty array, deliberately. Following the prompt's rule rather than inventing a "Group visit". Checked the child and youth page, the pool and aquatics page, the recreation programs link, the facilities page, and site searches for "school group" and for "birthday rental booking". The last returned no results at all. Everything published for children at this branch is childminding for members with a parent in the building, or drop in and registered activity a child needs their own Y membership to join. There is no group rate, no rental, no booking route and no school offer.

- **Prices re-read live:** not applicable, no price is published for this location.

- **Conflicts recorded:** 0

- **Images:** 1 kept, 1 dropped. The page's own social sharing image is a promotional graphic reading "Find Your Y at the Bay Centre, Opening Spring 2026" rather than a photograph, so it was skipped and the skip is noted in gaps. The hero used instead is the banner from this branch's pool page, opened in the browser and looked at before the alt line was written. No alt on the site, so `alt_source: generated`. `width` and `height` read from the markup attributes.

- **Authored fields written:** none. There are no programs, so `what_children_do`, `our_note` and `practical_summary` have nowhere to live. The venue description is factual rather than authored and says plainly what is and is not on offer.

- **Location:** the contact page carries a Google Maps embed whose URL contains the map coordinates, so `geo_source` is `site_embed` rather than geocoded or hand placed. Coordinates recorded to 5 decimal places as published. Address recorded as the site writes it, including the unit number and the Bay Centre floor description.

- **Meets minimum viable record:** no — no programs, so no publishable record. That is the correct outcome, not a hole to be padded. Venue block, address, coordinates, category and hero image with alt are all present, so if a group offer ever appears the record only needs the programme added.

- **Confidence:** high, on the negative finding. Six pages plus two site searches all agree there is nothing bookable by a children's group here. Low confidence on facilities, because the site publishes almost nothing about them.

- **Recommended follow up by phone or email:**
  1. **Is a group visit possible at all** — the site never says yes or no. This is the only question that matters for this branch.
  2. **Price** — if a group visit is possible, ask whether non-member children can be admitted and at what rate.
  3. **Youngest age** — ask whether under fives can use the pool as a group, given the 3:1 in-water ratio.
  4. **Capacity and lead time** — unpublished.
  5. **Lunch space and washrooms** — unpublished.

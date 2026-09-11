# VERIFICATION — Qualicum Beach Historical and Museum Society

- **Fields checked:** 47 (33 venue, 46 program keys on one program, 2 image records, location, provenance)

- **Fields corrected:** 3
  - `geo_source`: `site_embed` -> `geocoded`. The Google Maps embed on the contact page carries only `!1d…!2d-124.4476878!3d49.350242` (a viewport centre) plus a place-reference id. There is no `!3d…!4d…` pin, no `?q=lat,lng`, no JSON-LD `GeoCoordinates` and no `og:latitude`. Coordinates were geocoded from the published street address instead and land on the museum building.
  - `general_admission_adult_cad` / `general_admission_child_cad`: `5` / `2` -> `null`. Admission is by donation with $5 and $2 *suggested*. That is neither free nor a price. The suggested figures are recorded in the program's fees note and in the description instead.
  - `hours_notes`: re-read from the live DOM footer after scrolling, not from the fetched HTML, and confirmed identical to the contact page wording.

- **Fields set to null after review:** 6
  - `is_free` (by donation is not free), `cost_per_child_cad`, `cost_per_group_cad`
  - `has_washrooms`, `has_lunch_space`, `wheelchair_accessible` — the site has no plan-your-visit or accessibility page and never mentions any of them. Nothing was inferred from the photographs.
  - `age_basis`, `grade_min`, `grade_max` — the only grade text on the site is that programs are being re-developed to suit the K-12 BC curriculum, which describes the curriculum, not who the tour is for.

- **Conflicts recorded:** 0. The hours and the admission line are identical on the home page footer and the contact page. Two email addresses are given but they are offered side by side, not in disagreement, so both are recorded in `gaps`.

- **Authored fields written:** all three.
  - `what_children_do` rests on "invites students to learn about the social and natural history of Qualicum Beach and area through hands-on activities and inquiry-based learning", on the fossil and paleontology collection described on the home page, and on "As you step upstairs, you will be transported into the Qualicum Beach of yesteryear."
  - `our_note` rests on "we are currently re-developing our educational programs", on the absence of any published duration or content, and on the upstairs stairs.
  - `practical_summary` rests on the empty facility fields plus the by-donation admission and the described grounds.

- **Meets minimum viable record:** no. The venue block clears the bar (id, name, address, lat, lng, category, checked_on, one hero with alt). The program does not: there is no `age_basis` and no age or grade range, and no cost field or `is_free`, because the site publishes neither. Both are left visibly missing rather than filled by invention.

- **Confidence:** medium. Everything recorded was read from the live DOM in a browser on 2026-09-10 and the site is plainly current, with news items dated September 2026. The confidence is not high only because the school-tour offering itself is described in two sentences with no price, age, length or capacity.

- **Recommended follow up by phone (250-752-5533) or email (qbmuseumadmin@shaw.ca), in priority order:**
  1. Price. Is a school or daycare group charged a set fee, a per-child donation, or nothing?
  2. Youngest age. Will they take a preschool room, given programs are being rewritten around K-12?
  3. Capacity. How many children per tour, and is there a minimum?
  4. Lead time. How much notice do they need?
  5. Lunch space. Can a group eat on the grounds or in the gazebo?
  6. Washrooms. Are there any, and where?
  7. Rain backup, and step free access to the upstairs social history rooms.
  8. Children's Museum Day in August. What is it, what age, and can a group come?

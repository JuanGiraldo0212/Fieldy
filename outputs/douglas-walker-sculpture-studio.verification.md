# VERIFICATION — Douglas Walker Sculpture Studio

- **Fields checked:** 33 venue fields and 2 images. No programs, so no program fields.

- **Retrieval:** the tracker URL was tried bare first. `https://douglaswalkersculpture.ca/` and
  `https://www.douglaswalkersculpture.ca/` both resolve, but a plain fetch of either returns an
  effectively empty body. The site was read in a live browser instead, where the home page, about,
  contact and shows pages all render normally. The site is a Drupal build from around 2015 and the
  fetch emptiness is a rendering artefact, not a dead domain.

- **Fields corrected:** 0 (first extraction).

- **Fields deliberately left null:** washrooms, lunch space, wet weather cover, pushchair and wheelchair
  access, bus parking, opening hours as a schedule, youngest age, admission prices, restrictions and
  languages. None of these appear anywhere on the site.

- **`hosts_school_groups` and `hosts_daycare_groups` are null, not false.** The site never mentions
  groups, schools, daycares, children or classes on any page. It does say, on the contact page, "Feel
  free to visit us and experience our garden gallery and working sculpture studio. We welcome visitors
  year round. You can call ahead for an appointment or just drop by." Silence about groups is not a
  refusal, and a flat false would tell a director "no" on a site that says "come by".

- **No program was created, and no "Group visit" was invented.** The prompt's rule is that a "Group
  visit" is only created when a site says groups are welcome. This site says *visitors* are welcome.
  Everything else on it is about buying or commissioning a sculpture: it is a working studio and garden
  gallery at the artist's private home, with nothing bookable, nothing priced and nothing timetabled
  that a group leader could act on. `programs` is an empty array, which is the honest state.

- **Conflicts recorded:** 0. The contact page and the footer agree on the address, phone and email.

- **Location:** the contact page's map is a plain address search embed. It carries no `!3d`/`!4d` pin,
  no `?q=lat,lng`, no JSON-LD `GeoCoordinates` and no `og:latitude`. The coordinates were geocoded from
  the address on the contact page, 8138 Island Highway, Black Creek, and `geo_source` is `geocoded`.
  49.82727, -125.12552 sits in Black Creek, which passes the Vancouver Island sanity check.

- **Images:** 2, both from the home page carousel, both on the venue's own domain, both https, both
  1800 x 1095. Both carry the site's own alt text ("Water Features", "Wind sculptures"), which is thin
  but is real alt text rather than a filename, so `alt_source` is `site` and it is used word for word.
  Both were opened and looked at to confirm they are photographs of sculptures in the garden rather
  than logos or product cutouts. The other four slides are close-ups of individual pieces with no
  setting visible, so they were left out. There is no photograph anywhere of the driveway, the
  entrance, the studio building or a visitor. `usage` is `unverified` on both.

- **Authored fields written:** none. `what_children_do`, `our_note` and `practical_summary` live on
  programs, and there are no programs. The `description` is factual, not authored advice.

- **Meets minimum viable record:** **no.** Missing: at least one program. This is correct and should be
  visible. The venue block itself is complete, with address, coordinates, category, contact details and
  a hero image, so the record is one phone call away from being fillable rather than being a blank.

- **Confidence:** medium-high on what is recorded, which is a small and well sourced set. Low on the
  question a director actually wants answered, which the site simply does not address. The site's newest
  dated content is from 2017 and the footer reads 2015, so some of it may be out of date even though the
  pages load and read as current.

- **Recommended follow up by phone or email** (250 218 9838, douglaswalker@telus.net), in priority order:
  1. **Whether a children's group can visit at all**, and whether it needs an appointment. This is the
     one question that decides the record.
  2. **Price** — whether visiting costs anything.
  3. **Youngest age** — it is a private garden with metal sculpture and standing water, so ask what age
     it works for.
  4. **Group size** — how many the garden can take at once.
  5. **Lead time** for an appointment.
  6. **Lunch space and washrooms** — nothing published, and it is a residential acreage.
  7. **Wet weather** — the gallery is the garden, so ask what happens in rain.
  8. **Parking** — whether a bus or a run of cars can get in and turn.

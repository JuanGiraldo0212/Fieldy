# VERIFICATION — Echo Players Village Theatre

- **Fields checked:** 33 venue fields, 2 programs, 2 images. Every price was read off the live rendered
  box office page in a browser, not from a fetch.

- **Retrieval:** Squarespace. A plain fetch does return usable text here, but it also returned the
  **entire archive of past productions** on the ticket page, complete with their old prices. Read in a
  browser, the live ticket page lists only the four upcoming shows and carries **no prices at all**.
  Any price taken from that fetch would have been a dead show's.

- **Whose price is recorded, and the trap.** The live box office page publishes this ladder:
  Adults $28.00, Seniors 65 and over $25.00, Students with valid ID $17.00, **Groups (10 or more)
  $24.00 per person**, and Christmas Play only, Children 12 and under, $15.00.

  The **$24 group rate sits between the $25 senior and the $28 adult price, and well above the $17
  student price. It is the adult group discount, not a children's rate.** It is recorded as
  `cost_per_adult_cad: 24` on the mainstage program, with `cost_per_child_cad` left null, because the
  site nowhere says what a class of children is charged. This is the same shape as the warning in the
  brief, and it is spelled out for the director in `our_note`, in `extra_fees_note` and as the first
  line of `gaps`, with the money named: on a party of 25 the difference between $17 and $24 a head is
  $175.

  The one genuine child price on the site is the $15 for children 12 and under, and it applies to the
  Christmas play only. That is recorded as its own program with `cost_per_child_cad: 15` and
  `months_offered: [12]`, so it does not leak into the rest of the season.

- **There is no school programming here.** The menu has no schools, education or field trips entry. A
  site search for "school" returns only play synopses, a past show title and the venue of a spring camp.
  There are no school matinees, no class workshops and no touring programs. `hosts_school_groups` and
  `hosts_daycare_groups` are **null, not false**: the site is silent about groups of children rather
  than refusing them, and it does publish a group rate that a class could in principle use.

- **Per-group versus per-child:** "Groups (10 or more): $24.00 per person" is explicitly per person, so
  no per-group figure was recorded. The 10 is a **minimum** group size and is recorded in
  `capacity_min`, not `capacity_max`. No maximum and no house seating capacity is published.

- **Fields corrected during the pass:** 3
  - `capacity_min` was almost recorded as `capacity_max` from "10 or more"; caught and set as a minimum.
  - `general_admission_child_cad` was left null rather than set to 15, because $15 is Christmas only and
    is not a year round child admission.
  - `months_offered` on the mainstage program was set to [4, 7, 10, 12] from the four published run
    dates rather than left null, since null would render as year round and the theatre is dark between runs.

- **Fields set to null after review:** the weekday half of the box office opening hours, because the two
  pages disagree and neither is dated. It is recorded as a conflict instead. `price_year_or_season` is
  null because the box office page prints no year against its prices.

- **Conflicts recorded:** 1. The box office page says the box office is open Tuesday to Friday in the
  fortnight before a show; the contact page says Tuesday to Saturday. Both say 11 am to 2 pm.

- **Camps excluded on purpose.** Four youth camps are published, ages 6 to 19, $200 to $425, week long
  or three weeks. They are individual registrations that a family enters a child into, not something a
  class or a daycare can book, so no program was created for them. They are described in full in `gaps`
  so a director can still find them.

- **Off-domain material excluded.** Theatre rentals are on thevillagetheatre.ca, a separate domain
  linked from the menu. Nothing was taken from it; it is noted in `gaps`.

- **Accessibility recorded exactly as written, including the bad news.** `wheelchair_accessible` is true
  because the theatre does take a wheelchair, but the facility note carries their own two caveats word
  for word: one wheelchair per performance, booked ahead by phone, and the restrooms are not wheelchair
  accessible. `has_washrooms` is true because they describe their restrooms; it was not inferred.

- **Location:** no place pin anywhere. The map links on the ticket pages are plain address searches
  (`maps.google.com?q=110 W 2nd Ave...`), there is no Maps iframe with `!3d`/`!4d`, no JSON-LD
  `GeoCoordinates` and no `og:latitude`. Coordinates were geocoded from the published address, and
  `geo_source` is `geocoded`. 49.34700, -124.44202 is in Qualicum Beach, which passes the sanity check.

- **Images:** 2. Both on the site's own Squarespace CDN, both https, query strings stripped and both
  confirmed to still resolve. Both were opened and looked at before the alt was written, because the
  site's own alt values are filenames ("Theatre Exterior.jpg", "IMG_2958.jpg") or empty. The og:image
  was **not** used as the hero: it is a dark night time shot of the theatre in snow, so the daylight
  street view from the about page was used instead and the reason is in `gaps`. No captions were
  invented and no `rights_note` was taken from the site-wide copyright line.

- **Authored fields written:** `what_children_do`, `our_note` and `practical_summary` on both programs.
  They rest on the about page's account of the 1949 movie house the members converted, on the price
  ladder, on the under-3 rule, on the December show's own description, and on the accessibility
  paragraph. They deliberately do not repeat facts shown elsewhere on the card.

- **Meets minimum viable record:** yes. Both programs carry id, name, `age_basis` with a range,
  `comes_to_you`, a cost field and an `our_note`, and there is a hero image with alt.

- **Confidence:** medium. Everything recorded was read off a live page today and is well sourced. The
  medium is entirely about fit: this is a general-audience community theatre with no school offering,
  and the central number, what a class actually pays, is genuinely not published.

- **Recommended follow up by phone or email** (250 752 3522, info@echoplayers.ca), in priority order:
  1. **Price** — what a class of children is charged. Student $17, group $24 or something else, and
     whether the two combine. This is the whole record.
  2. **How to claim the group rate** — the site only describes the online checkout.
  3. **Youngest age** — under 3 are refused; ask what they think works from 3 up for a given show.
  4. **Capacity** — how many seats they can hold for one group, since no house capacity is published.
  5. **Lead time** — the box office only opens two weeks before a run.
  6. **Show length and interval**, which matters for getting a class back on time.
  7. **Lunch space** — nothing published about the lobby or anywhere to eat.
  8. **Bus parking** — the theatre is on a village high street and nothing is said about it.
  9. Whether any relaxed or sensory friendly performance is ever run.

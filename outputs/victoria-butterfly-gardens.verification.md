# VERIFICATION — Victoria Butterfly Gardens

Verified 2026-09-03. The tracker had this row as `no_website` with a blank website column. That was
wrong: this is a large commercial attraction with its own domain, `butterflygardens.com`, found on
the first search.

**Source note.** Everything recorded comes from `butterflygardens.com` and its Shopify CDN. Six
pages were opened and all six yielded something: home, group bookings, FAQ, plan your visit,
contact and scavenger hunt.

- **Fields checked:** 38 across the venue block, two programs, two images and the location fields.

- **Fields corrected:** 1.
  - `lat` / `lng`: first taken from the Google Maps iframe on the plan your visit page, whose
    centre is `-123.44180, 48.56446`. Replaced with `48.56449, -123.43916`, the place coordinates
    in the `!3d…!4d…` segment of the maps link on the contact page, which is the coordinate pair
    the prompt names and points at the building rather than an offset map centre. `geo_source`
    stays `site_embed` either way.

- **Fields set to null after review:** 2.
  - `duration_min`. The FAQ says most visitors spend 45 minutes to 1.5 hours, which is an estimate
    of visitor behaviour, not a booked slot length. Moved into the program description.
  - `youngest_age_welcomed_years`. Infants aged 0 to 4 are ticketed free, which is an admission
    band, not a stated minimum age for a group. Left null with a line in gaps.

  `hosts_daycare_groups` was also left null rather than set true. The group booking conditions are
  about numbers and payment, not ages, and the site never addresses preschool groups.

- **Prices re-checked:** admission appears on three separate pages (home, plan your visit, FAQ) and
  all three agree: adult 20.00, student 13 to 17 16.00, senior 16.00, child 5 to 12 9.50, infant
  free. Recorded as venue general admission, not as a program cost. There is no published group
  rate at all, only the conditions under which one applies, so no cost field was invented on the
  group visit program. `capacity_min` 10 and `lead_time_days` 2 both come from one FAQ sentence,
  which is the recorded evidence. The 10 is a minimum group size, not a maximum, and sits in
  `capacity_min` accordingly. No page carries a date or a season on its prices, so
  `price_year_or_season` stays null.

- **Conflicts recorded:** 1. The group bookings page says guided tours run by request October
  through April, and a banner at the top of the same page says they cannot accommodate guided tours
  after June 25th. Neither line is dated, so `months_offered` on the guided tour follows the
  explicit October to April statement and the disagreement is surfaced to the director.

- **Authored fields written:** `what_children_do` on the group visit, and `our_note` plus
  `practical_summary` on both programs. `what_children_do` rests on the creature list on the home
  page, the 12,000 square foot rainforest answer in the FAQ and the two scavenger hunt lists.
  `our_note` rests on the stated 26 to 30 degrees and 70 percent humidity, and on the two facts
  that outside food is banned and there is no cafe. `what_children_do` was left null on the guided
  tour because the site never says what a tour actually does.

- **Facility fields re-read against the FAQ and the accessibility block on plan your visit.**
  `wheelchair_accessible` and `stroller_accessible` are explicit yes answers. `has_rain_backup` is
  true on the strength of the site's own description of an indoor environment, quoted in the notes.
  `has_lunch_space` is false, which is supported by two statements rather than inferred: outside
  food and drink are not permitted inside, and there is no cafe on-site. `has_washrooms` stays null
  because the site never mentions them. `bus_parking` stays null; the only parking statement is
  that free parking is available for all visitors, which is recorded as a note against that field
  rather than promoted to a yes.

- **Images:** two, both with the site's own alt text. The og:image is the logo social card and was
  skipped, which is noted in gaps. The hero is the butterfly-on-flower photograph from the contact
  page; the koi pond photograph from the home page is recorded as a space shot. Both URLs sit on
  `butterflygardens.com/cdn/shop/files/` and were confirmed present on the pages recorded in
  `found_on_url`. Query strings were stripped. Nothing was generated: the browser was unavailable,
  so the several unlabelled banner photographs were left out rather than described from filenames.

- **Meets minimum viable record:** no. Everything on the venue side is there, including address,
  coordinates and a hero with alt. What is missing is a program with an age or grade range: the
  site publishes admission age bands but never an age range for a group visit, so `age_basis` stays
  null rather than being back-filled from ticket prices.

- **Confidence:** high on the venue block, the admission prices and the group conditions, all of
  which are stated plainly and cross-checked. Lower on the guided tour, where the site contradicts
  itself.

- **Recommended follow up by phone or email**, in priority order, to
  customerservice@butterflygardens.com or 250-652-3822:
  1. The actual group rate per child, and whether a daycare group qualifies for it.
  2. Youngest age they take on a group booking.
  3. Maximum group size, and how many adults they expect per group of children.
  4. Whether guided tours are running, given the two dates on their page.
  5. Where a group can eat, given outside food is not allowed in and there is no cafe.
  6. Washrooms, and whether a bus can park on site.

## Targeted image pass, 2026-09-07

Opened the site in a browser, scrolled each page so the lazy loaded photographs resolved, and looked
at every candidate image before writing alt text.

- **Images added:** 3, taking the record to the limit of five. `program-group-visit` from the group
  bookings page, attached to the group visit program. `space-iguana-in-foliage` from the home page.
  `space-butterfly-on-leaf` from the plan your visit page. None of the three carries any alt
  attribute on the site, so all three alts are generated and rest on having looked at the image.
- **Checked and rejected:** the annual pass cards, the ticket and admission graphics, the illustrated
  foliage panels, a 60px colour swatch, and a mobile crop of the group bookings photograph that is
  the same picture at a smaller size.
- **Existing images confirmed:** hero and koi pond both still load and both keep the site's own alt.
- **Fields corrected:** 0 outside the images array.
- **Meets minimum viable record:** unchanged, still no. Missing a program with a published age or
  grade range.

# VERIFICATION — Ladysmith Museum

Verified 2026-09-03. The tracker had this row as `no_website` with a blank website column. That was
wrong: the museum has a full page on its operator's site,
`ladysmithhistoricalsociety.ca/museum/`.

**Not a duplicate.** The Ladysmith and District Historical Society runs three separate sites, and
the tracker has a row for each. They are different addresses and different visits:

| Row | Where |
| --- | --- |
| Ladysmith Museum (this record) | 721 1st Avenue, downtown |
| Ladysmith Archives | Unit B, 1115 1st Avenue, below Tim Horton's |
| Ladysmith Industrial Heritage Museum | the former Comox Logging and Rail yard |

The two other rows are still `pending` and should be extracted on their own pages
(`/archives/` and `/industrial-heritage-museum/`). This record does not overlap them, and the point
is written into gaps so nobody merges them later.

- **Fields checked:** 30 across the venue block, three programs, one image and the location fields.

- **Fields corrected:** 1.
  - `hours_notes`. First taken from the contact and hours page, then replaced with the museum
    page's own line after both page modification dates were compared. See conflicts below.

- **Fields set to null after review:** 2.
  - `has_rain_backup`. It is plainly an indoor museum, but the site never says anything a director
    could hold them to about weather, so this stays null rather than being inferred from the
    building.
  - `comes_to_you` on the Historically Speaking talk. "Available in person by request to groups of
    10 or more" could mean either direction and the site never settles it.

  `hosts_daycare_groups` also stays null. The Learning Centre copy mentions students and adult
  groups but nothing about under-fives.

- **Location:** `geo_source` is `site_embed`. The museum page's own map is a static image keyed by
  address and carries no coordinates, but the contact and hours page embeds a Google Maps iframe
  for the museum whose centre is `!2d-123.82158768432085!3d48.99494647930115`, recorded to five
  decimal places as 48.99495, -123.82159. No pin was hand-placed.

- **Conflicts recorded:** 2.
  1. Opening hours. The museum page says Mon-Fri 10-5, Sat 11-3; the contact and hours page says
     Friday noon to 2, Sat 11-3, and by appointment during winter. The museum page carries a more
     recent modified date, so its value is the one in `hours_notes`, and the audit trail sits in
     gaps rather than in front of the director.
  2. Admission. The same museum page says "Admission is free" near the top and "Admission is by
     donation" further down. `is_free` is true and both general admission fields are 0, with the
     disagreement surfaced so a director knows to bring some cash.

- **Authored fields written:** `what_children_do` on the museum visit, and `our_note` plus
  `practical_summary` on all three programs. `what_children_do` rests on the named displays: the
  Story Wall, the 49th parallel town marker, the re-curve bow, the miniature Victorian home and the
  children's toys. It is null on the walking tour and the talk because neither is described. The
  `our_note` on the museum visit rests on the fact that the site says volunteers staff the building
  and that opening times vary between their own pages, which is why it says to ring ahead.

- **Facility fields re-read.** `has_washrooms` true and `wheelchair_accessible` true are both
  quoted verbatim in the notes, from "a bathroom" in the Learning Centre description and "A
  wheelchair ramp is available, thanks to the Town of Ladysmith". `has_lunch_space` stays null: the
  Learning Centre has a kitchenette but is described as a room for rent, not as somewhere a group
  can eat.

- **Programs:** three, all real bookable or drop-in offerings the site describes. The Learning
  Centre was deliberately not made a fourth. The page calls it a room suitable for programs and
  says community programming is still being developed, so there is nothing bookable for children
  to record yet. That decision is written into gaps.

- **Images:** one hero, the museum interior photograph, which is the only image on any of the four
  pages carrying a real alt attribute ("Ladysmith Museum") and a caption ("Interior"), both taken
  verbatim. The og:image, the gift shop photograph and the Learning Centre photograph all have no
  alt, and no browser was available to look at them, so no alt was generated and they were left
  out rather than described from filenames. `rights_note` is null: the only credit-shaped text on
  the site is the footer copyright line, which is not a photo credit.

- **Meets minimum viable record:** no. Venue side is complete, with address, coordinates and a hero
  with alt. What is missing is a program with an age or grade range; the site publishes none for
  any of the three offerings, so `age_basis` stays null on all of them.

- **Confidence:** medium to high. The facts are plainly stated and the address and coordinates are
  solid, but the site disagrees with itself on both hours and admission, which is exactly the kind
  of small volunteer-run site where a phone call beats the page.

- **Recommended follow up by phone or email**, in priority order, to 250-245-0423 or
  info@ladysmithhistoricalsociety.ca:
  1. Which opening hours are current, given their two pages disagree.
  2. Youngest age they take, and whether a daycare group is welcome.
  3. How many children they can take at once in the display rooms.
  4. How far ahead to book a group, and what a walking heritage tour costs and how long it runs.
  5. Whether the Learning Centre can be used by a visiting group, and at what price.
  6. Somewhere to eat, and where a bus can park downtown.

## Targeted image pass, 2026-09-07

Opened the site in a browser and looked at every photograph before writing alt text.

- **Hero replaced.** The record's hero was the interior shot, which is only 256 pixels across. The
  museum page's own og:image is the photograph of the building from the street, which is both the
  first preference under the image rules and the more useful picture for a group arriving, since it
  shows the ramp up to the door. That is now `hero-museum-exterior`. The interior shot is kept as
  `space-museum-interior` with the site's own alt and caption.
- **Images added:** 3. The gift shop from the museum page, and the two Learning Centre photographs
  from the Learning Centre page. All three carry the site's figcaption, recorded verbatim, and no
  alt attribute, so their alts are generated.
- **Left out:** the photograph captioned as a volunteer, because it is a picture of one person.
- **Programs:** `museum-visit` now carries three image ids.
- **Meets minimum viable record:** unchanged, still no. Missing `lat`, `lng`, and a program with a
  published age or grade range.

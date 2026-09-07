# Shawnigan Lake Museum

The tracker had this row as `no_website` with a blank website column. That was wrong. A search for
"Shawnigan Lake Museum Shawnigan Lake" returns the museum's own site at shawniganlakemuseum.com
immediately, and it is a live Wix site with a dedicated School Programs page. The museum is operated
by the Shawnigan Lake Historical Society, which the About Us page states directly. Status changed
to `done`.

VERIFICATION

- Fields checked: 41 (33 venue, 46 program keys of which 12 non-null, 2 images)
- Fields corrected: 1
  - hours_notes: "Tues - Sat, 10:00 - 3:30" -> null. Their press kit fact sheet gives 9:30 as the
    opening time and the rest of the site gives 10:00. Neither page is dated, so per the conflict
    rule the field is nulled and the disagreement is recorded in conflicts where the director sees
    both answers.
- Fields set to null after review: 4
  - general_admission_child_cad and general_admission_adult_cad. The only mention of cost anywhere on
    the site is a visitor review on the homepage saying "everything is by donation". A review is not
    the museum speaking, so both stay null.
  - what_children_do. The school programs page names the programs but never describes what happens in
    one, so there was nothing to ground it in.
  - grade_min / grade_max and age_basis. The page says only "Primary" and "Intermediate". Converting
    those to BC grade numbers would be my inference, not their publication.
- Conflicts recorded: 1 (opening time, 10:00 across the site vs 9:30 on the press kit)
- Authored fields written: our_note and practical_summary.
  - our_note rests on the school programs page publishing no price, length, group size or grade range,
    on the two quoted teacher testimonials naming a Grade 1 class and a Grade 6/7 class, and on the
    homepage parking instructions.
  - practical_summary rests on the absence of any washroom, lunch, accessibility or bus parking
    statement anywhere on the six pages opened.
  - what_children_do was deliberately left null.
- Meets minimum viable record: no. Missing venue.lat and venue.lng, which are geocode_pending because
  the site publishes no coordinates. Also missing a program with a published age or grade range and a
  cost or is_free value, because the museum publishes neither.
- Confidence: high on what is recorded, which is a small set of well sourced facts. The record is thin
  because the site is thin about school bookings, not because the retrieval was thin. Every page
  returned full body text to a plain fetch.
- Image note: no browser was available on this run. Both photographs recorded have a file name in
  place of alt text, which is an accessibility failure the pipeline normally fixes by opening the
  image and describing it. Rather than invent a description of a photo I could not see, the file name
  is recorded verbatim with alt_source "site" and the problem is flagged in gaps. The hero needs a
  human pass. The Open Graph image was skipped because it is the "Meet me at the Museum" wordmark
  rather than a photograph.

Recommended follow up by phone or email, in priority order:

1. Price of a school program, and whether it is per child or per class.
2. Which grades each program suits, and whether they take preschool or daycare groups at all. There is
   no minimum age published.
3. Maximum group size, and how many adults have to come.
4. How long a program runs, and how much notice they need.
5. Whether there is somewhere indoors to eat lunch.
6. Washrooms, and whether the building is step free. It is a converted 1950s firehall that has just
   been expanded, so this is worth asking rather than assuming either way.
7. Where a bus can park. The homepage lists four car parking options and says nothing about buses.
8. Confirm the opening time, 9:30 or 10:00.

## Targeted image pass, 2026-09-07

Opened each photograph in a browser and looked at it before writing alt text.

- **Fields corrected:** 4. `images[0].alt` "Morton House Celebration_edited.jpg" to a written
  description, with `alt_source` site to generated. `images[1].alt` "IMG_6003 (1).jpg" to a written
  description, with `alt_source` site to generated. Both URLs swapped for the larger versions the
  site also serves, w_1173 and w_1480.
- **Image added:** `space-museum-exterior`, the photograph of the museum building from the street on
  the visit page. The site gives it no alt at all, so its alt was written from the image.
- **Other photographs checked:** the three exhibit tiles on the home page. The Kinsol Trestle tile
  does carry site alt but is a title card, and the other two are served at under 400px, so none was
  taken.
- **Hero unchanged:** the home page banner is still the hero, since the og:image is the museum's
  wordmark rather than a photograph.
- **Meets minimum viable record:** unchanged, still no. Missing `lat`, `lng`, and a program with a
  published age or grade range.

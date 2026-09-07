# VERIFICATION — art-council-of-ladysmith-and-district

- **Fields checked:** 71 across the venue block, 4 programs and 3 images. Each class page was reopened after the JSON was drafted and its age band, price, day, time and location line were checked word for word. The class listing and the site search were read from the live DOM in a browser, because they are rendered by JavaScript and a plain fetch shows the calendar shell rather than the results.

- **Fields corrected:** 2
  - `programs[kids-clay-mixed-media-older].days_offered`: [1] -> [2]. First pass inferred Monday from the listing. The class page states "Tuesdays 4:45 pm - 5:45 pm".
  - `venue.address` postal code: V9G 1B8 -> V9G 1S8. V9G 1B8 is the postal code on their PO Box mailing address on the contact page and on two of the class pages. V9G 1S8 is what the other two class pages give for the building itself. Both are recorded as a conflict.

- **Fields set to null after review:** 3
  - `venue.hosts_school_groups` and `venue.hosts_daycare_groups` — left null, not false. The site is silent about groups rather than excluding them, and the guidance is that silence is null.
  - `venue.youngest_age_welcomed_years` — set back to null. The youngest published children's class is age 6, but that is the youngest thing they programme, not a stated minimum age for the building. It is recorded in gaps instead.
  - `programs[*].neurodiversity_friendly` — left null. The clay class pages address support needs, but what they say is a caveat about there being one teacher on their own, not a claim of being neurodiversity friendly. Setting it false would be equally wrong.

- **Conflicts recorded:** 1
  - Two different postal codes for the same building on Oyster Bay Drive, taken from two of their own class pages.

- **The gallery has been kept out.** The tracker carries Ladysmith Gallery as a separate pending row on this same domain. This record covers the arts council as an organisation only: its Oyster Bay Drive office and classroom, its education programme and its own coordinates. The gallery's address, phone number, email, opening hours, exhibition content and interior photograph have all been deliberately left out, and the relationship is spelled out in gaps.

- **Price checks.** $162 and $136 are per child for a whole class series, not per session and not per group. Both were read from the "Tickets / Cost" line and confirmed against the "Price" line in each page's own registration panel. They are recorded as `cost_per_child_cad`, `school_rate_only` false, `tax_included` null because no tax statement is made.

- **Ages kept as ages.** All four classes publish age bands, not grades, so `age_basis` is `years` and both grade fields are null throughout.

- **Duration.** `duration_min` 60 is the length of a single weekly session, taken from the stated start and end times. The series runs five or six weeks; that is in the description rather than in the duration.

- **Location.** `geo_source` is `site_embed`. Coordinates come from the Google Maps embed on their contact page for the entry labelled "Arts Council of Ladysmith and District (Office and Classroom)". No pin was hand placed.

- **Images.** All three URLs are absolute, https, and on the venue's own domain. Each was opened and looked at in a browser before its alt was written. One is a CSS background image on the homepage and none of the three carries an alt attribute on the page, so all three are `alt_source: generated`. The width and height on the animation image are the values the page states in its own image meta tags for that exact file. No captions invented, no `rights_note` set. One hero is present, although it is a photograph of art materials rather than of the building, because no photograph of the Oyster Bay Drive classroom or its exterior is published.

- **Authored fields written:** `what_children_do`, `our_note` and `practical_summary` on all four programs.
  - `what_children_do` rests on the materials and activity paragraphs on each class page: the guided drawing games and creature designs, the clay animation and pixilation, and the clay, watercolour, acrylic and pastel work in the mixed media classes.
  - `our_note` rests on: the classes being individual registrations rather than group bookings, the camera and tripod requirement on the animation class, and the single teacher and helper policy on the clay classes.
  - `practical_summary` rests on the gaps list, since the site publishes nothing about the classroom's facilities.

- **Meets minimum viable record:** yes. Venue id, name, address, lat, lng, category and checked_on are present, there is one hero image with alt, and all four programs carry id, name, age_basis with an age range, `comes_to_you`, a cost and `our_note`.

- **Confidence:** medium. Everything recorded is well supported and was checked against the live pages, but the four programs are a single autumn 2026 term of after school classes rather than a standing offer, so they will go stale in a few months. More importantly, this organisation publishes nothing at all for groups, which is the thing a director actually wants, so the record is honest but thin on the question that matters.

- **Recommended follow up by phone or email** (250 245 1252, or education@ladysmitharts.ca):
  1. Ask whether they will take a booked group at all, and at what price, since nothing is published.
  2. Ask whether anything runs for children under 6.
  3. Ask how many children a class holds.
  4. Ask how far ahead to register and what happens if you cancel.
  5. Ask about washrooms and a change table at the Oyster Bay Drive classroom.
  6. Ask whether there is somewhere to eat and somewhere to leave coats and bags.
  7. Ask about step free access and where a vehicle can park.

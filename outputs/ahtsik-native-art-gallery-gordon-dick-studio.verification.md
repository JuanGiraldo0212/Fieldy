# ahtsik-native-art-gallery-gordon-dick-studio.json

VERIFICATION

- **Fields checked:** 34 (all non-null venue fields, the single program's non-null fields, and all three image entries), re-read against freshly re-fetched copies of the Studio and Visit pages plus the home and About pages. Every quoted string was matched programmatically against the re-fetched page text, not from memory.

- **Fields corrected:** 2
  - `venue.name`: "Ahtsik Native Art Gallery + Gordon Dick Studio" -> "Ahtsik Native Art Gallery". The site's own page title, navigation and site name are all the shorter form. The longer form appears only in the footer copyright line, as "Ahtsik Gallery + Gordon Dick Studio". The tracker's longer name is kept in the file name.
  - `venue.booking_method`: "email" -> null. The gallery publishes both a phone number and an email address on every page, but never says which is the way to arrange a visit. The enum has no value for "they give you two contacts and no instructions", so the field is null and the point is carried in gaps. Both contacts are still recorded in `booking_email` and `booking_phone`.

- **Fields set to null after review:** 3
  - `program.is_free` — it is a commercial gallery with no admission price published anywhere. Absent an admission price it is tempting to record the visit as free, but the site never says so, and a wrong "free" tile is worse than an amber one.
  - `program.outdoor` — the site names a "carving shelter" but never says whether it is enclosed, roofed or open to the yard. Left null rather than guessed; `indoor` stays true on the strength of the gallery exhibit space.
  - `venue.facility_notes` — there was nothing to put in it. The site says nothing about washrooms, parking, lunch or access, so an empty object would have implied a check that did not happen.

- **Conflicts recorded:** 0. The address, phone and email are identical on the home, About, Visit and Studio pages. The postal code V9Y 8Y4 appears only on the Visit page; the other pages simply stop at "Port Alberni, BC", which is an omission rather than a disagreement. A third-party tourism listing shows a different street number and postal code, but off-domain listings are not sources and no conflict is recorded from one.

- **Authored fields written:** all three, on the one program.
  - `what_children_do` rests on the Studio page ("his studio and carving shelter", "inviting visitors to observe as he engages in the process of developing traditional Northwest Coast art", "sharing traditional teachings, cultural skills, and educating the public about his community of Tseshaht First Nation, as well as the regional signatures of Nuu-chah-nulth art") and on the About page (the gallery represents Nuu-chah-nulth, Kwakiutl and Coast Salish artists, and Dick "operates his carving shed and studio on site, where you'll often find him making wood chips"). The materials named are the ones the home page lists against the pieces on display.
  - `our_note` rests on the Visit page's only hours line, "By appointment or chance", set against the complete absence of any group size, price or duration anywhere on the site.
  - `practical_summary` is generated from what the site does publish (address, phone, email, the by-appointment opening) against the washroom, parking, lunch, access and price gaps.

- **Meets minimum viable record:** no. Two shortfalls:
  - `venue.lat` and `venue.lng` are null. No geocoding service was available in this run and the site publishes no coordinates, no map embed and no structured address block. The full street address including postal code is captured and `geo_source` is `geocode_pending`, so a later backfill pass can fill both without re-reading the site.
  - The program has no `age_basis` and no cost field or `is_free`. The site publishes no age or grade range and no price of any kind, so both are honestly null. `id`, `name`, `comes_to_you` and `our_note` are all present.

- **Confidence:** medium. The address, hours, contacts and the invitation to visit the studio are unambiguous and were matched word for word on the venue's own pages, but this is a five-page commercial gallery site that never mentions schools, daycares, children or groups, so the record is thin rather than uncertain. The one soft spot is the image alt text: no photo on the site carries usable alt text, no browser was available to look at the files, and the three alts were written from file names and page position, so they need a human eye before publish.

- **Recommended follow up by phone or email** ((250) 723-3425 or ahtsik@gmail.com):
  1. Price — is there any charge for a group visit, and is a plain look around the gallery free?
  2. Youngest age — are preschool and daycare groups welcome around the carving tools, and is there a minimum age?
  3. Capacity — how many children can be in the gallery and the carving shelter at once?
  4. Lead time — the gallery opens by appointment or chance, so how much notice does a group need to give, and who arranges it?
  5. Lunch space — is there anywhere a group can eat, indoors or out?
  6. Washrooms — are there any on site?
  7. Rain backup — is the carving shelter enclosed, or does a wet day move everything into the gallery?
  8. Also worth asking: coach or bus parking off Pacific Rim Highway, wheelchair and stroller access, and how long Gordon Dick usually spends with a visiting group.

# Nuyumbalees Cultural Centre

The tracker had this row as `no_website` with a blank website column. That was wrong twice over. The
centre has two live sites of its own: nuyumbaleesmuseumsociety.com, which is current, and
museumatcapemudge.com, the older one, which is still up and is where the admission prices and the
booking notice for tours and education programs actually live. Both are run by the Nuyumbalees Museum
Society, which was founded in 1975 by the hereditary and elected chiefs and operates the centre, so
both count as the venue's own domain. Status changed to `done`.

This is the Cape Mudge centre on Quadra Island. It is not Wei Wai Kum House of Treasures in Campbell
River, which is a separate tracker row and a separate venue.

VERIFICATION

- Fields checked: 58 (33 venue, 2 programs, 1 image)
- Fields corrected: 0
- Fields set to null after review: 3
  - booking_email. The older site's directions page shows nuyumbaleesculturalcentre@gmail.com as text
    but its mailto link points at nuyumbaleesculturecenter@gmail.com, spelled differently. The newer
    site shows ED.nuyumbalees@outlook.com but its mailto link is an unedited Wix placeholder pointing
    at info@mysite.com. Neither page is dated, so the field is null and both visible addresses are in
    conflicts. booking_method is phone, which is the one contact route both sites agree on.
  - hosts_school_groups and hosts_daycare_groups. The directions page asks people to call two weeks
    ahead for "Tours/Education, Language/Cultural Programs", which is a group offering, but it never
    says school or daycare groups specifically and publishes no minimum age. Third party tourism
    listings do say school groups; those are not sources.
- Conflicts recorded: 2
  - The reopening date. Both sites say the centre is temporarily closed and transitioning to an opening
    date. The older site says June 3, 2025 and the newer says June 2026. Today is September 2026 and
    neither page has been updated past its own date, so the current opening status genuinely cannot be
    read off the site. This is the single most important thing on the record given the ferry crossing.
  - The contact email, as above.
- Prices verified on a second cache-busted fetch of the admissions page: Adult $10.00, Senior $5.00,
  Youth/Student/Children $5.00. These are per person, so they are recorded as cost_per_child_cad and
  cost_per_adult_cad, not as a group cost. No group or school rate is published anywhere. The page
  carries no date or season, which is noted in gaps rather than guessed at in price_year_or_season.
- Authored fields written: what_children_do, our_note and practical_summary on the self-guided visit,
  our_note and practical_summary on the tours program.
  - what_children_do rests on the admissions page saying the collection is self-guided and that staff
    answer questions, and on the facilities page describing the native garden above Discovery Passage,
    the touchscreen of elders' stories and the carving shed. It was left null on the tours program,
    where the site describes nothing about what a session involves.
  - our_note rests on the per person pricing with no group rate, the ferry crossing the site itself
    links to, the two week notice, and the unresolved closure notice.
- Meets minimum viable record: no. Missing venue.lat and venue.lng, which are geocode_pending because
  neither site publishes coordinates. The self-guided visit has a cost and comes_to_you but no
  published age or grade range, so no program clears the bar. The centre publishes no ages at all.
- Confidence: medium. The facts recorded are well sourced and were re-read, but the two sites disagree
  about whether the place is currently open and the prices sit on the older of the two. The venue is
  real and its own material is the source for everything here; the uncertainty is theirs, not ours.
- Image note: no browser was available on this run. The one photograph recorded has a file name in
  place of alt text, recorded verbatim with alt_source "site" rather than inventing a description of an
  image I could not see. The other photographs on the homepage carry no alt attribute at all and were
  left out entirely rather than guessed at. The hero needs a human pass. The Centre page on the new
  site is still unedited Wix placeholder text and yielded nothing.

Recommended follow up by phone (250-914-8762), in priority order:

1. Are they open, and from when. Two of their own pages give different reopening dates.
2. Whether the $10 and $5 admission still stands, and whether there is a school or group rate. There
   is none published, so a class of twenty is currently twenty separate admissions.
3. Whether they take school groups and daycare groups, and the youngest age they will host.
4. What a tour or education session covers, how long it runs and what it costs.
5. Maximum group size.
6. Whether the two week notice is a minimum or a preference.
7. Somewhere for a group to eat lunch, washrooms, and step free access. None of the three is mentioned
   anywhere on either site.
8. Where a bus can park, and what the ferry crossing from Campbell River means for a group booking.

## Targeted image and conflict pass, 2026-09-07

Opened each photograph in a browser and looked at it before writing alt text.

- **Fields corrected:** 2. `images[0].alt` "nuyumbalees_9565-2.jpg" to a written description of the
  building, with `alt_source` site to generated, and the URL swapped for the larger w_700 version
  the site also serves.
- **Images added:** 2, both from the older site and both without any alt attribute of their own.
  `space-carved-house-posts` from the facilities page and `space-collection-display` from the centre
  page. Their figcaption text was not repeated as alt.
- **Photographs deliberately left out:** the two other large images on the newer site. One is a
  studio portrait of a single person, one is a single mask on a plain wall. Neither shows the place.
  Noted in gaps.
- **Reopening dates re-checked and unchanged.** museumatcapemudge.com still reads "We are temporarily
  closed and are transitioning to an opening date of June 3, 2025." nuyumbaleesmuseumsociety.com's
  directions page still reads "We are temporarily closed and are transitioning to an opening date in
  June 2026." The disagreement was already carried in `conflicts` as structured data with a note
  written for a director, and it stands as recorded.
- **Conflicts recorded:** 2, unchanged.
- **Meets minimum viable record:** unchanged, still no. Missing `lat`, `lng`, and a program with a
  published age or grade range.

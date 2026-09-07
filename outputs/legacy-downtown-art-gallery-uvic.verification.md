# VERIFICATION - legacy-downtown-art-gallery-uvic

- **Fields checked:** 48 (26 venue, 14 non-null program fields, 3 images x 4 checkable attributes)
- **Fields corrected:** 2
  - `venue.lat` / `venue.lng`: candidate values 48.426491 / -123.366257 -> null, `geo_source` = `geocode_pending`. The number pair in the visit page's Google Maps embed is a `!2d` / `!3d` map viewport centre, not a `!3d`/`!4d` place pin, so it is not a published coordinate for the gallery. Address kept for backfill.
  - `images` hero: og:image `legacy-exterior-graphic-half2.jpg` -> `legacygalleryexterior.jpg`. The og:image is captioned on the home page as a "black line illustration of Legacy's downtown location", so it is a graphic, not a photograph.
- **Fields set to null after review:** 4
  - `general_admission_child_cad` / `general_admission_adult_cad` - "Admission: Free" appears only in the Legacy Maltwood tab of the visit page, not the Legacy Downtown tab.
  - `has_rain_backup` - the gallery is indoors, but the site never addresses a rain plan, so this is inference not fact.
  - `stroller_accessible` - the accessibility text covers mobility devices only.
  - `bus_parking` - the site describes metered street parking and a parkade two blocks away, nothing about coaches.
- **Conflicts recorded:** 0. The contact block in the footer, the contact page and the education page all give the same email and phone.
- **Authored fields written:** all three, on one program.
  - `what_children_do` rests on "Group visits with a short introduction to the exhibition(s)" plus the gallery layout described on the visit page (main gallery and inner gallery).
  - `our_note` rests on the street level single floor layout, the classroom being upstairs by stairs only, the absence of any lunch information, and the fact that both galleries share one booking email.
  - `practical_summary` rests on the washroom and step free entry text plus the gaps list.
- **Verified against source:** the evidence quote "We offer free exhibition introductions for university classes, school classes, and community groups of all ages." is contiguous and verbatim on the tours page. `is_free: true` matches "free exhibition introductions" and "book your free visit"; no per-child or per-group price is published so no cost field was populated. No age or grade range is published, so `age_basis` and both ranges stay null rather than being invented from "all ages". No capacity, lead time or chaperone figure exists on any page opened.
- **Images:** all three URLs are absolute, https, on `www.uvic.ca`, and were present in the fetched text of the `found_on_url` recorded. All three carry the site's own alt text, so `alt_source` is `site` in every case. Captions are the italic lines printed directly beneath the images. No `rights_note` was set; the only copyright line on the site is the site wide UVic footer.
- **Meets minimum viable record:** no. `lat`/`lng` are pending geocoding, and the single program has no published `age_basis` plus range. Everything else on the bar is present, including a hero image with alt, a cost field (`is_free`) and `our_note`.
- **Confidence:** high. Every field rests on a page fetched cleanly from the venue's own domain, the site is plain server rendered HTML with no JavaScript problem, and the record's gaps are genuine silences on the site rather than retrieval failures.
- **Recommended follow up by phone or email** (legacy@uvic.ca, 250-721-6562), in priority order:
  1. Does walking into the downtown gallery cost anything, and is the group introduction still free?
  2. What is the youngest age they will take, and will they take a daycare group?
  3. What is the maximum group size for one introduction?
  4. How much notice do they need to book?
  5. Is there anywhere a group can eat, indoors or nearby?
  6. Where can a bus drop off and park?
  7. Which of the two galleries will the visit actually be in?

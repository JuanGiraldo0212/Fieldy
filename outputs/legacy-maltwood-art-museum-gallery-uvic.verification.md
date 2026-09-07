# VERIFICATION - legacy-maltwood-art-museum-gallery-uvic

- **Fields checked:** 44 (26 venue, 18 non-null program fields across two programs)
- **Fields corrected:** 2
  - `venue.lat` / `venue.lng`: candidate values 48.464470 / -123.322111 -> null, `geo_source` = `geocode_pending`. That pair is the `!2d`/`!3d` viewport centre of the visit page's Google Maps embed, not a place pin, and it sits several hundred metres off the McPherson Library. A wrong pin is worse than none.
  - `wheelchair_accessible`: true -> null. The site says the gallery is reachable by stairs or lift but also that "the layout of the space may be difficult for some mobility devices to navigate", which is not a yes. The full sentence is kept in `facility_notes`.
- **Fields set to null after review:** 3
  - `has_washrooms` - stated for the downtown gallery only, never for the campus gallery.
  - `has_lunch_space`, `bus_parking` - not mentioned for this location at all.
- **Conflicts recorded:** 0.
- **Separation from the downtown record:** this is deliberately a separate record with its own `venue.id`, its own address, its own hours line and its own free admission values. Nothing was copied across except the two programs the site publishes once for both galleries, and each record's gaps says so plainly so a director knows to confirm the location when booking.
- **Authored fields written:** all three, on both programs.
  - `what_children_do` for the group visit rests on "Group visits with a short introduction to the exhibition(s)" plus the stated location on the lower level of the library. For the walking tour it rests on the 90 minute walking tour description and the stated themes.
  - `our_note` rests on the gallery sitting inside a working library, the shared booking address for both galleries, and for the walking tour on it being offered to UVic classes with a published self guided pamphlet and map as the fallback.
  - `practical_summary` rests on the free admission line, the lift and layout text, and the gaps list.
- **Verified against source:** both evidence quotes are contiguous and verbatim on the tours page. `general_admission_child_cad` and `general_admission_adult_cad` are 0 from "Admission: Free" in the Legacy Maltwood tab of the visit page. `duration_min: 90` matches "90-minute walking tours"; no cost is published for that tour so `is_free` stays null rather than being assumed free by association with the free gallery introductions. Neither programme publishes an age or grade range, so `age_basis` and both ranges stay null.
- **Images:** empty array, and gaps explains why. Every gallery photograph found on the pages opened is captioned or titled as Legacy Downtown. Using a downtown exterior or interior shot as this venue's hero would put the wrong building on the card, so nothing was recorded. Confirmed no eligible campus gallery photo exists on the pages opened.
- **Meets minimum viable record:** no. Missing `lat`/`lng` (pending geocoding), missing a hero image, and neither program publishes `age_basis` plus a range. `id`, `name`, `address`, `category`, `checked_on`, `comes_to_you`, a cost field and `our_note` are all present.
- **Confidence:** medium. The programme and admission facts are solid and come straight from the venue's own pages, but the site describes this gallery in two short paragraphs inside a tab on the downtown page, publishes no street address, no hours of its own and no photograph of the space, and never says which of the two galleries a booked group visit happens in. Much of what a director needs is genuinely absent rather than missed.
- **Recommended follow up by phone or email** (legacy@uvic.ca, 250-721-6562), in priority order:
  1. Is the guided introduction offered at the campus gallery, or only downtown?
  2. What does the Indigenous art walking tour cost, and will they run it for a school or daycare group?
  3. What is the youngest age they will take?
  4. What is the maximum group size in the campus gallery?
  5. How much notice do they need?
  6. Are there washrooms near the gallery, and anywhere a group can eat?
  7. Where can a bus drop off on campus, and what are the gallery's actual opening hours this term?

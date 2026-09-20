# roy-henry-vickers-gallery.json

VERIFICATION

- **Fields checked:** 47 (33 venue fields, every non-null field on both programs, and the single image entry, each re-read against The Gallery, Contact, Public Speaking, Gallery & Business for Sale, Gallery Policies and the home page).

- **Fields corrected:** 3
  - `venue.geo_source`: `geocode_pending` -> `site_embed`, and `lat`/`lng`: null -> 49.15271 / -125.90829. No geocoding service was available for this run, but the Contact page publishes coordinates directly in a Google Maps embed (`!2d-125.90828578834655!3d49.1527088713461`, with the place string `350 Campbell St, Tofino, BC V0R`). Published coordinates on the venue's own page outrank geocoding, so they were taken from there and rounded to 5 places. No pin was hand placed.
  - `program.free-gallery-visit.what_children_do`: the first draft had children walking in "past a carved cedar eagle on the front of the building and four cedar totems". The four cedar totems are listed on the for-sale page among the things the gallery is adorned with, and that page never says they stand outside. The Gallery page does say the artwork hangs "among totem poles and carvings" inside, so the totems were moved indoors in the sentence and the eagle facade left on the front, which is what the site actually says.
  - `venue.address`: "350 Campbell Street, PO Box 10, Tofino, BC V0R 2Z0" -> "350 Campbell Street, Tofino, BC V0R 2Z0". The PO Box appears only in the Contact page's postal block; the footer of every page and the map embed both give the street address alone, and the PO Box is a mailing address rather than the place you drive to.

- **Fields set to null after review:** 4
  - `venue.has_rain_backup` — the visit is indoors, but no page on the site addresses rain, shelter or a wet weather plan, and "the whole thing is inside a building" is an inference rather than a statement. Left blank.
  - `venue.restrictions` — the Gallery Policies page turned out to be shipping, returns and exchange terms for the online store. There are no rules about visiting, photography, food, bags or behaviour anywhere on the site, so nothing was recorded.
  - `venue.booking_method` — entry is free and drop-in, and the site publishes no booking route for a visit. Per the schema a drop-in venue with no booking route is blank, not `walk_in`. The email and phone are still recorded at venue level because the Public Speaking page names them as the booking route for that one offering.
  - `images[0].width` / `height` — the markup carries `width="2048x2048" height="2048x2048"`, which is not a number. Recorded as blank rather than parsed.

- **Conflicts recorded:** 0. The hours, address, phone number and email are identical on the home page footer, The Gallery page and the Contact page. Nothing disagreed across pages.

- **Authored fields written:** all three, on both programs.
  - Free gallery visit. `what_children_do` rests on The Gallery page (paintings, original prints, calendars, art cards and reproductions on hand adzed cedar walls among totem poles and carvings, soft lighting and restful music, guests gathered around the centre pit in the main hall) plus the carved eagle facade named on the for-sale page. `our_note` rests on the fact that everything on the walls is stock for sale in an artist-owned gallery, on the single main hall described on that page, and on the complete absence of any group information on the site. `practical_summary` is generated from the published address, hours and free entry against the washroom, lunch, bus parking and group-booking gaps.
  - Speaking engagement. `what_children_do` rests on the Public Speaking page's own account of the session: Roy walks through selected works, shares stories of inspiration, and gets everyone involved in a sing-a-long or traditional chant. `our_note` and `practical_summary` rest on that page publishing a booking contact and nothing else, no fee, no length, no ages, no group size.

- **Judgement call worth a second opinion:** this venue was expected to fall into the "does not serve children's groups" bucket as a retail gallery, and it was not recorded that way. The site is a Shopify store and its main business is selling art, but it also states the gallery "is open free to the public all year round", calls itself a Tofino landmark welcoming more than 500,000 visitors a year, describes storytelling gatherings around the centre pit in the main hall, and publishes a route for booking the artist to speak at an event. None of that is adults-only, private or permanently closed, and the site never says groups are unwelcome. Marking the school and daycare fields false would have asserted an exclusion the site does not make, so both were left blank and the gap was written out in full instead. If the orchestrator prefers the stricter reading, the two programs and the hosts flags are the only things that change.

- **Meets minimum viable record:** yes for the venue block, which has `id`, `name`, `address`, `lat`, `lng`, `category`, `checked_on` and one hero image with alt. No for either program: neither publishes an age or grade range, so `age_basis` and both ranges are blank on both. The free gallery visit otherwise clears the bar with `is_free` true and `our_note` written; the speaking engagement is missing a cost field as well, since the site publishes no fee at all.

- **Confidence:** medium. The address, coordinates, hours, free entry, the building and the two offerings are unambiguous and come straight from the venue's own pages, but there is nothing group-facing or child-facing on the site, and the one photograph recorded could not be looked at, so its alt and its suitability as a hero need a human eye.

- **Recommended follow up by phone or email** (250-725-3235, toll free 1-800-663-0669, tofino@royhenryvickers.com), in priority order:
  1. Price — entry is free, but is there any charge or minimum for bringing a group, and does a group need to book?
  2. Youngest age — are preschool and daycare groups welcome in the gallery, and is there an age below which they would rather you did not come?
  3. Capacity — how many children can be in the main hall at once, and how many adults do they want with them?
  4. Lead time — how much notice do they want before a group arrives, and are there times of day that are better?
  5. Lunch space — is there anywhere a group can eat, and if not, what do they suggest nearby?
  6. Washrooms — is there one visitors can use, and is there a change table?
  7. Rain backup — not really a question here since the visit is indoors, but ask where a group waits if the hall is busy.
  8. Storytelling dates — how do you find out when Roy is storytelling, since no dates were on the home page.
  9. Speaking engagements — what it costs, how long it runs, what ages it suits, and whether he travels to a school or daycare.
  10. Ownership — the gallery and business are advertised for sale, so ask whether anything is changing.

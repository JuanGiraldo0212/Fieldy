# zeballos-expeditions.json

VERIFICATION

- **Fields checked:** 36 (all 33 venue fields plus the three image entries, re-read against a second cold fetch of the home page taken after the JSON was written). There are no programs to re-open, so the program pass does not apply.

  The site is now a single page. `https://www.zeballosexpeditions.com/` and `https://www.zeballosexpeditions.com/index.aspx` return byte-identical HTML, and the second fetch was byte-identical to the first, so nothing rotates between loads. Its own `Sitemap.xml` lists two addresses, `index.aspx` and `transportation.html`; the second now returns a not-found page. `italiano.html`, still linked in the footer, is also gone. Sixteen further guesses at the old tour, rates, contact and gallery pages, in both `.html` and `.aspx` form, all returned not-found. There is no navigation menu in the markup at all. The venue is thin because the site is thin, not because the fetch failed.

- **Fields corrected:** 2
  - `hours_notes`: "The store is open 2 to 7 pm for groceries, liquor, ice and bait." -> "The store is open 2 to 7 pm." — the store notice reads "2-7 pm / groceries, liquor, ice" and the body paragraph adds bait and parking. Both are true, but only the time belongs in the opening hours line, so the goods stayed in `description` and the hours line was cut back to what the hours notice says.
  - `facility_notes.bus_parking`: "SECURE PARKING $6/day & $30/week Call: 250 761 4099" -> "Secure parking $6/day & $30/week. Call: 250 761 4099" — lightly trimmed out of the site's block capitals. The number is verbatim and is a different line from the main one. The flag itself stays null: this is the store's own secure parking and the site never says whether a bus or a van fits, which is now a gap in its own right.

- **Fields set to null after review:** 0 in the sense of a walk-back, but three judgements are worth naming because a reader will expect them to be filled.
  - `hosts_school_groups` and `hosts_daycare_groups` stay **null, not false.** There is a real temptation to write false here: the company has sold the hotel and the restaurant, describes no tour, and says it is considering its next steps, so today there is nothing a class could book. But the schema asks whether the venue hosts these groups, and false is reserved for a venue that gives a reason, a minimum age or an adults-only policy. This site gives no reason. It is silent, and silence is null. The status in the tracker carries the "nothing to book" finding instead.
  - `booking_method` stays null. `booking_email` and `booking_phone` hold the general contact address and phone from the footer, because they are the only route to a human and a director should not have to go hunting. The site never describes booking anything, so naming a method would invent one. The gaps list says this in as many words.
  - `restrictions` stays null. Zeballos sits at the end of a long gravel road, which decides whether a group can come at all, and the site does not mention the road once. Inventing that line from what I know of the area is exactly the hand-placed pin the prompt warns about, so it went into gaps as a question to ask rather than into the record as a fact.

- **Conflicts recorded:** 0. There is only one page, so there is nothing for a second page to disagree with.

- **Authored fields written:** none of the three. `what_children_do`, `our_note` and `practical_summary` live on programs, and there are no programs. The site never describes an activity, so `what_children_do` would have had to be imagined, and the prompt is explicit that an imagined visit is worse than a blank. The four sentences in `description` are the only prose in the record and each one rests on a sentence on the page: the address block, the change-of-ownership notice, the store notice with the shared shuttle, and the absence of anything bookable.

- **Category:** `nature_outdoors`. The trading side of the business today is a grocery and liquor store, which no category covers, but the venue as the site presents itself is a West Coast outfit whose banner still runs wildlife viewing, kayaking and the 1,000 km cycling route. `community_civic` would be worse. The choice is flagged here because it rests on the site's self-presentation rather than on a current offering.

- **Location:** no coordinates are published. There is no map embed, no structured address block, no location meta tags and no JSON-LD anywhere in the markup, so `site_embed` was not available. Geocoding 203 Pandora Ave, Zeballos returned nothing; the only result for the village was its administrative centroid at roughly 49.98, -126.85. Dropping that in would have put the pin somewhere in Zeballos with no visible warning, which the prompt rightly calls worse than null. So the street address is recorded, `lat` and `lng` are null and `geo_source` is `geocode_pending`, which is honest and leaves the record ready for a backfill pass.

- **Images:** three, all on the venue's own domain, all confirmed present on the home page recorded in `found_on_url`, all reachable and all served over https. The larger `4-` gallery versions were taken rather than the `0-` thumbnails the page displays, since the page links to the larger ones. Every photo on the site has an empty alt attribute, so all three alts are `generated`. No browser was available in this run, so those alts rest on the site's own file names rather than on having seen the images, and they were kept to the single thing the file name asserts and nothing more. That is recorded in gaps. The hero is a gallery photo rather than the home page banner because the banner file names say nothing about what is in them; that too is in gaps. No caption was written, since the site has none. The `rights_note` is not a footer copyright line but the site's own verbatim statement about reusing its photographs, which explicitly requires permission, so all three are `unverified` and should stay held back.

- **Meets minimum viable record:** no. Three required fields are missing: `venue.lat`, `venue.lng`, and at least one program. There is nothing on the site to build a program from, so padding it with a "Group visit" entry would have been invention. `id`, `name`, `address`, `category`, `checked_on` and a hero image with alt are all present.

- **Confidence:** high on what is recorded, which is a short list. The address, phone, email, store hours, parking price, staff languages and the fact of the ownership change are unambiguous on the page and survived a second cold fetch unchanged. The uncertainty is not about the facts but about the business: the site says it is considering its next steps, so whether tours return is genuinely unknown and the record will need re-reading later.

- **Recommended follow up by phone or email** (1-250-761-4137, or 250 761 4099 for the store, info@zeballosexpeditions.com):
  1. Is anything running for groups at all now that the hotel and restaurant have been sold, and is there any plan to bring the tours back?
  2. Price — is there a rate for a children's group for anything, including the water taxi?
  3. Youngest age — if kayaking, caving or a boat trip ever runs again, what is the minimum age?
  4. Capacity — how many children could come at once, on the water or in a vehicle?
  5. Lead time — how much notice, and who takes the booking?
  6. Lunch space and washrooms — is there anywhere indoors for a group now that the restaurant is under new ownership?
  7. Rain backup — is there any indoor shelter at all.
  8. Getting there — what the road in is like, and whether a school bus or a van can make it and park.

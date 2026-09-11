VERIFICATION — MONK Art Gallery & Studio

Duplicate question settled first: artbymonk.com describes **two** addresses, not one. The home page and the contact page each carry two separate blocks, "MONK Art Gallery and Studio, 151a Morrison Ave Parksville, 250 248-8189" and "MONK'S Rathtrevor Beach Studio, #5 1065 Tanglewood Place, 250 228-6648", and the meta description on every page says MONK has "a primary studio on spectacular Rathtrevor Beach ... and a gallery/studio across from the beach club in Central Parksville". The two addresses are about three and a half kilometres apart and have different phone numbers. So this is not the Pacific Northwest Raptors case of one place under two names; it is one business at two places. Both records were written with their own address, their own phone number and their own coordinates. The single painting offering was **not** cloned: Paint with MONK lives only on this record, the beach studio record carries only what the site says about that address, and each file names the other in gaps.

- Fields checked: 33 venue fields, 45 program fields on one program, one image, two conflicts.

- Fields corrected: 1
  - conflicts[1].values second entry: "151a Morrison Ave parksville" -> "151a Morrison Ave Parksville" (reason: reread from the live DOM. The lowercase spelling is the contact page's; the home page body uses a capital P. Both differ from the footer, which is the value recorded in address.)

- Fields set to null after review: 1
  - hours_notes (their home page footer says Monday closed and 11 AM to 3 PM Tuesday through Sunday; their contact page says Mon-Fri 10AM - 4PM. Neither page is dated, so the field is null and the disagreement is recorded as a conflict for the director to read.)

- Conflicts recorded: 2
  - Opening hours, home page footer against contact page.
  - Street spelling, Morison in the footer address against Morrison in the page bodies.

- Authored fields written: what_children_do, our_note and practical_summary on the one program.
  - what_children_do rests on the about page, "MONK invites people to paint on Canvases and let their own creativity flow through them", together with the home page line about signed dedications on the back of the paintings.
  - our_note rests on the two published addresses with no statement of which one a session runs at, and on the complete absence of price, length, age and group size anywhere on the site.
  - practical_summary rests on the empty facility fields and on the hours conflict.

- Images: one hero. The site publishes no photograph of the gallery, inside or out, and the home page has no Open Graph image, so the hero is the banner painting at the top of the home page. It was opened directly in the browser before the alt was written; the alt describes only the painting in the frame. Confirmed present on the home page in a live DOM read. alt_source is generated because the img element carries no alt attribute. usage unverified, rights_note null, no per-photo credit exists on the site.

- Location: no Google Maps embed, no JSON-LD, no og:latitude anywhere on the site, and both Get Directions buttons link back to the site rather than to a map. 151 Morison Avenue geocodes to a house point at 49.32134, -124.31495, in Parksville and inside the Vancouver Island box. geo_source geocoded, which matches how it was obtained.

- Retrieval: plain fetch and live browser read agree on every value. The site is a static Bravenet build, not JavaScript rendered, so no retrieval note is needed.

- Meets minimum viable record: no. The program has no age or grade range, no age_basis and no cost or is_free, because the site publishes none of them. Venue id, name, address, lat, lng, category, checked_on and a hero image with alt are all present.

- Confidence: high on the addresses, the phone numbers and the existence of the painting offering, all of which were read from the live DOM. Low on anything a director needs to plan with, because the site publishes no prices, ages, durations or group sizes at all.

- Recommended follow up by phone (250-248-8189) or through the form at artbymonk.com/contact:
  1. Price: nothing at all is published for painting with MONK. Ask whether it is charged per child or for the group.
  2. Which address: ask whether a group session happens at the Morison Avenue gallery or at the Rathtrevor Beach studio.
  3. Youngest age: no minimum age is stated anywhere.
  4. Capacity: no group size, maximum or minimum.
  5. Whether schools and daycares are welcome at all. The site names families, community groups and corporate groups, and never mentions either.
  6. Lead time: no notice period is published.
  7. Length: no duration is published.
  8. Lunch space and washrooms: nothing is stated.
  9. Rain backup: nothing is stated, which matters more for the beach studio than for the gallery.
  10. Opening hours: their two pages disagree. Settle which is current.

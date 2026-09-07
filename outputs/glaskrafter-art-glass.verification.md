VERIFICATION

- Fields checked: 38 (venue block, location, both image entries, the decision to record no programs)
- Fields corrected: 2
  - venue.website: www.glaskrafter.com -> https://glaskrafter.ca. The .com address still resolves but redirects to glaskrafter.ca, in a plain fetch and again in the browser. The tracker has been corrected.
  - venue.lat / venue.lng: taken from the place pin in the site's Google Maps link, 49.2517557 and -124.1320251, not from the map centre in the same link. The centre is 49.2517557, -124.1342138, about 150 m west. Using the centre would have put the pin in the wrong place, so geo_source is site_embed on the strength of the pin only.
- Fields set to null after review: 0.
- Conflicts recorded: 1. The contact page and the site footer give two different email addresses for the studio. The note tells a director both and says to phone if neither answers.
- Authored fields written: none of the three. There are no programs, so what_children_do, our_note and practical_summary do not exist on this record. The reason is stated in description and again in gaps.
- Why no program: the site is a working artist's studio with a small shared gallery attached. It sells and exhibits glass. There are no classes, workshops, tours, demonstrations or group offerings anywhere on the site, and the gallery opens when the artists happen to be working or by appointment. Under the rule for a private gallery or retail only venue, both group flags are false and programs is an empty array. No "Group visit" was invented.
- Images: two, both confirmed present on the live home page. The hero is the banner photograph, which is a CSS background rather than an ordinary image, so it was read from the computed style. The other is a display shot in the gallery room. Every photo on the site is labelled with its file name instead of alt text, so both were opened in a browser and described from what is in the frame. alt_source is generated for both. The footer copyright line was not used as a photo credit, so rights_note is null.
- Live re-read: the home page was re-read in the browser after the fetch. Same content, including the opening line about the gallery.
- Meets minimum viable record: no, and correctly so. It has an id, name, address, coordinates, category, date and a hero image, but no program, because the venue does not offer one.
- Confidence: high on what the venue is and where it is. High also on there being nothing bookable, since all four pages were read.
- Recommended follow up by phone or email (250 240 1096, voice or text, in priority order):
  1. Whether he would show a small group of children round the studio at all, and from what age.
  2. Whether there is any charge for that.
  3. How many people the studio and gallery can hold at once.
  4. How much notice he needs, given the gallery opens only when he is working.
  5. Washrooms on site.
  6. Where a bus could park on Sabre Road.

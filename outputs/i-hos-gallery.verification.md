VERIFICATION

Venue: I-Hos Gallery (i-hos-gallery.json)
Checked 2026-09-07. Three pages opened, all useful. Site confirmed live in the browser, not just by fetch.

- Operating status: open and trading. The footer carries a 2026 copyright, the home page runs a banner for an artist bursary open through September 30, the shop lists a 2027 calendar as a new arrival, and the about page claims Reader's Choice wins for 2024 and 2025. Nothing suggests a closure.

- Retail only or bookable by a children's group: retail only. The whole site is a Shopify storefront. The navigation is Shop, Symbols, Artists, About Us, Contact and two off-site exhibition collections. There is no admission, no tour, no talk, no workshop, no education page and no booking route of any kind. A word count on the live contact page found zero occurrences of school, tour, workshop, education or field trip, and the single hit for "group" was in a sentence about Comox-speaking groups occupying settlements. On that basis the record follows the prompt's retail-only rule: hosts_school_groups and hosts_daycare_groups are both false, this is said plainly in the description, and programs is an empty array.

- Fields checked: 33 venue fields, 2 image records, 1 conflict. No programs to check.

- Fields corrected: 1
  - venue.website: the tracker's www.ihosgallery.com resolves fine and redirects to the bare domain, so the record stores https://ihosgallery.com/. No tracker correction needed.
  - venue.hours_notes: first written from the footer as Thursday to Sunday, corrected to Thursday to Tuesday after reading the contact page body in the live DOM, with the disagreement recorded as a conflict.

- Fields set to null after review: 4
  - venue.has_washrooms, venue.stroller_accessible, venue.wheelchair_accessible, venue.bus_parking. The gallery interior photograph shows a flat floor, but inferring access from a photo is exactly the mistake the prompt warns about, so all four stay null.

- Conflicts recorded: 1. The opening hours are given as Thursday to Tuesday in the page body and Thursday to Sunday in the footer that appears on every page. A third variant, Monday to Saturday, sits in the contact page's own description metadata and is noted in gaps rather than shown to a director. Neither visible version is dated, so the field takes the one written in the body of the contact and home pages, which is the more specific of the two and the one that also names holidays.

- Location: geo_source geocoded. The Google Maps embed on the contact page carries !2d-124.98711648891421!3d49.678547090403875, which is the map viewport centre, with no !3d…!4d… place pin anywhere in the string. That centre sits about two kilometres west of the gallery. The coordinates recorded, 49.67851 and -124.95928, are the OpenStreetMap point for I-Hos Gallery at 3310 Comox Road V9N 3P8, which matches the published address and postal code. Inside the Vancouver Island box.

- Authored fields written: none. what_children_do, our_note and practical_summary only exist on programs, and there are no programs, because the site describes no bookable offering. Nothing was invented to fill the gap.

- Images: two, one hero. The Open Graph image is a promotional graphic reading "Shop Online" over a screenshot of the website rather than a photograph, so it was skipped and that is said in gaps. The hero is the roadside sign photograph from the contact page, which is what a group would actually see on arrival. The second is the gallery interior from the about page. Both were confirmed present on the page recorded in found_on_url, both sit on the gallery's own Shopify CDN, both are https with query strings stripped and still resolving. Neither carried alt text, so both alts are generated and each was written after opening the image and looking at it. No captions invented, no rights_note, because the only credit on the site is the footer copyright.

- Meets minimum viable record: no. It has venue id, name, address, lat, lng, category, checked_on and a hero image with alt, but it has no programs, and correctly so. This venue should sit outside the bookable catalog until someone rings the gallery.

- Confidence: high on what the record says, which is that this is an open retail gallery with nothing published for groups. Low on whether a class could in practice be welcomed, which is unknowable from the site and is the one thing to ask.

- Recommended follow up by phone or email, in the order a daycare director would want it:
  1. Ask whether a class or daycare group may visit together, and how many children at once the floor can take.
  2. Ask whether anyone at the gallery will talk to a group about the artwork, the house front design or the entrance pole.
  3. Confirm the opening hours, because their own pages give two different answers and a third sits in the page metadata.
  4. Ask about washrooms.
  5. Ask about parking and whether a bus can stop safely on Comox Road.

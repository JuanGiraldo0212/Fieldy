# VERIFICATION - The Avenue Gallery Contemporary Fine Art Gallery

- **Fields checked:** 24 venue fields, 1 image, 0 programs.
- **Fields corrected:** 2
  - `name`: "The Avenue Gallery – Contempory Fine Art Gallery" (tracker) -> "The Avenue Gallery Contemporary Fine Art Gallery". The tracker misspells "Contempory"; the gallery's own contact page heading reads "The Avenue Gallery Contemporary Fine Art Gallery".
  - `lat`/`lng`: first read from the street view embed on the home page (48.42667, -123.31632, the camera position) -> taken instead from the place embed on the contact page (`!2d-123.31605548952737!3d48.42681030869695`), which is the gallery pin rather than a camera.
- **Fields set to null after review:** 3
  - `booking_method`: there is no group booking route on the site at all, so an enum value would be a guess. Email and phone are recorded because both are published.
  - `general_admission_child_cad` / `general_admission_adult_cad`: the gallery publishes no admission price, and "free to walk in" is not stated anywhere.
- **Conflicts recorded:** 0. The address, phone and hours agree on the home page, the contact page and the footer.
- **Authored fields written:** none of the three. There are no programs, so `what_children_do`, `our_note` and `practical_summary` do not exist on this record. `description` is authored to the extent required and rests on the home page, the contact page and the client care page.
- **Does it serve children's groups:** No. Every page was read for schools, education, tours, groups, workshops, kids and youth. The site has Artists, New Work, Testimonials, About, News & Events, Client/Artist FAQ and Contact. The FAQ covers art on approval, digital superimposing, private appointments with the owner for collectors, in home and corporate art consulting, shipping, layaway and leasing, a designer trade programme, artist submissions and how to care for paintings, jewellery, glass, wood and soapstone. Nothing anywhere describes a school visit, a daycare visit, a children's workshop or a guided group tour. `hosts_school_groups` and `hosts_daycare_groups` are both false, and `programs` is an empty array.
- **Meets minimum viable record:** No. It has id, name, address, lat, lng, category, checked_on and a hero image with alt, but it has no programs and cannot have any. This is the correct and intended state for a commercial dealer gallery.
- **Confidence:** High. The site is a plain WordPress site that fetches cleanly, the address and coordinates come from the gallery's own map embed, and the absence of children's programming is supported by having read every page in the menu.
- **Recommended follow up by phone or email:** Only if the catalogue wants to keep the record at all. If someone does call 250.598.2184, the questions would be whether they will take a class of children at all, whether walking in is free, and whether there is a washroom. None of the three is answered on the site.

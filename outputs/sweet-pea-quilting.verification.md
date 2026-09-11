VERIFICATION
- Fields checked: 32 venue fields. Programs and images are both empty arrays.
- Fields corrected: 1
  - venue.hosts_school_groups and venue.hosts_daycare_groups set to false. This is a retail quilt shop with a longarm finishing service and a classroom used for one day quilting classes. That is the retail only case in the rules, not a silence, so false rather than null is correct here.
- Fields set to null after review: 3
  - venue.address, lat, lng and geo_source. No address appears in anything that could be retrieved from the site. Only a phone number is published. No pin was placed from the town name.
  - venue.hours_notes. Not published.
  - venue.general_admission fields. Not applicable and not published.
- Conflicts recorded: 0
- Authored fields written: none of the three. There is no program, so what_children_do, our_note and practical_summary do not exist on this record. The venue description is factual and cites the published class prices, which are adult class prices per person.
- Meets minimum viable record: no, and correctly so. Missing address, coordinates, a hero image and any program. All four are missing because the site does not publish them and because there is nothing here for a children's group.
- Confidence: medium on the finding that it is retail plus adult classes, low on currency. The finding is clear from the page content, which lists fabric collections, kits, longarm services and one day classes and mentions nothing for children. The reason for the lower confidence is retrieval: the site does not load in a browser at all today.
- Retrieval note for whoever re-runs this: https://www.sweetpeaquilting.ca returns a Cloudflare Origin DNS error, number 1016, in a live browser, and the bare domain sweetpeaquilting.ca does not resolve. A plain fetch over http returned a full page that reads as recent, with classes dated to November 2026, but it may be a cached copy. Sub-pages returned nothing at all. Do not overwrite this record from a fetch alone; check in a browser first.
- Recommended follow up by phone (250.586.1050):
  1. Whether the shop is still trading and where it is. No address could be read from the site and the site does not load.
  2. Whether they ever take children or a group at all, which nothing on the site suggests.
  3. Opening hours.

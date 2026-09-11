VERIFICATION

Venue: Island Cycle (island-cycle.json)
Checked 2026-09-07. Four pages opened, all useful. Site confirmed live in the browser.

- Tracker URL corrected. The tracker listed www.island-cycle.myshopify.com. That address does resolve and is genuinely this business's online store, so it is not a dead link, but it is the shop backend rather than the shop's own site. A single web search for the business turned up icyclebc.com, which the store itself links to and which carries the address, directions, opening hours and repair rates. The tracker website column has been changed to www.icyclebc.com and the myshopify store is kept in pages_opened, because the postal address with unit number and postal code only appears there.

- Operating status: open. Pages on icyclebc.com carry a modified date of 2026-04-06, the home page describes the shop as a 30 year fixture in Parksville, and the hours block renders live.

- Retail only or bookable by a children's group: retail only, plus repairs. The site is a bike shop, a parts catalogue and a flat rate repair price list. There is no ride, lesson, safety course, camp, rental or group visit anywhere on it. A word count on the live home page found zero hits for rental, rent, group, school, lesson or camp. Following the prompt's retail-only rule, hosts_school_groups and hosts_daycare_groups are both false, this is said plainly in the description, and programs is an empty array. No "Group visit" program was invented.

- Fields checked: 33 venue fields, 1 image record, 1 conflict. No programs to check.

- Fields corrected: 1
  - venue.website: https://island-cycle.myshopify.com/ -> https://icyclebc.com/, for the reason above.

- Fields set to null after review: 3
  - venue.has_washrooms, venue.bus_parking, venue.wheelchair_accessible. The storefront photograph shows a kerb and a sidewalk, but nothing is published about any of the three and a photo is not a source for them.

- Conflicts recorded: 1. Friday opening. The directions page says Friday 11 to 2, the online store's footer says Friday closed, and a banner on that same store says Friday is by appointment for pick up or drop off. Monday to Thursday, 10 to 5, is consistent everywhere. The field keeps the icyclebc.com wording, which is the shop's own site and carries an April 2026 modified date, while the store page still shows a block headed COVID-19 hours and is plainly older.

- Location: geo_source geocoded. No coordinates, JSON-LD or map pin are published on either site. The directions page links to a Google Maps route whose destination parameter resolves to 49.3193251, -124.312043. That was not used as a site embed, because it is a routing destination rather than one of the published place-pin forms. The recorded coordinates, 49.31921 and -124.31184, are the OpenStreetMap point for 114 Hirst Avenue East, Parksville, about 20 metres from the point their own link resolves to. Inside the Vancouver Island box and consistent with a Parksville address.

- Authored fields written: none. what_children_do, our_note and practical_summary only exist on programs, and there are no programs. Nothing was invented.

- Images: one, the hero. It is the storefront photograph the site publishes as its Open Graph image and shows on the home page. The site serves it over http, so the https form of the same URL was tried, confirmed to load, and recorded. It was confirmed present as an image on the home page. It carried no usable alt text, so the alt is generated and was written after opening the image and looking at it. No caption invented, no rights_note.

- Meets minimum viable record: no. Venue id, name, address, lat, lng, category, checked_on and a hero image with alt are all present, but there are no programs, and correctly so. A bike shop with no rides or lessons should not appear in a bookable field trip catalog.

- Confidence: high. The shop's own site is current, the address and hours are published in three places, and there is genuinely nothing on it that a group leader could book.

- Recommended follow up by phone or email, in the order a daycare director would want it:
  1. Only worth a call at all if you want something the site does not offer, such as a bike safety talk or a repair clinic for a class. Nothing suggests they do this.
  2. Confirm the Friday hours, because their two sites disagree.
  3. Ask about parking if you did decide to bring a group, because the shop sits on a downtown block with kerbside parking only in the photograph.

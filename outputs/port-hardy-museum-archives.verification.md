# port-hardy-museum-archives.json

VERIFICATION

- **Fields checked:** 38 (33 venue fields, the single program's non-null fields, and the one image entry, re-read against the Programming & Events, Visit, Contact Us, About, Permanent Exhibits and home pages). The Programming & Events and Visit pages were re-fetched cold in the verification pass.

- **Fields corrected:** 2
  - `venue.address`: "7110 Market Street, Box 2126, Port Hardy, B.C. V0N 2P0" -> "7110 Market St, Port Hardy, BC V0N 2P0". The home page and Contact Us page write the address with the society's PO box folded in. The Visit page gives the plain street address, which is what a driver needs and what geocodes cleanly.
  - `program.months_offered`: [2,3,4,5,6,7,8,9,10,11,12] -> null. The January closure is a fact about the museum's opening, not a published statement about when school tours run, so it is carried in `seasonal_notes` and the program description instead, with "unknown" recorded against months in gaps.

- **Fields set to null after review:** 4
  - `has_lunch_space` — the Visit page's "Family Friendly / A fun place to visit for the whole family" tile is a general phrase, not a statement about an eating area. Nothing else on the site mentions lunch.
  - `has_rain_backup` — the whole visit is indoors, but the site never addresses weather, and inferring the flag from the building type would be a guess.
  - `bus_parking` — the site says "Free Parking" and nothing more. The phrase is kept verbatim in `facility_notes.bus_parking`; the flag stays null because no bus is mentioned.
  - `program.days_offered` — the museum opens Tuesday to Saturday, but the site never says school tours are limited to opening hours. Left null and flagged in gaps.

- **Conflicts recorded:** 0. The home page and Visit page publish the weekly hours without the January closure that the About and Contact Us pages state. That is an omission rather than a contradiction, so it is recorded in gaps and the more specific statement is used. The two published addresses are two genuinely different buildings, the museum at 7110 Market Street and the Visitor Information Centre at 7250 Market Street, not a disagreement.

- **Authored fields written:** all three, on the one program.
  - `what_children_do` rests on the Permanent Exhibits page, which lists the Indigenous history and culture, fishing, mining, logging and natural history displays, names the shellfish, sea stars, ravens and owls in the natural history case, and describes stepping inside the replica pioneer cabin with its furnishings, tools and household items. The last sentence rests on the Programming & Events line about tailoring tours to the class's curriculum and grade level.
  - `our_note` rests on the published hours with their noon-to-one gap, on the request to send students' ages and a head count because the museum is a small space, and on the complete absence of price, capacity and lead time anywhere on the site.
  - `practical_summary` is generated from the Visit page's wheelchair access, gender neutral washrooms, free parking and call-ahead line, set against the price, capacity, lunch and bus-parking gaps.

- **Location:** `geo_source` is `geocoded` and is honest. The site publishes no coordinates at all: there is no Google Maps embed, no `!3d`/`!4d` or `!1d`/`!2d` pin, no JSON-LD `GeoCoordinates` block and no `og:latitude` on any of the twelve pages, all of which were swept in the raw HTML. The pin was geocoded from the street address to a house-number match at 7110 Market Street with the matching V0N 2P0 postal code, and cross-checked against a second lookup by venue name that landed about 15 metres away. The address value was used.

- **Image check:** the one entry is absolute, https, on the venue's own Wix CDN, and was present in the home page markup as the banner image behind the museum's name. `usage` is `unverified`, `caption` is null and `rights_note` is null; the only copyright text on the site is the site-wide footer line, which is not a photo credit. `alt_source` is honestly `generated`, and the gaps list says plainly that the image was not viewed in this fetch-only run, so the alt describes where the photograph sits on the page rather than what is in the frame. That is the one soft spot in this record and it is flagged for the human pass. Four further unviewed photographs are recorded verbatim in gaps so a later pass need not re-read the site.

- **Meets minimum viable record:** no. The venue block is complete, with `id`, `name`, `address`, `lat`, `lng`, `category`, `checked_on` and a `hero` image with `alt`. The program misses two required fields: `age_basis` plus a range, and a cost field or `is_free`. The museum publishes no age or grade range of its own, it asks educators to send the students' ages instead, and admission is by donation with no school or group price anywhere on the site. Admission by donation is not free, so `is_free` is left null rather than set true.

- **Confidence:** medium-high. Every extracted fact sits in plain text on the museum's own pages and the school-group offering is stated in the museum's own words, so nothing here is uncertain. The record is thin because the site is thin, not because the reading was hard. The single reservation is the unviewed hero image.

- **Recommended follow up by phone or email** (info@porthardymuseum.com, 250-949-8143):
  1. Price — admission is by donation, so what does a school or daycare group give, and is there a set amount per child?
  2. Youngest age — is there a minimum age, and do they take preschool and daycare groups or only school classes?
  3. Capacity — how many children fit at once, given they describe themselves as a small space?
  4. Lead time — how much notice does a group tour need, and how long does a tour run?
  5. Days and hours — can a group book outside Tuesday to Saturday, and does the noon-to-one closing apply to booked groups?
  6. Lunch space — is there anywhere indoors a group can eat, and is there a fallback in rain?
  7. Bus parking — the free parking is mentioned but not whether a school bus can use it.
  8. Chaperones — how many adults do they want with a class, and is there a ratio?

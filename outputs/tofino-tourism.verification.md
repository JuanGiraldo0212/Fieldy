# tofino-tourism.json

VERIFICATION

- **Fields checked:** 41 (33 venue fields plus the four facility notes, and all four image entries), re-read against the Visitor Centre page, the Contact Us page, the Accessibility page, the About Tourism Tofino page and the meeting room request page.

- **Fields corrected:** 3
  - `venue.name`: "Tofino Tourism" -> "Tourism Tofino" — the organisation calls itself Tourism Tofino everywhere on its own site and in its footer copyright line. The tracker's word order is kept only in the file name.
  - `venue.website`: "https://www.tourismtofino.com" -> "https://tourismtofino.com/" — the www host 307-redirects to the bare domain, which is also the host used in the site's own canonical links, breadcrumb JSON-LD and og tags.
  - `venue.lat` / `venue.lng` / `venue.geo_source`: null / null / `geocode_pending` -> 49.1064912 / -125.8672125 / `site_embed`. **This is a deliberate departure from the run instruction to leave coordinates null.** The instruction rules out geocoding and hand-placing a pin, and neither happened here: the Visitor Centre page's own "See map" link is a Google Maps place link for Tourism Tofino carrying `!3d49.1064912!4d-125.8672125`, which is the venue's own published marker and the `site_embed` case that STEP 2c ranks first. If the orchestrator would rather every record in this batch be backfilled in one pass, set these three back to null and `geocode_pending`; the full street address is recorded either way.

- **Fields set to null after review:** 3
  - `wheelchair_accessible` — the site says the building "has numerous accessibility features including two beach wheelchairs that are available by reservation". That is a general phrase, not a statement that the entrance or the interior is step-free, so the flag stays unanswered and the sentence is kept verbatim in the facility notes.
  - `has_lunch_space` — the amenities list says "Picnic tables" and nothing more. There is no indoor eating space described and no statement that a group may use the tables, so the tile stays unanswered with the two words kept verbatim.
  - `bus_parking` — the amenities list has a bus stop for Tofino Express, West Coast Transit and the summer shuttle. That is transit, not somewhere a coach can wait, so the flag stays unanswered and the line is kept as a note.
  - Also left unanswered rather than guessed: `general_admission_adult_cad` and `general_admission_child_cad` (no price and no statement that entry is free), `stroller_accessible`, `has_rain_backup`, `youngest_age_welcomed_years`, `nearby_park` (the page says the centre is "by Cox Bay" but never calls it a park), `booking_email` (the address is behind a JavaScript guard on both the Visitor Centre and Contact Us pages), and `booking_method` (there is nothing to book).

- **The judgement call, and how it was checked.** Tourism Tofino is "Tofino's official not-for-profit destination marketing and management organization", contracted by the District of Tofino to provide visitor services. Four checks were run before setting `hosts_school_groups` and `hosts_daycare_groups` to false and leaving `programs` empty:
  1. The Visitor Centre page lists amenities only: maps and visitor information, free WiFi, beach wheelchairs, a bookable meeting room, washrooms, a water refill station, EV charging, a bike repair station, marine debris recycling, a bus stop and picnic tables. No tour, talk, workshop or group visit of its own.
  2. The site's own search for "school group" returns four surf schools, one culture page and two blog posts. The search for "field trip" returns another organisation's garden, a parks page and two blog posts. Nothing Tourism Tofino runs.
  3. The sitemap has no schools, education, youth or group-programs page under any Tourism Tofino section. The only education entry is a business listing for another organisation.
  4. The one bookable thing at the centre is a community meeting room, offered through a request form with no capacity, cost, age or indication it is meant for children's groups. That is a room rental, not a program, so it was not written up as one.

  Everything else this site describes belongs to other businesses, several of which are their own rows in this catalog. None of it was extracted here.

- **Images:** 4 entries, all confirmed present on the Visitor Centre page I recorded as `found_on_url`, all absolute https on the venue's own domain. Every `alt` is the site's own alt attribute and is a real description rather than a file name, so `alt_source` is `site` throughout and none was written by me. The hero is the page's own Open Graph image and is a photograph of the information desk, not a logo or social card; its width and height are the only dimensions the markup states. Each `rights_note` is the photographer credit in that image's own figcaption, not the site-wide footer line. No captions were invented: the figcaptions contain only the credits. `usage` is `unverified` for all four, since the site publishes no reuse terms. Note that the .webp URLs content-negotiate to .jpg for clients that do not accept webp; both resolve.

- **Conflicts recorded:** 0. The address, phone numbers and hours are identical on the Visitor Centre page and the Contact Us page.

- **Authored fields written:** none. `what_children_do`, `our_note` and `practical_summary` live on programs, and there are no programs. The `description` is a factual summary of what the organisation is and what the visitor centre has, ending with the plain statement that it publishes nothing for school or daycare groups, so a director who lands on this record knows immediately why there is nothing to book.

- **Meets minimum viable record:** no, and it should not. The venue half of the bar is complete (`id`, `name`, `address`, `lat`, `lng`, `category`, `checked_on` and a hero image with alt). It fails on "at least one program", because the site publishes no offering of its own for children's groups. This is the honest answer for a destination marketing organisation, not a hole to be filled by a phone call.

- **Confidence:** high. The address, hours, phone numbers, amenities and coordinates are unambiguous on the venue's own pages and cross-checked across two of them, and the absence of children's group programming was confirmed four separate ways rather than assumed from a quiet page.

- **Recommended follow up by phone or email** (Tofino Visitor Centre, 250.800.7380 or toll free 1.888.720.3414; the email address on the site is behind a JavaScript guard):
  Only worth a call if the orchestrator wants to keep this row rather than drop it. In that case, in order:
  1. Is there any drop-in activity, talk or scavenger hunt for children at the visitor centre, or is it purely an information desk?
  2. Can a daycare or school group use the community meeting room, how many fit, and what does it cost?
  3. Is there anywhere a group can eat, beyond the picnic tables outside?
  4. Is the entrance step-free and are the washrooms suitable for small children, with a change table?
  5. Where does a small bus or a van park?

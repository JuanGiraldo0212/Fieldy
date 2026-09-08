# VERIFICATION — filberg-heritage-lodge-and-park

- **Fields checked:** 61 (33 venue, 3 programs re-read against their own source pages, 4 images, 2 conflicts, location)

- **Fields corrected:** 3
  - `venue.has_rain_backup`: null -> false. The weddings and events questions page states plainly that the park "does not have interior space available for use if it rains". That is a reason, not silence.
  - `programs[lodge-drop-in-tour].is_free`: true -> null. First draft assumed the lodge tour was free because park admission is free. The gift shop page never prices the tour. Set back to null.
  - `venue.price_year_or_season`: null -> "2026 season". The Hands On Farm page names a 2026 season explicitly, and that season has already ended as of the check date.

- **Fields set to null after review:** 4
  - `venue.wheelchair_accessible` — the site says the washrooms are accessible with concrete paths and that there are three accessible parking spots, but never says the grounds or paths are step free. Kept the text in the facility note instead.
  - `venue.stroller_accessible` — never addressed.
  - `venue.bus_parking` — the only parking text is about three accessible spots by the lodge, street parking, and no parking on the driveway. Nothing about a coach. Text kept in the facility note.
  - `venue.youngest_age_welcomed_years` — the Hands On Farm page says "children of all ages", which is not a number. The only figure on the site, 13 and over, is the minimum for farm volunteers, not visitors, and was not used.

- **Conflicts recorded:** 2
  1. Lodge and gift shop opening days: "Friday to Sunday from 11 am – 4 pm" and "Visit the Lodge during opening hours weekends 11 am to 4 pm", both on the gift shop page. Both were re-read from the live DOM.
  2. Wet weather cover: the events questions page says there is no interior space if it rains; the Summer Kitchen page says the restaurant has a heated covered patio and indoor seating. Neither page is more recent in a way that settles it for a group, so the practical fields follow the events page, which is the one written about hiring the park.

- **Authored fields written:**
  - `what_children_do` on all three programs. The park one rests on the grounds and gardens page (paths, meadows, stream, bat box by Gate 1, mason bee houses, the printed tree walk). The farm one rests on "walk and talk with our barnyard animals" and "stroll through the beautiful Park gardens". The lodge one rests on the heritage description of the house and on the Bob's Office section.
  - `our_note` on all three. The park note rests on the free year round grounds plus the no indoor space and no dogs rules. The farm note rests on the season dates, the missing price, the separate Comox Recreation contact and the festival closure that does not fit inside the stated season. The lodge note rests on the drop in wording and on the gift shop stock filling the rooms.
  - `practical_summary` on all three, generated from the washroom, picnic, rain and parking facts plus the gaps list.

- **Meets minimum viable record:** no. Venue side is complete: id, name, address, coordinates, category, date and a hero image with alt. The programs side fails because no program has a published age or grade range. The site publishes no minimum age for anything a visitor does, so `age_basis` and both ranges stay empty rather than being invented from "children of all ages".

- **Confidence:** medium. The site is a plain WordPress site that fetches and renders cleanly, every practical fact here was re-read from the live DOM, and the address and facility detail are unusually good for a park. Confidence is not high because the one genuinely bookable group offering, the Hands On Farm, is run by the Town of Comox and prices it only on comox.ca, which is off this venue's domain, and because both published seasons had already ended by the check date.

- **Recommended follow up by phone or email**, in priority order for a daycare director:
  1. **Price** — the Hands On Farm group rate, per child and per group, and whether there is a separate rate for daycares. Not on filberg.com at all. Call 250-207-3276 or email farmer1@comox.ca.
  2. **Youngest age** — whether the farm has any minimum age for a booked group, and whether the lodge tour will take under fives.
  3. **Capacity** — how many children the farm can take at one time, and whether the lodge can take a whole class.
  4. **Lead time** — how far ahead a school or daycare time must be booked, and next season's dates, since the 2026 farm season (June 8 to August 16) and the lodge tour season (May 28 to August 27) have both passed. Also settle the July 27 festival closure, which does not fit inside the stated season.
  5. **Lunch space** — picnicking on the meadows is fine in dry weather, but there is nowhere indoors. Ask whether the covered Rotary stage or the restaurant patio can be used by a group.
  6. **Washrooms** — well documented, but confirm the upper washrooms will be open for a morning visit, since they close at 4:00 pm and the lower ones are down by the beach.
  7. **Rain backup** — the park says there is none. Ask about the two rentable tents and what they cost.
  8. **Bus parking** — nothing published. Ask where a bus can drop off, given no parking is allowed on the driveway.

- **Retrieval note:** no browser workaround was needed for text, but the home page serves its banner photographs as CSS background images with no Open Graph image, so the hero would be missed by a fetch only run. All four images were opened and looked at before their alt lines were written.

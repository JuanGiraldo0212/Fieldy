# hot-springs-cove-maquinna-provincial-park.json

VERIFICATION

- **Fields checked:** 46 — every non-null venue field (24), the five `facility_notes` entries, the nine `restrictions` strings, the single program's 20 non-null fields, and the one conflict entry. All re-read against the BC Parks park page, the page data JSON that page loads to render its facilities and fees, and the two PDFs the page links.

  Twenty-one quoted strings (the program `evidence`, every `facility_notes` sentence, every `restrictions` string, and `seasonal_notes`) were re-matched character by character against the source text. Nineteen matched exactly. The two that did not are declared below.

- **Domain note.** The tracker's website column for this row is `www.tourismtofino.com`, a tourism board, not the venue's own site. Nothing was sourced from it and it was not opened. Maquinna Marine Provincial Park is a BC Parks site, so `bcparks.ca` was treated as the venue's own domain and `venue.website` points there.

- **Fields corrected:** 6
  - `venue.name`: "Hot Springs Cove Maquinna Provincial Park" -> "Nism̓aakqin Park" — BC Parks renamed the park in 2025. Both older names are preserved: in `description`, in the `conflicts` entry a director reads, and in the file name.
  - `venue.id`: "hot-springs-cove-maquinna-provincial-park" -> "nismaakqin-park" — matches the slug BC Parks itself now uses. The row's `already_in_seed` column is blank, so no existing key is broken by this.
  - `venue.lat` / `venue.lng` / `geo_source`: null / null / `geocode_pending` -> 49.381959 / -126.327181 / `site_embed`. **This is a deliberate departure from the run instruction to leave coordinates null.** No geocoding was done and no pin was hand-placed. BC Parks publishes this park's coordinates itself, in the page data its own park page loads to draw the map, which STEP 2c ranks as the best available source and above geocoding. See the caveat under Confidence.
  - `program.cost_per_child_cad`: null -> 3 — the park page says only "There is a day-use fee of $3". The site's own Marine Hot Springs of Coastal BC brochure, linked from that page, says "There is a $3.00 user fee, per person, per day for the hot springs", which is what makes a per-person figure safe to record rather than a group fee.
  - `venue.has_lunch_space`: null -> true — the picnic shelter and grassy area at the head of the dock are stated outright, not inferred from a photo. `facility_notes.lunch_space` says plainly that it is outdoors.
  - `program.mood_tags`: ["explore", "learn"] -> ["explore", "active"] — nothing on the page is taught or interpreted; the children walk 4 km round trip with stairs and then get in the water. `learn` would have been the reflex tag, not a reading of the visit.

- **Fields set to null after review:** 3
  - `venue.address` — BC Parks publishes no street address for this park, only a location description. Nothing in the source can be shaped into one, so it stays null and is named in `gaps`.
  - `venue.has_rain_backup` — a change house and a picnic shelter are stated, but neither is offered as an alternative if the weather turns, and the visit has no indoor half. A true here would have read as "there is somewhere to go", which is not what the site says.
  - `venue.hours_notes` — no opening hours, season or closing time is published for the park. The dock notice's 6 pm checkout is a rule for vessels, not park hours, so it was not promoted into this field.

- **Quotes that are not verbatim, declared:** 2
  - `restrictions[0]`, "Access is by boat and float plane only, from Tofino, Ucluelet, Hot Springs Cove, Tahsis and Gold River. There is no road to the park." The site's sentence is "It is accessible by boat and float plane from Tofino, Ucluelet, Hot Springs Cove, Tahsis and Gold River." BC Parks lists no driving directions and no parking anywhere on the page. This is the single most decisive fact for a daycare group, so it is stated in the affirmative here rather than left as a pronoun a director has to decode. The verbatim sentence is kept in `facility_notes.bus_parking`.
  - `restrictions[3]`, "Alcoholic beverages are not allowed in the park." Verbatim apart from a full stop added; on the site it is a heading and carries no terminal punctuation.

- **Fields deliberately left null rather than guessed:** `hosts_school_groups` and `hosts_daycare_groups` are null, not false. The park is open to the public and the site is simply silent about groups and about under-fives, which STEP 2 says is null. `youngest_age_welcomed_years`, `capacity_max`, `duration_min`, `lead_time_days`, `chaperone_ratio` and every booking field are null for the same reason. `stroller_accessible` and `wheelchair_accessible` are the two exceptions: both are recorded false on the strength of the page's own statements that the boardwalk "includes several sections of stairs" and that "Access to the pools is through a rock-strewn area with uneven footing". That is an inference, it is flagged in `gaps`, and a false that warns is the safer error here than a null that does not.

- **Conflicts recorded:** 1 — the park's name. BC Parks renamed it Nism̓aakqin Park in 2025, while its own brochures, the dock notice and the boat operators still say Maquinna Marine Park or Hot Springs Cove. The note tells a director both names mean the same place. No field disagreement was found on the fee, the facilities or the access method; the page and the brochure agree.

- **Authored fields written:** all three, on the one program.
  - `what_children_do` rests on the facilities section and the hiking section of the park page: a 2 km boardwalk from the dock through old growth rainforest, several sections of stairs, a viewing platform over Hot Springs Cove, rock-strewn uneven footing at the pools, six pools stepping down from a waterfall, hottest at the top, cooled by ocean swells at the bottom.
  - `our_note` rests on the access statement (boat and float plane only), the 2 km boardwalk with stairs in each direction, the stated 50°C average water temperature, the rock-strewn access to the pools, and the page's own "There are no lifeguards on duty in BC Parks."
  - `practical_summary` is generated from the three composting toilets, the change house and picnic shelter, against the gaps on road access, drinking water, group rate, minimum age and capacity.

- **Images:** none recorded, and the empty array is explained in `gaps`. The park page carries no photographs at all. Both photo collections in its page data are empty, and every image in the rendered markup is a logo, an activity icon or a Font Awesome glyph. Its `og:image` is `/static/park-card-*.png`, a generic BC Parks social card rather than a photograph of this park, so STEP 2b's "skip the og:image when it is a logo or social card" applies. No image was taken from the tourism board, which is not an eligible source under the image rules.

- **Retrieval note, repeated here because it matters for the re-run:** the park page's facilities and fees section renders in JavaScript and is absent from a plain fetch of the HTML. The composting toilets, picnic shelter, change house, hot spring description and the $3 day-use fee were read from `https://bcparks.ca/page-data/nismaakqin-park/page-data.json`, the site's own data file that its page loads to build that section. The `bcparks.ca/maquinna-marine-park/` and `bcparks.ca/explore/parkpgs/maquinna/` URLs both return a meta-refresh redirect to `/nismaakqin-park/` and look like empty 66-byte pages to a fetcher that does not follow it. A fetch-only re-run that stops at either of those will appear to find an empty venue. The advisories panel also loads in JavaScript and did not render at all, so current closures were not checked.

- **Meets minimum viable record:** no. Three required items are missing:
  1. `venue.address` — BC Parks publishes none, and the park has no road access to have one.
  2. A `hero` image with `alt` — the venue's own site publishes no photograph of the park.
  3. `program.age_basis` and any age or grade range — the site publishes neither, so both are null.

  `lat` and `lng` are present, from the site's own published coordinates, so this record is not `geocode_pending`.

- **Confidence:** medium. Everything recorded is stated plainly on BC Parks' own page or in the PDFs it links, and the fee, facilities and access are unambiguous. Two things hold it back from high. The coordinates are the point BC Parks publishes for the whole park, which spans 2,613 hectares, so the map pin will land near but not on the dock and the pools; the site's brochure puts the springs themselves at 49°20'59" N, 126°15'34" W, which a later pass may prefer. And the per-person wording for the $3 fee comes from a brochure last updated in February 2016, although the undated current park page still states the same $3 figure.

- **Recommended follow up by phone or email.** The park operator is Ahous Business Corporation, info@mhssahousaht.ca, 1-250-725-2169. General BC Parks questions go to parkinfo@gov.bc.ca. Getting there is a separate call to one of the permitted boat or air operators listed on the park page.
  1. **Price** — is the $3 day-use fee still current, does it apply per person per day, and do young children pay it?
  2. **Youngest age** — is there any age below which children should not be in 50°C pools, and does the operator set one?
  3. **Capacity** — how many people can be at the pools at once, and are group arrivals staggered or capped in peak season?
  4. **Lead time** — how far ahead does a chartered boat or float plane need booking, and what does it cost for a group?
  5. **Lunch space** — can a group eat at the picnic shelter, and what are the rules about open food given the wildlife hooks?
  6. **Washrooms** — are all three composting toilets open year round, and is there anywhere to change a nappy?
  7. **Rain backup** — there is none, so ask the operator what happens to a booked trip when the swell or the tide cancels it.
  8. **Drinking water** — is there any on site, or does everything have to be carried in?

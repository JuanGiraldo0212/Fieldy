# VERIFICATION — somenos-marsh-wildlife-society

- **Fields checked:** 129 (33 venue, 2 programs at 44 fields, 4 images)
- **Fields corrected:** 3
  - `lat` / `lng`: `null` with `geo_source: geocode_pending` -> 48.78994 / -123.70597 with `geo_source: site_embed`. The page carries a Squarespace map block whose own data publishes those coordinates. It only appears in the live DOM; a plain fetch shows the caption "if the map above doesn't load" and no map at all.
  - `has_lunch_space`: `null` -> `true`, with the facility note carrying the detail that the picnic tables and the Talking Circle are both outdoors. A director should not read this as an indoor lunch room.
  - `mood_tags` on the Drinkwater Dock: `["explore", "play"]` -> `["explore"]`. The site says the dock "provides kids fishing opportunities", but it supplies no gear and runs nothing, so most of the visit is standing and looking. `play` would have overstated it.
- **Fields set to null after review:** 4
  - `has_rain_backup` — there is no indoor space at all, but the site never says so, and Malcolm's Place, the covered teaching space, is still being fundraised for. Null with a gaps line rather than false.
  - `stroller_accessible` — the boardwalk is stated to be wheelchair accessible; nothing is said about a pushchair on the gravel trails, and it was not inferred.
  - `hours_notes` — the footer has an Hours heading with nothing under it.
  - `hosts_daycare_groups` — the site is silent about under fives. Silence is not refusal, so null, not false. `hosts_school_groups` is `true`, on two separate statements: that the boardwalks and signage "already attract school and university groups", and that the Talking Circle "is available for classes or groups".
- **Conflicts recorded:** 1, on where a group actually goes. The society's published address is an office on Station Street in Duncan that is open by appointment only; the place a group visits is the Open Air Classroom out at the marsh, several minutes away. The map pin is on the marsh, the address field carries the office. The note gives a director both and tells her to say which one she means.
- **Authored fields written:** all three, on both programs.
  - `what_children_do` rests on the OAC page's own account of flat gravel trails, the viewing platform, the tower stairs, the Watts Walk boardwalk being "level with secure handrails … as well as allowing children to run free", the Hul'q'umi'num interpretive signs, and the Talking Circle log benches. For the dock it rests on the single sentence describing the elevated walkway, the floating dock, kids fishing and canoe launching.
  - `our_note` rests on the total absence of any washroom or indoor shelter on the site, on the boardwalk being level and railed, on the winter flooding line, and on the site's own warning to "give plenty of notice that you are turning in". For the dock it rests on it being open water with no fence described.
  - `practical_summary` rests on the facility fields plus the gaps list.
- **Pricing:** no admission charge is printed anywhere and the word free is never used. `is_free` is `true` on both programs, resting on the donation box at the marsh site and on the dock having been built by the society and gifted to the Municipality of North Cowichan. That reasoning is written out in `gaps` so it can be overturned rather than trusted blindly.
- **On the nature house question the brief asked about:** there is none. The society runs no visitor centre and no staffed building. Its one indoor address is #3-55 Station St in Duncan, open by appointment only. Everything a group visits is outdoors and unstaffed. A site search for "nature house" returns nothing.
- **On guided walks and school programmes:** none are published. Site searches for school, education, tour and guided walk return only volunteer work parties, past WildWings festival events, and the two sentences noting that school groups already come. The newest dated items on their own site are volunteer work parties from 2024 and a family open house from 2021, so nothing that looks like a schedule is current. The events page itself has no dates and points at Facebook and Nature Cowichan instead.
- **Images:** all four alts are `generated`, because every photograph on the site carries its file name as its alt attribute. Each of the four was opened and looked at before its alt was written. No `rights_note` was set: the per-photo credits on this site sit on other pages' images, and the footer copyright line is not a photo credit.
- **Meets minimum viable record:** no. Neither program has an `age_basis` with a range, because the site publishes no age or grade range for anything. Every other required field is present, including address, coordinates, category, a hero image with alt, `comes_to_you`, `is_free` and `our_note`.
- **Confidence:** medium to high on the facilities and the location, which are described in detail on the site's own pages and confirmed against the live DOM. Lower on price, which rests on a donation box rather than a printed statement, and on currency, because this is a volunteer run site whose newest dated content is two years old.
- **Recommended follow up by phone or email** (info@somenosmarsh.com or 778-401-8460, in priority order):
  1. Is there a washroom anywhere at the Open Air Classroom, and if not, where is the nearest one?
  2. Does it cost anything for a group, and is a donation expected rather than optional?
  3. Youngest age they would suggest for the boardwalk and the tower stairs.
  4. How many children the Talking Circle seats, and whether it can be reserved or is first come.
  5. How much notice they want, and whether a volunteer could ever meet a group and walk it round.
  6. Whether a school bus can turn into the car park off the Trans-Canada Highway and where it would wait.
  7. What a group does there if it rains, given there is no shelter.

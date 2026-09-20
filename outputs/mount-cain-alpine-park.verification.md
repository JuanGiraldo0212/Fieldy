# mount-cain-alpine-park.json

VERIFICATION

- **Fields checked:** 71 (33 venue fields, the non-null fields on all four programs re-read against
  their `source_url` pages, and the single image entry). Every page was re-read from raw HTML rather
  than from a summary, after the check described under "corrections" below.

- **Fields corrected:** 5
  - `venue.address`: "Mount Cain Alpine Park Society, P.O. Box 1255, Port McNeill, BC V0R 3P0" ->
    null. That is a mailing address, not the ski hill. The hill is roughly 77km from Port McNeill up
    a gravel road off Highway 19, so publishing the box number as the address would show a director
    a place she must not drive to. The mailing address is kept in gaps.
  - `learn-to-ski-snowboard-package.cost_per_child_cad`: 47.25 -> null. Their tickets page says
    "$ 47.25 plus tax" and their lessons page says "$48 per person". Neither page is dated, so under
    the conflict rule the field goes to null and both figures reach the director through the
    conflict note.
  - `private-lesson`: cost moved from `cost_per_child_cad` 91 to `cost_per_group_cad` 91. The site
    prices the half day as "2.5 hours of lessons for $91 (+ $50 for each additional guest)", so $91
    buys the instructor for one guest and each further child is $50. Recording $91 per child would
    have been the per-class-as-per-child error this pipeline warns about; the $50 add-on is carried
    in the extra fees line.
  - `wolfpack-junior-program.months_offered`: [1,2,3,4] -> null. The site publishes only the start,
    "Starting the second weekend in January, on Sundays". Filling the end months from the hill's own
    early-April closing date would have been an inference across two pages. The word "unknown" is
    against it in gaps.
  - `venue.hours_notes` and `seasonal_notes`: first drafted from the mountain statistics page alone,
    which says "9:30 am to 3:30 pm Saturdays and Sundays, and holidays" and omits Mondays. Rewritten
    from the about page and the operational schedule, which both name select Mondays, and the
    disagreement is recorded as a conflict rather than silently resolved.

- **Fields set to null after review:** 4
  - `has_washrooms` — the only washroom text that covers day visitors is the parking policy line
    "Properly dispose of all waste water in one of the outhouses". That confirms outhouses exist in
    the lot but says nothing about a washroom a group of small children can use, so the flag stays
    null and the sentence is kept verbatim in the facility notes. The hostel washrooms described on
    the accommodation pages are for overnight guests and were not used.
  - `has_lunch_space` — the Cain Cafe hours are published and nothing else. A cafe is not a stated
    group lunch space, so the flag is null and the hours line is kept verbatim.
  - `bus_parking` — the site describes a main parking lot, cars parked within four feet of each
    other, and "Tow-behind trailers are strongly discouraged". Nothing about a bus, so null with the
    text kept.
  - `venue.price_year_or_season` — no price on the site carries a year or a season. The most recent
    completed season named anywhere is 2025/2026, which closed in April 2026, and that sits in gaps
    instead of being invented into this field.

  A fifth near-miss is worth recording. A summarised read of the village map page returned a tidy
  list of day lodge, cafe, washrooms, first aid, ski shop, parking, cabins and bunny hill. Re-reading
  the raw page showed it contains a single map image and no text at all; the list was the summariser
  echoing the question back. No facility field was taken from that page.

- **Conflicts recorded:** 2
  1. Operating days. The about page says "Saturday, Sunday and select Mondays"; the mountain
     statistics page says "Saturdays and Sundays, and holidays". This matters because the Mondays are
     exactly the days school groups are slotted onto.
  2. The beginner package price, $47.25 plus tax on the tickets page against $48 on the lessons page.

  Not raised as a conflict: the vertical drop is 430 m on one page and 457 metres on another. It
  changes nothing a director decides, so it sits in gaps.

- **Authored fields written:** all three, on all four programs.
  - `what_children_do` rests on the mountain statistics and activities pages (two T-bars, one
    beginner handle tow, 21 runs, 20% beginner terrain, snowshoeing in the meadows and forest with
    rentals from the ski shop), the rentals page line that School Group Mondays run "when only the
    lower lifts are operating", and the lessons page descriptions of the beginner package, the
    private lesson blocks and the Wolfpack's two hours on and off the groomers.
  - `our_note` rests on the access page (16km of gravel, about 30 minutes, chains mandatory for all
    vehicles including four wheel drives, and their own warning that phone directions turn you off
    the highway too soon), the absence of any published group rate, and the age floors on the two
    lesson programs.
  - `practical_summary` is generated from what is published (children 12 and under ride free, free
    rental helmets, fixed lesson start times, a week's notice for the Wolfpack) against the washroom,
    lunch, weather backup, bus parking, capacity and group price gaps.

- **Meets minimum viable record:** no. Missing `venue.address`, and only that. The site publishes no
  street or civic address for the ski area, only a Port McNeill post office box. Everything else on
  the bar is present: coordinates are filled from the venue's own weather link, a hero image with a
  description is recorded, and the Wolfpack program carries id, name, ages 6 to 14 on a years basis,
  a $25 per child price and an our note.

- **Location:** `geo_source` is `site_embed`. There is no map embed, no structured location block and
  no location meta tag anywhere on the site. The weather page links to
  `https://www.windy.com/50.229/-126.326?50.180,-126.334,12`, which the venue itself chose and which
  carries two coordinate pairs. The pair in the link path, 50.229 and -126.326, is the forecast point
  and is what is recorded; the pair in the query string, 50.180 and -126.334, is the map view centre
  about 5km south. Both are written out verbatim in gaps so nobody has to re-read the site to settle
  it. No coordinate was placed from memory or from a third party.

- **Retrieval:** a plain fetch worked. The site is WordPress and serves its content in the HTML, so a
  re-run needs no browser. The events calendar and the media list were read through the site's own
  JSON endpoints on the same domain to confirm the school group Mondays and to check whether any
  image on the site carries alt text. None does.

- **Confidence:** medium-high. Prices, hours, season, road conditions and the group booking contact
  are stated plainly and unambiguously on the venue's own pages and were re-read from raw HTML. The
  two soft spots are the coordinates, which are inferred from which half of a weather link is the
  pinned point, and the hero image description, which was written from where the photo sits rather
  than from looking at it.

- **Recommended follow up by phone or email** (no phone number is published; group and school
  bookings go to Barb at bcolbourne@mountcain.com, lessons and rentals to rentals@mountcain.com,
  general enquiries to info@mountcain.com):
  1. Price — is there a group or school rate, and what does a class of beginners pay once lift
     tickets, rentals and a lesson are added up? Confirm whether the beginner package is $47.25 plus
     tax or $48.
  2. Youngest age — is there a minimum age on the hill, and will they take a preschool or daycare
     group at all? The only published floors are 7 for a private lesson and 6 for the Wolfpack.
  3. Capacity — how many children can come in one group, and how many will one instructor take?
  4. Lead time — how far ahead do the school group Mondays fill, and which Mondays are still open?
  5. Lunch space — is there anywhere indoors a group can eat packed lunches, or is the cafe the only
     option?
  6. Washrooms — is there anything beyond the outhouses in the parking lot, and is there a change
     table?
  7. Rain and weather backup — what happens if the road or the hill closes on the day, and how much
     notice would a group get?
  8. The road — does a school bus get up the access road, and what do they expect a group's vehicles
     to carry for chains?

VERIFICATION
- Fields checked: 44 (32 venue, 1 program x 46 keys spot-checked against source, 4 images, 1 conflict)
- Fields corrected: 3
  - venue.geo_source: site_embed -> geocoded. The Google Maps embed on the directions page carries only `!2d-124.997172!3d49.691825`, which is the map viewport centre. There is no `!3d...!4d...` place pin, so the point was geocoded from 442 Cliffe Avenue instead. It resolves to Sid Williams Civic Theatre, 442 Cliffe Avenue, Courtenay.
  - programs[0].is_free: initially left null, set to true after the live series page was re-read. It says "admission is free" word for word.
  - venue.has_lunch_space: null -> false. The audience information page states "No outside food or drink permitted in the venue," which is a stated answer, not a silence.
- Fields set to null after review: 4
  - venue.hosts_school_groups and venue.hosts_daycare_groups. The site never mentions school or daycare groups at all. Silence is not refusal, so these stay null rather than false.
  - programs[0].age_basis and both range fields. The family film page publishes no age or grade range. It says only "family-appropriate films".
  - programs[0].months_offered. "A few each season" is not a list of months; recorded as unknown in gaps instead.
  - programs[0].format. Watching a film is none of guided, self_guided, hands_on or interactive, and the enum is closed.
- Conflicts recorded: 1. The family film page says admission is free while the box office page says a $3.40 handling fee applies to every ticket by every method of purchase.
- Authored fields written: what_children_do, our_note and practical_summary on the one program. what_children_do rests on the series page (costumes, special guests dressed as characters, door prizes). our_note rests on the weekend afternoon scheduling plus the absence of any group booking route on the site. practical_summary rests on the accessibility page (two accessible washrooms, platform seating at the rear, manually operated lift) and the audience information page (no outside food or drink), plus the gaps for bus parking.
- Meets minimum viable record: no. The program has no age_basis and no age or grade range, because the site publishes none. Everything else on the bar is present, including a hero image with alt.
- Confidence: medium. The venue block and the free admission are read from live pages word for word. The weak point is that the events listing is script-rendered and did not load, so we could not confirm a family film is actually scheduled this season.
- Recommended follow up by phone or email (250-338-2430, tickets@sidtheatre.com):
  1. Price for a class. There is no group, school or student rate on the site at all; every ticket is priced per event. Ask whether a block of seats for a class can be held and at what price, and whether the $3.40 per ticket handling fee applies to the free family films.
  2. Whether any family film is scheduled this season, and on what dates.
  3. Youngest age. Everyone needs a ticket, babies included, and children of 13 and under must sit beside a supervising adult, which for a class means an adult next to every child. Ask how they apply that to a group.
  4. Capacity for a group booking and how many adults they expect.
  5. Lunch. There is nowhere to eat; outside food and drink are banned in the building. Ask what groups normally do.
  6. Bus parking. Two public car parks adjoin the theatre and both are said to fill quickly.

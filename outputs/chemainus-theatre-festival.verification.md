# VERIFICATION — Chemainus Theatre Festival

- **Fields checked:** 33 venue fields, 3 programs at roughly 45 fields each, 2 images. Every price and age claim was re-read from the live DOM in a browser, not from the fetch cache.
- **Fields corrected:** 2
  - `programs[0].cost_per_child_cad`: 49 → null, and the 49 moved to `cost_per_adult_cad`. The 2026 group rate sheet is headed "GROUP RATES for 10 or more Adults" and the group bookings page repeats "Group rates apply to 10 or more adults". Recording that as a per-child price would have been wrong. The only published child concession is a percentage, 50 percent off premium and standard seats for anyone 18 and under, with no dollar figure attached, so the child price stays null.
  - `programs[0].extra_fees_note`: $3.00 → $3.15 service fee, after the live FAQ read. See conflicts below.
- **Fields set to null after review:** 4
  - `has_washrooms`, `has_lunch_space` — nothing on the site says either way. The Playbill Dining Room and the concession are paid food service, not somewhere to unwrap a packed lunch, so neither was allowed to stand in for lunch space.
  - `general_admission_adult_cad` — single ticket prices run from $24 for economy and preview seats up to $90, and vary by show, seat section and day of the week. There is no single base adult price to record.
  - `programs[*].format` — the four allowed values are guided, self guided, hands on and interactive. None of them describes an audience watching a play, so the field was left empty and the reason put in gaps rather than forcing a value.
- **Conflicts recorded:** 1
  - The service fee per ticket. The 2026 season calendar PDF, dated 10/20/25, says "We've added a service fee of $3.00 to all tickets". The FAQ page, last modified 2026-07-07, says "There is a $3.15 service fee on all theatre tickets". The FAQ is the more recently dated page, so $3.15 is what the record carries. Both were confirmed in the live browser, so this is a genuine disagreement between their pages and not a stale fetch.
- **Authored fields written:** all three, on all three programs.
  - `what_children_do` rests on the FAQ ("Children must have a ticket and sit with a parent or guardian"), the concession being open during intermission, and the relaxed performance page describing movement and re-entry as permitted. Nothing was invented about the plays themselves.
  - `our_note` rests on the group discount being written for adults, on the relaxed performance dates and Pay-What-You-Can pricing, and on the ten ticket ceiling and two week minimum in the Access Ticket criteria.
  - `practical_summary` rests on the accessibility page (lift, designated accessible seating), the FAQ parking answer (bus and RV parking on Croft St), and on washrooms and lunch space being absent from the site.
- **Meets minimum viable record:** yes. Venue id, name, address, coordinates, category and date are all present, there is a hero image with alt, and the group mainstage program carries an age basis, an age minimum, a cost answer, `comes_to_you` and an `our_note`.
- **Confidence:** high on the venue block, the season dates and the group terms, which come from the theatre's own 2026 rate sheet and calendar. Medium on how a children's group is actually priced, because every published discount is either an adult group rate or an individual youth percentage and the site never puts the two together.

## What the school-programme search actually turned up

The brief asked specifically about school matinees, student ticket rates, theatre-school classes and backstage or workshop offerings. The full page sitemap was read, along with the plan your visit, group bookings, FAQ, accessibility, relaxed performances, group ticket form and access tickets pages, plus the 2026 group information sheet and the 2026 season calendar.

There is no theatre school, no drama class for young people, no backstage tour and no classroom workshop published anywhere on the site. There is no school matinee series and no student matinee rate. What a class can genuinely book is a seat at a public performance, which is a real bookable programme and is recorded as one. Three were created:

1. **Group booking for a mainstage performance.** 15 percent off for 10 or more adults, one free ticket with 20 or more, adult starting price $49 per person theatre only, GST and fees included, 10 percent deposit. Matinees at 2:00 pm Wednesday, Thursday, Saturday and Sunday.
2. **BMO Relaxed Performance.** Pay-What-You-Can, phone booking only, the minimum age of 4 does not apply, and the theatre explicitly names small children and sensory or neurological differences. Recorded `sensory_friendly` and `neurodiversity_friendly` true because the site addresses both directly. `low_noise` left null: the point of these shows is that audience noise is allowed, so calling them low noise would be wrong.
3. **Access Tickets for schools and community groups.** Free, educational organisations explicitly eligible, maximum 10 tickets, minimum two weeks notice, up to two productions a season.

**Season is time-bound.** `months_offered` is set to February through December for the mainstage and access programmes, because the 2026 season runs 20 February to 23 December and there is nothing in January. The relaxed performance programme carries only the five months it actually runs in. As of 3 September 2026, three of the five relaxed dates have already passed and only 1 October and 19 November remain, which the `our_note` says.

**Mood tags.** All three programmes are `explore` and `learn`. Watching a play is not `play` under the v2 definition, since no child's hands are on anything, and it is not `creative`, since nobody performs. Had a drama workshop existed it would have been `creative`, but none does.

**Booking route.** The seat map, live prices and checkout all live on the theatre's separate ticketing system at purchase.chemainustheatrefestival.ca. Nothing was extracted from it. The `booking_url` points at the group ticket request form on the theatre's own site. The "REQUEST TICKETS" button on the group bookings page goes to a Microsoft Forms page off the theatre's domain and was not used.

**Coordinates.** `geo_source` is `site_embed`. The theatre publishes Google Maps place links on its own FAQ and accessibility pages carrying `!3d48.9212376!4d-123.7171703` and `!3d48.9212321!4d-123.717156`. The two are about six metres apart. The first was used. No pin was hand-placed.

**Images.** Both entries were confirmed present on the pages recorded, both are absolute https URLs on the theatre's own WordPress uploads, and both carry the site's own alt text verbatim. No caption was invented and no rights note was taken from the site-wide footer copyright line.

## Recommended follow up, in the order a director will care

1. **Price for a child.** What does a school or daycare group actually pay per child? The 15 percent group discount is written for adults and the 50 percent youth discount is written for individual tickets.
2. **Whether a group of children counts as a group at all** for the 10-or-more discount.
3. **Youngest age.** Minimum 4 for mainstage shows is published, but the KidzPlay exception is named without any KidzPlay show existing in the 2026 season. Ask whether KidzPlay still runs.
4. **Capacity.** No maximum group size is published.
5. **Lead time** for a group booking. Only the Access Ticket scheme states one, at two weeks.
6. **Somewhere to eat a packed lunch** before or after a matinee.
7. **Washrooms**, which the site never mentions.
8. **How long the show runs**, including the interval, so a bus can be booked.
9. **How many adults have to come** with a group of children.

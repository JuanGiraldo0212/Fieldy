# VERIFICATION — The Port Theatre (the-port-theatre.json)

- **Fields checked:** 33 venue fields, 2 programs, 3 images.
- **Fields corrected:** 3
  - `venue.address`: the site footer gives "125 Front Street, Nanaimo BC Canada" with no postal code; the contact page and every event page give "125 Front St. Nanaimo, BC V9R 6Z4". Recorded with the postal code. Not a conflict, just a fuller version of the same address.
  - `programs[family-performance-tickets].cost_per_child_cad`: first written as 13.50 from the Discovery Series line "Adults $28.50 | Members $23.50 | Students $13.50" -> 25.00. The Discovery Series has no shows announced for the current season, so its price is not bookable. The $25 recorded is the student ticket on a live Spotlight family show.
  - `venue.booking_method`: `shop` -> `phone` at venue level, with `shop` kept on the ticketed family performance program. Every accessibility, seating and group question on the site is answered with "call the Ticket Centre".
- **Fields set to null after review:** 4
  - `age_basis` and both ranges on every program. No age or grade range is published for any offering. This is why the record is not publishable, and it is the honest answer.
  - `has_rain_backup` — the venue is obviously indoors, but the site never addresses it, and inferring from "it is a theatre" is the kind of guess the brief rules out. `indoor: true` on the programs carries the fact.
  - `has_lunch_space` — nothing on the site.
  - `programs[school-show].what_children_do` — the site never describes what a school show involves, so this stays null rather than imagining a visit.
- **Conflicts recorded:** 0. The site's pages agree with each other.
- **Authored fields written:** `our_note` and `practical_summary` on both programs, and `what_children_do` on the family performance only. They rest on the About page line about school shows, the empty School Shows series, the Glob event page (65 minutes, All Ages, $35 regular and $25 student, taxes and fees included), the washroom and elevator answers in the FAQ, the free booster seat and coat check at the services desk, and the parking answer that sends you to the City of Nanaimo.
- **Meets minimum viable record:** no. Missing: a program with an `age_basis` and a published age or grade range. The theatre publishes none, for any offering.
- **Confidence:** high on what is there, and high that nothing more is published. The absence of school programming was checked three ways.
- **Whose price this is:** the $25 recorded as `cost_per_child_cad` is **the theatre's own "Student" ticket price** on SPOTLIGHT: GLOB, a Port Theatre Society presentation marked All Ages. It is not a child price, not a group price and not a school rate; `school_rate_only` is false and the note says so in plain words. The $35 recorded as `cost_per_adult_cad` is the "Regular" ticket on the same show. Two prices were deliberately **not** recorded: the Discovery Series student price of $13.50, because that series has no shows announced; and the "Adult $39.50 / Youth Under 18 $25.00" on the family concerts, because those are presented by the Vancouver Island Symphony rather than by the Port Theatre. Both are noted in gaps.
- **What the browser changed:** it turned a suspected rendering problem into a confirmed fact. A plain fetch of the season page returned a "School Shows" heading with nothing under it, which usually means a JS-rendered block. In the live DOM that section is genuinely empty (53 characters of inner HTML, no siblings), and the events filter at /events/series/school-shows/ returns "0 School Shows Events". The browser also confirmed via the sitemap that there is no education, teachers or school page anywhere on the site, and that the Discovery Series page is a season out of date.
- **Recommended follow up by phone (250-754-8550) or tickets@porttheatre.com, in priority order:**
  1. Price: whether a class or group booking costs less than the single ticket price, and whether the student rate applies to school-age children.
  2. Youngest age: whether a preschool or daycare group is welcome at a family show, given every child needs their own seat and only under-24-month lap infants are mentioned.
  3. Capacity: how many seats they will block for one group.
  4. Lead time: how far ahead a school show or a group block has to be booked.
  5. School shows: whether one is coming this season at all, and whether the theatre keeps a mailing list for teachers.
  6. Lunch space: whether a group can eat anywhere in the building before a daytime show.
  7. Bus parking and drop off: not covered on the site at all, which sends parking questions to the City of Nanaimo.
  8. Community tickets: the theatre gives complimentary Spotlight and Discovery tickets through partner organisations but publishes no route to ask.

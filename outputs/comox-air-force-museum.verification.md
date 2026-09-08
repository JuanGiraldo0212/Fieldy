# VERIFICATION — comox-air-force-museum

- **Fields checked:** 33 venue fields, 2 programs at 45 fields each, 4 images at 11 fields each. Both programme source pages, the heritage park page and the contact page were reopened in a live browser after the JSON was written.
- **Fields corrected:** 3.
  - `lat` / `lng`: first read as null on the assumption that a PO box address could not be geocoded -> 49.7132185, -124.905753 from the place pin on the contact page. See below.
  - `venue.bus_parking`: `true` -> `null`. The site describes a small car park and overflow "for RVs, trucks and overflow" across the street. It never mentions buses. The parking text was moved into `facility_notes` so a director still gets the detail without a boolean the site does not support.
  - `venue.has_lunch_space`: `true` -> `null`. "Grab a picnic and the kids and enjoy a sunny afternoon" is an invitation to bring food outdoors, not a statement that there is somewhere to eat. No tables, shelter or indoor room is described.
- **Fields set to null after review:** 4. `has_washrooms`, `has_rain_backup`, `wheelchair_accessible`, `stroller_accessible`. The site addresses none of them. All four render as amber "not stated" rows, which is the correct outcome for a group leader.
- **Conflicts recorded:** 2 (opening hours against a closure pop up, and two different distances to the air park).

## Location

The contact page carries a Google Maps embed whose string ends `!4m5!3m4!1s0x…!8m2!3d49.7132185!4d-124.905753`. The `!8m2!3d…!4d…` block is the **place pin**, not a viewport centre, so `geo_source` is `site_embed`. A separate coordinate, 49.7125525, appears elsewhere in the same markup as a map centre and was **not** used; it is about 80 metres away and would have been the wrong basis even though it would have looked close enough to pass. The recorded point sits in Lazo at the 19 Wing entrance, inside the island box.

This matters because the only address the site publishes is a mailing one, a PO box at 19 Wing Comox. Without the place pin this record would have been `geocode_pending`. The address field carries the mailing address as the site writes it, and `gaps` records that the museum itself is described as being on the corner of Ryan Road and Military Row.

## Admission and the cost bar

Admission is by donation, stated twice, on the home page and the contact page. Neither programme therefore has a price, and neither has been given one.

`is_free` is **null on both**, not true and not false. By donation is not free, because a group is expected to give something, and it is not a fixed price either. Setting `is_free` true to clear the publishable bar would have been the easy wrong answer. It is recorded verbatim in `extra_fees_note` on both programmes instead, so a director sees "Admission is by donation" rather than a number that does not exist.

This is the reason the record is not publishable, and it is the honest reason.

## Programmes

Two were recorded, and the difference between them is deliberate.

1. **Tours and Educational Programming** exists only as one paragraph on the events page with a mailto booking link. It is real and bookable, so it is a programme. It has no ages, no length, no group size, no price and no notice period, and none were invented. `what_children_do` is **null** rather than written, because the paragraph is marketing about immersive journeys and captivating stories and never describes what anyone actually does. Writing a plausible visit from it would have been fiction.
2. **Self-guided museum and Heritage Air Park visit** is the one with real detail. The gallery page describes the route, the ejection seat, the hands on air traffic control centre, the Argus engine, the viewing lounge and the activity books; the air park page describes walking up to the aircraft and the memorials. That supports a concrete `what_children_do`.

`hosts_school_groups` is `true`, and this is the record's weakest claim. The site never uses the words school, class or daycare anywhere; two site searches were run to confirm it. The value rests on a bookable educational programme, which is a fair reading but is not their wording, and `gaps` says so plainly so nobody later mistakes it for a quote. `hosts_daycare_groups` is null, because silence about under-fives is null and not false.

## Mood tags

- Guided tour: `explore`, `learn`. Aircraft described but nothing said about touching anything.
- Self-guided visit: `play`, `explore`. Children try an ejection seat and work a hands on air traffic control display, so their hands are on it, and the rest is open-ended wandering through galleries and an outdoor air park at their own pace. Not tagged `learn`, because almost anything is educational and the tags are more useful when they say what the child would say they did.

## Images

Four entries, one hero. Every URL was opened in the browser and looked at before its alt was written, and all four resolve.

- **Three of the four are CSS `background-image` on the home page** and do not appear in an `<img>` scan at all. A markup-only image pass on this site returns the logo and a 300 by 225 thumbnail, and nothing else. Recorded in `gaps`.
- Hero is the site's own Open Graph image, which is a genuine photograph of the galleries and not a logo or social card, so it takes precedence per the rules. Its width and height are stated in the og meta tags and are recorded.
- The one candidate on the events page, a 300 by 225 rendition beside the tours paragraph, was skipped for being under 400px on its longest side.
- No `rights_note` on any entry. The site carries a footer copyright line for the Comox Valley Air Force Museum Association and no per-image credits, and a footer line is not a photo credit.
- All four are `unverified`.

## Other checks

- Both evidence quotes were confirmed present character for character in the live DOM, contiguous, and under 25 words.
- `days_offered` on the self-guided visit is 2 to 7, from "Tuesday to Sunday" on the site banner and the contact page. It is subject to the closure conflict below.
- `languages` is null. The site has an English and French switcher, but that is the website being translated and not a statement that tours are given in French.
- A staleness flag is in `gaps`: the gallery page says the special exhibits room is "currently showcasing" the RCAF 1924 to 2024 centenary exhibit, and the top navigation still leads with an RCAF 2024 item. What is on now may have moved on.
- The closure pop up, "closed to the public until April 3rd", carries no year and contradicts the open banner on the same page. Both are live, both were seen in the browser. It is recorded as a conflict rather than resolved, because there is no dated basis for choosing.

- **Meets minimum viable record:** no. The venue block is complete, there is a hero with alt, and both programmes have id, name, `comes_to_you` and `our_note`. Two things are missing and both are missing from the site: **no `age_basis` or age or grade range on either programme**, and **no cost field or `is_free`**, because admission is by donation and no tour price is published.
- **Confidence:** medium. The venue block, the coordinates and the self-guided detail are solid and quoted. The guided programme is close to an empty shell, and the open-versus-closed contradiction on their own front page means even the opening hours should be treated as unconfirmed until somebody rings.

## Recommended follow up by phone or email

1. Is the museum actually open, given the pop up saying closed until April 3rd sits on the same page as the open banner. Ask first.
2. What a group is expected to give, since admission is by donation and there is no published rate.
3. Youngest age the tour suits, and whether they take a preschool group at all.
4. Biggest group they can take, and how many adults they want with it.
5. How much notice they need for a booking.
6. Somewhere to eat, and whether there is anywhere indoors if it rains at the air park.
7. Washrooms.
8. Whether a bus can turn and park, at the museum and at the air park.

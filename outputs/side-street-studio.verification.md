# VERIFICATION - Side Street Studio

Checked 2026-09-03. extractor_version v2.0.

## Fields checked: 33

Five pages opened. The tracker's website was checked first for the "wrong site" failure mode:
sidestreetstudio.com is genuinely this venue's own site, not a tourism board or a directory.
The name, the Oak Bay address and the phone number all match the tracker row, so the row is
correctly marked and no substitute site was needed.

There is a similarly named arts organisation in Illinois. It is a different body on a different
domain and was not used.

## The venue does not serve children's groups

Despite the word Studio in the name, this is a retail shop and gallery selling the work of
British Columbia artists. It is not a working teaching studio.

Checked for a children's offering on the home page, the About page, the Visit the Studio page,
the Contact page and the full sitemap page. The sitemap lists every page and collection on the
site; a search of it for class, workshop, birthday, camp, lesson, school, kids and group
returned nothing. The navigation is entirely product categories: pottery, jewelry, glass, wood,
textiles, BC gifts, artwork.

So `hosts_school_groups` and `hosts_daycare_groups` are both `false`, the reason is stated in
`description`, and `programs` is an empty array. Extraction stopped after the venue block, per
the retail-only rule.

## Fields corrected: 1

- `venue.hours_notes`: set back to `null` after the cross-page check found two different answers.
  See conflicts.

## Fields set to null after review: 8

- `hours_notes` - two pages disagree and neither is dated.
- `has_washrooms`, `has_lunch_space`, `has_rain_backup`, `stroller_accessible`,
  `wheelchair_accessible`, `bus_parking` - nothing on the site addresses any of them. The
  address is unit 204, which suggests an upper floor, but that is an inference and was not
  recorded as an access answer either way. It is flagged in gaps instead.
- `booking_method` - there is a contact form and a phone number, but nothing to book, so null
  rather than `web_form`.

## Prices

None recorded. The only prices on the site are for products in the shop, which are not an
admission or a program cost, so no cost field was populated and nothing was carried across.

## Conflicts recorded: 1

Opening hours. The contact page and the home page footer give "Mon-Fri 11-5, Sat 10-5, Closed
Sundays". The About page footer gives "Mon-Sat 10-5, Sun 12-4, Closed Canada Day July 1st".
Same site, same footer block, two different answers, and neither page is dated, so the field is
null and the director gets both answers in the note.

## Images: none recorded

`images` is an empty array, and gaps says why.

- The Open Graph image is `logo.png`. A logo, so skipped under the rules.
- The home page banner, `slideshow_1.jpg`, was opened in the browser and looked at. It is a
  title graphic: the words "Side Street Studio" and "100 % Local - Handmade - West Coast
  Inspired Gifts" set in large type over a stock forest photograph. It is a wordmark, not a
  photograph of the venue, so it was skipped rather than passed off as a hero.
- There is no photograph of the shop, its interior or its street frontage anywhere on the pages
  opened. The About page carries a portrait of the owner, which is a staff headshot and skipped.
- Product photographs in the shop collections are of individual items for sale, not of the venue,
  so none was promoted to a hero.

No alt text was written for an image that is not being recorded.

## Location

No usable published coordinates. The Visit and Contact pages both carry the same Google Maps
embed, but the only numbers in it are `!2d-123.3399095!3d48.4239035`, which is the centre of a
map view roughly 21 km across, not a pin on the shop. Using it would have put the venue in
about the right city and the wrong place, which is worse than null. Address recorded verbatim,
`geo_source: geocode_pending`, lat and lng null.

## Authored fields written: none

`what_children_do`, `our_note` and `practical_summary` all live on programs, and there are no
programs. Nothing was authored to fill the space.

## Meets minimum viable record: no

Missing `venue.lat`, `venue.lng`, a hero image and at least one program. The program and the
image are missing because the venue genuinely has neither, not because the extraction fell
short. This record should not be published to a daycare director, and the empty programs array
is the correct answer rather than a gap to be filled.

## Confidence: high

High confidence in the finding, which is that there is nothing here for a school or daycare
group. The whole site was checked including its own sitemap, and it is unambiguously a retail
gallery.

## Recommended follow up by phone or email

Low priority. The venue can be left as it is. If someone wants to keep the row alive:

1. **Whether a small group of children may visit the shop at all**, and whether the owner would
   ever host anything for a group. Nothing on the site says either way.
2. **Opening hours**, to settle which of their two published answers is current.
3. **Step-free access**, given the unit number suggests an upper floor.

Phone (250) 592-1262.

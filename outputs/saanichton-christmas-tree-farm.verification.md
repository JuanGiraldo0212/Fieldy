# VERIFICATION - Saanichton Christmas Tree Farm

Checked 2026-09-03. extractor_version v2.0.

## Fields checked: 44

Six pages opened, five useful. The price-bearing page (tree-care-faqs) was re-read **live in a
browser** for STEP 3, because `web_fetch` deduplicated both the plain and the trailing-slash
URL. The live DOM today still gives the 2025 prices and the 2025 season dates. The home page
was also re-read live to confirm the banner text.

## Fields corrected: 2

- `programs[u-cut-christmas-tree-visit].months_offered`: `null` -> `[11, 12]`. Null means
  year-round, which would have been wrong. The farm publishes a season of November 15 to
  December 23 for the u-cut fields, so November and December are recorded.
- `venue.hours_notes`: the u-cut field hours were first folded in with the shop hours. They are
  different and the difference matters, so the 4pm field closure is now stated separately:
  "Because our fields are not lit, our U-Cut fields are open from 9am to 4pm every day."

## Fields set to null after review: 6

- `venue.hosts_school_groups` and `venue.hosts_daycare_groups` - **left null, not false.** The
  site is silent about groups rather than exclusionary: there is no minimum age, no adults-only
  policy and no reason given. Silence is null. It is a public farm anyone can walk onto, so
  marking it as not serving groups would have been a guess in the other direction.
- `venue.has_washrooms`, `has_lunch_space`, `has_rain_backup`, `bus_parking` - nothing on the
  site addresses any of them. The about page's line that the farm "has provided a unique
  educational experience for its visitors" is marketing prose about four decades of history,
  not a school offering, and was not used to support anything.
- `booking_method` - a phone number and an email address are published, but no booking process
  of any kind, so this is null rather than `phone`.

## No program was invented

The site publishes no school program, no group rate, no field trip page and no booking route.
A live check of the whole FAQ page text for the words group, school, field trip and tour
returned nothing. So no "School visit" or "Group visit" program was created.

What is recorded is the one offering the farm does publish: the u-cut Christmas tree visit that
any member of the public can turn up for, with its published season, daily hours, per-foot
pricing and the 6 foot minimum tree size. Its cost fields are null and `is_free` is null,
because the farm publishes no admission charge and does not say entry is free. A tree costs
money; walking the fields may or may not. That gap is recorded rather than filled.

## Price check (the common error)

The only published prices are **per foot of tree**, which is a purchase, not a per-child or
per-group admission. Live text: "Our trees range in size from 2 to 12 feet in height and are
priced per foot, in 2025, between $8-15/foot." That is recorded in `extra_fees_note` and as the
evidence quote, and no per-child or per-group cost was derived from it.

`price_year_or_season` is set to "2025 Christmas season". The prices and dates on the site are
written for 2025 and had not been updated when checked in September 2026.

## Grades and ages

Nothing published. `age_basis`, all age fields and all grade fields are null. Nothing was
converted.

## Capacity and lead time

Nothing published. `capacity_max`, `capacity_min` and `lead_time_days` all null.

## Conflicts recorded: 1

Opening hours. The home page carries a banner reading "Now open daily from 9am-7pm!", confirmed
live today, 3 September, while the contact page and the FAQ page both give a season that runs
November 15 to December 23. Two pages agree with each other against the banner, and the banner
reads like it was left up from a past season, so `hours_notes` keeps the corroborated seasonal
hours rather than being nulled, and the disagreement is handed to the director in the conflict
note.

## Images

Three entries, one hero. All absolute, https, on the farm's own Squarespace CDN, and each
confirmed present on the page recorded in `found_on_url`.

The home page banner image is a close-up of a red bauble on a tree indoors, so it was not used
as the hero even though the preference order points at the home page banner. The Santa's
Workshop photograph on the Christmas trees page is what a group would actually see on arrival,
so that is the hero. **Both generated alts were written after opening the image in a browser
and looking at it**, because the site's own alt attributes on those two are raw filenames
("1463978_752335328113561_2141434448_n.jpg"). The third image keeps the site's own alt verbatim,
"Saanichton Christmas Tree Farm", with `alt_source: site`.

Two other photographs were seen and dropped: one is a portrait of the two farmers beside a
tractor and one is a portrait of a person beside the pre-cut tree rack. No caption was invented.
No `rights_note` was taken from the footer copyright line. `usage` is `unverified`.

## Location

No coordinates published anywhere on the site. Address taken verbatim from the contact page and
the site-wide footer. `geo_source: geocode_pending`, lat and lng null. No pin was hand-placed.

## Authored fields written

`what_children_do`, `our_note` and `practical_summary`, all on the one program.

- `what_children_do` rests on "acres of trees for you to choose from", "We provide saws, free
  hot apple cider", "We supply hand saws ... as well as twine for securing it to your vehicle"
  and "We have signs identifying the different tree types throughout the farm". Nothing about
  children handling a saw was written, because the site does not say that.
- `our_note` rests on the unlit fields closing at 4pm while the shop runs to 7, the instruction
  to "dress appropriately for the weather and wear appropriate shoes or boots", and the total
  absence of any group arrangement.
- `practical_summary` rests on the empty facility fields and the short published season.

## Meets minimum viable record: no

Missing `venue.lat` and `venue.lng`, and the one program has no `age_basis`, no age or grade
range and no cost or `is_free` value, because the site publishes none of them. This record
should miss the bar visibly. It is a phone call away from being useful, not an extraction
failure, and nothing was padded to clear it.

## Confidence: medium

What the site does publish is clear, specific and was confirmed live today. The confidence is
not high because the whole site is a season out of date, and because everything a group leader
needs beyond the season and the tree price is simply absent.

## Recommended follow up by phone or email

Phone 250.652.3345 or email joanfleming@shaw.ca. In priority order:

1. **Price for a group.** Whether there is any charge to walk the fields, and whether a class
   visiting without buying a tree is welcome at all.
2. **Youngest age** they are happy to have on the farm.
3. **Capacity.** How many children they can take at once in the fields.
4. **Lead time** and whether they want notice at all.
5. **Somewhere to eat** and any shelter, given the fields are open ground in December.
6. **Washrooms.** Not mentioned anywhere on the site.
7. **Rain backup**, and whether a wet day means the visit is off.
8. **Bus access.** Whether a coach can get in and turn off East Saanich Road.
9. **This season's dates and prices**, since the published ones are last year's.

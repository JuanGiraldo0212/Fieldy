# VERIFICATION — Royal BC Museum (royal-british-columbia-museum.json)

Checked 2026-09-03. Extractor v2.0.

## Retrieval note

The tracker's `www.royalbcmuseum.bc.ca` redirects to `rbcm.ca`, a WordPress site. Plain fetches
returned real content, so STEP 1b was not needed for rendering reasons. However several RBCM pages
exceed the fetcher's text cap: the rendered HTML pages carry roughly 2,500 lines of navigation before
the page body, and long pages were cut off before their content began. Most pages were therefore read
through the site's own WordPress REST API on the same domain
(`https://rbcm.ca/wp-json/wp/v2/pages?slug=…`), which returns the page body without the navigation.

**A browser was requested but Claude in Chrome was not connected** (two attempts, both returned "not
connected"). Consequence: images whose `alt` attribute is empty on the site were skipped rather than
described, because a `generated` alt must rest on having actually looked at the picture. Every image
in this record carries the site's own alt text.

One section could not be retrieved at all: the **Details and Booking Information** block at the foot of
the Provocation Packs page. Both the rendered page and the REST response were truncated by the fetcher
before reaching it. Grades, price, loan length and borrower eligibility for provocation packs are
therefore null, and this is recorded in `gaps`.

## Fields checked

- Fields checked: 12 programs × the non-null fields on each, plus the full venue block and 5 images.
  Roughly 250 non-null values.
- Every price-bearing page was re-fetched live in STEP 3 through a **different REST path**
  (`/wp-json/wp/v2/pages/4445`, `/2134`, `/1905`, `/1914`) so the fetcher could not serve a cached
  copy. All prices came back identical to the first read. No stale prices found.

## Fields corrected

- None. Nothing had to be changed between first extraction and verification; the live re-read matched.

Two things were deliberately **not** recorded the obvious way, and are worth naming:

- `cost_per_group_cad: 150` (and 200) for the Learning Labs, **not** `cost_per_child_cad`.
  "Learning Labs are $150 for core galleries and $200 for feature exhibitions" is a flat program fee.
  The per-lab Cost fields repeat $150/$200 with no per-student component.
- `cost_per_child_cad: 2` for the self-guided visit, which **is** per student:
  "Core gallery visits are $2 per student in low season and $8 per student when we have feature
  exhibitions." The $8 high-season figure is carried in `extra_fees_note`, the program description,
  `seasonal_notes` and `price_year_or_season`, because a feature exhibition is on right now and the
  higher rate is what a school would actually pay today.
- Grades were kept as grades throughout. "K–3" is `grade_min: 0`, `grade_max: 3`, `age_basis: "grades"`,
  with both age fields null. No grade was converted to an age anywhere.

## Fields set to null after review

- `general_admission_child_cad` / `general_admission_adult_cad` — the home page rates panel renders
  member rates only in fetched text. No non-member door price was readable, so both stay null.
- `has_rain_backup` — the museum is indoors, but the site never addresses a rain backup, and inferring
  it from "indoors" is the kind of guess this pipeline forbids.
- `bus_parking` — the site says only that it has no car park and that there is a short-term drop-off
  zone on Belleville Street. That text is preserved in `facility_notes.bus_parking`; the boolean stays
  null because nothing addresses coaches.
- `hosts_daycare_groups` — the site is silent about under-fives. School rates are written for "BC public
  and independent grade schools" and grades start at K, but silence is null, not false.
- `sensory_friendly` / `low_noise` / `neurodiversity_friendly` on every program — the only sensory
  sensitive offering named on the accessibility page belongs to IMAX Victoria, not the museum, and the
  same page says sensory friendly visits are not bookable through group bookings.
- Provocation pack cost, grades and loan period — section not retrievable, see above.
- `duration_min` on the self-guided visit — the site gives planning advice ("plan 1 – 2 hours"), not a
  fixed length, so it is in the description instead.
- `lead_time_days` on the Learning Labs — "we recommend booking … a minimum of two weeks (10 business
  days) in advance" is a recommendation. It sits in the description. Where the site states a genuine
  minimum (two business days for self-guided and for online bookings) `lead_time_days` is 2.

## Conflicts recorded: 2

1. **Digital field trip group size.** The same page says "Up to 30 participants per program" and then
   tells groups larger than 50 to email for a webinar format. A class of 32 to 50 is not covered by
   either sentence.
2. **The hardship discount.** The Field Trips page says "a discounted rate"; the Booking Information
   page and the Outreach Kits page both say "a 25% discounted rate". The 25% figure is used in the
   record because the two pages that state it are the more specific ones, and the note tells the
   director to confirm.

## Authored fields written

`what_children_do`, `our_note` and `practical_summary` were written for all 12 programs, except
`what_children_do` on the Group visit, which is null because the site never describes what a group
actually does on one.

- `what_children_do` rests on the "Program Format" numbered lists the museum publishes for every
  Learning Lab and digital program (splitting into two groups, handling specimens, drawing a mystery
  object, walking into Old Town to place it), and on the inquiry guide descriptions for the self-guided
  visit.
- `our_note` rests on the per-class pricing, the capacity numbers, the September to May window, the
  low-season and high-season split, the late and replacement fees for kits, and the unanswered question
  of whether a lab fee includes gallery admission.
- `practical_summary` rests on the accessibility page (six ramps, elevator to all floors,
  wheelchair-accessible washrooms on every floor, stroller assistance) and the booking information page
  (Carl Hall and the community room for lunch, picnic tables, water stations, no car park, drop-off zone
  on Belleville Street), plus the gaps above.

No em dashes or en dashes were used in any authored field. Grades and prices are written in words a
director uses, not field names.

## Location

`geo_source: "site_embed"`. The museum publishes coordinates itself, in the Google Maps link in the
Location block of its own home page, which carries `@48.4198111,-123.3674497` and
`!3d48.4198111!4d-123.3674497`. Recorded to five decimals as 48.41981, -123.36745. No pin was
hand-placed and no geocoding service was used.

## Images

Five entries, all on `rbcm.ca` uploads, all https, all absolute, all with the site's own alt text, all
`usage: unverified`, all `rights_note: null` (there are no per-image credit lines; the site does have a
media kit page, but it was not opened and nothing here claims press reuse). One hero. Each URL was
present on the `found_on_url` recorded. Dozens of further photographs on these pages have empty alt
attributes and were skipped because no browser was available to look at them.

## Meets minimum viable record: YES

Venue has id, name, address, lat, lng, category, checked_on and one hero image with alt. Ten of the
twelve programs carry id, name, age_basis with a grade range, comes_to_you, a cost field and our_note.
`validate_v2.py` reports the file as OK with no errors and no warnings.

## Confidence: high

Everything material was read twice, the second time on a different URL path that could not be served
from cache, and the numbers matched exactly. The one real hole, provocation pack pricing, is recorded
as a hole rather than guessed.

## Recommended follow up by phone or email

Contact: learning@royalbcmuseum.bc.ca for programs, groups@royalbcmuseum.bc.ca for bookings and
payment, dft@royalbcmuseum.bc.ca for online sessions, outreach@royalbcmuseum.bc.ca for kits. No phone
number is published on the pages read, which is itself worth chasing.

1. **Price.** Does the $150 or $200 Learning Lab fee include entry to the galleries, or is the $2 to $8
   per student self-guided rate charged on top? This changes the cost of a normal school day
   substantially.
2. **Price.** What does a group of 15 or more that is not a BC grade school pay? Nothing is published,
   only a rate inquiry form. Ask what "therapeutic visits are free" covers.
3. **Price.** What do provocation packs cost, and for how long do you keep one?
4. **Youngest age.** Will they take a preschool or daycare group, and from what age? Programs start at
   Kindergarten and nothing addresses under-fives.
5. **Capacity.** What is the maximum for the Museum Career lab and the Ancient Egypt lab? And for an
   online session, is a class of 32 to 50 a normal booking or a webinar?
6. **Lead time.** Labs sell through an online calendar with no stated minimum notice, only a two week
   recommendation. Ask how far ahead popular dates actually go.
7. **Lunch space.** Carl Hall and the community room are named, but not how many they seat or whether
   they need booking alongside the visit.
8. **Bus drop-off.** There is no museum car park. Confirm where a coach can pull in beyond the
   short-term zone on Belleville Street, and where it waits.
9. **Quiet times.** Nothing is published about quieter hours or sensory support inside the museum.

## Targeted image pass, 2026-09-07

Opened the site in a browser and re-tested every image URL in the record.

- **Fields corrected:** 3. `activity-natural-history-gallery`, `activity-tide-pool` and
  `space-old-town-gallery` all pointed at .jpeg files that now return 404. The museum has re-saved
  those photographs as .webp and dropped the old files; the .jpeg paths survive only inside a
  `<picture>` fallback that no longer resolves. All three URLs corrected to the .webp form, which
  returns 200. The hero and the specimen handling photograph still load unchanged.
- **Images added:** 0. The record already carries the maximum of five.
- **Alt text:** unchanged and all still the site's own. The museum writes long, careful descriptions
  rather than file names, so nothing needed rewriting.
- **Meets minimum viable record:** yes, unchanged.

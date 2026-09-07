# VERIFICATION — Chemainus Valley Museum

- **Fields checked:** 33 venue fields, 2 programs at roughly 45 fields each, 2 images. Thirteen pages of the site were opened, which is the whole public site apart from the two audio transcript pages.
- **Fields corrected:** 1
  - `nearby_park`: true → the museum's own sentence about Waterwheel Park. The field takes a string, and the site gives a usable one, so the description was recorded rather than a bare flag.
- **Fields set to null after review:** 6
  - `general_admission_child_cad`, `general_admission_adult_cad`, and every cost field on the guided tour programme. No admission price appears anywhere on the site. Every page was checked, including the support, membership, gift shop and donation pages. There is no rates page and no price table, rendered or otherwise, so nothing was estimated.
  - `has_washrooms`, `has_lunch_space` — never mentioned. Neither was inferred from the museum being an indoor building.
  - `youngest_age_welcomed_years` — the site quotes a grade 4 pupil and a grade 1 pupil, and describes a grade 7 class project on display, but sets no minimum age. Grades were not converted into ages.
  - `wheelchair_accessible`, `stroller_accessible`, `bus_parking` — nothing published.
  - `lat` / `lng` — see below.
- **Conflicts recorded:** 0. The pages are consistent with each other, mostly because so little is stated twice.
- **Authored fields written:** all three, on both programmes.
  - `what_children_do` for the guided tour rests on the collection description on the how you can help page, the ten panel structure of None Came Back, and the observation point described on the home page. For the walking tour it rests on the route the walking tour page names, between Oak, Maple, Esplanade and Pine Streets.
  - `our_note` rests on the museum being volunteer run and asking you to leave a message, on nothing about price or group size being published, and on the walking tour's subject being the uprooting and internment of Japanese Canadians.
  - `practical_summary` rests on the museum sitting in Waterwheel Park and on the facility fields being empty.
- **Meets minimum viable record:** no. Missing `lat` and `lng`, and no programme carries an age basis, an age range or a cost answer, because the site publishes none of those. The record misses the bar visibly, which is the right outcome here.
- **Confidence:** medium. What the site does say is clear and current. The problem is how little it says: no price, no ages, no capacity, no lead time, no facilities.

## Is the site out of date?

No, and this matters because a small volunteer-run museum site often is. The copyright line reads 2026, the home page carries a season raffle with a 24 October 2026 deadline and a 27 October 2026 draw, the mission statement is dated 18 August 2025, the membership form PDF is titled 2026, the walking tour transcript is titled Spring Summer 2026, and the news page mentions the 2025 Halloween season and its 340 visitors. So the site is being kept up. There simply is no admission price on it, which is a gap rather than a stale figure. `price_year_or_season` is therefore null rather than flagged as historic.

## What the group offering actually is

The contact page carries this, in its own headings: "If your group is visiting Chemainus and you would love a tour... we can happily arrange that! Leave an email cvhsMuseum@shaw.ca or call and leave a message 250-246-2445". That is a real bookable offering and is recorded as the guided group tour. It is genuinely all that is published about it, so almost every field on that programme is null.

A second programme was created for the Chemainus walking tour, because the audio and the printable transcript are both published free on the museum's own domain, the route is stated, and a teacher could use it without asking anyone. It is `self_guided`, `is_free` true, and outdoors. `months_offered` was left null, meaning all year, because the page never says it is seasonal, but the transcript being filed as "Spring Summer 2026" is flagged in gaps so it can be confirmed.

**Mood tags.** Both programmes are `explore` and `learn`. There is nothing children put their hands on described anywhere on the site, so `play` would have been wrong, and nothing is made, so `creative` would have been wrong.

**hosts_school_groups vs hosts_daycare_groups.** Schools is true: the museum arranges tours for visiting groups, hosts a grade 7 class display as part of the current exhibit, and its mission statement names education and community outreach. Daycares is null, not false: the site is simply silent about under-fives and gives no minimum age, so there is no reason to rule them out.

**Coordinates.** `geo_source` is `geocode_pending`. The full address is on the contact page. The live DOM was searched for latitude and longitude values, JSON-LD and map iframes, and the page publishes none: its map is drawn by script and its "Get directions" is a form. No pin was hand-placed from the town name.

**Images.** Both are on the museum's own GoDaddy image CDN, both are absolute https URLs, and both were confirmed on the pages recorded. The exterior photograph was opened directly in a browser and is the Chemainus Valley Museum's own frontage, with the museum's name on the stone wall. Its alt text on the site describes it as the Pend Oreille County Museum, which is a different museum in a different country. The site's alt was recorded word for word, as the rules require, and flagged in gaps so a human rewrites it before publishing. No caption was invented and no rights note was taken.

The site does publish an image reuse statement on the home page, asking that photographs be credited to the Chemainus Valley Historical Society and Museum and not reproduced for commercial purposes. That is a site-wide statement rather than a credit attached to either photograph, so `rights_note` is null on both and `usage` stays `unverified`. It is worth knowing before anything is published.

## Recommended follow up, in the order a director will care

1. **Admission price.** For children, for adults, and whether a school or daycare group is charged at all. Nothing is published.
2. **Youngest age** they will take on a guided tour.
3. **Largest group** they can handle at once, and whether a class needs splitting.
4. **How much notice** they need. They are volunteers and ask you to leave a message, so this is not a same-week booking.
5. **How long a tour runs.**
6. **Somewhere to eat.** Waterwheel Park is right there, but ask whether there is anything indoors when it rains.
7. **Washrooms**, never mentioned.
8. **Step free access and coach parking**, neither mentioned.
9. **Hours outside autumn.** Only autumn hours are on the home page.

# VERIFICATION — Seaview Game Farm

- **Fields checked:** 84 (33 venue, 46 program keys on one program, 3 image records, location, provenance)

- **Is it still trading?** Yes. Checked on 2026-09-10 in a browser, not from a fetch: the site loads, the home page banner gives current farm store hours ("open currently for drop ins Tues - Sat from 10 - 4"), the store page repeats them, and the camping page carries rates explicitly labelled **2026** with a peak season of May 15 to September 20. Nothing on the site says closed, sold or seasonal shutdown.

- **The expectation this venue did not meet.** It was flagged as promising for daycares, petting-farm style, with hands-on animal contact expected. **The site does not support that.** It describes a 168 acre meat, hay and vegetable farm with oceanfront accommodation, a small retail store and a picnic site for hire. There is no farm tour page, no animal feeding, no petting area, no children's programme, and no statement anywhere that a visitor can see the deer, cattle, goats or emu at all. "Farm Tours" appears only in the invisible `meta-keywords` list in the page source, with no page behind it. Nine likely addresses (`farmtours`, `tours`, `farm-tours`, `schools`, `groups`, `visit`, `petting-zoo`, `about2`, `about4`) were probed in the browser and all nine returned 404. The full internal link graph on the live home page was enumerated: 16 pages, all of them opened or accounted for, and none is about visiting the animals.

- **What that means for `mood_tags`.** `play` is on the one program, but it rests on the picnic site's own facility list (picnic tables, shelter, BBQ, fire pit, **beach access**) rather than on animal contact, which is not published. `explore` is the second tag. No `learn` was added, because nothing on the site describes anything being taught.

- **Fields corrected:** 3
  - `cost_per_child_cad` -> `cost_per_group_cad`. $325 is a site rental for a party of up to 50, not a per-head charge. Recording it per child would have put a $325-a-head farm in the catalog. See the caveat below.
  - `has_rain_backup`: `true` -> `null`. "Shelter" appears in the facility list but nothing says whether it is enclosed or whether a group could get out of the rain under it. The photograph shows an open-sided roof, and a photograph is not a source for a facility field.
  - `restrictions`: the "maximum of 100 people" line was moved out of restrictions into `capacity_max`, where it belongs.

- **Fields set to null after review:** 5 — `general_admission_child_cad`, `general_admission_adult_cad` (no general admission is offered at all), `hosts_school_groups`, `hosts_daycare_groups` (the site never mentions schools, daycares or children's groups, and silence is not refusal), `months_offered` (unknown, flagged in gaps rather than read as year-round).

- **Prices re-read from the live DOM**, not from the fetched HTML: $325 for 1-50 guests for 1-4 hours, +$50 per extra 2 hours; $400 for 51-100 guests, +$65 per extra 2 hours; maximum 100 people. All four figures matched the fetched copy. The evidence quote "The Site can accommodate a maximum of 100 people." was confirmed word for word on the live page.

- **Per-group vs per-child, stated honestly.** Their page lays the fee out under a guest band ("1-50 Guests / 1-4 Hours .......... $325") and never uses the words "per group" or "per site". Reading it as a whole-site fee is an **inference from the layout, not a quote**, and that is said in `gaps` with the money named: if it were per child it would be roughly $325 a head, which is plainly not the intent, but one sentence on the phone settles it. The same applies to the $400 band.

- **Conflicts recorded:** 0. The store hours are given identically on the home page banner and the farm store page. The camping deposit and cancellation terms sit only on the camping page and were deliberately **not** applied to the picnic site rental, which publishes none.

- **Authored fields written:** all three.
  - `what_children_do` rests only on the site's own facility list for the rented site: picnic tables, shelter, beach access. It is deliberately two clauses long, because that is all the site supports.
  - `our_note` rests on the absence of any animal-contact offering, and on the fee being for the site rather than per head.
  - `practical_summary` rests on the facility list, the extra-portable-toilet rule for parties over 50, and the empty accessibility, bus parking and rain fields.

- **Images:** 3. The hero (og:image) was opened and looked at in a browser before its alt was written; it is a photograph of the fallow deer herd, not a logo or social card. The two gallery images keep the site's own non-empty alt text verbatim (`alt_source: site`), which names the offering rather than describing the picture; neither is a filename, so the rule to use the site's alt applies. Both captions are the site's own caption text, verbatim. No `rights_note` was recorded: the only credit line anywhere on the site is "A. Timmons Photography" on three wedding photographs, none of which is used here. All three URLs are on the site's own Wix CDN, https, and were present on the pages recorded in `found_on_url`.
  - Noted in `gaps`: the **Show More button at the foot of the gallery does nothing when clicked**, so any further photographs behind it could not be seen.

- **Location:** no map embed and no coordinates anywhere on the site. Geocoded from the published address, 1392 Seaview Road, Black Creek, and the result lands on a house point at the end of Seaview Road, consistent with their own directions ("We are located at the very end of Seaview Road"). Sanity-checked against Vancouver Island bounds and against nearby Black Creek venues in the catalog.

- **Meets minimum viable record:** no. The venue block clears the bar. The program does not: no `age_basis` and no age or grade range, because the site publishes none. It has a cost, `comes_to_you`, and `our_note`.

- **Confidence:** medium-high on the facts recorded, low on the venue's usefulness to a daycare. Everything here was verified against the live DOM and the farm is clearly trading. What is missing is the thing a director actually wants, and it is missing from the site rather than from this record.

- **Recommended follow up by phone (250-337-5182) or email (info@seaviewgamefarm.com), in priority order:**
  1. **The animals.** Can a group of young children see, walk near, or feed the deer, cattle, goats or emu, and is there any guided farm tour at all?
  2. Price. Confirm $325 is for the whole site, not per person, and ask whether a small daycare group of fifteen gets a lower rate.
  3. Youngest age welcomed, and whether children can be near the fence lines safely.
  4. Capacity minimum. There is a maximum of 100 but no floor.
  5. Lead time, deposit and cancellation terms for the picnic site, none of which are published.
  6. Which months and days the picnic site can be booked.
  7. Rain backup. Is the shelter enclosed enough to hold a group in wet weather?
  8. Washrooms. How many, and how far from the picnic site.
  9. Bus parking and whether the route from the gate to the site is step free.

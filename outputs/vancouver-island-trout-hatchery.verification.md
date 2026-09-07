# VERIFICATION — vancouver-island-trout-hatchery

- **Fields checked:** 41 (33 venue, 2 programs re-read against their source pages, images array, provenance)
- **Fields corrected:** 2
  - `venue.website`: `https://www.gofishbc.com/` -> `https://www.gofishbc.com/about-us/contact-us/` — the hatchery has no page of its own; the Contact / Locations and Hours page is the only page carrying its address and phone, so that is the page a director should land on.
  - `pages_opened` kept `https://www.gofishbc.com/about-us/our-hatcheries/` even though it 404s, because the 404 is itself the finding. A plain fetch of that URL returns an apparently healthy empty body; the live browser shows "404 PAGE NOTE FOUND".
- **Fields set to null after review:** 3
  - `venue.booking_method` — the phone number sits under a "Locations and Hours" heading, not under any booking instruction. A contact number is not a stated booking route.
  - `programs[0].what_children_do` — the site never describes what happens on a visit here, so this stays null rather than being imagined from what other hatcheries offer.
  - `programs[1].what_children_do` — a gear pickup, not a visit.
- **Conflicts recorded:** 0. The two pages that mention this hatchery (Contact, Rod Loan) give the same address, and neither contradicts the other.
- **Authored fields written:** `our_note` and `practical_summary` on both programs; `what_children_do` deliberately left null on both.
  - The self guided visit note rests on two facts read together: the About page line that most of their hatcheries welcome visitors and offer self guided tours, and the Contact page, which prints visitor hours for four other hatcheries and none for Duncan.
  - The Rod Loan note rests on the Rod Loan page listing 1080 Wharncliffe Road with "Contact us in advance to coordinate", and on the absence of Duncan from the fishing pond list on the Contact page.
- **Meets minimum viable record:** no.
  - Missing: one `hero` image (the site publishes no photograph of this hatchery, and borrowing a photo of a different hatchery would misrepresent it).
  - Missing: a program with `age_basis` plus a range and a cost field. The self guided visit publishes neither an age range nor a price; the Rod Loan program has `is_free: true` and `comes_to_you: false` but no published age range.
- **Confidence:** medium. Every recorded fact is verbatim from two pages read live in a browser, and the coordinates were geocoded and sanity checked. The record is thin because the site really is thin about this location, not because pages were missed: every page in the site's own sitemap was searched for "Vancouver Island Trout", "Wharncliffe" and "Duncan" and only the Contact and Rod Loan pages matched.
- **How this was kept separate from the parent record:** `outputs/freshwater-fisheries-society-of-b-c.json` was read first. That record holds the Society's own programs (It's a Trout's Life, Learn to Fish school field trips, group Learn to Fish, fishing birthday parties, and the province wide Rod Loan), all of which the site places at Abbotsford, Summerland, Clearwater, Fort Steele or off site lakes. None of those has been copied here. The only Rod Loan entry in this record is the Duncan pickup point, which the Rod Loan page lists by address, and the gaps list names the parent file and venue id so the two records read as a pair.
- **Recommended follow up by phone (250-746-5180), in priority order for a daycare director:**
  1. Can a class or a daycare group visit at all, and is there a charge?
  2. What are the visitor hours here? None are published, unlike four of their other hatcheries.
  3. What is there to see, and how long does it take?
  4. How many children can come at once, and how much notice do you need?
  5. Is there anywhere to eat a packed lunch, and are there washrooms?
  6. Is any of it under cover if it rains, and where would a bus park?
  7. For the Rod Loan: how many rods, for how long, is there a deposit, and is there an age limit?

# VERIFICATION — National Toy Museum of Canada

- **Is it actually open, and where?** Yes. The home page states an address, daily opening hours and admission prices: the museum occupies the back of a space shared with the vintage toy shop Cherry Bomb Toys at 719 Yates Street, between the Interactivity Board Game Cafe and the Haunted Mini Golf, and it says it is currently expanding its footage to include more displays. It moved there from an earlier mezzanine location inside the same shop, which is why the gallery page is labelled as photographs of the previous location. Nothing on the site suggests it is without premises.
- **Fields checked:** 44 non-null values across the venue block, 1 program and 4 images. The home page was reopened in a browser after the JSON was written and the rates block, hours and restriction line re-read word for word.
- **Fields corrected:** 1 after the JSON was written. Image widths and heights on three entries went from null to the values stated in the page markup (1024 x 805 and 1000 x 667), confirmed by re-reading the attributes on the home page.
- **Decisions taken during extraction, recorded so they can be audited:**
  - `mood_tags` is `explore` and `learn`. `play` was considered and rejected because the site says there is no touching allowed. A child's hands are on nothing here, which matters for a toy museum where a director would assume otherwise.
  - `booking_method` is `email` rather than `web_form`. The contact page has a form, but the museum publishes a direct address and asks you to contact it for class rates.
- **Fields set to null after review:** 3
  - `age_min_years`, `age_max_years` and `age_basis`. The $5 band for 14 and under is a ticket price, not a program age range, so it was not converted into one.
  - `capacity_max`. The site never says how many people fit.
  - `facility_notes` entirely. There is no text about washrooms, lunch or access anywhere on the site.
- **Conflicts recorded:** 0.
- **Authored fields written:** `what_children_do`, `our_note` and `practical_summary`.
  - `what_children_do` rests on the description of changing displays of toy lines, dolls and retro gaming consoles, and on the no touching rule.
  - `our_note` rests on the same no touching rule, on the museum sitting at the back of a working toy shop, and on "Contact us for group rates for school classes".
  - `practical_summary` rests on the daily hours, the published youth price, and the four practical fields the site never mentions.
- **Price check:** $10 adult, $7 senior, $5 youth 14 and under, $25 family pass for two adults and up to four youths, Access 2 cards accepted. These are per person walk in prices, not per group, and are recorded as such. The class rate is quoted on request and is not published, so nothing was invented for it. `school_rate_only` is false because the recorded price is the ordinary public one.
- **Meets minimum viable record:** no. `lat` and `lng` are pending geocoding, and the program has no `age_basis` plus range.
- **Confidence:** high on the address, hours, admission prices and the no touching rule, which are all stated plainly on the home page and were re-read in a browser; medium on the images, since two of them date from 2016 and may show the earlier premises even though they sit on the current home page.
- **Recommended follow up by phone (250-385-8697) or email (toymuseumofcanada@telus.net):**
  1. The group rate for a school class, which is the whole reason to call.
  2. The youngest age they will take, given the no touching rule.
  3. How many children fit in the museum at once.
  4. How much notice they need and whether a class needs to book at all.
  5. Washrooms and anywhere to eat.
  6. Step free access to the back of the shop, and stroller access.

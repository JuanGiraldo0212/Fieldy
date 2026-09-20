# cineplex-education-cinema-more.json

VERIFICATION

- **Fields checked:** 47 (33 venue fields, every non-null field on the single program, and both image entries). The Screenings page and the inquiry form page were both re-fetched cold in a second pass and each quoted string was matched against the fresh copy.

- **Fields corrected:** 4
  - `venue.website`: `www.cineplex.com/groupsales` -> `https://www.cineplex.com/parties-and-groups/screenings`. The tracker address returns a 404 and the old `Corporatesales/EducationCinema` address now redirects to the Parties and Groups landing page. The site's own footer links "School Events & Screenings" to the Screenings page, so that is the page this record rests on.
  - `venue.name`: "Cineplex - Education Cinema & More" -> "Cineplex Education Cinema". The site's own heading for the section is "Education Cinema"; the tracker's longer title is kept only in the file name.
  - `program.capacity_min`: 100 -> 20. The 100 figure on the Screenings page is the minimum for *adding* food, catering or a presentation, not a minimum group size. The general minimum is the one the enquiry form enforces, "Number of Guests (Min. 20 Guests)". The 100 figure is kept in the program description where its condition travels with it.
  - `program.source_url`: the Screenings page -> the inquiry form page. The evidence quote has to be contiguous and on the page it cites, and the only hard number published for this offering is the 20-guest minimum on the form. The Screenings page is still listed first in `pages_useful` because that is where the offering itself is described.

- **Fields set to null after review:** 6
  - `venue.address`, `venue.lat`, `venue.lng`, `venue.geo_source` — Cineplex is a national chain. The Screenings page names no theatre, and the enquiry form asks the booker to pick a province, a city and a theatre. Three Cineplex cinemas sit on Vancouver Island, each with its own page, address and published coordinates, so no single pin is honest here. The only address in the page source is the company's head office in Toronto, inside a JSON-LD Organization block, which is not a place a class visits.
  - `venue.booking_phone` — the only telephone number published is 1-800-333-0061, labelled Guest Services in that same Organization block. It is not a booking route, so it is not recorded as one.
  - `program.lead_time_days` — the form's confirmation says they aim to reply within 3 business days. That is a response time, not a minimum notice, so it sits in the description instead.
  - `program.format` — none of the four allowed values describes sitting in an auditorium watching a film the group chose, so it is left null rather than forced.
  - `program.months_offered` — left null with the word unknown recorded against months in gaps, because the site never says when in the year group screenings run.
  - `venue.wheelchair_accessible`, `venue.has_washrooms`, `venue.has_lunch_space` — the accessibility page speaks for the company, not for any one cinema, and never states step-free access outright. The one sentence it does give is kept verbatim in the facility notes and the flag stays null. Washrooms and lunch space are never mentioned for group bookings at all.

- **Conflicts recorded:** 0. The Screenings page, the inquiry form and the footer agree with each other. The 20-guest and 100-guest figures are not a conflict; they answer two different questions and both are carried in the description.

- **Authored fields written:** all three, for the one program.
  - `what_children_do` rests on two lines from the Screenings page: the Education Cinema description naming Classic Literature, Visual Arts, Opera, Ballet and Film, and the film rail's note that a group is "free to choose any movie including those that are not currently showing in theatres". Nothing is claimed about a private auditorium, because the site only promises that under its corporate and social headings.
  - `our_note` rests on the complete absence of any published price, on the form's refusal of fewer than 20 guests, and on the form's three required location fields, province, city and preferred theatre.
  - `practical_summary` is generated from what the pages do publish, an indoor screening booked through a form, against the price, age, running time, notice, washroom, lunch and bus parking gaps.

- **Images:** 2 kept, both re-confirmed on the fresh copy of the Screenings page, both absolute https on mediafiles.cineplex.com, which is Cineplex's own media host, and both answering a HEAD request as image/jpeg. Alt text on both is the site's own and is recorded verbatim, so `alt_source` is `site`; it is a section label rather than a description of the photograph, which is noted in gaps. No captions were written and no rights note was recorded, as the site prints none next to either image. The page banner was skipped because its alt is empty and there is no browser in this run to look at the picture before describing it. The Open Graph image was skipped because it is the site-wide Cineplex sharing card, not a photograph.

- **Meets minimum viable record:** no. Missing `venue.address`, `venue.lat` and `venue.lng`, which cannot be supplied without inventing a location for a chain, and missing a qualifying program: the site publishes no age or grade range, so `age_basis` is null, and no price of any kind, so every cost field and `is_free` are null. The record is honest rather than thin; there genuinely is nothing more on the site.

- **Confidence:** medium. Everything recorded is quoted from Cineplex's own pages and was re-checked cold, but the page content only reaches a plain fetch through the site's own JSON payload, and the Corporate Meetings and Screenings FAQ that the page links to sits on a JavaScript support portal that could not be read, so a price or notice period may exist there.

- **Recommended follow up by phone or email** (the enquiry form at cineplex.com/parties-and-groups/inquiry-form is the only published route; 1-800-333-0061 is guest services, not bookings):
  1. Price — what does a class pay per student for an Education Cinema screening, and is there a separate rate for daycares?
  2. Youngest age — are preschool and daycare groups welcome, and is there a minimum age?
  3. Capacity — the form will not take fewer than 20 guests, so what happens with a single room of 15, and can two groups be combined?
  4. Lead time — how far ahead does a school screening have to be booked, as distinct from how long they take to reply?
  5. Running time — how long should a group block out, including getting in and out of the auditorium.
  6. Lunch space — is there anywhere a group can eat, or does lunch happen off site?
  7. Washrooms — how many, and where are they relative to the auditorium.
  8. Bus parking — where does a school bus drop off and wait at the specific cinema you choose.

- **Note for whoever reviews this record:** this row covers a company, not a venue. Cineplex runs SilverCity Victoria Cinemas at 3130 Tillicum Road, Cineplex Odeon Victoria Cinemas at 780 Yates Street and Galaxy Cinemas Nanaimo at 213-4750 Rutherford Road, and each of those theatre pages publishes its own address and its own coordinates. Splitting this into three rows, one per cinema, would give each a real pin from the site itself rather than a null, and would let a director see which one is nearest. The program text would be identical on all three.

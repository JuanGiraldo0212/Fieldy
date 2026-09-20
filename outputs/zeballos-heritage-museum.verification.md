# zeballos-heritage-museum.json

VERIFICATION

- **Fields checked:** 18 non-null values (7 venue values, 9 program values, the single image entry, and the coordinates), each re-read against a fresh fetch of the Community Facilities page after the JSON was written. The museum has exactly one card on the whole village site, so every non-null value traces to that card except the drive description in `our_note` (Getting Here) and the volunteer line in the venue description (Employment Opportunities).
- **Fields corrected:** 1
  - `venue.website`: the village home page -> the Community Facilities page. The website column in the tracker is the Village of Zeballos site, which covers the whole village. The museum is one card on the facilities page, and that is the only page a director would want to land on.
- **Fields set to null after review:** 3
  - `program.indoor` — the site never describes the building or what a visit involves. A museum is almost certainly indoors, but the site does not say it, so the flag is null and the gap says so.
  - `program.format` — nothing on the site says whether a visitor is shown around or walks through alone.
  - `venue.hosts_school_groups` and `venue.hosts_daycare_groups` (counted as one review) — the site is silent about groups of any kind. Silence is not a no, so both stay null rather than false.
- **Conflicts recorded:** 0. Two phone numbers sit on the one card, the museum's own (250) 761-4070 and the 250-761-4229 the opening line tells you to call, which is the village office. That is one page being specific about two different numbers, not two pages disagreeing, so it is recorded in gaps and the appointment number is the one kept.
- **Authored fields written:** two of three.
  - `what_children_do` is **null on purpose**. The site never says what is in the museum, so there is no honest way to describe the visit.
  - `our_note` rests on the facilities card (an address and one instruction, to call the village office) and the Getting Here page, which states 42 km off Highway 19 and about an hour along the Zeballos Forest Service Road, unpaved, with logging trucks.
  - `practical_summary` is generated from the one published fact, the address and appointment number, against the washroom, lunch, price, age and group gaps.
- **Location:** `geocoded`, not `site_embed`. The site does publish coordinates, but they belong to the village office at 157 Maquinna Ave (the map header on every page) and to the village as a whole (the driving maps on Getting Here). Neither is the museum, so they were not used. 122 Maquinna Ave resolves through the Province of BC address geocoder at civic number precision, score 100, giving 49.98501, -126.84562.
- **Images:** one hero, the photo in the museum's own card on the facilities page, confirmed present on that page and served over https. It carries no alt attribute, so the alt is ours, written from the photo's position in the museum's card and its file name. No browser was available in this run, so the photo was not viewed. That is stated in gaps. No caption and no rights note exist; the site has only a footer copyright line, which is not a photo credit.
- **Meets minimum viable record:** no. The venue block is complete (id, name, address, coordinates, category, date, hero image with alt), but the one program is missing `age_basis` with a range and any cost value, because the site publishes neither an age range nor a price. The validator reports the record as schema-valid and below the publishable bar, which is the honest result here.
- **Confidence:** medium. The few facts are unambiguous and come straight off the village's own page, but they are all there is: this is a village facility listing rather than a museum with a web presence, and nothing about the collection, the hours, the price or children's groups is published at all.
- **Recommended follow up by phone or email** (village office, 250-761-4229, or reception@zeballos.com; the museum's own line is (250) 761-4070):
  1. Price — is there any admission for a children's group, or a donation people are asked for?
  2. Youngest age — are preschool and daycare groups welcome, and is there a youngest age?
  3. Capacity — how many children fit inside at once, and how many adults should come with them?
  4. Lead time — how much notice does an appointment need, and which months and days are realistic given it is opened by volunteers?
  5. What children see — what is actually on display, and how long does a visit take?
  6. Lunch space — is there anywhere a group can eat, given the drive in and out?
  7. Washrooms — are there any in the building, or is the village office the nearest?
  8. Rain backup and access — is the whole visit indoors, and can a stroller or wheelchair get in?

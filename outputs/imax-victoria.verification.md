# VERIFICATION: IMAX Victoria

- **Fields checked:** 52 (venue block 33, three programs against their source pages, 1 image, coordinates, four cross page checks)

- **Fields corrected:** 0. Nothing recorded had to be changed after the second pass.

- **Fields set to null after review:** 5
  - `venue.hosts_daycare_groups` left null. Everything on the site is written for schools and students. The site never mentions daycares and never sets a minimum age, so false would be wrong and true would be an assumption.
  - `venue.has_lunch_space` left null. The school planning page suggests a lunch break at a restaurant off site, which is not a statement that the building has anywhere to eat.
  - `venue.bus_parking` left null. The accessibility page describes accessible car parking and a drop off zone at the main entrance and says nothing about coaches. The detail is kept as a facility note.
  - `venue.stroller_accessible` left null. The site covers wheelchairs and mobility scooters only.
  - Cost fields on both in theatre programs left null, see below.

- **Group price deliberately not recorded.** The only group rate sheet on the site is a PDF linked from the school planning page, marked "Effective August 31, 2016", giving $9.30 for youth 6 to 18, $5.85 for children 3 to 5, $6.50 for BC students, and one complimentary chaperone per 15 to 29 paid admissions. It is ten years old, and the Group Rates link that used to sit beside it now redirects to the schools page. Recording a decade old rate as current would be worse than a blank, so both in theatre programs carry null costs and the situation is spelled out in gaps. The public documentary rates of $14.00 adult and $7.00 child are recorded at venue level instead, where they belong.

- **Prices re-confirmed live:** the showtimes rate table and the schools page were both re-read after the JSON was written, the schools page through a different host name to force a genuine second fetch. Adult $14.00 and Child $7.00 for documentaries, and "Fee: $100.00 + GST per class" with "A maximum of 35 students per classroom", both unchanged.

- **Per class not per child:** the virtual screening fee is $100.00 plus GST for the whole class, recorded as `cost_per_group_cad` 100 with `tax_included` false and `capacity_max` 35. It is not a per student rate.

- **Conflicts recorded:** 4
  1. How much notice to give. Schools page says five business days, school planning page says two.
  2. How early to arrive. School planning page says fifteen minutes, the printed booking guide says thirty.
  3. Number of wheelchair spaces. Accessibility page says up to six, the FAQ says eight stalls in Row C.
  4. When the group office is open. Schools page says nine to four, the film library page says nine to five.
  In each case the value in the record follows the more recently updated page, and each note is written for a director rather than describing our process.

- **Kept to IMAX and not the museum:** the schools page also advertises Royal BC Museum Digital Field Trips at $75, but those are run by the museum on its own site. They are noted in gaps and not recorded as an IMAX program.

- **Authored fields written:** `what_children_do`, `our_note` and `practical_summary` on all three programs.
  - `what_children_do` rests on the 45 minute documentary running time, the six storey screen, the 9am and 10am library slots and the classroom delivery of the virtual screening.
  - `our_note` rests on the film length and volume, the monthly sensory sensitive screening, the 45 student minimum on library films, and the per class arithmetic on the $100 virtual fee.
  - `practical_summary` rests on the accessibility page, the washroom line, and the gaps list.

- **Location:** `geo_source` is `site_embed`. The contact page carries a Google Maps embed for 675 Belleville St containing `!2d-123.36958568454745!3d48.419823839439815`, recorded to 5 decimal places.

- **Images:** 1 entry, the schools page banner, confirmed present on https://imaxvictoria.com/schools/ and served from the site's own uploads folder. Its only attribute is a title holding the file name, which is not alt text, so the alt is `generated` and was written after looking at the image. The homepage Open Graph image was skipped because it is only 370 pixels wide and the rest of the homepage images are film posters. Both decisions are in gaps.

- **Meets minimum viable record:** no. Venue fields, coordinates and a hero with alt are all present, and the virtual screening has a cost and a `comes_to_you` value, but no program publishes an age or grade range, so `age_basis` is null throughout. The missing required field is a program age or grade range.

- **Confidence:** high. Every fact came from a current page, the two prices were re-read live, and the one stale document on the site was identified and excluded rather than absorbed.

- **Recommended follow up by phone or email** (Groups@royalbcmuseum.bc.ca or 250-356-7226), in priority order:
  1. Current group ticket rate per student for an in theatre screening, and whether daycares get the same rate as schools.
  2. Whether there is a minimum age for a booked group screening, and which titles suit three to five year olds.
  3. Maximum group size for an in theatre booking.
  4. How many chaperones come in free.
  5. Whether five business days is really the minimum, since one of their pages says two.
  6. Whether a group can eat lunch anywhere in the building.
  7. Whether a group screening can be run as a sensory sensitive one.

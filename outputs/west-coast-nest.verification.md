# west-coast-nest.json

VERIFICATION

- **Fields checked:** 62 (16 non-null venue fields, 14 on the customized planning program, 18 on the Coastal Pathways program, and all 11 fields on each of the two images). Every source page was re-fetched cold on a trailing-slash URL for this pass, so nothing here rests on the first read.

- **Fields corrected:** 3
  - `programs[].name` for the second program: "Coastal Pathways" -> "Coastal Pathways: Skills, Stories & Futures", which is how the page titles it.
  - `images[].url` for the activity photo: the larger `/display/` variant of the same file was dropped in favour of the `/list/` URL that is actually in the markup of the page it was found on. The bigger file exists on the server but was never on the page, so it is not auditable.
  - `programs[].booking_method` / `booking_url` on Coastal Pathways: set at the program level rather than inherited. The camp is joined through an interest form on its own page and the office email that the rest of the site gives does not appear on it at all.

- **Fields set to null after review:** 4
  - `what_children_do` on the customized planning program. NEST's own page describes the service, not the visit; the activities belong to whichever regional partner gets booked. Imagining a day would have been invention.
  - `format` on the same program. Nothing in the closed list describes a planning and coordination service, so it is left empty rather than forced.
  - `indoor` / `outdoor` on both programs. The site talks about outdoor learning in general terms but never says where either offering actually happens.
  - `age_basis`, `grade_min` and `grade_max` on the customized planning program. The service is filed under both the K to 7 and the 8 to 12 outdoor school headings, but those are browsing categories on a listing page, not a published range. Recorded in gaps instead.

- **Conflicts recorded:** 0. The About page counts "over 40" partner organizations and the customized programs page "over 30". That is a rough figure rather than a field a director books on, so it sits in gaps rather than in conflicts. The phone numbers agree across pages, with the contact page adding a cell number the course page does not carry. Nothing else disagreed.

- **Authored fields written:** all three on both programs, except `what_children_do` on the planning service, which is null for the reason above.
  - Customized planning: `our_note` rests on the fee line ("Customized planning is $150 for the first hour, then $50/hour") and the sentence that each tour or workshop booked is paid for on top, plus the Outdoor School pages pointing teachers at the Education Coordinator for a custom experience. `practical_summary` rests on the published fee and booking email against the complete silence on ages, group size, notice and facilities.
  - Coastal Pathways: `what_children_do` rests on the page's own list of four half days of hands on activities, guided field experiences, workshops and mentorship led by NEST staff, local professionals, environmental organizations, artists and Nuu-chah-nulth knowledge holders, and on the morning and afternoon grade split. `our_note` and `practical_summary` rest on the published dates and grade bands against the "Check back here for more details" state of the fee and the timetable.

- **Scope check.** This was the main risk on this venue. West Coast NEST brokers well over a hundred courses, and most of them belong to other organizations that are separate rows in this catalog: Raincoast Education Society, Ucluelet Aquarium, Tofino Clayoquot Heritage Museum, Parks Canada, Nomad Adventure Guides, Wild Pacific Trail Society and others. Each listing names its own provider under "Organization", and only two of them name West Coast NEST: the customized planning service and Coastal Pathways. Nothing from a partner listing was extracted. Biodiversity Discovery Days is co-run by NEST and the Clayoquot Biosphere Trust but is a free public event whose 2026 dates have passed and which nobody books as a group, so it is recorded against the venue rather than as a program.

- **Location:** `geo_source` is `geocoded`, and it is honest. There is no map embed, no JSON-LD and no coordinate meta tag anywhere on the site; the only iframe on any page is a tag manager. The coordinates come from geocoding the published street address, 316 Main St, Tofino, BC V0R 2Z0, which resolves to the Clayoquot Biosphere Trust office where NEST is based. Note that the pin marks the office, not a place a group visits.

- **Images:** 2, both re-confirmed present in the markup of the page recorded against them, both absolute https on the venue's own domain. Both use the site's own alt text verbatim, so `alt_source` is `site` in both cases and nothing was generated. No captions were written and no `rights_note` was taken; the only credit line on the site is the footer copyright, and the photographer's name on the second image sits inside the alt attribute rather than beside the picture. A hero exists. Its alt, "West Coast NEST Courses Events", is a label rather than a description, which is flagged in gaps; without a browser to open the file and look at it, writing a better one would have been guesswork off the file name.

- **Meets minimum viable record:** no. The venue block is complete, with a hero image, an address and coordinates. What is missing is a single program that clears the program bar. The customized planning service publishes a price ($150 for the first hour) but no age or grade range. Coastal Pathways publishes grades 6 to 12 but no fee at all, only an interest list. Neither one carries both, so the record falls short on `age_basis` plus range for the priced program.

- **Confidence:** medium to high on what is recorded, low on coverage. Every figure here is quoted verbatim from a NEST page and was re-checked cold, but NEST publishes very little about its own two offerings, so the record is thin by the site's own doing rather than by uncertainty.

- **Recommended follow up by phone or email** (Nicole Gerbrandt, Director of Education, nicole@westcoastnest.org, cell 250-726-6508, office 250-725-2219):
  1. Price — what does a typical group end up paying once the planning hours and the partner programs are added together, and is there a flat quote for a school or daycare?
  2. Youngest age — are preschool and daycare groups served at all, or does this start at school age?
  3. Capacity — how many children can one custom itinerary handle, and is there a minimum group size?
  4. Lead time — how far ahead does an itinerary need to be started, and how long does the booking form take to turn around?
  5. Lunch space — is there anywhere a group can eat between stops, given the day moves between partner sites?
  6. Washrooms — which of the partner sites on a typical itinerary have them, and are there change tables?
  7. Rain backup — what happens to an outdoor itinerary in heavy weather, and is there indoor space to fall back on?
  8. Coastal Pathways — what will the 2027 camp cost, what are the daily start and finish times, and where does it meet?

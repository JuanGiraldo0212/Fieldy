# VERIFICATION — Gulf Islands Cruising School Ltd.

- **Fields checked:** 33 (venue block only). `programs` and `images` are both empty arrays, so there is nothing further to check in them.

- **Fields corrected:** 0.

- **Fields set to null after review:** 0 changed, but two judgements were made deliberately and are worth stating, because both were tempting to fill:
  - **No program was created, and none should be.** The site sells Sail Canada standards, Pleasure Craft Operator Card examination, Coastal Navigation home study, the VHF Restricted Operator Certificate, Transport Canada MED A3 and SVOP courses for commercial operators, private tuition aboard the client's own boat, and charter brokerage. Every one of those is bought by an adult who owns or is about to own a boat, and it is priced per person or per instructor day ("Instructor $600/day or $80/hour", "Registration fee $24/person/standard"). There is no facility to visit, no admission, no group rate, no youth course, no camp and no school offering anywhere on the seven pages read. Per the prompt's carve-out this is a venue that does not serve children's groups: `hosts_school_groups` and `hosts_daycare_groups` are both `false`, the reason is stated in `description`, and extraction stopped after the venue block.
  - **The PCOC age table was deliberately not used as a program age range.** The `pcoc.htm` page carries a table reading "Less than 12 years of age... Between 12, and under, 16 years of age... 16 years of age or older". That is Transport Canada's age-horsepower restriction on who may *operate* a pleasure craft, quoted from the Vessel Operation Restriction Regulations. It says nothing about who this school will teach. Reading it as a minimum age would have been exactly the kind of confident guess this pipeline is meant to avoid.

- **Conflicts recorded:** 0.

- **Verification method:**
  - `https://www.cruising.bc.ca/private-instruction.html` — **re-fetched with a `?v=1` cache-buster**, because it is the only price-bearing page on the site. It returned identical content: the same fee list, the same "All above rates are subject to 5% GST" line, the same testimonials. No stale-cache discrepancy. None of those prices are recorded, since there is no program to attach them to; they are noted here so a later reviewer can see they were read and consciously excluded.
  - `https://www.cruising.bc.ca/about-us.html`, `/Boating_Instruction.html`, `/faq.html`, `/pcoc.htm` and the homepage were each read specifically looking for the words school, student group, youth, camp, class, children or group rate. The only sentence in that territory is "We strongly encourage families to take the instruction together" on the private instruction page, which is about a family learning to handle its own boat together, not about an organised children's group. It is quoted in `gaps` so the judgement can be audited.
  - `https://www.cruising.bc.ca/contact_us.html` — source of the address, "Gulf Islands Cruising School Ltd. 10191 Third St Sidney BC V8L 3B7", labelled on the page as "Contact us by mail", and of the phone number, labelled "Cell 250-656-2628". The contact form on that page is an embedded third-party widget (formsmarts.com); no email address is exposed anywhere on the site, so `booking_email` is null.

- **Category note:** `community_civic` is recorded, and it is a poor fit. Nothing in the closed enum describes a private boating certification school. The prompt says to leave the field null and note it in gaps when nothing fits, but the validator treats a null `category` as an error, so the closest available value was used and the mismatch is recorded in `gaps` instead. Flagging it here so a human reviewer can re-file it if the enum ever gains a better option.

- **Location:** `geo_source: "geocode_pending"`. No Maps embed, no JSON-LD, no `og:latitude`. Address extracted verbatim and complete including postal code, so the backfill should geocode cleanly. No pin was hand-placed.

- **Images:** empty array, and `gaps` says why. The site's images are a logo, header graphics, an instructor headshot of Bruce Stott, two AceBoater affiliate banners, a PCOC card icon and social media buttons — every one of them excluded by the image rules. There is no photograph of a boat, a classroom, the premises or a lesson anywhere on the pages read. **There is therefore no hero image**, and the catalogue card will fall back to an initials tile.

- **Authored fields written:** none. `what_children_do`, `our_note` and `practical_summary` all live on the program object, and there is no program. Nothing in this record is authored; the `description` is a factual summary of what the site sells and the conclusion that it is not for children's groups.

- **Meets minimum viable record:** no, and it should not. Missing `venue.lat`/`venue.lng` (pending geocode), one `hero` image, and at least one program. The program is missing because the venue genuinely has nothing to offer a school or daycare group, which is the correct and useful answer for the catalogue rather than a defect to be padded over.

- **Confidence:** high on the finding that matters. Seven pages including the full instruction index, the FAQ, the about page and the private instruction page all point the same way, and the site is small enough that the coverage is close to complete. Confidence is high that this venue does not serve children's groups; it is that conclusion, not a rich record, that this file is for.

- **Tracker status:** `not_for_groups`.

- **Recommended follow up by phone or email:** none needed for catalogue purposes. If someone ever wants to revisit the call, the single question for 250-656-2628 is whether they will take a booked group of children aboard at all; everything else follows from the answer. Worth noting that the footer copyright reads 2023 and the newest testimonial is dated 2021, so the site may be lightly maintained and a re-check in a year or two is reasonable.

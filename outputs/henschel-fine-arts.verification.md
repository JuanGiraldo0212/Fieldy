# henschel-fine-arts.json

VERIFICATION

- **Fields checked:** 4 of the 33 venue fields carry a non-null value (`id`, `name`, `website`, `description`, plus `category`, `checked_on` and `checked_by`), and each was re-checked in a second pass. There are no programs and no images to check, because no page belonging to the venue could be read.
  - The catalog list has no web address for this venue. A single web search for "Henschel Fine Arts Port McNeill" returned a business directory, two tourism listing sites, a stock photo page, a phone directory, a sales-contact aggregator and a Wikipedia article about the town. Not one of them is a site on the venue's own domain, so none of them is a source.
  - The one domain that matches the venue's name, `henschelfinearts.com`, resolves in DNS but serves nothing: the secure port refuses the connection and the plain port times out. That was seen on the first pass and again on the verification pass, over two independent network paths, with control sites loading normally in the same seconds. It is recorded in `website` because the record needs one, and both the description and the gaps say plainly that it does not load and has not been confirmed as the venue's.
- **Fields corrected:** 0.
- **Fields set to null after review:** 0. Everything the search results offered, including a street address and a phone number, was left null from the start rather than taken from a directory or a tourism listing. The description says what is genuinely known and no more.
- **Conflicts recorded:** 0. With a single unreadable source there is nothing that could disagree with anything else.
- **Authored fields written:** none. `what_children_do`, `our_note` and `practical_summary` live on programs, and there are no programs. Writing any of them would have meant imagining a visit nobody has described, which is the one thing the record must not do. `category` is the only judgement call in the file: it is set to `arts_performance` from the venue's name alone, and the gaps list says so.
- **Meets minimum viable record:** no. Missing `venue.address`, `venue.lat`, `venue.lng`, a `hero` image with alt text, and any program at all. The record exists to hold the gap honestly until someone can call.
- **Confidence:** high that there is nothing readable to extract, low about the venue itself. Two passes over the only plausible domain both failed while control sites loaded, so the absence is real rather than a fetch problem. Nothing at all is known about what the venue offers, so if the domain comes back up this venue should be re-run from scratch rather than topped up.
- **Recommended follow up by phone or email** (no contact details belonging to the venue are available; the number carried by third-party directories was deliberately not recorded and would need to be confirmed before use):
  1. Whether the venue hosts children's groups at all, and whether daycare groups are welcome as well as school classes.
  2. Price for a group visit, and whether children are charged.
  3. Youngest age welcomed.
  4. How many children can come at once.
  5. How much notice a booking needs, and who takes the booking.
  6. Whether there is anywhere for a group to eat.
  7. Washrooms on site, and whether there is a change table.
  8. Whether the visit works in the rain.
  9. The street address, so the venue can be placed on the map.

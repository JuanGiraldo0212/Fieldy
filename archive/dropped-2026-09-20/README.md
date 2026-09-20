# cedar-coast-field-station — dropped 2026-09-20

Same organisation as `cedar-coast-art-and-ecology-centre`, which is the record to keep.

`cedarcoastfieldstation.org` is dead. It now serves a 596-byte stub in Indonesian for
every path. The successor site, `thecedarcoast.ca`, states on its home page that the
Vargas Island centre is **permanently closed**, and still links back to this domain for
its SOPs and herbarium, which is what confirms the two are one organisation.

The record was moved here rather than deleted because it is the evidence for that
finding. It is not importable: `venue.category` is null and `venue.website` is null, so
leaving it in `outputs/` aborts the whole catalog import.

Retrieval trap, for anyone who re-runs this: `thecedarcoast.ca` serves its real
WordPress site **only to a desktop browser User-Agent**. A default fetch gets the same
596-byte stub, which reads as a hijacked domain and is how this duplicate arose.

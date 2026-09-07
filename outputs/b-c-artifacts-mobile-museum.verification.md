# VERIFICATION — b-c-artifacts-mobile-museum

- **Fields checked:** 33 venue fields. There are no programs and no images to check.

- **The headline finding.** This venue has closed. Loading `mobilemuseum.ca` in a browser follows a redirect to `www.bcartifacts.com`, whose first line of body text reads "The BC Artifacts Mobile Museum are now closed!". That is the live state of the site as of today.

- **Fields corrected:** 3
  - `venue.hosts_school_groups`: true -> false, and `venue.hosts_daycare_groups`: true -> false, once the live site was read.
  - `venue.website`: kept as `https://mobilemuseum.ca` because that is the address in the tracker and it still resolves, but the redirect target is recorded in the description and in `pages_opened`.

- **Fields set to null after review:** 4
  - `booking_email`, `booking_phone`, `booking_url` and `booking_method` — all null. The older page published a phone number and two email addresses, but they are now the contact route for someone wanting to buy the business, not a booking route. Recording them as booking contacts would send a director to ring about a service that no longer exists. This is explained in gaps.
  - `lat`, `lng` and `geo_source` — all null. No address was ever published for the business, so there is nothing to geocode and no pin was hand placed.

- **Programs:** empty array, as required for a venue that does not serve children's groups. The older page did describe a real offering: 50 to 60 minute presentations, best kept under 35 students per session, an hour and a half of set up before the first presentation, suitable for all ages, and bookings taken up to a year ahead. None of it has been written up as a program, because the offering does not exist. It is summarised in gaps so the detail is not lost if someone does buy the business.

- **The per visit price the brief asked about does not exist.** Neither version of the site publishes a per visit, per day or per student fee, a travel radius, or a mileage charge. The only figure anywhere is $75.00 for a book. There is nothing to record and nothing to estimate.

- **Images:** empty array. The live page is text and links with no photographs, and the older fetched version served no images either. Recorded in gaps.

- **Conflicts recorded:** 1
  - Whether the museum is trading. The live site says it is closed; the version returned to a plain fetch says the owner is retiring and hoping to sell. The note tells a director both, in her own words, and says there is nothing to book either way.

- **The retrieval trap.** A plain fetch of `mobilemuseum.ca` returns the older page, complete with tour details and a retirement notice, and does not follow through to the closure notice. Anyone re-running this venue with fetching alone will see a live looking business. A `RETRIEVAL NOTE` in gaps says so explicitly.

- **Authored fields written:** none. `what_children_do`, `our_note` and `practical_summary` live on programs, and there are no programs. The venue `description` is factual and sourced.

- **Meets minimum viable record:** no. Missing `venue.address`, `lat`, `lng`, a hero image and any program. That is the correct outcome for a closed venue and none of it should be filled in.

- **Confidence:** high, on the one thing that matters. The closure statement is unambiguous, is on the site the venue's own domain now points at, and was read directly from the live page.

- **Recommended follow up:** none for booking purposes. If someone later reports that the business has been sold and restarted, re-check `bcartifacts.com` and the linked Facebook page, and ask for a per visit price, a travel radius, how many sessions a day they will run, and the maximum group size per session.

- **Tracker status:** `not_for_groups`, chosen over `error` because the site is up and working and the venue genuinely no longer serves groups. It is not a retrieval failure.

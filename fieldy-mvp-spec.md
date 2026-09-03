# Fieldy. MVP design spec

This is the single spec for the MVP. It merges the original design spec and the messaging addendum, and aligns names with `fieldy-data-model.md` (rooms, centres, date options, asks, the request first trip lifecycle).

## 1. What this is

A web app that helps early childhood educators (ECEs), daycare directors and elementary teachers on Vancouver Island, starting with Greater Victoria, find, request and track outings for their group. It replaces a mix of Google searches, bookmarked PDFs, sticky notes and email threads.

The product is consumer first. Venues do not have accounts. The catalog is maintained by us. Venues stay in their own email; Fieldy sits in the middle of the conversation.

Primary audience for the MVP: licensed daycares and preschools (groups of 8 to 24 children, ages 1 to 5). Secondary: elementary teachers (K to 7). The design should feel natural to the first group and not alienate the second.

## 2. The promise in one sentence

"Tell us about your group once and we will show you every outing that actually works for you, send the request for you, and keep the conversation and the deadlines in one place."

## 3. What the MVP is not

- No venue portal, no venue login, no venue facing inbox. Venues reply from their own email.
- **No reply by email for the educator.** Fieldy emails the venue and receives their replies, but the educator reads and writes in the app. They get a short notification email with a preview and a link, not a forwarded copy of the thread. One conversation, in one place.
- No payments, invoicing or parent consent collection.
- No integration with school district systems.
- No multi user centre accounts, roles, invitations or approvals. One account per person; the centre exists as a record so it can be shared later.
- No automatic status changes without a tap. The app suggests, the user decides.
- No reading of attachments. They are shown, not parsed.
- No phone call logging beyond a hand written note and a manual status change.
- No mobile app. Mobile web must be excellent because directors will open this on a phone.

## 4. Core objects (for the designer's mental model)

- **Account**: one person. Name, role (ECE, director, teacher, other), phone, notification preference.
- **Centre**: the daycare, preschool or school. Name, type, address. Every distance is measured from here.
- **Room**: one class or room. Age range, size, licensed ratio, budget per child, transport options (walking, bus, parent drivers, none), address if different from the centre, short notes. One person can have several rooms (toddler room, preschool room). Rooms are archived, never deleted.
- **Venue**: a place or organization. Address, category, practical facts (washrooms, lunch space, rain backup, stroller access, bus parking).
- **Program**: a specific offering from a venue. Age or grade range, cost, duration, capacity, months offered, lead time to book, whether it comes to you.
- **Trip**: a program requested for one or more rooms on a set of candidate dates. A trip exists because a request was sent; there is no draft state. Status: requested, replied, confirmed, done, cancelled. A derived "waiting on" (educator, venue, nobody) comes from who sent the last message.
- **Date option**: a candidate date with a slot (morning, afternoon, either), in rank order.
- **Ask**: a question sent with the request, mostly derived from what the venue does not publish (price, lunch space, youngest age).
- **Task**: a dated checklist item generated for a trip (send request, book transport, approval, consent out, consent in, headcount, day before) with the offset from the trip date.
- **Message**: one email in a trip's thread. Party (educator, venue, system), time, stripped body, optional full body, attachments. The opening request renders as a summary card.
- **Suggestion**: the app's reading of a venue reply. Intent (confirmed, proposed dates, declined, unclear), dates, time, a one line evidence quote, confidence. Never applied on its own.
- **Saved outing**: a bookmark on a program.
- **Report**: a data correction from a user, anonymous allowed.

## 5. Screens

### 5.1 Landing and catalog (no login required)

The first thing anyone sees. Must work from a link shared in a text message.

- Top: a compact profile bar. Age range, group size, transport, budget per child. Logged out, these are session values with defaults that make the page useful before anyone touches it (ages 3 to 5, 16 children, walking or bus, $10 per child). Logged in, the bar shows the active room and switches between rooms. Changing any value refilters instantly.
- Below: a list of programs, not venues. Each card shows program name, venue name, distance and travel mode from the home address (if set), cost per child and estimated total for the group size, duration, age fit, and one honest line from us.
- A small "feasible for your group" indicator on each card. Green when age, size and budget all fit. Amber when one thing is off, stated plainly ("capacity is 12, your group is 16, ask about splitting"). Red when two or more are off. Never hide cards, rank feasible ones first.
- Filters as chips, not a sidebar: category (animals and farms, nature, museums and history, arts and performance, science, community and civic, comes to you), season, indoor or outdoor, free, accessibility, format.
- Search box for name or keyword.
- Search state lives in the URL so a filtered view can be shared.
- Map toggle. Optional for MVP, but leave room for it.

### 5.2 Program detail

- Everything on the card plus: full description, what children do, capacity, months and days offered, lead time to book, booking method (email, phone, web form) with the contact.
- Practical block, prominently placed: washrooms, lunch space, indoor backup for rain, stroller and wheelchair access, bus parking, nearby park for lunch. Unknown facts are shown as unknown, not hidden, because they become asks on the request.
- Our note: one to three sentences written by us. This is the curation and it should read like a friend's advice, not marketing.
- Primary action: "Plan this trip." Secondary: "Save for later."
- Data freshness line: "Details checked on <date>. Something wrong? Tell us." One tap opens the report form.

### 5.3 Plan a trip

One screen, not a wizard. Opening it requires a login; a first time user creates the centre and first room in a two step form and returns here.

1. Rooms: pick one or more. The header shows children, required adults and the combined ratio as they pick.
2. Date options: up to three, each with a slot, in rank order. "Sometime in <month>" is allowed as a single option.
3. Asks: chips, with the ones derived from the program's gaps pre selected. The user can add a custom question.
4. Message: prefilled from the centre, rooms, dates and asks, editable. A helper line under it: "Sent from your name through Fieldy. The venue's reply lands here, and we'll email you when it does."
5. Send. This creates the trip and opens the trip page.

### 5.4 Trip page

The heart of the product. One page per trip, top to bottom:

1. **Header.** Program, venue, rooms, dates (the options until confirmed, then the confirmed date and time), status selector. Next to status, the "waiting on" pill: "Waiting on venue, 4 days", "Your turn", or nothing once confirmed. A small line under the status says where the last change came from: "moved here when the venue replied" or "set by you."
2. **Suggestion banner**, when a venue reply produced one (see 5.5).
3. **Cost summary.** Admission for children, adults if charged, group fee, transport estimate if a bus is needed, total, per child figure. Editable numbers, because reality differs. A flag when a component is unknown.
4. **Timeline.** Checklist with dates calculated backwards from the trip date. Default offsets: send request at trip date minus the venue's lead time minus a buffer (send request is created already done, since sending is what created the trip); book transport at 14 days before, bus trips only; approval at 10; consent out at 10; consent in at 3; headcount at 2; day before at 1. Each task has a checkbox, an editable date, and can be deleted or added to. Overdue tasks are visually loud but not alarming. When the confirmed date differs from the requested one, tasks the user has not edited move with it; edited ones stay.
5. **Thread.** Chronological, newest at the bottom. The opening request is a summary card (rooms, dates, asks) rather than a wall of text. Each later message shows the party avatar and name ("Royal BC Museum Education"), time, and the stripped body; "Show full message" expands the quoted history. Attachments are chips under the message and open in a new tab. System events are thin grey lines inline: "Request sent Sep 22", "Status set to confirmed". Unread venue messages carry a dot until the page is viewed.
6. **Compose.** A text box docked under the thread with a Send button. Empty after the first request. Sends through Fieldy from the user's name.
7. **Notes** for the team, and the **attendance helper**: number of children and adults, the ratio, and a flag when it is below the room's required ratio. Multi room trips show each room's requirement separately, never averaged.

### 5.5 Suggestion banner

When a venue reply produces a suggestion with a clear intent, a soft card appears between the header and the cost summary. One sentence, the action buttons, and a smaller evidence line quoting the sentence the reading came from, so the user can check the machine's work.

- Confirmed: "Looks like the venue confirmed Tue Oct 14 at 9:30." Buttons: Mark confirmed, Not quite. Accepting sets the status, the confirmed date and time, and regenerates the remaining tasks. If the reply confirmed without a date, the banner offers the first date option.
- Proposed dates: "The venue suggested Oct 16 or Oct 21 instead." One button per date, however many the venue offered, plus Neither. Picking one updates the trip dates and offers a prefilled reply accepting it.
- Declined: "It sounds like the venue can't take this booking." Buttons: Mark cancelled, Not quite. Below it, "Find a similar program" opens the catalog filtered to the same category and the current room.
- Unclear: no banner. The message is simply in the thread.

There is no "needs info" banner. A venue reply that only asks questions reads as unclear and sits in the thread; the compose box is directly below it, which is the whole action anyway. Summarising a venue's questions in our own words needs generation, not extraction, and the classifier is rule based by design (no LLM in the MVP).

Dismissed banners do not come back for that message. Every accepted suggestion writes a system event in the thread.

### 5.6 My trips

- Trips grouped by status, upcoming first. Each row: date, program, venue, rooms, the "waiting on" pill, the last message summary in one truncated line, and the next task due.
- Sort within each group by urgency: trips waiting on the educator first, then trips waiting on the venue the longest, then the rest.
- A filter chip at the top: "Needs my reply."
- Done and cancelled trips fold into a history section.
- Empty state suggests three feasible programs for the active room.

### 5.7 Inbox

A single list of all messages across trips, newest first, grouped by day. Each row: venue name, trip name and date, stripped body preview, party. Tapping opens the trip page scrolled to that message. It is for the director with eight trips in flight who wants to clear replies in one pass. It is a list, not a mail client. Lives in the main navigation next to My trips, with an unread count.

### 5.8 Rooms

- List and editor. Fields: name, icon, age range, size, required ratio, budget per child, transport options, address if different from the centre, notes (300 characters).
- Address entry uses autocomplete or a map pin; distance calculations depend on it.
- Archive instead of delete. An archived room shows as "Preschool room (deleted)" on old trips and disappears from pickers. A centre always keeps at least one active room.

### 5.9 Saved outings

Bookmarked programs, same cards as the catalog, feasibility against the active room.

### 5.10 Account and centre

- Email plus magic link. No passwords.
- Name, role, phone (offered to the venue as a contact), centre name and type, centre address.
- A short explanation, shown once before the first request and again here: "Requests are sent from your name through a Fieldy address. The venue sees your name and centre, and your email is in the message so they can always reach you directly. Their replies come back here, and we email you when one arrives." A toggle: "Email me when a venue replies," default on.
- The notification email is a nudge, not a copy of the thread: who replied, which trip, the first line or two, and a button to the trip. It comes from a no-reply address, and says so — replying to it does not reach the venue.

## 6. Design direction

- Warm, calm and practical. This is used at 7:40 am by someone with a coffee in one hand.
- Big touch targets, generous line height, real photos of venues where we have rights, otherwise a simple category illustration. No stock photos of smiling children.
- Copy is plain and specific. "Bring rain gear, the barn is outdoors" beats "an unforgettable experience."
- Avoid dashboards and stats. The user is planning one outing, not running a business.
- Colour: an earthy base with one confident accent. Status colours must be distinguishable without relying on colour alone.
- Empty states do work: an empty trip list suggests three feasible programs for the current room; an empty thread explains that the venue's reply will appear there.
- The thread reads like a conversation, not a mail client. No headers, no subject lines, no "Re: Re:". The subject exists only in the venue's inbox.
- Educator and venue messages align the same way, distinguished by avatar. This is a shared record, not a chat bubble app.
- Suggestions are quiet: a soft card with normal weight text. The user should never feel the app decided something for them.
- System events are visually lighter than messages.

## 7. Key interactions to prototype

1. Land on the catalog, change the age range to "1 to 3," watch the list refilter and the feasibility indicators update.
2. Open a program, read the practical block and our note, tap "Plan this trip," pick rooms, dates and asks, send, and arrive on the trip page with the request card at the top of the thread and the "Send request" task already done.
3. See the header pill read "Waiting on venue."
4. A venue reply arrives (simulated). See it in the thread with an unread dot, see the "Looks like the venue confirmed" banner with its evidence line, tap Mark confirmed, watch the status, date and timeline update and a system event appear in the thread.
5. A second reply proposes two other dates. Pick one, see the prefilled acceptance in the compose box.
6. Open Inbox with three replies across three trips, tap one, land on the right trip scrolled to the message.
7. Change status by hand to cancelled, see "set by you" under the status.
8. Archive a room that has an old trip; the trip still shows the room's name and numbers.

## 8. Success criteria for the demo

- A director can find a feasible outing for a specific room in under one minute.
- A request goes out with rooms, dates and asks filled in within three taps of a program card.
- A director can see which trips are waiting on her in one glance from My trips.
- A confirmation from a venue becomes a confirmed trip in one tap, with the evidence visible.
- The person asks for the link.

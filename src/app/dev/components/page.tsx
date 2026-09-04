import { notFound } from 'next/navigation'
import { AttachmentChip, Thread, type ThreadMessage } from '@/components/trip/thread'
import { ComposeBox } from '@/components/trip/compose-box'
import type { Ask, DateOption } from '@/lib/schemas'

/*
  The component gallery. Plan §2a.2: "Build each one with a dev-only gallery at
  /dev/components covering every listed state, and compare side by side against
  the running prototype before moving on."

  It exists so a state can be looked at without arranging the data that
  produces it. Some of these are otherwise genuinely hard to reach — an
  attachment whose bytes we failed to fetch needs a broken storage object, and
  a message the stripper trimmed needs a venue with a chatty mail client.

  Currently covers slice 5's thread components. Later slices add their own
  sections; nothing here is imported by anything that ships.
*/

export const dynamic = 'force-dynamic'

const NOW = new Date('2026-09-23T14:20:00Z')
const EARLIER = new Date('2026-09-22T09:14:00Z')

const DATE_OPTIONS: DateOption[] = [
  { date: '2026-10-14', slot: 'morning', rank: 1 },
  { date: '2026-10-16', slot: 'either', rank: 2 },
]

const ASKS: Ask[] = [
  {
    key: 'fact:Washrooms',
    label: 'Washrooms',
    question: 'Where are the closest washrooms to the program space?',
    source: 'gap',
  },
  {
    key: 'fact:Lunch',
    label: 'Lunch space',
    question: 'Is there somewhere we can use for lunch?',
    source: 'gap',
  },
]

function msg(over: Partial<ThreadMessage> & { id: string }): ThreadMessage {
  return {
    party: 'venue',
    authorName: 'Margaret Doyle',
    body: 'Yes, that works.',
    bodyFull: null,
    isRequest: false,
    sentAt: NOW,
    readAt: NOW,
    attachments: [],
    sendError: null,
    ...over,
  }
}

export default async function ComponentGallery() {
  /* Never in production. It renders fixtures, and a public page of invented
     venue replies is a confusing thing to leave lying around. */
  if (process.env.NODE_ENV === 'production') notFound()

  return (
    <main className="mx-auto max-w-[940px] px-5 py-8">
      <h1 className="font-display text-display-md m-0">Components</h1>
      <p className="text-body text-text-muted mt-2 mb-8">
        Dev only. Slice 5: the thread and the compose box.
      </p>

      <Section
        title="Thread — the ordinary run"
        note="Request card, an educator follow-up, a venue reply carrying the Newest reply mark, and the waiting tail."
      >
        <Thread
          dateOptions={DATE_OPTIONS}
          asks={ASKS}
          waitingOnVenue
          undelivered={false}
          messages={[
            msg({
              id: 'a',
              party: 'educator',
              authorName: 'Sarah Chen',
              isRequest: true,
              sentAt: EARLIER,
              body: 'Hello,\n\nWe are hoping to bring our preschool room to your guided tour.\n\nSarah Chen\nSunnyside Daycare',
            }),
            msg({
              id: 'b',
              party: 'educator',
              authorName: 'Sarah Chen',
              sentAt: EARLIER,
              body: 'One more thing — is there anywhere to leave 18 pairs of wellies?',
            }),
            msg({
              id: 'c',
              body: 'Tuesday October 14 works for us — we can take the group at 9:30am.\n\nThe picnic shelter is yours for the hour.',
              bodyFull:
                'Tuesday October 14 works for us — we can take the group at 9:30am.\n\nThe picnic shelter is yours for the hour.\n\nMargaret Doyle\nEducation Coordinator\n250-555-0134\n\nOn Mon, Sep 22, 2026 at 9:14 AM Sarah Chen wrote:\n\n> Hello,\n>\n> We are hoping to bring our preschool room.',
            }),
          ]}
        />
      </Section>

      <Section
        title="Thread — unread, attachments, a system event"
        note="The unread dot stays until the page is viewed. A chip with no link is an attachment whose bytes we could not fetch — it still names the file."
      >
        <Thread
          dateOptions={DATE_OPTIONS}
          asks={ASKS}
          waitingOnVenue={false}
          undelivered={false}
          messages={[
            msg({
              id: 'd',
              party: 'system',
              authorName: 'Fieldy',
              body: 'Sarah Chen set the status to confirmed.',
            }),
            msg({
              id: 'e',
              readAt: null,
              body: 'Confirmed for the 14th. The booking form is attached — please bring it signed on the day.',
              attachments: [
                {
                  name: 'booking-form.pdf',
                  url: 'att/demo/1/booking-form.pdf',
                  mime: 'application/pdf',
                  size: 184320,
                },
                {
                  name: 'site-map.png',
                  url: 'att/demo/1/site-map.png',
                  mime: 'image/png',
                  size: 2400,
                },
              ],
            }),
          ]}
        />
      </Section>

      <Section
        title="Thread — the request never left"
        note="No venue is being slow, because nobody was written to. The failure sits on the message rather than on the page."
      >
        <Thread
          dateOptions={DATE_OPTIONS}
          asks={ASKS}
          waitingOnVenue={false}
          undelivered
          messages={[
            msg({
              id: 'f',
              party: 'educator',
              authorName: 'Sarah Chen',
              isRequest: true,
              sentAt: EARLIER,
              body: 'Hello,\n\nWe are hoping to bring our preschool room.',
            }),
            msg({
              id: 'g',
              party: 'educator',
              authorName: 'Sarah Chen',
              body: 'Following up on the above.',
              sendError: 'Could not send: the mail provider refused the address.',
            }),
          ]}
        />
      </Section>

      <Section title="Attachment chip" note="Openable, and not.">
        <div className="flex flex-wrap gap-2">
          <AttachmentChip
            attachment={{
              name: 'booking-form.pdf',
              url: 'k1',
              mime: 'application/pdf',
              size: 184320,
            }}
            href="#"
          />
          <AttachmentChip
            attachment={{ name: 'site-map.png', url: 'k2', mime: 'image/png', size: 2400 }}
            href={null}
          />
          <AttachmentChip
            attachment={{ name: 'notes', url: 'k3', mime: null, size: null }}
            href="#"
          />
        </div>
      </Section>

      <Section
        title="Compose box"
        note="Empty with Send disabled, and the case where the venue publishes no booking email."
      >
        <ComposeBox tripId="demo" canSend venueName="Abkhazi Garden" />
        <div className="mt-8">
          <ComposeBox tripId="demo" canSend={false} venueName="Abkhazi Garden" />
        </div>
      </Section>
    </main>
  )
}

function Section({
  title,
  note,
  children,
}: {
  title: string
  note?: string
  children: React.ReactNode
}) {
  return (
    <section className="mb-10">
      <h2 className="font-display text-display-sm border-border m-0 border-b pb-2">
        {title}
      </h2>
      {note ? (
        <p className="text-meta text-text-faint mt-2 mb-4 leading-normal">{note}</p>
      ) : (
        <div className="mb-4" />
      )}
      <div className="bg-surface border-border rounded-panel border p-6">
        {children}
      </div>
    </section>
  )
}

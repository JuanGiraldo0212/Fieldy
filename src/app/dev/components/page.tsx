import { notFound } from 'next/navigation'
import { AttachmentChip, Thread, type ThreadMessage } from '@/components/trip/thread'
import { ComposeBox } from '@/components/trip/compose-box'
import { SuggestionCard } from '@/components/trip/suggestion-card'
import type { DateOption, Suggestion } from '@/lib/schemas'
import { Skeleton } from '@/components/ui'

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

function suggestion(over: Partial<Suggestion> = {}): Suggestion {
  return {
    intent: 'confirmed',
    dates: ['2026-10-14'],
    time: '09:30',
    evidence: 'Wednesday October 14 works for us — we can take the group at 9:30am.',
    confidence: 0.9,
    dismissed_at: null,
    ...over,
  }
}

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
        Dev only. Slice 5: the thread and the compose box. Slice 6: the
        suggestion banner.
      </p>

      <Section
        title="Suggestion banner"
        note="The three drawn intents, then the two the design leaves out on purpose: unclear renders nothing, and a dismissed one is gone for good. Buttons post to the real action and will answer “not one of yours” here."
      >
        <SuggestionCard
          messageId="demo-confirmed"
          suggestion={suggestion()}
          dateOptions={DATE_OPTIONS}
          similarHref="/?cat=animals_farms"
        />
        <SuggestionCard
          messageId="demo-confirmed-no-date"
          suggestion={suggestion({
            dates: null,
            time: '10:00',
            confidence: 0.75,
            evidence: 'That works — we have you down for the date you asked for at 10 am.',
          })}
          dateOptions={DATE_OPTIONS}
          similarHref="/?cat=animals_farms"
        />
        <SuggestionCard
          messageId="demo-proposed"
          suggestion={suggestion({
            intent: 'proposed_dates',
            dates: ['2026-10-21', '2026-10-23', '2026-10-27'],
            time: null,
            evidence: 'Neither of those dates works I am afraid, but we could offer Oct 21, Oct 23 or Oct 27 instead.',
          })}
          dateOptions={DATE_OPTIONS}
          similarHref="/?cat=animals_farms"
        />
        <SuggestionCard
          messageId="demo-declined"
          suggestion={suggestion({
            intent: 'declined',
            dates: null,
            time: null,
            confidence: 0.75,
            evidence: 'Unfortunately we are fully booked for school groups until the end of November.',
          })}
          dateOptions={DATE_OPTIONS}
          similarHref="/?cat=animals_farms"
        />
        <div className="text-meta text-text-faint mt-4 leading-normal">
          Below: an <code>unclear</code> reading and a dismissed one. Both
          render nothing, which is the point.
        </div>
        <SuggestionCard
          messageId="demo-unclear"
          suggestion={suggestion({ intent: 'unclear', dates: null, time: null, confidence: 0.5 })}
          dateOptions={DATE_OPTIONS}
          similarHref="/?cat=animals_farms"
        />
        <SuggestionCard
          messageId="demo-dismissed"
          suggestion={suggestion({ dismissed_at: '2026-09-23T15:00:00Z' })}
          dateOptions={DATE_OPTIONS}
          similarHref="/?cat=animals_farms"
        />
      </Section>

      <Section
        title="Thread — the ordinary run"
        note="The opening request, an educator follow-up, a venue reply carrying the Newest reply mark, and the waiting tail."
      >
        <div className="bg-chat-ground rounded-card-lg px-4 py-4">
          <Thread
            waitingOnVenue
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
        </div>
      </Section>

      <Section
        title="Thread — unread, attachments, a system event"
        note="The unread dot stays until the page is viewed. A chip with no link is an attachment whose bytes we could not fetch — it still names the file."
      >
        <div className="bg-chat-ground rounded-card-lg px-4 py-4">
          <Thread
            waitingOnVenue={false}
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
        </div>
      </Section>

      <Section
        title="Thread — the request never left"
        note="No venue is being slow, because nobody was written to. The failure sits on the message rather than on the page."
      >
        <div className="bg-chat-ground rounded-card-lg px-4 py-4">
          <Thread
            waitingOnVenue={false}
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
        </div>
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
        title="Photo skeleton"
        note="What a card thumbnail and a strip tile hold while the venue's photograph is still coming down. Hard to catch on a warm cache, so it is here."
      >
        <div className="flex flex-wrap items-start gap-3">
          <span className="bg-thumb relative block h-[104px] w-[104px] overflow-hidden rounded-thumb">
            <Skeleton className="absolute inset-0" />
          </span>
          <span className="bg-thumb relative block h-[200px] w-[260px] max-w-full overflow-hidden rounded-card">
            <Skeleton className="absolute inset-0" />
          </span>
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

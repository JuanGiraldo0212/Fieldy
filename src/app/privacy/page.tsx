import type { Metadata } from 'next'
import Link from 'next/link'

/*
  Privacy and terms. Plan M6: "Privacy page and terms covering stored
  correspondence, retention of raw email (90 days), deletion of a trip's
  thread on request."

  Plain, specific, and short enough to actually be read by the person it is
  about. Every promise here is one the code keeps: the retention job in
  src/lib/jobs/retention.ts, the send-only relay in src/lib/email, the
  centre scoping in every query. Nothing is promised that is not built.
*/

export const metadata: Metadata = {
  title: 'Privacy and terms · Fieldy',
}

const UPDATED = '5 September 2026'

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-[680px] px-5 pt-8 pb-20">
      <h1 className="font-display text-display-lg m-0">Privacy and terms</h1>
      <p className="text-body text-text-muted mt-2">
        What Fieldy keeps, why, for how long, and how to have it removed.
        Last updated {UPDATED}.
      </p>

      <Section title="What Fieldy is">
        <p>
          Fieldy is a free planner for educators on Vancouver Island. You find
          an outing, we write and send a booking request to the venue in your
          name, and the venue's reply lands on your trip page. That is the
          whole product, and everything below follows from it.
        </p>
      </Section>

      <Section title="What we store">
        <ul>
          <li>
            <strong>Your account and centre.</strong> Your name, email, role,
            your centre's name, type and address, and the rooms you set up:
            ages, group size, ratio, budget, transport and any notes. This is
            what the catalog measures against.
          </li>
          <li>
            <strong>Your trips.</strong> The dates you asked for, the questions
            you asked, the checklist, costs and team notes.
          </li>
          <li>
            <strong>Correspondence.</strong> Every request we send for you and
            every reply a venue sends back, including attachments. This is the
            record your trip page shows and it is the reason the product
            exists.
          </li>
          <li>
            <strong>The raw email.</strong> For ninety days we also keep the
            venue's reply exactly as it arrived — headers and both bodies — so
            that a threading or formatting problem can be checked against the
            bytes we received. After ninety days it is deleted automatically.
            The message itself, as shown on your trip, stays.
          </li>
        </ul>
      </Section>

      <Section title="How the relay works">
        <p>
          Requests go out from a Fieldy address with your name on them. The
          venue sees your name, your centre and your email address in the
          message, so they can always reach you directly. Their replies come
          back to Fieldy and appear on your trip page; if you have
          notifications on, we email you a short note with a link when one
          arrives. We never forward the venue's email to you and we never send
          anything to a venue that you did not write or approve.
        </p>
        <p>
          Nothing in a venue's reply is read by a person at Fieldy in the
          ordinary course of things. A rule-based reader looks for a
          confirmation, an offer of other dates, or a decline, and shows you
          what it found with the sentence it found it in. It never changes a
          trip on its own; only your tap does.
        </p>
      </Section>

      <Section title="Who can see what">
        <p>
          Trips and their correspondence are visible to the accounts at your
          centre and nobody else. Saved outings are yours alone. The catalog is
          public. We do not sell or share your data, and we do not use it for
          advertising. The services that hold it on our behalf are Supabase
          (database and storage), Vercel (hosting) and Resend (email).
        </p>
      </Section>

      <Section title="Deletion">
        <p>
          Ask, and we will delete a trip's thread, a trip, a room, or your
          whole account and centre. Write to{' '}
          <a href="mailto:hello@fieldy.ca">hello@fieldy.ca</a> from the address
          on your account. Deleting a trip removes its correspondence and
          attachments with it. Venues keep their own copies of what they sent
          and received, which we cannot reach.
        </p>
      </Section>

      <Section title="Terms, in short">
        <ul>
          <li>Fieldy is free and offered as is. We do our best to keep the catalog accurate and say plainly what we could not confirm; check anything that matters with the venue.</li>
          <li>A request sent through Fieldy is your request. A booking exists when the venue says so, not when the app does.</li>
          <li>Use the relay to book outings. Do not use it to send anything a venue would not expect from an educator.</li>
          <li>We may change or withdraw the service; if we do, you will be told and given a way to take your data with you.</li>
        </ul>
      </Section>

      <p className="text-body-sm text-text-muted mt-10">
        Questions: <a href="mailto:hello@fieldy.ca">hello@fieldy.ca</a> ·{' '}
        <Link href="/" className="text-brand font-semibold no-underline">
          Back to the catalog
        </Link>
      </p>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="font-display text-display-sm m-0 mb-2">{title}</h2>
      <div className="text-body text-text-strong flex flex-col gap-3 leading-relaxed [&_li]:mb-2 [&_ul]:list-disc [&_ul]:pl-5">
        {children}
      </div>
    </section>
  )
}

/*
  Seed a demo centre. Plan M6.

    pnpm seed:demo <account email>

  Gives an existing account a centre called "Sunnyside Early Learning" with
  two rooms and three trips in three states — one waiting on the venue, one
  the venue has answered with a confirmation the director has not yet
  accepted, one confirmed with a checklist under way — so a demo can open
  My trips and find every tab doing something.

  **It sends nothing.** Every message row is written directly with its send
  already recorded as done and a fixture external id, and no Resend call is
  made. A reseed that mailed real venues would burn twenty of the hundred
  free emails a day and, worse, put invented requests in real inboxes.

  Idempotent by name: run it twice and the second run finds the centre and
  stops. Delete the centre (cascades to rooms and trips) to reseed.

  The account must already exist — it is created by the auth trigger on
  first login, and this script does not mint sessions. Use `pnpm dev:login`
  for that.
*/

import { eq, inArray } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { account, centre, message, program, room, trip, venue } from '@/db/schema'
import { newId, newRelayToken } from '@/lib/ids'
import { generateTasks, shiftDate } from '@/lib/trips/tasks'
import { requiredAdults } from '@/lib/trips/derived'
import type { Ask, DateOption, RoomSnapshot } from '@/lib/schemas'

const CENTRE_NAME = 'Sunnyside Early Learning'

async function main() {
  const email = process.argv[2]?.trim().toLowerCase()
  if (!email) {
    console.error('Usage: pnpm seed:demo <account email>')
    process.exitCode = 1
    return
  }
  const url = process.env.DATABASE_URL
  if (!url) {
    console.error('DATABASE_URL is not set')
    process.exitCode = 1
    return
  }

  const sql = postgres(url, { max: 1, prepare: false })
  const db = drizzle(sql)

  try {
    const [acct] = await db.select().from(account).where(eq(account.email, email)).limit(1)
    if (!acct) {
      console.error(`No account for ${email}. Sign in once first, then run this.`)
      process.exitCode = 1
      return
    }

    const existing = await db
      .select({ id: centre.id })
      .from(centre)
      .where(eq(centre.name, CENTRE_NAME))
      .limit(1)
    if (existing[0]) {
      console.log(`${CENTRE_NAME} already exists (${existing[0].id}). Delete it to reseed.`)
      return
    }

    /* Three programs with a booking address, from three different venues,
       so the demo's trips do not all read as the same place. */
    const programs = await db
      .select({ program, venue })
      .from(program)
      .innerJoin(venue, eq(program.venueId, venue.id))
      .where(inArray(program.id, [
        'beacon-hill-childrens-farm:weekly-animal-talks',
        'cfb-esquimalt-naval-and-military-museum:oriole-childrens-gallery-visit',
        'art-gallery-greater-victoria:school-tour-workshop',
      ]))
    if (programs.length === 0) {
      console.error('The catalog is empty. Run pnpm import:catalog first.')
      process.exitCode = 1
      return
    }
    const pick = (i: number) => programs[i % programs.length]!

    const today = new Date().toISOString().slice(0, 10)
    const centreId = newId()
    const toddlerId = newId()
    const preschoolId = newId()

    await db.transaction(async (tx) => {
      await tx.insert(centre).values({
        id: centreId,
        name: CENTRE_NAME,
        type: 'daycare_preschool',
        address: '1450 Fairfield Rd, Victoria, BC',
        lat: 48.4159,
        lng: -123.3411,
      })
      await tx.update(account).set({ centreId, name: acct.name || 'Dana Mireau' }).where(eq(account.id, acct.id))

      await tx.insert(room).values([
        {
          id: toddlerId,
          centreId,
          name: 'Toddler room',
          icon: 'baby',
          ageMin: 1,
          ageMax: 3,
          size: 10,
          ratioChildrenPerAdult: 4,
          budgetPerChild: '8.00',
          transport: ['walking', 'bus'],
          address: '1450 Fairfield Rd, Victoria, BC',
          lat: 48.4159,
          lng: -123.3411,
          notes: 'Naps after 12:30 — mornings only.',
        },
        {
          id: preschoolId,
          centreId,
          name: 'Preschool room',
          icon: 'backpack',
          ageMin: 3,
          ageMax: 5,
          size: 16,
          ratioChildrenPerAdult: 8,
          budgetPerChild: '12.00',
          transport: ['bus'],
          address: '1450 Fairfield Rd, Victoria, BC',
          lat: 48.4159,
          lng: -123.3411,
          notes: null,
        },
      ])

      const rooms = {
        toddler: { id: toddlerId, name: 'Toddler room', size: 10, ratio: 4 },
        preschool: { id: preschoolId, name: 'Preschool room', size: 16, ratio: 8 },
      }

      /* 1. Waiting on the venue: asked five days ago, nothing back. */
      await seedTrip(tx, {
        centreId,
        pick: pick(0),
        rooms: [rooms.toddler],
        askedDaysAgo: 5,
        dates: [shiftDate(today, 24), shiftDate(today, 26)],
        author: acct.name || 'Dana Mireau',
        state: 'requested',
      })

      /* 2. They answered: a confirmation waiting for one tap. */
      await seedTrip(tx, {
        centreId,
        pick: pick(1),
        rooms: [rooms.preschool],
        askedDaysAgo: 9,
        dates: [shiftDate(today, 31), shiftDate(today, 33)],
        author: acct.name || 'Dana Mireau',
        state: 'replied',
      })

      /* 3. Confirmed, checklist under way, both rooms going. */
      await seedTrip(tx, {
        centreId,
        pick: pick(2),
        rooms: [rooms.toddler, rooms.preschool],
        askedDaysAgo: 20,
        dates: [shiftDate(today, 12)],
        author: acct.name || 'Dana Mireau',
        state: 'confirmed',
      })
    })

    console.log(`Seeded ${CENTRE_NAME} (${centreId}) for ${email}: two rooms, three trips. Nothing was sent.`)
  } finally {
    await sql.end()
  }
}

type Tx = Parameters<Parameters<ReturnType<typeof drizzle>['transaction']>[0]>[0]

async function seedTrip(
  tx: Tx,
  o: {
    centreId: string
    pick: { program: typeof program.$inferSelect; venue: typeof venue.$inferSelect }
    rooms: RoomSnapshot[]
    askedDaysAgo: number
    dates: string[]
    author: string
    state: 'requested' | 'replied' | 'confirmed'
  },
) {
  const { program: p, venue: v } = o.pick
  const tripId = newId()
  const askedAt = new Date(Date.now() - o.askedDaysAgo * 86_400_000)
  const dateOptions: DateOption[] = o.dates.map((date, i) => ({
    date,
    slot: i === 0 ? 'morning' : 'either',
    rank: i + 1,
  }))
  const childrenCount = o.rooms.reduce((n, r) => n + r.size, 0)
  const adultsCount = requiredAdults(o.rooms)
  const asks: Ask[] = [
    { key: 'fact:Lunch space', label: 'Lunch space', question: 'Is there somewhere we can use for lunch?', source: 'generic' },
    { key: 'fact:Washrooms', label: 'Washrooms', question: 'Where are the closest washrooms to the program space?', source: 'generic' },
  ]
  const first = dateOptions[0]!.date
  let tasks = generateTasks({
    tripDate: first,
    venueName: v.name,
    leadTimeDays: p.leadTimeDays,
    needsTransport: !p.comesToYou,
  })
  if (o.state === 'confirmed') {
    /* A couple of steps already ticked, the way a real one looks a week out. */
    tasks = tasks.map((t, i) => (i <= 2 ? { ...t, done: true, done_at: askedAt.toISOString() } : t))
  }

  await tx.insert(trip).values({
    id: tripId,
    centreId: o.centreId,
    programId: p.id,
    roomIds: o.rooms.map((r) => r.id),
    status: o.state,
    statusSource: o.state === 'confirmed' ? 'manual' : 'system',
    relayToken: newRelayToken(),
    venueEmail: p.bookingEmail ?? v.bookingEmail ?? null,
    dateOptions: o.state === 'confirmed' ? [dateOptions[0]!] : dateOptions,
    confirmedDate: o.state === 'confirmed' ? first : null,
    confirmedTime: o.state === 'confirmed' ? '09:30' : null,
    childrenCount,
    adultsCount,
    roomSnapshots: o.rooms,
    costChild: p.costPerChildCad,
    costGroupFee: p.costPerGroupCad,
    asks,
    tasks,
    createdAt: askedAt,
    updatedAt: askedAt,
  })

  const requestId = newId()
  await tx.insert(message).values({
    id: requestId,
    tripId,
    party: 'educator',
    authorName: o.author,
    body: [
      `Hi ${v.name} team,`,
      '',
      `We would love to book ${p.name} for our ${o.rooms.map((r) => r.name.toLowerCase()).join(' and ')}. That is ${childrenCount} children with ${adultsCount} adults.`,
      '',
      ...dateOptions.map((d, i) => `  • ${i === 0 ? '1st choice' : 'Alternative'}: ${d.date}, ${d.slot === 'morning' ? 'morning' : 'any time that day'}`),
      '',
      'We are also wondering:',
      ...asks.map((a) => `  • ${a.question}`),
      '',
      'Thank you,',
      o.author,
    ].join('\n'),
    isRequest: true,
    channel: 'email',
    subject: `Group visit request: ${v.name}`,
    sentAt: askedAt,
    /* Recorded as sent, without sending. See the header comment. */
    externalMessageId: `seed-${requestId}`,
    sendError: null,
  })

  if (o.state === 'requested') return

  const repliedAt = new Date(askedAt.getTime() + 2 * 86_400_000)
  const replyId = newId()
  await tx.insert(message).values({
    id: replyId,
    tripId,
    party: 'venue',
    authorName: 'Margaret Doyle',
    body: `Hi ${o.author.split(' ')[0]},\n\n${first} works for us — we can take the group at 9:30am. I have pencilled you in.\n\nThere is a picnic shelter you are welcome to use for lunch, and the closest washrooms are by the main entrance.\n\nBest,\nMargaret`,
    channel: 'email',
    sentAt: repliedAt,
    readAt: o.state === 'confirmed' ? repliedAt : null,
    externalMessageId: `seed-${replyId}`,
    suggestion: {
      intent: 'confirmed',
      dates: [first],
      time: '09:30',
      evidence: `${first} works for us — we can take the group at 9:30am.`,
      confidence: 0.9,
      dismissed_at: o.state === 'confirmed' ? repliedAt.toISOString() : null,
    },
  })
  await tx.update(trip).set({ lastVenueReplyAt: repliedAt }).where(eq(trip.id, tripId))

  if (o.state === 'confirmed') {
    await tx.insert(message).values({
      id: newId(),
      tripId,
      party: 'system',
      authorName: 'Fieldy',
      body: `Status set to confirmed for ${first}. ${o.author} accepted the venue's reply.`,
      channel: 'email',
      sentAt: new Date(repliedAt.getTime() + 3600_000),
    })
  }
}

main().catch((cause) => {
  console.error(cause instanceof Error ? cause.message : cause)
  process.exitCode = 1
})

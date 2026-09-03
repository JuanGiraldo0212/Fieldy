'use client'

import { useActionState, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Accessibility as A11y,
  ArrowLeft,
  Baby,
  Bus,
  Calendar,
  Check,
  CircleDollarSign,
  CircleHelp,
  Home,
  Lock,
  Mail,
  Plus,
  Send,
  Toilet,
  Users,
  Utensils,
} from 'lucide-react'
import { createTrip, type PlanState } from '@/app/plan/actions'
import {
  askIntro,
  composeRequest,
  leadWarning,
  ordinalLabel,
  shortDate,
  type AskTopic,
} from '@/lib/trips/asks'
import { requiredAdults } from '@/lib/trips/derived'
import { cx } from '@/components/ui'

/*
  The plan screen. Design lines 640 to 760 of the bright prototype.

  One client component rather than five, because every part of it reads the
  same state: picking a second room changes the headcount, which changes the
  message, and splitting that across components would mean lifting all of it
  up here anyway.
*/

export type PlanRoom = {
  id: string
  name: string
  size: number
  ratio: number
  ageMin: number
  ageMax: number
  transport: string[]
}

type DateRow = { date: string; slot: 'morning' | 'afternoon' | 'either' }

const ASK_ICONS: Record<string, React.ReactNode> = {
  washrooms: <Toilet size={18} />,
  lunch: <Utensils size={18} />,
  rain: <Home size={18} />,
  indoor: <Home size={18} />,
  strollers: <Baby size={18} />,
  wheelchair: <A11y size={18} />,
  access: <A11y size={18} />,
  bus: <Bus size={18} />,
  conflict: <Users size={18} />,
  fees: <CircleDollarSign size={18} />,
}

const SLOTS: DateRow['slot'][] = ['morning', 'afternoon', 'either']
const SLOT_LABEL: Record<DateRow['slot'], string> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  either: 'Either',
}

export function PlanForm({
  venueId,
  programSlug,
  venueName,
  programName,
  programLeadTimeDays,
  capacityMax,
  centreName,
  senderName,
  today,
  rooms,
  topics,
  sendingEnabled,
}: {
  venueId: string
  programSlug: string
  venueName: string
  programName: string
  programLeadTimeDays: number | null
  capacityMax: number | null
  centreName: string
  senderName: string
  today: string
  rooms: PlanRoom[]
  topics: AskTopic[]
  /* False until slice 5 wires the sender. The screen must not promise mail
     it cannot put on the wire. */
  sendingEnabled: boolean
}) {
  const [state, action, pending] = useActionState<PlanState, FormData>(
    createTrip,
    {},
  )

  const [picked, setPicked] = useState<string[]>([rooms[0]!.id])
  const [groupsOpen, setGroupsOpen] = useState(false)
  const [dates, setDates] = useState<DateRow[]>([])
  const [dateEdit, setDateEdit] = useState(true)
  const [asks, setAsks] = useState<string[]>(
    topics.filter((t) => t.gap).map((t) => t.key),
  )
  const [customAsk, setCustomAsk] = useState('')
  const [customOpen, setCustomOpen] = useState(false)
  /* Null until she types in the preview. After that her words win, and nothing
     she changes above silently rewrites them. */
  const [draft, setDraft] = useState<string | null>(null)

  const chosen = rooms.filter((r) => picked.includes(r.id))
  const snapshots = chosen.map((r) => ({
    id: r.id,
    name: r.name,
    size: r.size,
    ratio: r.ratio,
  }))
  const children = chosen.reduce((n, r) => n + r.size, 0)
  const adults = requiredAdults(snapshots)

  const ordered = useMemo(
    () => [...dates].sort((a, b) => (a.date < b.date ? -1 : 1)),
    [dates],
  )
  const dateOptions = ordered.map((d, i) => ({ ...d, rank: i + 1 }))

  const chosenAsks = topics
    .filter((t) => asks.includes(t.key))
    .map(({ key, label, question, source }) => ({ key, label, question, source }))
  const allAsks = customAsk.trim()
    ? [
        ...chosenAsks,
        {
          key: 'custom',
          label: 'Your own question',
          question: customAsk.trim(),
          source: 'custom' as const,
        },
      ]
    : chosenAsks

  const message =
    draft ??
    composeRequest({
      venueName,
      programName,
      rooms: snapshots,
      childrenCount: children,
      adultsCount: adults,
      dates: dateOptions,
      asks: allAsks,
      senderName,
      centreName,
    })

  const overCapacity = capacityMax != null && children > capacityMax
  const warning = leadWarning({
    firstDate: dateOptions[0]?.date ?? null,
    today,
    leadTimeDays: programLeadTimeDays,
    venueName,
  })
  const canSend = picked.length > 0 && dates.length > 0

  const toggleRoom = (id: string) =>
    setPicked((p) => {
      const next = p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
      /* Never leave the form with nothing selected: the headcount, the ratio
         and the message all have nothing to say without a room. */
      return next.length > 0 ? next : p
    })

  const addDate = (value: string) => {
    if (!value || dates.some((d) => d.date === value)) return
    setDates((d) => [...d, { date: value, slot: 'morning' }])
    setDateEdit(true)
  }

  return (
    <main className="mx-auto max-w-content px-5 pt-5.5 pb-[70px]">
      <Link
        href={`/outing/${venueId}/${programSlug}`}
        className="text-body-sm text-brand flex items-center gap-2.5 py-2 font-semibold no-underline"
      >
        <ArrowLeft size={17} />
        Back to outing details
      </Link>

      <div className="mt-3 flex flex-wrap items-start gap-7">
        <div className="min-w-0 flex-1 basis-[320px]">
          <h1 className="font-display text-display-lg mb-2.5">Plan your request</h1>
          <p className="text-body text-text-muted max-w-[380px] leading-relaxed">
            Choose your dates and tell us anything else you would like us to
            ask. {sendingEnabled ? 'We will send the request and build your trip.' : 'We will write the request and build your trip.'}
          </p>
        </div>

        <div className="bg-surface border-border flex basis-[420px] items-center gap-4 rounded-card-lg border px-5.5 py-4.5">
          <span className="text-brand flex">
            <Users size={20} />
          </span>
          <div className="text-body min-w-0 flex-1 font-semibold">
            {chosen.map((r) => r.name).join(' and ')}{' '}
            <span className="text-border-strong">·</span>{' '}
            <span className="text-text-muted font-normal">
              {children} children, {adults} adults
            </span>
          </div>
          <button
            type="button"
            onClick={() => setGroupsOpen((o) => !o)}
            className="text-body-sm text-brand font-semibold"
          >
            Change
          </button>
        </div>
      </div>

      {groupsOpen ? (
        <div className="bg-surface border-border mt-4 flex flex-col gap-2 rounded-card-lg border p-5">
          <div className="text-body-sm font-bold">Which groups are going?</div>
          {rooms.map((r) => {
            const on = picked.includes(r.id)
            return (
              <button
                key={r.id}
                type="button"
                aria-pressed={on}
                onClick={() => toggleRoom(r.id)}
                className="border-border bg-surface hover:border-brand flex items-center gap-3.5 rounded-card border px-4 py-3.5 text-left"
              >
                <span
                  aria-hidden
                  className={cx(
                    'flex h-[22px] w-[22px] flex-none items-center justify-center rounded-[7px]',
                    on
                      ? 'bg-brand text-white'
                      : 'border-border-strong border-[1.5px]',
                  )}
                >
                  {on ? <Check size={13} strokeWidth={2.5} /> : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="text-body block font-bold">{r.name}</span>
                  <span className="text-meta text-text-muted block">
                    {r.size} children, ages {r.ageMin} to {r.ageMax}, 1 adult per{' '}
                    {r.ratio}
                  </span>
                </span>
              </button>
            )
          })}
          <button
            type="button"
            onClick={() => setGroupsOpen(false)}
            className="bg-brand hover:bg-brand-hover text-body-sm self-start rounded-control px-5 py-2.5 font-bold text-white"
          >
            Done
          </button>
          {overCapacity ? (
            <div className="bg-warn-tint-2 text-warn text-meta rounded-control px-3.5 py-3 leading-normal">
              {venueName} takes up to {capacityMax} children and you have{' '}
              {children}. We will ask whether they can take the whole group.
            </div>
          ) : null}
        </div>
      ) : null}

      <form action={action}>
        <input type="hidden" name="venueId" value={venueId} />
        <input type="hidden" name="programSlug" value={programSlug} />
        {picked.map((id) => (
          <input key={id} type="hidden" name="roomIds" value={id} />
        ))}
        <input
          type="hidden"
          name="dateOptions"
          value={JSON.stringify(dateOptions)}
        />
        <input type="hidden" name="asks" value={JSON.stringify(allAsks)} />

        {/* ── 1. Preferred dates ─────────────────────────────────────────── */}
        <section className="bg-surface border-border mt-5 rounded-card-lg border p-6">
          <div className="flex flex-wrap items-start gap-4">
            <StepNumber n={1} />
            <div className="min-w-[200px] flex-1">
              <div className="text-body-lg font-bold">Preferred dates</div>
              <div className="text-body-sm text-text-muted mt-1">
                We will ask the venue in this order.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setDateEdit((e) => !e)}
              className="text-body-sm text-brand flex items-center gap-2.5 font-semibold"
            >
              {dateEdit ? 'Done editing' : 'Edit dates'}
              <Calendar size={18} />
            </button>
          </div>

          {dateOptions.length > 0 ? (
            <div className="mt-4.5 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3.5">
              {dateOptions.map((d) => (
                <div
                  key={d.date}
                  className="border-border bg-surface rounded-card border px-4.5 py-4"
                >
                  <div className="text-meta text-brand font-semibold">
                    {ordinalLabel(d.rank)}
                  </div>
                  <div className="font-display mt-1.5 text-[21px] font-bold tracking-[-0.015em]">
                    {shortDate(d.date)}
                  </div>
                  {dateEdit ? (
                    <>
                      <div className="mt-2 flex items-center gap-2">
                        <input
                          type="date"
                          value={d.date}
                          min={today}
                          onChange={(e) =>
                            setDates((rows) =>
                              rows.map((r) =>
                                r.date === d.date
                                  ? { ...r, date: e.target.value }
                                  : r,
                              ),
                            )
                          }
                          className="border-border-strong text-body-sm h-[42px] min-w-0 flex-1 rounded-menu border px-2.5 font-semibold outline-none"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setDates((rows) => rows.filter((r) => r.date !== d.date))
                          }
                          className="text-meta text-text-faint hover:text-danger px-1.5 py-1.5 font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                      <select
                        value={d.slot}
                        onChange={(e) =>
                          setDates((rows) =>
                            rows.map((r) =>
                              r.date === d.date
                                ? { ...r, slot: e.target.value as DateRow['slot'] }
                                : r,
                            ),
                          )
                        }
                        className="border-border-strong bg-surface text-meta mt-2 h-10 w-full cursor-pointer rounded-menu border px-2.5 font-semibold"
                      >
                        {SLOTS.map((s) => (
                          <option key={s} value={s}>
                            {SLOT_LABEL[s]}
                          </option>
                        ))}
                      </select>
                    </>
                  ) : (
                    <div className="text-meta text-text-muted mt-1.5">
                      {SLOT_LABEL[d.slot]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : null}

          <label className="border-border text-body-sm text-brand mt-3.5 inline-flex cursor-pointer items-center gap-2.5 rounded-card border px-5 py-3.5 font-semibold">
            <Plus size={18} />
            {dateOptions.length === 0 ? 'Pick a date' : 'Add another date'}{' '}
            {dateOptions.length === 0 ? null : (
              <span className="text-text-faint font-normal">(optional)</span>
            )}
            <input
              type="date"
              min={today}
              value=""
              onChange={(e) => addDate(e.target.value)}
              className="border-border-strong text-meta h-9 w-[132px] rounded-[9px] border px-2 font-semibold outline-none"
            />
          </label>

          {dates.length === 0 ? (
            <div className="text-body-sm text-warn mt-3">Pick at least one date.</div>
          ) : null}
          {warning ? (
            <div className="text-meta text-warn mt-3 leading-normal">{warning}</div>
          ) : null}
        </section>

        {/* ── 2. Asks ────────────────────────────────────────────────────── */}
        <section className="bg-surface border-border mt-4 rounded-card-lg border p-6">
          <div className="flex items-start gap-4">
            <StepNumber n={2} />
            <div className="min-w-0 flex-1">
              <div className="text-body-lg font-bold">
                Anything else to ask?{' '}
                <span className="text-body-sm text-text-faint font-normal">
                  (optional)
                </span>
              </div>
              <div className="text-body-sm text-text-muted mt-1 leading-normal">
                {askIntro(topics, venueName)}
              </div>
            </div>
          </div>

          <div className="mt-4.5 flex flex-wrap gap-3">
            {topics.map((t) => {
              const on = asks.includes(t.key)
              return (
                <button
                  key={t.key}
                  type="button"
                  aria-pressed={on}
                  title={t.question}
                  onClick={() =>
                    setAsks((a) =>
                      a.includes(t.key) ? a.filter((x) => x !== t.key) : [...a, t.key],
                    )
                  }
                  className={cx(
                    'text-body-sm flex items-center gap-2.5 rounded-card border px-4.5 py-3.5 font-semibold',
                    on
                      ? 'bg-brand-tint border-brand-tint text-text'
                      : 'border-border bg-surface hover:border-brand text-text',
                  )}
                >
                  {on ? (
                    <span className="bg-brand flex h-[22px] w-[22px] items-center justify-center rounded-pill text-white">
                      <Check size={13} strokeWidth={2.5} />
                    </span>
                  ) : (
                    <span className="text-text-faint flex">
                      {(t.factKey && ASK_ICONS[t.factKey]) ?? <CircleHelp size={18} />}
                    </span>
                  )}
                  {t.label}
                </button>
              )
            })}

            {customOpen ? (
              <input
                value={customAsk}
                onChange={(e) => setCustomAsk(e.target.value)}
                maxLength={300}
                placeholder="Is there a quiet corner for a nap?"
                className="border-brand text-body-sm h-[52px] min-w-0 flex-1 basis-[260px] rounded-card border px-4 outline-none"
              />
            ) : (
              <button
                type="button"
                onClick={() => setCustomOpen(true)}
                className="border-border bg-surface hover:border-brand text-body-sm text-brand flex items-center gap-2.5 rounded-card border px-4.5 py-3.5 font-semibold"
              >
                <Plus size={18} />
                Add your own
              </button>
            )}
          </div>
        </section>

        {/* ── Preview ────────────────────────────────────────────────────── */}
        <section className="bg-surface border-border mt-4 rounded-card-lg border px-6 py-5">
          <div className="flex items-center gap-3.5">
            <span className="bg-brand-tint text-brand flex h-[38px] w-[38px] flex-none items-center justify-center rounded-pill">
              <Mail size={19} />
            </span>
            <span className="text-body-lg flex-1 font-semibold">Preview message</span>
          </div>
          <textarea
            name="message"
            value={message}
            onChange={(e) => setDraft(e.target.value)}
            rows={Math.min(24, message.split('\n').length + 1)}
            className="border-border-strong bg-surface-2 text-body-sm mt-4 w-full resize-y rounded-card border px-4.5 py-4 leading-relaxed outline-none"
          />
          <p className="text-meta text-text-muted mt-2.5 leading-normal">
            {sendingEnabled
              ? 'Sent from your name through Fieldy. The venue’s reply lands here, and we will email you when it does.'
              : 'Fieldy is not connected to an email service yet, so this is written and saved rather than sent. Your trip and its checklist are built either way.'}
          </p>
        </section>

        {state.error ? (
          <p
            role="alert"
            className="bg-warn-tint text-warn text-body-sm mt-4 rounded-card px-4 py-3"
          >
            {state.error}
          </p>
        ) : null}

        <div className="mt-5.5">
          {canSend ? (
            <button
              type="submit"
              disabled={pending}
              className="bg-brand-solid hover:bg-brand-solid-hover flex w-full items-center justify-center gap-3.5 rounded-pill p-5 text-[19px] font-bold text-white disabled:opacity-70"
            >
              <Send size={20} />
              {pending
                ? 'Working…'
                : sendingEnabled
                  ? 'Send request & build my trip'
                  : 'Save request & build my trip'}
            </button>
          ) : (
            <div className="border-border text-body-lg rounded-pill border bg-[#EDF2F8] p-5 text-center font-bold text-[#7C8CA0]">
              Pick a group and a date
            </div>
          )}
          <p className="text-body-sm text-text-muted mt-3.5 text-center leading-relaxed">
            We will write the message for you and start the conversation.
            <br />
            {sendingEnabled
              ? 'This sends a request. Nothing is booked yet.'
              : 'This is a request, not a booking. Nothing is held for you.'}
          </p>
        </div>
      </form>

      <div className="border-border text-meta text-text-faint mt-6.5 flex items-center gap-2.5 border-t pt-4.5">
        <Lock size={15} />
        Only you and your team can see this trip.
      </div>
    </main>
  )
}

function StepNumber({ n }: { n: number }) {
  return (
    <span className="bg-brand text-body-sm flex h-8 w-8 flex-none items-center justify-center rounded-pill font-bold text-white">
      {n}
    </span>
  )
}

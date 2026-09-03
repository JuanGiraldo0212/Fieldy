import { describe, expect, it } from 'vitest'
import {
  daysBetween,
  generateTasks,
  overdueTasks,
  regenerateTasks,
  setTaskDate,
  shiftDate,
  taskSummary,
  toggleTask,
} from './tasks'

const TRIP = '2026-11-19'

const make = (over: Partial<Parameters<typeof generateTasks>[0]> = {}) =>
  generateTasks({
    tripDate: TRIP,
    venueName: 'Goldstream Nature House',
    leadTimeDays: 21,
    needsTransport: true,
    ...over,
  })

describe('shiftDate', () => {
  it('counts backwards across a month boundary', () => {
    expect(shiftDate('2026-11-19', -21)).toBe('2026-10-29')
    expect(shiftDate('2026-01-05', -10)).toBe('2025-12-26')
  })

  it('survives a leap day', () => {
    expect(shiftDate('2028-03-01', -1)).toBe('2028-02-29')
  })

  it('does not drift across a daylight saving change', () => {
    // BC changes clocks on 2026-11-01. A naive local-midnight date would come
    // back a day out here.
    expect(daysBetween('2026-10-25', '2026-11-08')).toBe(14)
  })
})

describe('generateTasks', () => {
  it('sends the request by the venue lead time plus the buffer', () => {
    // 21 days lead plus a 3 day buffer means 24 days before the trip.
    const send = make().find((t) => t.kind === 'send_request')!
    expect(send.due_date).toBe(shiftDate(TRIP, -24))
    expect(send.offset_days).toBe(-24)
  })

  it('names the venue in the send task', () => {
    expect(make().find((t) => t.kind === 'send_request')!.title).toBe(
      'Send request to Goldstream Nature House',
    )
  })

  it('marks the send already done, because sending created the trip', () => {
    const send = make().find((t) => t.kind === 'send_request')!
    expect(send.done).toBe(true)
    expect(send.done_at).not.toBeNull()
  })

  it('assumes a fortnight when the venue publishes no lead time', () => {
    const send = generateTasks({
      tripDate: TRIP,
      venueName: 'X',
      leadTimeDays: null,
      needsTransport: false,
    }).find((t) => t.kind === 'send_request')!
    expect(send.due_date).toBe(shiftDate(TRIP, -17)) // 14 + 3
  })

  it('only books a bus when the trip needs one', () => {
    expect(make({ needsTransport: true }).some((t) => t.kind === 'book_transport')).toBe(true)
    expect(make({ needsTransport: false }).some((t) => t.kind === 'book_transport')).toBe(false)
  })

  it('uses the design offsets', () => {
    const by = Object.fromEntries(make().map((t) => [t.kind, t.offset_days]))
    expect(by.book_transport).toBe(-14)
    expect(by.approval).toBe(-10)
    expect(by.consent_out).toBe(-10)
    expect(by.consent_in).toBe(-3)
    expect(by.headcount).toBe(-2)
    expect(by.day_before).toBe(-1)
  })

  it('comes back in date order', () => {
    const dates = make().map((t) => t.due_date)
    expect([...dates].sort()).toEqual(dates)
  })
})

describe('regenerateTasks', () => {
  it('moves undone tasks to the new date', () => {
    const moved = regenerateTasks(make(), '2026-11-26')
    expect(moved.find((t) => t.kind === 'headcount')!.due_date).toBe('2026-11-24')
  })

  it('leaves a task a human has dated alone', () => {
    // She moved consent-in to a Friday because that is when the office is
    // open. A venue offering a different date must not undo that.
    const tasks = make()
    const id = tasks.find((t) => t.kind === 'consent_in')!.id
    const edited = setTaskDate(tasks, id, '2026-11-13')
    const target = edited.find((t) => t.id === id)!
    expect(target.offset_days).toBeNull()

    const moved = regenerateTasks(edited, '2026-12-10')
    expect(moved.find((t) => t.id === target.id)!.due_date).toBe('2026-11-13')
  })

  it('leaves a completed task alone', () => {
    const tasks = make()
    const send = tasks.find((t) => t.kind === 'send_request')!
    const moved = regenerateTasks(tasks, '2027-01-20')
    expect(moved.find((t) => t.id === send.id)!.due_date).toBe(send.due_date)
  })

  it('handles a date moving earlier, not just later', () => {
    const moved = regenerateTasks(make(), '2026-11-05')
    expect(moved.find((t) => t.kind === 'day_before')!.due_date).toBe('2026-11-04')
  })
})

describe('toggleTask', () => {
  it('ticks and unticks, stamping and clearing the time', () => {
    const tasks = make()
    const id = tasks.find((t) => t.kind === 'approval')!.id
    const on = toggleTask(tasks, id)
    expect(on.find((t) => t.id === id)!.done).toBe(true)
    expect(on.find((t) => t.id === id)!.done_at).not.toBeNull()
    const off = toggleTask(on, id)
    expect(off.find((t) => t.id === id)!.done).toBe(false)
    expect(off.find((t) => t.id === id)!.done_at).toBeNull()
  })
})

describe('overdue', () => {
  it('counts only undone tasks already past', () => {
    const tasks = make()
    // Two days before the trip: everything except the day-before task is due.
    const late = overdueTasks(tasks, '2026-11-18')
    expect(late.every((t) => !t.done)).toBe(true)
    expect(late.some((t) => t.kind === 'day_before')).toBe(false)
  })

  it('shows a short-notice trip as behind rather than hiding it', () => {
    // Booked eight days out, when the send task was due 24 days before. That
    // is the most useful thing the list can say on the day it is created.
    const tasks = generateTasks({
      tripDate: '2026-11-19',
      venueName: 'X',
      leadTimeDays: 21,
      needsTransport: true,
    })
    expect(overdueTasks(tasks, '2026-11-11').length).toBeGreaterThan(0)
  })

  it('summarises done and overdue together', () => {
    expect(taskSummary(make(), '2026-10-01')).toBe('1 of 7 done')
    expect(taskSummary(make(), '2026-11-18')).toMatch(/1 of 7 done, \d+ overdue/)
  })
})

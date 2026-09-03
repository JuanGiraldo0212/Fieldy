'use client'

import { useActionState, useState } from 'react'
import {
  Bus,
  Check,
  ClipboardCheck,
  ClipboardList,
  FileCheck2,
  FileText,
  ListChecks,
  Send,
  Users,
} from 'lucide-react'
import {
  addTripTask,
  removeTripTask,
  retimeTripTask,
  toggleTripTask,
  type TripState,
} from '@/app/trips/actions'
import type { Task } from '@/lib/schemas'
import { shortDate } from '@/lib/trips/asks'
import { taskSummary } from '@/lib/trips/tasks'
import { cx } from '@/components/ui'

/*
  The checklist, dated backwards from the trip date.

  Each row is its own form so a checkbox works before any JavaScript loads.
  Overdue is "visually loud but not alarming" (spec §5.4.4): the date goes
  amber, and nothing else changes.
*/

const TASK_ICONS: Record<string, React.ReactNode> = {
  send_request: <Send size={16} />,
  book_transport: <Bus size={16} />,
  approval: <FileCheck2 size={16} />,
  consent_out: <FileText size={16} />,
  consent_in: <ClipboardCheck size={16} />,
  headcount: <Users size={16} />,
  day_before: <ClipboardList size={16} />,
  custom: <ListChecks size={16} />,
}

export function Checklist({
  tripId,
  tasks,
  today,
}: {
  tripId: string
  tasks: Task[]
  today: string
}) {
  const [editing, setEditing] = useState(false)

  return (
    <section className="bg-surface border-border flex flex-col rounded-panel border p-6">
      <div className="mb-4.5 flex flex-wrap items-center gap-3.5">
        <span className="bg-warn-tint text-warn flex h-[38px] w-[38px] flex-none items-center justify-center rounded-pill">
          <ListChecks size={19} />
        </span>
        <h2 className="font-display text-display-sm m-0 flex-1">Checklist</h2>
        <span className="text-meta text-text-faint">
          {taskSummary(tasks, today)}
        </span>
        <button
          type="button"
          onClick={() => setEditing((e) => !e)}
          className="text-meta text-brand font-semibold"
        >
          {editing ? 'Done' : 'Edit'}
        </button>
      </div>

      <div className="flex flex-col gap-1">
        {tasks.map((t) => (
          <TaskRow
            key={t.id}
            tripId={tripId}
            task={t}
            today={today}
            editing={editing}
          />
        ))}
      </div>

      {editing ? <AddTask tripId={tripId} /> : null}
    </section>
  )
}

function TaskRow({
  tripId,
  task,
  today,
  editing,
}: {
  tripId: string
  task: Task
  today: string
  editing: boolean
}) {
  const [, toggle] = useActionState<TripState, FormData>(toggleTripTask, {})
  const [, retime] = useActionState<TripState, FormData>(retimeTripTask, {})
  const [, remove] = useActionState<TripState, FormData>(removeTripTask, {})
  const overdue = !task.done && task.due_date < today

  return (
    <div className="border-border-soft flex items-center gap-3 border-b py-2 last:border-b-0">
      <form action={toggle} className="flex">
        <input type="hidden" name="tripId" value={tripId} />
        <input type="hidden" name="taskId" value={task.id} />
        <button
          type="submit"
          role="checkbox"
          aria-checked={task.done}
          aria-label={task.done ? `Undo ${task.title}` : `Tick off ${task.title}`}
          className={cx(
            'flex h-[22px] w-[22px] flex-none items-center justify-center rounded-pill border-2',
            task.done
              ? 'border-success bg-success text-white'
              : 'border-border-strong bg-surface hover:border-brand',
          )}
        >
          {task.done ? <Check size={12} strokeWidth={3} /> : null}
        </button>
      </form>

      <span
        aria-hidden
        className="bg-surface-3 text-brand flex h-[34px] w-[34px] flex-none items-center justify-center rounded-menu"
      >
        {TASK_ICONS[task.kind] ?? TASK_ICONS.custom}
      </span>

      <span
        className={cx(
          'text-body-sm min-w-0 flex-1 leading-snug',
          task.done && 'text-text-faint line-through',
        )}
      >
        {task.title}
      </span>

      {editing ? (
        <form action={retime} className="flex items-center gap-2">
          <input type="hidden" name="tripId" value={tripId} />
          <input type="hidden" name="taskId" value={task.id} />
          <input
            type="date"
            name="date"
            defaultValue={task.due_date}
            onChange={(e) => e.currentTarget.form?.requestSubmit()}
            className="border-border-strong text-meta h-9 rounded-menu border px-2 font-semibold outline-none"
          />
          <button type="submit" className="text-meta text-brand font-semibold sr-only">
            Save date
          </button>
        </form>
      ) : (
        <span
          className={cx(
            'text-meta font-semibold whitespace-nowrap',
            overdue ? 'text-warn' : 'text-text-faint',
          )}
        >
          {shortDate(task.due_date)}
        </span>
      )}

      {editing ? (
        <form action={remove}>
          <input type="hidden" name="tripId" value={tripId} />
          <input type="hidden" name="taskId" value={task.id} />
          <button
            type="submit"
            className="text-meta text-text-faint hover:text-danger font-semibold"
          >
            Remove
          </button>
        </form>
      ) : null}
    </div>
  )
}

function AddTask({ tripId }: { tripId: string }) {
  const [state, add] = useActionState<TripState, FormData>(addTripTask, {})

  return (
    <form action={add} className="mt-3 flex flex-wrap items-center gap-2">
      <input type="hidden" name="tripId" value={tripId} />
      <input
        name="title"
        placeholder="Add a step"
        maxLength={140}
        className="border-border-strong text-body-sm h-10 min-w-0 flex-1 basis-[160px] rounded-menu border px-3 outline-none"
      />
      <input
        type="date"
        name="date"
        className="border-border-strong text-meta h-10 rounded-menu border px-2 font-semibold outline-none"
      />
      <button
        type="submit"
        className="bg-brand hover:bg-brand-hover text-meta rounded-menu px-4 py-2.5 font-bold text-white"
      >
        Add
      </button>
      {state.error ? (
        <p role="alert" className="text-meta text-warn basis-full">
          {state.error}
        </p>
      ) : null}
    </form>
  )
}

import { Check } from 'lucide-react'
import { STATUS_RAIL, type TripStatus } from '@/lib/trips/derived'
import { cx } from '@/components/ui'

/*
  Asked, They answered, Confirmed, Done. Four steps, no "Idea": a trip exists
  because a request was sent.

  A cancelled trip is not a stage, so it does not light anything up. It gets
  its own line above instead of a broken rail.
*/
export function StatusRail({ status }: { status: TripStatus }) {
  const index = STATUS_RAIL.findIndex((s) => s.status === status)

  return (
    <ol className="mt-6 flex list-none p-0">
      {STATUS_RAIL.map((step, i) => {
        const reached = index >= 0 && i <= index
        const leftFilled = index >= 0 && i <= index && i > 0
        const rightFilled = index >= 0 && i < index
        return (
          <li
            key={step.status}
            aria-current={i === index ? 'step' : undefined}
            className="flex min-w-0 flex-1 flex-col items-center gap-2.5"
          >
            <div className="flex w-full items-center">
              <span
                aria-hidden
                className={cx(
                  'h-0.5 flex-1',
                  leftFilled ? 'bg-brand' : 'bg-border',
                  i === 0 && 'invisible',
                )}
              />
              {reached ? (
                <span className="bg-brand flex h-6 w-6 flex-none items-center justify-center rounded-pill text-white">
                  <Check size={13} strokeWidth={2.5} />
                </span>
              ) : (
                <span className="border-border bg-surface h-[22px] w-[22px] flex-none rounded-pill border-2" />
              )}
              <span
                aria-hidden
                className={cx(
                  'h-0.5 flex-1',
                  rightFilled ? 'bg-brand' : 'bg-border',
                  i === STATUS_RAIL.length - 1 && 'invisible',
                )}
              />
            </div>
            <div
              className={cx(
                'text-meta text-center font-semibold',
                reached ? 'text-text' : 'text-text-faint',
              )}
            >
              {step.label}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown, GraduationCap } from 'lucide-react'
import { AGE_BANDS } from '@/lib/schemas'
import { CheckRow, Field, FieldBox } from '@/components/ui'

/*
  Age / Grade, as a multiple choice.

  It was a single <select> reading `age_bands[0]`, which quietly disagreed with
  the rest of the app: bandsFor() has always returned SEVERAL bands for a room
  that spans a boundary — 3 to 8 is "3 to 5", "Kindergarten" and "Grade 1" —
  because the bands overlap on purpose so a five-year-old is not lost between
  two of them. The dropdown showed the first of those and threw the others away
  on the next change. The URL, the filters and the feasibility check all took
  a list already; only this control did not.

  A native <select multiple> would have been the small change, and it is the
  wrong control here: fifteen rows tall on desktop, a system sheet on iOS that
  hides the field it belongs to, and no way to see the choice without opening
  it. This is the same checkbox row the filter drawer uses, in a popover under
  the field, with the field itself carrying the summary.
*/

/* The two pre-school bands carry no grade; everything from Kindergarten up
   does. Splitting them under headings keeps fifteen rows scannable. */
const FIRST_SCHOOL_BAND = AGE_BANDS.findIndex((b) => b[3] != null)

function gradeLabel(grade: number): string {
  return grade === 0 ? 'K' : String(grade)
}

/*
  What the closed field says. One band speaks for itself; a contiguous run of
  grades is the common multi-select and reads as a range. Anything else is
  named by its first band and counted, because "3 to 5 years to Grade 2" is
  not a range anyone means.
*/
export function bandSummary(bands: number[]): string {
  const use = [...new Set(bands)]
    .filter((i) => i >= 0 && i < AGE_BANDS.length)
    .sort((a, b) => a - b)

  if (use.length === 0) return AGE_BANDS[1]![2]
  if (use.length === 1) return AGE_BANDS[use[0]!]![2]

  const contiguous = use.every((n, i) => i === 0 || n === use[i - 1]! + 1)
  const grades = use.map((i) => AGE_BANDS[i]![3])
  if (contiguous && grades.every((g) => g != null)) {
    return `Grades ${gradeLabel(grades[0]!)} to ${gradeLabel(grades.at(-1)!)}`
  }
  return `${AGE_BANDS[use[0]!]![2]} +${use.length - 1} more`
}

export function AgeBandSelect({
  value,
  onChange,
}: {
  value: number[]
  onChange: (bands: number[]) => void
}) {
  const [open, setOpen] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      trigger.current?.focus()
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  /* Unchecking the last band is refused rather than allowed and quietly
     repaired. usableBands() would fall back to "3 to 5", so an empty box
     would still be filtering by an age — and the field would say so while
     the checkboxes said nothing was chosen. */
  const toggle = (i: number) => {
    const has = value.includes(i)
    if (has && value.length === 1) return
    onChange(
      has ? value.filter((x) => x !== i) : [...value, i].sort((a, b) => a - b),
    )
  }

  const rows = (from: number, to: number) =>
    AGE_BANDS.slice(from, to).map((b, n) => {
      const i = from + n
      return (
        <CheckRow key={b[2]} checked={value.includes(i)} onChange={() => toggle(i)}>
          {b[2]}
        </CheckRow>
      )
    })

  return (
    <Field label="Age / Grade">
      <div ref={wrap} className="relative">
        <button
          ref={trigger}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={`Age or grade: ${bandSummary(value)}`}
          className="w-full cursor-pointer text-left"
        >
          <FieldBox>
            <span className="text-brand flex">
              <GraduationCap size={18} />
            </span>
            <span className="text-body-sm min-w-0 flex-1 truncate font-semibold">
              {bandSummary(value)}
            </span>
            <span className="text-text-faint flex">
              <ChevronDown size={15} />
            </span>
          </FieldBox>
        </button>

        {open ? (
          <div
            role="group"
            aria-label="Age or grade"
            /* Above the cards, and scrollable: fifteen rows is taller than a
               phone once the field itself is on screen. */
            className="border-border-strong bg-surface shadow-card absolute top-[calc(100%+6px)] right-0 left-0 z-30 max-h-[min(60vh,340px)] overflow-y-auto rounded-control border p-3"
          >
            <div className="text-label text-text-faint mb-1 font-bold uppercase">
              Before school
            </div>
            {rows(0, FIRST_SCHOOL_BAND)}
            <div className="text-label text-text-faint mt-2.5 mb-1 font-bold uppercase">
              School
            </div>
            {rows(FIRST_SCHOOL_BAND, AGE_BANDS.length)}
          </div>
        ) : null}
      </div>
    </Field>
  )
}

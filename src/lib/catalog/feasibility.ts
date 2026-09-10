/*
  Feasibility. Plan section 5.1.

  Two levels, not three. The design has no red state: a card is green when
  nothing failed and amber otherwise, with every failed reason joined by " · "
  on one line. Do not add red.

  Three checks only — age, capacity, budget. Distance and season are FILTERS,
  not feasibility reasons: a program outside the radius or out of season is
  excluded from results, not badged. See search.ts.

  A MISSING FACT IS NOT A FAILURE.

  Only a known mismatch goes amber. "The venue did not publish its capacity" is
  not evidence that the group will not fit; it is evidence that nobody has
  asked yet.

  This was measured, not assumed. Scoring the real catalog with unknowns
  counted as failures returned zero green programs out of thirty-nine, because
  33 do not publish capacity, 18 do not publish a youngest age and 13 do not
  publish a price. Only 9 of the 94 reasons raised were an actual mismatch
  between program and group. A badge that is always amber carries no signal and
  trains people to ignore it — which costs them the real failures it exists to
  surface.

  The unknowns are not swallowed. They still appear on the card and the outing
  page as "Capacity not published" / "Price not published" / "Ages not
  published", and they still become pre-selected asks on the request, which is
  where a director can actually do something about them. They are surfaced
  twice; they do not also need to consume the badge.

  The reason strings below are copy. They ship verbatim, are quoted in
  docs/design-map.md section 7, and are asserted character for character in the
  tests. Do not reword them here.
*/

export type FeasibilityLevel = 'green' | 'amber'

export type Feasibility = {
  level: FeasibilityLevel
  reasons: string[]
  /* The card's one-line amber text: reasons joined the way the design joins
     them. Empty when green. */
  issueText: string
}

/* What we know about the group asking — a room, or the anonymous search
   state when logged out. */
export type GroupCriteria = {
  ageMin: number
  ageMax: number
  /* The grades the director picked, youngest to oldest — equal when she
     picked one. Null when only the two pre-school bands are picked. */
  grades?: { youngest: number; oldest: number } | null
  size: number
  budgetPerChild: number
}

/* Only the program fields feasibility reads. Keeping this narrow means the
   function can be tested without a database row. */
export type FeasibilityProgram = {
  ageBasis: 'years' | 'grades' | null
  ageMinYears: number | null
  gradeMin?: number | null
  gradeMax?: number | null
  capacityMax: number | null
  costPerChildCad: number | null
  costPerGroupCad: number | null
  isFree: boolean | null
}

/*
  "$8", "$12.50" — whole dollars lose the decimals. Matches the design's own
  money helper, which the reason strings are written around.
*/
export function money(n: number): string {
  const v = Math.round(n * 100) / 100
  return `$${Number.isInteger(v) ? v.toFixed(0) : v.toFixed(2)}`
}

/*
  Effective cost per child. A group fee is divided across the group, because
  that is the number a director compares against a per-child budget.

  Returns null when nothing is published — which is a reason, not a pass.
*/
export function costPerChild(
  program: Pick<FeasibilityProgram, 'costPerChildCad' | 'costPerGroupCad' | 'isFree'>,
  size: number,
): number | null {
  if (program.isFree) return 0
  if (program.costPerGroupCad != null) {
    return program.costPerGroupCad / Math.max(1, size)
  }
  return program.costPerChildCad
}

export function feasibility(
  program: FeasibilityProgram,
  group: GroupCriteria,
): Feasibility {
  const reasons: string[] = []

  /* ── Age ──────────────────────────────────────────────────────────────
     First match wins: one age reason at most, because two overlapping
     complaints about the same fact read as noise.

     Grades are never converted to years, here or anywhere. A grade-published
     program is compared against a grade, or not at all — never against a guess
     that "K to 3" means "5 to 9".

     A pre-school room looking at a grade-published program therefore raises
     nothing. It used to raise "ages are set by grade here, not years — phone
     to confirm they take under-fives", which fired on every grade program a
     daycare saw and amounted to a permanent amber badge on half the catalog.
     Until we can say something sharper than "phone and ask", say nothing.

     An unpublished youngest age raises nothing: the card already says "Ages
     not published", and it becomes an ask on the request. */
  const grades = group.grades ?? null

  if (program.ageBasis === 'grades' && grades != null) {
    /*
      Both sides speak grades, so compare them. This is the case that used to
      fall through entirely: a "Grades 2 to 12" program publishes no ages, so
      with nothing to compare, a Grade 1 class was told it fitted.

      A selection of several grades is compared by its ends. It used to be
      skipped, which told a Grades 1 to 3 group that a Grades 4 to 12 program
      fitted them. When the whole group is outside the range the reason names
      the whole group; when only part of it is, it names that end.
    */
    const { youngest, oldest } = grades
    const whole = youngest === oldest
      ? gradeName(youngest)
      : `${gradeName(youngest)} to ${gradeName(oldest)}`
    if (program.gradeMin != null && youngest < program.gradeMin) {
      reasons.push(
        oldest < program.gradeMin || youngest === oldest
          ? `written for ${gradeName(program.gradeMin)} and up, yours are ${whole}`
          : `written for ${gradeName(program.gradeMin)} and up, your youngest are ${gradeName(youngest)}`,
      )
    } else if (program.gradeMax != null && oldest > program.gradeMax) {
      reasons.push(
        youngest > program.gradeMax || youngest === oldest
          ? `written for up to ${gradeName(program.gradeMax)}, yours are ${whole}`
          : `written for up to ${gradeName(program.gradeMax)}, your oldest are ${gradeName(oldest)}`,
      )
    }
  } else if (program.ageMinYears != null && program.ageMinYears > group.ageMin) {
    reasons.push(
      `built for ${program.ageMinYears}+, your youngest are ${group.ageMin}`,
    )
  }

  /* ── Capacity ─────────────────────────────────────────────────────────
     Only a published capacity that is genuinely too small. */
  if (program.capacityMax != null && program.capacityMax < group.size) {
    reasons.push(
      `capacity is ${program.capacityMax}, your group is ${group.size}`,
    )
  }

  /* ── Budget ───────────────────────────────────────────────────────────
     Only a published price that is genuinely over budget. */
  const perChild = costPerChild(program, group.size)
  if (perChild != null && perChild > group.budgetPerChild) {
    reasons.push(
      `${money(perChild)} a child is over your ${money(group.budgetPerChild)} budget`,
    )
  }

  return {
    level: reasons.length === 0 ? 'green' : 'amber',
    reasons,
    issueText: reasons.join(' · '),
  }
}

/* Grade 0 is Kindergarten; the catalog stores pre-kindergarten as -1. */
export function gradeName(g: number): string {
  if (g < 0) return 'Pre-K'
  return g === 0 ? 'Kindergarten' : `Grade ${g}`
}

/* The badge label on a catalog card. */
export function badgeLabel(level: FeasibilityLevel): string {
  return level === 'green' ? 'Fits your group' : 'Needs confirmation'
}

/* The badge on the outing page, which names the room. */
export function outingBadgeLabel(
  level: FeasibilityLevel,
  roomName: string,
  issueText: string,
): string {
  return level === 'green' ? `✓ Fits ${roomName}` : `! ${issueText}`
}

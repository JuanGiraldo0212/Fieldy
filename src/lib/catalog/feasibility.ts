/*
  Feasibility. Plan section 5.1.

  Two levels, not three. The design has no red state: a card is green when
  nothing failed and amber otherwise, with every failed reason joined by " · "
  on one line. Do not add red.

  Three checks only — age, capacity, budget. Distance and season are FILTERS,
  not feasibility reasons: a program outside the radius or out of season is
  excluded from results, not badged. See search.ts.

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
  size: number
  budgetPerChild: number
}

/* Only the program fields feasibility reads. Keeping this narrow means the
   function can be tested without a database row. */
export type FeasibilityProgram = {
  ageBasis: 'years' | 'grades' | null
  ageMinYears: number | null
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
     First match wins: one age reason at most, because three overlapping
     complaints about the same fact reads as noise.

     Grades are never converted to years, here or anywhere. The design flags
     the mismatch and tells the director to phone, rather than guessing that
     "K to 3" means "5 to 9" and quietly filtering on the guess. */
  if (program.ageBasis === 'grades' && group.ageMax <= 5) {
    reasons.push(
      'ages are set by grade here, not years — phone to confirm they take under-fives',
    )
  } else if (program.ageMinYears == null) {
    reasons.push('no youngest age published — email to ask before you plan')
  } else if (program.ageMinYears > group.ageMin) {
    reasons.push(
      `built for ${program.ageMinYears}+, your youngest are ${group.ageMin}`,
    )
  }

  /* ── Capacity ─────────────────────────────────────────────────────────── */
  if (program.capacityMax == null) {
    reasons.push('capacity is not published — ask when you book')
  } else if (program.capacityMax < group.size) {
    reasons.push(
      `capacity is ${program.capacityMax}, your group is ${group.size} — ask about splitting`,
    )
  }

  /* ── Budget ───────────────────────────────────────────────────────────── */
  const perChild = costPerChild(program, group.size)
  if (perChild == null) {
    reasons.push('no price published')
  } else if (perChild > group.budgetPerChild) {
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

/* The badge label on a catalog card. */
export function badgeLabel(level: FeasibilityLevel): string {
  return level === 'green' ? 'Fits your group' : 'One thing to check'
}

/* The badge on the outing page, which names the room. */
export function outingBadgeLabel(
  level: FeasibilityLevel,
  roomName: string,
  issueText: string,
): string {
  return level === 'green' ? `✓ Fits ${roomName}` : `! ${issueText}`
}

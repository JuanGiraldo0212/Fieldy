import { describe, expect, it } from 'vitest'
import {
  badgeLabel,
  costPerChild,
  feasibility,
  money,
  outingBadgeLabel,
  type FeasibilityProgram,
  type GroupCriteria,
} from './feasibility'

/* A preschool room: the design's own default group. */
const PRESCHOOL: GroupCriteria = {
  ageMin: 3,
  ageMax: 5,
  size: 16,
  budgetPerChild: 10,
}

/* A program that passes every check, so each test can break exactly one. */
const CLEAN: FeasibilityProgram = {
  ageBasis: 'years',
  ageMinYears: 2,
  capacityMax: 30,
  costPerChildCad: 6,
  costPerGroupCad: null,
  isFree: null,
}

const withProgram = (over: Partial<FeasibilityProgram>) => ({ ...CLEAN, ...over })

describe('money', () => {
  it('drops decimals on whole dollars', () => {
    expect(money(8)).toBe('$8')
    expect(money(0)).toBe('$0')
  })

  it('keeps cents when there are any', () => {
    expect(money(12.5)).toBe('$12.50')
    expect(money(9.375)).toBe('$9.38')
  })
})

describe('costPerChild', () => {
  it('reads a per-child price directly', () => {
    expect(costPerChild({ costPerChildCad: 6, costPerGroupCad: null, isFree: null }, 16)).toBe(6)
  })

  it('divides a group fee across the group', () => {
    // $150 for a class of 16 is $9.375 a child — the number a director
    // actually compares against a per-child budget.
    expect(costPerChild({ costPerChildCad: null, costPerGroupCad: 150, isFree: null }, 16)).toBeCloseTo(9.375)
  })

  it('prefers the group fee when a venue published both', () => {
    expect(costPerChild({ costPerChildCad: 99, costPerGroupCad: 150, isFree: null }, 10)).toBe(15)
  })

  it('never divides by zero', () => {
    expect(costPerChild({ costPerChildCad: null, costPerGroupCad: 150, isFree: null }, 0)).toBe(150)
  })

  it('treats is_free as zero, not as unknown', () => {
    expect(costPerChild({ costPerChildCad: null, costPerGroupCad: null, isFree: true }, 16)).toBe(0)
  })

  it('returns null when nothing is published', () => {
    expect(costPerChild({ costPerChildCad: null, costPerGroupCad: null, isFree: null }, 16)).toBeNull()
  })
})

describe('feasibility — green', () => {
  it('is green when nothing fails', () => {
    const r = feasibility(CLEAN, PRESCHOOL)
    expect(r.level).toBe('green')
    expect(r.reasons).toEqual([])
    expect(r.issueText).toBe('')
  })

  it('is green at the exact capacity and budget boundaries', () => {
    const r = feasibility(
      withProgram({ capacityMax: 16, costPerChildCad: 10, ageMinYears: 3 }),
      PRESCHOOL,
    )
    expect(r.level).toBe('green')
  })

  it('is green for a free program', () => {
    const r = feasibility(
      withProgram({ costPerChildCad: null, isFree: true }),
      PRESCHOOL,
    )
    expect(r.level).toBe('green')
  })
})

describe('feasibility — age', () => {
  it('flags a grade-based program for an under-five room, verbatim', () => {
    const r = feasibility(withProgram({ ageBasis: 'grades' }), PRESCHOOL)
    expect(r.reasons).toContain(
      'ages are set by grade here, not years — phone to confirm they take under-fives',
    )
  })

  it('does not flag grades for a school-age room', () => {
    const grade2: GroupCriteria = { ageMin: 6, ageMax: 8, size: 22, budgetPerChild: 12 }
    const r = feasibility(withProgram({ ageBasis: 'grades' }), grade2)
    expect(r.level).toBe('green')
  })

  it('does NOT flag an unpublished youngest age', () => {
    // A missing fact is not a failure. The card says "Ages not published" and
    // it becomes an ask on the request; it does not also consume the badge.
    const r = feasibility(withProgram({ ageMinYears: null }), PRESCHOOL)
    expect(r.level).toBe('green')
    expect(r.reasons).toEqual([])
  })

  it('flags a program built for older children, verbatim', () => {
    const r = feasibility(withProgram({ ageMinYears: 7 }), PRESCHOOL)
    expect(r.reasons).toContain('built for 7+, your youngest are 3')
  })

  it('gives at most one age reason — first match wins', () => {
    const r = feasibility(
      withProgram({ ageBasis: 'grades', ageMinYears: 7 }),
      PRESCHOOL,
    )
    const ageReasons = r.reasons.filter(
      (x) => x.includes('grade') || x.includes('built for'),
    )
    expect(ageReasons).toHaveLength(1)
    expect(ageReasons[0]).toMatch(/^ages are set by grade/)
  })

  it('treats the grade mismatch as known, not missing', () => {
    // The venue DID publish a range, in units that cannot answer this room's
    // question. That is a real thing to check, so it stays amber.
    const r = feasibility(withProgram({ ageBasis: 'grades' }), PRESCHOOL)
    expect(r.level).toBe('amber')
  })

  it('never converts grades to years', () => {
    // A grade 2-12 program has no published age range. For a school-age room
    // we must not invent "built for 7+" out of "Grade 2".
    const grade2: GroupCriteria = { ageMin: 6, ageMax: 8, size: 22, budgetPerChild: 12 }
    const r = feasibility(
      withProgram({ ageBasis: 'grades', ageMinYears: null }),
      grade2,
    )
    expect(r.issueText).not.toMatch(/built for/)
    expect(r.level).toBe('green')
  })
})

describe('feasibility — capacity', () => {
  it('does NOT flag an unpublished capacity', () => {
    // 33 of the 39 real programs publish no capacity. Counting that as a
    // failure made every card in the catalog amber.
    const r = feasibility(withProgram({ capacityMax: null }), PRESCHOOL)
    expect(r.level).toBe('green')
  })

  it('flags a group too big, verbatim', () => {
    const r = feasibility(withProgram({ capacityMax: 12 }), PRESCHOOL)
    expect(r.reasons).toContain('capacity is 12, your group is 16 — ask about splitting')
  })
})

describe('feasibility — budget', () => {
  it('does NOT flag an unpublished price', () => {
    const r = feasibility(
      withProgram({ costPerChildCad: null, costPerGroupCad: null }),
      PRESCHOOL,
    )
    expect(r.level).toBe('green')
  })

  it('flags going over budget, verbatim', () => {
    const r = feasibility(withProgram({ costPerChildCad: 12 }), PRESCHOOL)
    expect(r.reasons).toContain('$12 a child is over your $10 budget')
  })

  it('shows cents when a divided group fee produces them', () => {
    // $150 across 10 children is $15 exactly; across 16 it is $9.375.
    const r = feasibility(
      withProgram({ costPerChildCad: null, costPerGroupCad: 150 }),
      { ...PRESCHOOL, budgetPerChild: 5 },
    )
    expect(r.reasons).toContain('$9.38 a child is over your $5 budget')
  })

  it('does not flag a group fee that divides down under budget', () => {
    const r = feasibility(
      withProgram({ costPerChildCad: null, costPerGroupCad: 150 }),
      PRESCHOOL,
    )
    expect(r.level).toBe('green')
  })
})

describe('feasibility — several failures', () => {
  it('stays amber rather than inventing a red level', () => {
    const r = feasibility(
      withProgram({ ageMinYears: 7, capacityMax: 12, costPerChildCad: 20 }),
      PRESCHOOL,
    )
    expect(r.level).toBe('amber')
    expect(r.reasons).toHaveLength(3)
  })

  it('is green when everything that failed was merely unpublished', () => {
    const r = feasibility(
      withProgram({ ageMinYears: null, capacityMax: null, costPerChildCad: null }),
      PRESCHOOL,
    )
    expect(r.level).toBe('green')
  })

  it('joins reasons with a middle dot, in age then capacity then budget order', () => {
    const r = feasibility(
      withProgram({ capacityMax: 12, costPerChildCad: 20 }),
      PRESCHOOL,
    )
    expect(r.issueText).toBe(
      'capacity is 12, your group is 16 — ask about splitting · $20 a child is over your $10 budget',
    )
  })
})

describe('badge labels', () => {
  it('reads as the design writes it on a card', () => {
    expect(badgeLabel('green')).toBe('Fits your group')
    expect(badgeLabel('amber')).toBe('One thing to check')
  })

  it('names the room on the outing page', () => {
    expect(outingBadgeLabel('green', 'Preschool room', '')).toBe('✓ Fits Preschool room')
    expect(outingBadgeLabel('amber', 'Preschool room', 'no price published')).toBe(
      '! no price published',
    )
  })
})

describe('feasibility — against the real catalog', () => {
  it('marks the Art Gallery workshop amber for a preschool room', () => {
    // art-gallery-greater-victoria:school-tour-workshop, verbatim from the DB:
    // grades 2-12, $150 group, capacity 30, school_rate_only.
    const r = feasibility(
      {
        ageBasis: 'grades',
        ageMinYears: null,
        capacityMax: 30,
        costPerChildCad: null,
        costPerGroupCad: 150,
        isFree: null,
      },
      PRESCHOOL,
    )
    expect(r.level).toBe('amber')
    expect(r.reasons).toEqual([
      'ages are set by grade here, not years — phone to confirm they take under-fives',
    ])
    // $150 across 16 is $9.38, under the $10 budget, so cost is NOT a reason.
    expect(r.issueText).not.toMatch(/budget/)
  })
})

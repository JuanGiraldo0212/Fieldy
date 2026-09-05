import { describe, expect, it } from 'vitest'
import { loadFixtures, runEval, runFixture } from '@/lib/classify/eval'

/*
  Every fixture in tests/fixtures/replies/, as a test each. Plan M5.

  A fixture that fails is either a rule to tweak or an accepted `unclear`,
  and the accepted ones are written into the fixture as expected `unclear`
  — so this suite is meant to be green, not ninety percent green. The
  aggregate targets are asserted separately at the bottom.
*/

const fixtures = loadFixtures()

describe('classifier fixtures', () => {
  it('has at least the thirty replies the plan asks for', () => {
    expect(fixtures.length).toBeGreaterThanOrEqual(30)
  })

  for (const f of fixtures) {
    it(f.name, () => {
      const r = runFixture(f)
      expect(r.got.intent).toBe(f.expected.intent)
      expect(r.got.dates).toEqual(f.expected.dates)
      expect(r.got.time).toBe(f.expected.time)
    })
  }
})

describe('classifier targets', () => {
  const summary = runEval(fixtures)

  it('never confirms a reply that did not confirm', () => {
    expect(summary.falseConfirmations).toBe(0)
  })

  it('reads at least 90 percent of confirmations and declines', () => {
    for (const intent of ['confirmed', 'declined']) {
      const b = summary.byIntent[intent]!
      expect(b.correct / b.total).toBeGreaterThanOrEqual(0.9)
    }
  })
})

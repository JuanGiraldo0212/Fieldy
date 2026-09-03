import { describe, expect, it } from 'vitest'
import { packSpans } from './sections'

/* A 3-column grid. Every row has to add up to exactly 3, including the last,
   or the block ends on a ragged edge that reads as a bug. */
const COLUMNS = 3

function rows(spans: number[]): number[][] {
  const out: number[][] = []
  let row: number[] = []
  let used = 0
  for (const s of spans) {
    if (used + s > COLUMNS) {
      out.push(row)
      row = []
      used = 0
    }
    row.push(s)
    used += s
  }
  if (row.length) out.push(row)
  return out
}

const short = 'Yes'
const medium = 'x'.repeat(120)
const long = 'x'.repeat(300)

describe('packSpans', () => {
  it('leaves three short cards alone: they already fill the row', () => {
    expect(packSpans([short, short, short])).toEqual([1, 1, 1])
  })

  it('grows a lone card to the full width', () => {
    expect(packSpans([short])).toEqual([3])
  })

  it('splits two short cards across the row rather than leaving a gap', () => {
    // 1 + 1 would leave a third of the row empty.
    expect(packSpans([short, short])).toEqual([1, 2])
  })

  it('fills the gap a wide card leaves behind', () => {
    // A 2-wide followed by nothing else would leave one column bare.
    expect(packSpans([medium])).toEqual([3])
  })

  it('keeps a wide card wide when the row works out', () => {
    expect(packSpans([medium, short])).toEqual([2, 1])
  })

  it('never overflows a row', () => {
    const spans = packSpans([medium, medium, short, long, short])
    for (const r of rows(spans)) {
      expect(r.reduce((a, b) => a + b, 0)).toBeLessThanOrEqual(COLUMNS)
    }
  })

  it('fills every row completely, including the last', () => {
    const cases = [
      [short],
      [short, short],
      [short, short, short, short],
      [medium, short, short],
      [long, short, medium],
      [medium, medium, medium],
      [short, medium, long, short, short, medium, short, short],
    ]
    for (const values of cases) {
      const spans = packSpans(values)
      for (const r of rows(spans)) {
        expect(r.reduce((a, b) => a + b, 0)).toBe(COLUMNS)
      }
    }
  })

  it('returns one span per card, and never more than the grid is wide', () => {
    const values = [short, medium, long, short, short]
    const spans = packSpans(values)
    expect(spans).toHaveLength(values.length)
    for (const s of spans) {
      expect(s).toBeGreaterThanOrEqual(1)
      expect(s).toBeLessThanOrEqual(COLUMNS)
    }
  })

  it('handles the real Art Gallery set, which is what prompted this', () => {
    // Two long notes, several "Not stated on the site", one restrictions
    // paragraph. Eight cards, and every row has to come out flush.
    const values = [
      'x'.repeat(280), // washrooms, a real note
      'Not stated on the site',
      'Not stated on the site',
      'Not stated on the site',
      'x'.repeat(300), // wheelchair access
      'x'.repeat(140), // bus parking
      'Not stated on the site',
      'x'.repeat(260), // restrictions
    ]
    const spans = packSpans(values)
    for (const r of rows(spans)) {
      expect(r.reduce((a, b) => a + b, 0)).toBe(COLUMNS)
    }
  })

  it('copes with no cards at all', () => {
    expect(packSpans([])).toEqual([])
  })
})

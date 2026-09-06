import { describe, expect, it } from 'vitest'
import { bandSummary } from './age-band-select'

/*
  AGE_BANDS indices, for reading these: 0 = "1 to 3 years", 1 = "3 to 5 years",
  2 = Kindergarten, 3 = Grade 1, and so on to 14 = Grade 12.
*/
describe('bandSummary', () => {
  it('names a single band outright', () => {
    expect(bandSummary([0])).toBe('1 to 3 years')
    expect(bandSummary([1])).toBe('3 to 5 years')
    expect(bandSummary([2])).toBe('Kindergarten')
    expect(bandSummary([5])).toBe('Grade 3')
  })

  it('reads a contiguous run of grades as a range, with K for grade 0', () => {
    expect(bandSummary([3, 4, 5])).toBe('Grades 1 to 3')
    expect(bandSummary([2, 3, 4])).toBe('Grades K to 2')
    expect(bandSummary([13, 14])).toBe('Grades 11 to 12')
  })

  it('counts anything that is not a run of grades', () => {
    // Spanning the school boundary is not a grade range — bandsFor() produces
    // exactly this for a room of 3 to 8, and "3 to 5 years to Grade 1" is not
    // a thing anyone says.
    expect(bandSummary([1, 2, 3])).toBe('3 to 5 years +2 more')
    // Contiguous, but pre-school only.
    expect(bandSummary([0, 1])).toBe('1 to 3 years +1 more')
    // Grades, but with a hole in the middle.
    expect(bandSummary([3, 5])).toBe('Grade 1 +1 more')
  })

  it('is stable however the list arrives', () => {
    expect(bandSummary([5, 3, 4])).toBe('Grades 1 to 3')
    expect(bandSummary([3, 3, 4, 5])).toBe('Grades 1 to 3')
  })

  it('falls back to the default band rather than showing nothing', () => {
    // usableBands() defaults an empty or rubbish selection to "3 to 5", and
    // the field has to say the same thing the filter is doing.
    expect(bandSummary([])).toBe('3 to 5 years')
    expect(bandSummary([99])).toBe('3 to 5 years')
  })
})

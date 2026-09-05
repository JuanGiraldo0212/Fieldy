import { describe, expect, it } from 'vitest'
import { findPhrases, scoreSentence } from './rules'

/*
  The phrase rules. Plan §5.5 step 3: the three lists, negation within four
  words, and the question mark weakening a confirm.
*/

describe('scoreSentence — the three lists', () => {
  it('counts a confirm phrase', () => {
    expect(scoreSentence('We have you down for the 14th.').confirm).toBe(1)
  })

  it('counts a decline phrase', () => {
    expect(scoreSentence('Unfortunately we are fully booked.').decline).toBe(2)
  })

  it('counts an alternative phrase, including the gapped one', () => {
    expect(scoreSentence('Would the 21st work for you?').alternative).toBe(1)
    expect(scoreSentence('We could offer the 21st instead.').alternative).toBe(2)
  })

  it('matches on word boundaries, so "neither of" is not "either of"', () => {
    expect(scoreSentence('Neither of those suits.').alternative).toBe(0)
  })

  it('is case-insensitive', () => {
    expect(scoreSentence('CONFIRMED.').confirm).toBe(1)
  })
})

describe('scoreSentence — negation', () => {
  it('flips a confirm within four words of a negation into a decline', () => {
    const s = scoreSentence('We cannot confirm that date.')
    expect(s.confirm).toBe(0)
    expect(s.decline).toBe(1)
  })

  it('reaches across a few words', () => {
    const s = scoreSentence('We are not able to confirm that date.')
    expect(s.confirm).toBe(0)
    /* "not able to" is itself a decline phrase, and the negated confirm
       counts once more. */
    expect(s.decline).toBe(2)
  })

  it('does not reach further than four words', () => {
    const s = scoreSentence('No problem at all, we are pleased to say it is confirmed.')
    expect(s.confirm).toBe(1)
  })

  it('marks the hit as negated', () => {
    const hits = findPhrases("We can't confirm that.")
    expect(hits.find((h) => h.phrase === 'confirm')?.negated).toBe(true)
  })
})

describe('scoreSentence — questions and weights', () => {
  it('halves a confirm that ends in a question mark', () => {
    expect(scoreSentence('Can you confirm the numbers?').confirm).toBe(0.5)
  })

  it('does not weaken a decline for being a question', () => {
    expect(scoreSentence('Unfortunately, could we say no?').decline).toBe(1)
  })

  it('gives a weak confirm half a point', () => {
    expect(scoreSentence('The lunch room is booked.').confirm).toBe(0.5)
  })

  it('counts "booked" inside "fully booked" as the decline only', () => {
    const s = scoreSentence('We are fully booked.')
    expect(s.confirm).toBe(0)
    expect(s.decline).toBe(1)
  })

  it('counts a phrase once at its longest match', () => {
    const s = scoreSentence("You're all set.")
    expect(s.confirm).toBe(1)
  })
})

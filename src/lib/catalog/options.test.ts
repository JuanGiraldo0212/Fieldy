import { describe, expect, it } from 'vitest'
import {
  ageBasis,
  bookingMethod,
  imageRole,
  imageUsage,
  moodTag,
  programFormat,
  venueCategory,
} from '@/db/schema'
import {
  AGE_BASES,
  BOOKING_METHODS,
  IMAGE_ROLES,
  IMAGE_USAGES,
  MOOD_TAGS,
  PROGRAM_FORMATS,
  VENUE_CATEGORIES,
  values,
} from './options'

/* The lists the admin forms offer must be exactly the pg enums, or a save
   fails on a value the form let someone pick — or worse, quietly cannot
   offer a value the database accepts. */
describe('options match the schema enums', () => {
  const cases: [string, readonly string[], readonly string[]][] = [
    ['venue category', values(VENUE_CATEGORIES), venueCategory.enumValues],
    ['booking method', values(BOOKING_METHODS), bookingMethod.enumValues],
    ['age basis', values(AGE_BASES), ageBasis.enumValues],
    ['program format', values(PROGRAM_FORMATS), programFormat.enumValues],
    ['mood tag', values(MOOD_TAGS), moodTag.enumValues],
    ['image role', values(IMAGE_ROLES), imageRole.enumValues],
    ['image usage', values(IMAGE_USAGES), imageUsage.enumValues],
  ]
  for (const [name, ours, theirs] of cases) {
    it(name, () => {
      expect([...ours].sort()).toEqual([...theirs].sort())
    })
  }
})

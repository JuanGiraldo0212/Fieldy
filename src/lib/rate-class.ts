import type { centreType, rateClass } from '@/db/schema'

type CentreType = (typeof centreType.enumValues)[number]
type RateClass = (typeof rateClass.enumValues)[number]

/*
  data-model.md section 2: rate_class is derived from centre.type, and drives
  whether a program's `school_rate_only` flag is shown at all.

  Derived, never stored — the model's third rule. It is also not expressible as
  a Postgres generated column: casting a text literal to an enum is stable
  rather than immutable, so the expression is rejected outright.

  "Other" resolves to daycare deliberately: the design's own copy for that case
  is "We will show every rate we have and flag the ones written for schools",
  and flagging is the daycare behaviour.
*/
export function rateClassOf(type: CentreType): RateClass {
  return type === 'daycare_preschool' || type === 'other' ? 'daycare' : 'school'
}

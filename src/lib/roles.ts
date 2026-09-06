/*
  The two "who are you" pick-lists, in one place because they are duplicated
  across four files that must agree: the welcome form, the account form, and
  the zod schema guarding each. They drifted once already.

  Order is presentation order, not the pg enum's order. The enum appends
  (see accountRole in src/db/schema.ts); this list reads the way a director
  would expect to find herself in it.

  "Other" is last in both lists and is the only option that opens a text box.
  What she types goes to `account.role_other` / `centre.type_other` and is
  never parsed — it is there so the next round of options comes from real
  answers instead of guesses, and so the request signature can say what she
  actually does.
*/

export const ROLES: readonly (readonly [string, string])[] = [
  ['director', 'Director'],
  ['manager', 'Manager'],
  ['ece', 'ECE'],
  ['ecea', 'ECEA'],
  ['teacher', 'Teacher'],
  ['other', 'Other'],
] as const

export const CENTRE_TYPES: readonly (readonly [string, string])[] = [
  ['daycare_preschool', 'Daycare or preschool'],
  ['elementary', 'Elementary'],
  ['middle', 'Middle school'],
  ['secondary', 'Secondary'],
  ['other', 'Other'],
] as const

/* The values the zod schemas accept. Kept as tuples so z.enum() is happy. */
export const ROLE_VALUES = [
  'director',
  'manager',
  'ece',
  'ecea',
  'teacher',
  'other',
] as const

export const CENTRE_TYPE_VALUES = [
  'daycare_preschool',
  'elementary',
  'middle',
  'secondary',
  'other',
] as const

/*
  What to store in the free-text column. Only "other" may carry one, so a
  director who types something, changes her mind and picks Director does not
  leave a stale string behind on her record.
*/
export function otherText(picked: string, typed: string | null): string | null {
  if (picked !== 'other') return null
  const t = typed?.trim()
  return t ? t.slice(0, 120) : null
}

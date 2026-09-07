/*
  Slugs for catalog ids. A venue's id is its slug; a program's id is
  `${venueId}:${slug}` (see scripts/import-catalog.ts and the schema).

  Ids are stable and public — they are in every outing URL and every trip
  references a program by id — so a slug is minted once, when the record is
  created, and never regenerated from a later rename.
*/

const MAX = 80

export function slugify(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip the accents NFD split off
    .replace(/&/g, ' and ')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, MAX)
    .replace(/-+$/, '')
}

/* What a hand-typed id must look like. Same alphabet slugify() produces. */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function isSlug(s: string): boolean {
  return s.length > 0 && s.length <= MAX && SLUG_PATTERN.test(s)
}

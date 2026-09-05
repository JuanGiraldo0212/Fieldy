import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { z } from 'zod'
import { dateOptionSchema, suggestionIntent } from '@/lib/schemas'
import { classify } from './provider'

/*
  The classifier eval. Plan M5: hand-written venue replies with the intent
  and dates each should produce, run against the classifier.

  Shared by `pnpm eval:classifier`, which prints the table, and
  tests/classifier-eval.test.ts, which fails the build on any regression.
  The fixtures are the tuning surface together with rules.ts: a real reply
  that reads wrong becomes a fixture here, and then a phrase there.
*/

export const FIXTURES_DIR = join(process.cwd(), 'tests/fixtures/replies')

const fixtureSchema = z.object({
  note: z.string().default(''),
  sent_at: z.iso.datetime({ offset: true }),
  date_options: z.array(dateOptionSchema),
  body: z.string(),
  expected: z.object({
    intent: suggestionIntent,
    dates: z.array(z.iso.date()).nullable().default(null),
    time: z.string().nullable().default(null),
  }),
})

export type Fixture = z.infer<typeof fixtureSchema> & { name: string }

export function loadFixtures(dir = FIXTURES_DIR): Fixture[] {
  return readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .sort()
    .map((f) => ({
      name: f.replace(/\.json$/, ''),
      ...fixtureSchema.parse(JSON.parse(readFileSync(join(dir, f), 'utf8'))),
    }))
}

export type EvalRow = {
  name: string
  expected: Fixture['expected']
  got: { intent: string; dates: string[] | null; time: string | null; confidence: number | null; evidence: string }
  intentOk: boolean
  datesOk: boolean
  timeOk: boolean
  /* The one outcome the plan says must be zero: a confirmed reading of a
     reply that did not confirm. */
  falseConfirmation: boolean
}

export function runFixture(f: Fixture): EvalRow {
  const s = classify({
    body: f.body,
    dateOptions: f.date_options,
    sentAt: new Date(f.sent_at),
  })
  /* No banner either way, so a null from the classifier meets an expected
     `unclear`. */
  const got = s
    ? {
        intent: s.intent,
        dates: s.dates,
        time: s.time,
        confidence: s.confidence,
        evidence: s.evidence,
      }
    : { intent: 'unclear', dates: null, time: null, confidence: null, evidence: '' }

  const intentOk = got.intent === f.expected.intent
  const datesOk = sameDates(got.dates, f.expected.dates)
  const timeOk = (got.time ?? null) === (f.expected.time ?? null)
  return {
    name: f.name,
    expected: f.expected,
    got,
    intentOk,
    datesOk,
    timeOk,
    falseConfirmation: got.intent === 'confirmed' && f.expected.intent !== 'confirmed',
  }
}

function sameDates(a: string[] | null, b: string[] | null): boolean {
  if (a === null || b === null) return a === b
  if (a.length !== b.length) return false
  const sa = [...a].sort()
  const sb = [...b].sort()
  return sa.every((d, i) => d === sb[i])
}

export type EvalSummary = {
  rows: EvalRow[]
  total: number
  correct: number
  byIntent: Record<string, { total: number; correct: number }>
  falseConfirmations: number
}

export function runEval(fixtures = loadFixtures()): EvalSummary {
  const rows = fixtures.map(runFixture)
  const byIntent: EvalSummary['byIntent'] = {}
  for (const r of rows) {
    const b = (byIntent[r.expected.intent] ??= { total: 0, correct: 0 })
    b.total++
    if (r.intentOk && r.datesOk && r.timeOk) b.correct++
  }
  return {
    rows,
    total: rows.length,
    correct: rows.filter((r) => r.intentOk && r.datesOk && r.timeOk).length,
    byIntent,
    falseConfirmations: rows.filter((r) => r.falseConfirmation).length,
  }
}

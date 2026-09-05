/*
  The classifier eval. Plan M5.

    pnpm eval:classifier

  Runs every reply in tests/fixtures/replies/ through the classifier and
  prints what it read against what was expected. The target is 90 percent on
  confirmed and declined with zero false confirmations; `unclear` is the safe
  failure and is never counted against a fixture that expected it.

  The same run is a vitest suite (tests/classifier-eval.test.ts), so a
  regression fails the build rather than only the number here.
*/

import { runEval } from '../src/lib/classify/eval'

const summary = runEval()

const pad = (s: string, n: number) => (s.length >= n ? s : s + ' '.repeat(n - s.length))

for (const r of summary.rows) {
  const ok = r.intentOk && r.datesOk && r.timeOk
  const mark = ok ? ' ok ' : r.falseConfirmation ? 'FAIL' : 'miss'
  const exp = `${r.expected.intent}${r.expected.dates ? ' ' + r.expected.dates.join(',') : ''}${r.expected.time ? ' @' + r.expected.time : ''}`
  const got = `${r.got.intent}${r.got.dates ? ' ' + r.got.dates.join(',') : ''}${r.got.time ? ' @' + r.got.time : ''}`
  console.log(`${mark}  ${pad(r.name, 38)} ${pad(exp, 40)} ${ok ? '' : '→ ' + got}`)
  if (!ok) console.log(`      evidence: “${r.got.evidence}”  confidence ${r.got.confidence}`)
}

console.log('')
for (const [intent, b] of Object.entries(summary.byIntent)) {
  console.log(`${pad(intent, 16)} ${b.correct}/${b.total}  ${Math.round((100 * b.correct) / b.total)}%`)
}
console.log(`${pad('overall', 16)} ${summary.correct}/${summary.total}  ${Math.round((100 * summary.correct) / summary.total)}%`)
console.log(`false confirmations: ${summary.falseConfirmations}`)

if (summary.falseConfirmations > 0) process.exit(1)

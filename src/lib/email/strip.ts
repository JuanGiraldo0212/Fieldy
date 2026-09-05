/*
  Reply stripping. Plan §5.4 step 4, and spec §5.4.5: the thread shows the
  stripped body, and "Show full message" expands the quoted history.

  A venue replies from Outlook or Gmail, and what arrives is four lines of
  answer sitting on top of our entire request, their signature, a legal
  disclaimer and sometimes a scanned-by-antivirus footer. Showing that in the
  thread turns a two-line answer into a page of scrollback.

  Two rules govern everything here:

  1. **Stripping is a display convenience, never a data decision.** The
     unstripped text is always stored in `message.body_full`, so an over-eager
     cut is one tap away from being undone rather than lost.
  2. **When in doubt, keep it.** A quoted paragraph left in the thread is
     untidy; an answer cut out of it is a director ringing a venue to ask a
     question they already answered. Every heuristic below is written to
     require strong evidence before it cuts.

  No dependencies. This is line-by-line string work, which means it is testable
  without a mail server — see strip.test.ts and its five real-world samples.
*/

export type StrippedBody = {
  /* What the thread shows. */
  body: string
  /* True when something was actually removed, which is what decides whether
     the message offers "Show full message" at all. */
  trimmed: boolean
}

/*
  Markers that mean "everything from here down is quoted history".

  Anchored to the start of a line and, where the phrase is ordinary English,
  required to carry punctuation or structure a person would not write by
  accident.
*/
const CUT_MARKERS: RegExp[] = [
  /*
    Ticket systems put the marker at the top of the reply and expect the
    sender to type above it. Zendesk's is the canonical wording; Freshdesk and
    Front use near-identical lines, so the middle is left loose.
  */
  /^\s*##-.*reply above this line.*-##\s*$/i,
  /^\s*-{2,}\s*Please (?:type your )?reply above this line\s*-{2,}\s*$/i,

  /* Outlook, both the English separator and the underscore rule it draws
     above the forwarded header block. */
  /^\s*-{3,}\s*Original Message\s*-{3,}\s*$/i,
  /^\s*-{3,}\s*Forwarded message\s*-{3,}\s*$/i,
  /^_{10,}\s*$/,

  /* Gmail's own collapse marker, which arrives verbatim in some clients. */
  /^\s*\[Quoted text hidden\]\s*$/i,
]

/*
  The Outlook header block: four labelled lines in a row, no separator above
  them. One `From:` line proves nothing — a venue may well write "From: our
  education team" — so this only fires when `From:` is followed within the next
  three lines by `Sent:`/`Date:` and `Subject:`.
*/
function outlookHeaderBlockAt(lines: string[], i: number): boolean {
  if (!/^\s*From:\s*\S/i.test(lines[i]!)) return false
  const window = lines.slice(i + 1, i + 5).join('\n')
  return (
    /^\s*(?:Sent|Date):/im.test(window) && /^\s*Subject:/im.test(window)
  )
}

/*
  The attribution line every client writes above a quote: "On <when>, <who>
  wrote:".

  Two things make this safe to act on. It must end in `wrote:` (or the French
  and German equivalents, which turn up on bilingual government mailboxes here),
  and it must begin with `On`/`Le`/`Am`. A venue writing "On Tuesday we could
  host you" fails the first test and survives.

  Long attributions wrap, so the line is joined with the two that follow before
  the test — Gmail breaks "…at 9:14 AM Jane Doe <jane@example.com> wrote:"
  across two lines routinely.
*/
const ATTRIBUTION = /^\s*(?:On|Le|Am)\b[\s\S]{0,300}?(?:wrote|a écrit|schrieb)\s*:\s*$/i

function attributionAt(lines: string[], i: number): boolean {
  for (let span = 1; span <= 3; span++) {
    const joined = lines.slice(i, i + span).join(' ').trim()
    if (ATTRIBUTION.test(joined)) return true
  }
  return false
}

/*
  Signature markers. Cut from here down, but only after the reply has said
  something — a message whose first line is "Sent from my iPhone" is a message
  we would otherwise blank entirely.
*/
const SIGNATURE_MARKERS: RegExp[] = [
  /* RFC 3676's sig delimiter: exactly two dashes on their own line. */
  /^--\s*$/,
  /^\s*Sent from my \S.*$/i,
  /^\s*Get Outlook for (?:iOS|Android)\s*$/i,
  /^\s*Sent from Mail for Windows.*$/i,
]

/* A run of `>` quoting. Also `> >` and the space-prefixed variants. */
function isQuotedLine(line: string): boolean {
  return /^\s{0,3}>/.test(line)
}

export function stripReply(raw: string): StrippedBody {
  const text = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const lines = text.split('\n')

  /*
    First pass: the earliest line at which the quoted history begins.

    A quoted line on its own counts only when what follows is also quoted or
    blank — a single `>` in the middle of a sentence is someone quoting a price,
    not a client quoting a thread.
  */
  let cut = lines.length

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!

    if (CUT_MARKERS.some((re) => re.test(line))) {
      cut = i
      break
    }
    if (outlookHeaderBlockAt(lines, i)) {
      cut = i
      break
    }
    if (attributionAt(lines, i)) {
      cut = i
      break
    }
    if (isQuotedLine(line) && restIsQuoted(lines, i)) {
      cut = i
      break
    }
  }

  let kept = lines.slice(0, cut)

  /*
    Second pass: the signature, searched only within what survived. It runs
    after the quote cut because a quoted history contains the sender's old
    signature too, and cutting at that one would keep half the quote.
  */
  for (let i = 0; i < kept.length; i++) {
    if (!SIGNATURE_MARKERS.some((re) => re.test(kept[i]!))) continue
    /* Only if something readable came first. */
    if (kept.slice(0, i).some((l) => l.trim() !== '')) {
      kept = kept.slice(0, i)
      break
    }
  }

  const body = trimBlankEdges(kept).join('\n')

  /*
    The safety net. If the heuristics ate the whole message — an unusual client,
    a reply typed entirely under the quote — show the original rather than an
    empty bubble. Being untidy beats appearing to have received nothing.
  */
  if (body.trim() === '') {
    return { body: trimBlankEdges(text.split('\n')).join('\n'), trimmed: false }
  }

  return { body, trimmed: body.length < text.trim().length }
}

/*
  Whether everything from `i` onward is quoted or blank. Tolerates the blank
  line clients leave between quote blocks, and the trailing whitespace at the
  end of a message.
*/
function restIsQuoted(lines: string[], i: number): boolean {
  const rest = lines.slice(i)
  return rest.every((l) => isQuotedLine(l) || l.trim() === '')
}

function trimBlankEdges(lines: string[]): string[] {
  let start = 0
  let end = lines.length
  while (start < end && lines[start]!.trim() === '') start++
  while (end > start && lines[end - 1]!.trim() === '') end--
  return lines.slice(start, end)
}

/*
  The fallback when a reply carries no plain text part at all — some clients,
  and most "sent from our CRM" systems, send HTML only.

  Deliberately crude: block tags become newlines, everything else is dropped,
  entities are decoded. This is not a renderer, and it must never become one —
  the output is stored as text and displayed as text, so any markup that
  survived would be shown to the educator as literal angle brackets at best.
*/
export function htmlToText(html: string): string {
  const withBreaks = html
    .replace(/<(?:script|style)\b[\s\S]*?<\/(?:script|style)>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(?:p|div|tr|li|h[1-6]|blockquote)>/gi, '\n')
    .replace(/<li\b[^>]*>/gi, '• ')
    .replace(/<[^>]+>/g, '')

  return decodeEntities(withBreaks)
    .replace(/\n{3,}/g, '\n\n')
    .split('\n')
    .map((l) => l.replace(/[ \t ]+/g, ' ').trimEnd())
    .join('\n')
    .trim()
}

const ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  mdash: '—',
  ndash: '–',
  rsquo: '’',
  lsquo: '‘',
  ldquo: '“',
  rdquo: '”',
  hellip: '…',
}

function decodeEntities(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n: string) =>
      String.fromCodePoint(parseInt(n, 16)),
    )
    .replace(/&([a-z]+);/gi, (m, name: string) => ENTITIES[name.toLowerCase()] ?? m)
}

/*
  What the thread shows and what it keeps, from whatever parts the message
  actually had. Text is preferred over HTML because it is what the sender
  typed; the HTML is a rendering of it.
*/
export function bodyFromParts({
  text,
  html,
}: {
  text: string | null
  html: string | null
}): { body: string; bodyFull: string } {
  const full = (text?.trim() ? text : html ? htmlToText(html) : '') ?? ''
  if (!full.trim()) {
    /* A message with no readable part at all. It still belongs in the thread —
       it may carry the attachment the whole exchange was about. */
    return { body: '', bodyFull: '' }
  }
  return { body: stripReply(full).body, bodyFull: full }
}

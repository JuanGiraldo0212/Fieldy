/*
  The reply notification, and the auto-response to anyone who answers it.
  Plan §5.4a, copy inventory §7 "Reply notification email".

  The design does not draw either of these — they are not screens — so they are
  built plain from the tokens in docs/design-map.md §3. Email clients strip
  stylesheets and web fonts, so everything is inline and the type falls back to
  the system stack.

  What is deliberately NOT in here: the suggestion, the thread, the venue's
  full message, and any way to reply. The notification is a nudge with a door
  in it. Pushing our reading of a venue's reply into an inbox, where there is
  no Dismiss button and no evidence line, is exactly the wrong place to be
  wrong.
*/

const BG = '#F2F6FB'
const SURFACE = '#FFFFFF'
const BORDER = '#DBE3EC'
const TEXT = '#16202B'
const MUTED = '#546475'
const FAINT = '#78899C'
const BRAND_SOLID = '#1D4E9B'

const FONT =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

/* Enough to tell a "yes" from a "sorry, we're full" without opening the app,
   and short enough that it cannot be mistaken for the whole message. */
export const PREVIEW_CHARS = 200

export function previewOf(body: string): string {
  const flat = body.replace(/\s+/g, ' ').trim()
  return flat.length > PREVIEW_CHARS
    ? `${flat.slice(0, PREVIEW_CHARS).trimEnd()}…`
    : flat
}

export type NotificationInput = {
  venueName: string
  programName: string
  authorName: string
  /* The trip's first date, already formatted for reading. Null before any date
     survives — a trip whose options were all withdrawn. */
  firstDate: string | null
  preview: string
  tripUrl: string
}

export function notificationSubject({
  venueName,
  programName,
}: Pick<NotificationInput, 'venueName' | 'programName'>): string {
  return `${venueName} replied about ${programName}`
}

export function notificationText(n: NotificationInput): string {
  const when = n.firstDate ? ` (${n.firstDate})` : ''
  return [
    `${n.authorName} at ${n.venueName} replied about ${n.programName}${when}.`,
    '',
    n.preview ? `“${n.preview}”` : '(They sent no message text.)',
    '',
    `Open the trip: ${n.tripUrl}`,
    '',
    "You can't reply to this email — open the trip to answer.",
  ].join('\n')
}

export function notificationHtml(n: NotificationInput): string {
  const when = n.firstDate ? ` · ${escapeHtml(n.firstDate)}` : ''
  return `<!doctype html>
<html><body style="margin:0;padding:24px 16px;background:${BG};font-family:${FONT};color:${TEXT};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;">
        <tr><td style="padding:0 4px 14px;font-size:15px;font-weight:700;color:${BRAND_SOLID};">Fieldy</td></tr>
        <tr><td style="background:${SURFACE};border:1px solid ${BORDER};border-radius:18px;padding:24px;">
          <div style="font-size:20px;font-weight:700;line-height:1.3;margin:0 0 6px;">
            ${escapeHtml(n.venueName)} replied
          </div>
          <div style="font-size:15px;color:${MUTED};line-height:1.5;margin:0 0 18px;">
            ${escapeHtml(n.authorName)} · ${escapeHtml(n.programName)}${when}
          </div>
          ${
            n.preview
              ? `<div style="background:${BG};border-radius:14px;padding:16px 18px;font-size:15px;line-height:1.6;color:${TEXT};margin:0 0 22px;">${escapeHtml(n.preview)}</div>`
              : `<div style="font-size:15px;color:${MUTED};margin:0 0 22px;">They sent no message text.</div>`
          }
          <a href="${escapeAttr(n.tripUrl)}"
             style="display:inline-block;background:${BRAND_SOLID};color:#FFFFFF;text-decoration:none;font-size:16px;font-weight:700;padding:14px 22px;border-radius:12px;">
            Open the trip
          </a>
          <div style="font-size:13px;color:${FAINT};line-height:1.5;margin:22px 0 0;">
            You can't reply to this email — open the trip to answer.
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

/*
  Plan §5.4a: "Someone typing a real answer into that reply and getting silence
  is the one failure mode worth spending fifteen lines to prevent."

  No trip link here, only the app. We do not resolve a trip for mail to the
  no-reply address — that is the whole point of not storing it — so we have no
  honest way to know which trip they meant.
*/
export function autoResponseSubject(): string {
  return 'Fieldy does not read replies to this address'
}

export function autoResponseText(siteUrl: string): string {
  return [
    "Fieldy doesn't read replies to this address.",
    '',
    `Open your trip to answer the venue: ${siteUrl}/trips`,
    '',
    'Your message was not delivered to anyone and has not been stored.',
  ].join('\n')
}

export function autoResponseHtml(siteUrl: string): string {
  return `<!doctype html>
<html><body style="margin:0;padding:24px 16px;background:${BG};font-family:${FONT};color:${TEXT};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;">
        <tr><td style="background:${SURFACE};border:1px solid ${BORDER};border-radius:18px;padding:24px;">
          <div style="font-size:17px;font-weight:700;margin:0 0 10px;">Fieldy doesn't read replies to this address.</div>
          <div style="font-size:15px;color:${MUTED};line-height:1.6;margin:0 0 20px;">
            Your message was not delivered to anyone and has not been stored.
            Open your trip to answer the venue.
          </div>
          <a href="${escapeAttr(siteUrl)}/trips"
             style="display:inline-block;background:${BRAND_SOLID};color:#FFFFFF;text-decoration:none;font-size:16px;font-weight:700;padding:14px 22px;border-radius:12px;">
            Open your trips
          </a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

/* A venue's message goes into this HTML. Escaping it is not optional. */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function escapeAttr(s: string): string {
  return escapeHtml(s).replace(/'/g, '&#39;')
}

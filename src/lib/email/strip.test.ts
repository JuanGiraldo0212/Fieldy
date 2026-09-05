import { describe, expect, it } from 'vitest'
import { bodyFromParts, htmlToText, stripReply } from './strip'

/*
  Plan M4: "strip.ts with tests against five real-world reply samples (Gmail,
  Outlook, Apple Mail, a Zendesk style ticket, a plain text client)."

  The five samples below are the shapes those clients actually produce, written
  around the kind of answer a Victoria venue sends: a couple of lines, a date,
  and a signature block with a phone number in it.

  Every sample asserts two things — that the answer survives whole, and that
  the quoted history is gone. The first assertion is the one that matters. A
  test suite that only checked for removal would pass happily on a function
  that returned the empty string.
*/

describe('stripReply — the five clients', () => {
  it('Gmail: cuts at the "On … wrote:" attribution', () => {
    const raw = [
      'Hi Sarah,',
      '',
      'Tuesday October 14 works for us. We can take the group at 9:30am.',
      '',
      'Best,',
      'Jen',
      '',
      'On Mon, Sep 22, 2026 at 9:14 AM Sarah Chen (Sunnyside Daycare) via Fieldy <',
      'trip-k4m2p8x1qr@mail.fieldy.ca> wrote:',
      '',
      '> Hello,',
      '>',
      '> We are hoping to bring 18 children to your guided tour.',
      '>',
    ].join('\n')

    const { body } = stripReply(raw)
    expect(body).toBe(
      'Hi Sarah,\n\nTuesday October 14 works for us. We can take the group at 9:30am.\n\nBest,\nJen',
    )
    expect(body).not.toContain('18 children')
  })

  it('Outlook: cuts at the underscore rule above the header block', () => {
    const raw = [
      'Good morning,',
      '',
      'Unfortunately we are fully booked that week. We could offer October 21.',
      '',
      'Kind regards,',
      'Margaret Doyle',
      'Education Coordinator | Royal BC Museum',
      '250-555-0134',
      '',
      '________________________________',
      'From: Sarah Chen (Sunnyside Daycare) via Fieldy <trip-k4m2p8x1qr@mail.fieldy.ca>',
      'Sent: Monday, September 22, 2026 9:14 AM',
      'To: Bookings <bookings@royalbcmuseum.bc.ca>',
      'Subject: Group visit request: Sunnyside Daycare, 18 children ages 3 to 5',
      '',
      'Hello,',
      '',
      'We are hoping to bring 18 children.',
    ].join('\n')

    const { body, trimmed } = stripReply(raw)
    expect(body).toContain('We could offer October 21.')
    expect(body).toContain('250-555-0134')
    expect(body).not.toContain('Subject: Group visit request')
    expect(trimmed).toBe(true)
  })

  it('Outlook: cuts at a bare From/Sent/To/Subject block with no separator', () => {
    const raw = [
      'Yes, we have you down for the 14th.',
      '',
      'From: Sarah Chen via Fieldy <trip-k4m2p8x1qr@mail.fieldy.ca>',
      'Sent: 22 September 2026 09:14',
      'To: Bookings',
      'Subject: Group visit request',
      '',
      'Hello,',
    ].join('\n')

    expect(stripReply(raw).body).toBe('Yes, we have you down for the 14th.')
  })

  it('Apple Mail: cuts at the "On <date>, at <time>, … wrote:" line', () => {
    const raw = [
      'That date is free — happy to hold it for you.',
      '',
      'Sent from my iPhone',
      '',
      'On 22 Sep 2026, at 09:14, Sarah Chen (Sunnyside Daycare) via Fieldy <trip-k4m2p8x1qr@mail.fieldy.ca> wrote:',
      '',
      '﻿',
      'Hello,',
      '',
      'We are hoping to bring 18 children to your farm tour.',
    ].join('\n')

    const { body } = stripReply(raw)
    expect(body).toBe('That date is free — happy to hold it for you.')
    expect(body).not.toContain('Sent from my iPhone')
    expect(body).not.toContain('farm tour')
  })

  it('Zendesk: keeps only what is above the reply-above-this-line marker', () => {
    const raw = [
      '##- Please type your reply above this line -##',
      '',
      'Your request (#48213) has been updated.',
      '',
      'Margaret Doyle replied:',
      'We can accommodate the group on the 14th.',
    ].join('\n')

    /*
      The marker is the first line, so everything is cut and the safety net
      returns the original. That is the right outcome: a ticket system that
      puts its whole reply below its own marker has defeated the heuristic,
      and showing the lot beats showing nothing.
    */
    const { body } = stripReply(raw)
    expect(body).toContain('We can accommodate the group on the 14th.')
  })

  it('Zendesk: cuts the ticket footer below a real reply', () => {
    const raw = [
      'We can accommodate the group on the 14th.',
      '',
      '##- Please type your reply above this line -##',
      '',
      'Ticket #48213 · Royal BC Museum Support',
      'This email is a service from Royal BC Museum.',
    ].join('\n')

    const { body } = stripReply(raw)
    expect(body).toBe('We can accommodate the group on the 14th.')
    expect(body).not.toContain('Ticket #48213')
  })

  it('plain text client: cuts a bare > quoted block', () => {
    const raw = [
      'Hi,',
      '',
      'We are able to take 18 children. $6 each, payable on the day.',
      '',
      '> We are hoping to bring 18 children to your guided tour on one of',
      '> the following dates.',
      '>',
      '> Sarah Chen',
    ].join('\n')

    const { body } = stripReply(raw)
    expect(body).toBe('Hi,\n\nWe are able to take 18 children. $6 each, payable on the day.')
  })
})

describe('stripReply — what it must not do', () => {
  it('keeps a message that quotes a single line mid-answer', () => {
    /* One quoted line with prose after it is a venue answering a question by
       quoting it, not a client quoting a thread. */
    const raw = [
      'Two answers:',
      '',
      '> Is there somewhere we can use for lunch?',
      '',
      'Yes, the picnic shelter is yours for the hour.',
    ].join('\n')

    const { body } = stripReply(raw)
    expect(body).toContain('picnic shelter')
    expect(body).toContain('Is there somewhere we can use for lunch?')
  })

  it('keeps a sentence that merely starts with "On"', () => {
    const raw = 'On Tuesday we could host you, but Wednesday is better for us.'
    expect(stripReply(raw).body).toBe(raw)
  })

  it('keeps a lone "From:" line that is not a header block', () => {
    const raw = 'From: our education team — yes, October 14 is fine.'
    expect(stripReply(raw).body).toBe(raw)
  })

  it('never returns empty: a message that is only a signature survives', () => {
    const raw = ['--', 'Margaret Doyle', 'Royal BC Museum'].join('\n')
    expect(stripReply(raw).body).toContain('Margaret Doyle')
  })

  it('never returns empty: a reply typed entirely below the quote', () => {
    const raw = [
      'On Mon, Sep 22, 2026 at 9:14 AM Sarah Chen wrote:',
      '',
      '> Are you free on the 14th?',
      '',
      'Yes we are.',
    ].join('\n')

    /* The answer is below the attribution, which the heuristic cannot know.
       The safety net hands back the whole thing rather than an empty bubble. */
    const { body, trimmed } = stripReply(raw)
    expect(body).toContain('Yes we are.')
    expect(trimmed).toBe(false)
  })

  it('reports trimmed = false when there was nothing to cut', () => {
    const { body, trimmed } = stripReply('Yes, that works. See you then.')
    expect(body).toBe('Yes, that works. See you then.')
    expect(trimmed).toBe(false)
  })

  it('normalises CRLF, which every mail transport uses', () => {
    const { body } = stripReply('Line one.\r\n\r\nLine two.\r\n')
    expect(body).toBe('Line one.\n\nLine two.')
  })
})

describe('htmlToText', () => {
  it('turns block markup into newlines and decodes entities', () => {
    const html =
      '<div>Hi Sarah,</div><div><br></div><div>Tuesday works &mdash; $6 &amp; up.</div>'
    expect(htmlToText(html)).toBe('Hi Sarah,\n\nTuesday works — $6 & up.')
  })

  it('drops script and style rather than printing them', () => {
    const html = '<style>p{color:red}</style><p>Yes, the 14th.</p>'
    expect(htmlToText(html)).toBe('Yes, the 14th.')
  })

  it('marks list items so a list of dates stays readable', () => {
    expect(htmlToText('<ul><li>Oct 16</li><li>Oct 21</li></ul>')).toBe(
      '• Oct 16\n• Oct 21',
    )
  })
})

describe('bodyFromParts', () => {
  it('prefers the text part, because it is what the sender typed', () => {
    const { body, bodyFull } = bodyFromParts({
      text: 'Yes, the 14th.\n\n> Are you free?',
      html: '<p>Something else entirely</p>',
    })
    expect(body).toBe('Yes, the 14th.')
    expect(bodyFull).toContain('> Are you free?')
  })

  it('falls back to HTML when there is no text part', () => {
    const { body } = bodyFromParts({
      text: null,
      html: '<p>Yes, the 14th.</p><p>Margaret</p>',
    })
    expect(body).toBe('Yes, the 14th.\nMargaret')
  })

  it('survives a message with no readable part at all', () => {
    expect(bodyFromParts({ text: null, html: null })).toEqual({
      body: '',
      bodyFull: '',
    })
  })
})

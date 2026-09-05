/*
  Two rate limits sit behind the login form and they want different advice.

  Per address: too many links to one inbox. On the built-in email provider
  that ceiling is two an hour for the whole project, so "wait a minute" is
  wrong — the wait is long, and the way out is a different address.

  Per client: too many requests from one IP, which clears in a few minutes.

  Both arrive as a 429 that reads like a server fault. We branch on the error
  code, and fall back to the message text for the older shapes that carry no
  code. When the server names a wait, we repeat it rather than guessing.
*/
export function sendError(err: { message: string; code?: string }): string {
  const seconds = err.message.match(/after (\d+) seconds?/)?.[1]
  if (seconds) {
    return `That link was just sent. Try again in ${seconds} seconds.`
  }

  if (err.code === 'over_email_send_rate_limit' || /email rate/i.test(err.message)) {
    return 'Too many links have gone to that address. Try again later, or use a different one.'
  }

  if (err.code === 'over_request_rate_limit' || /rate|limit/i.test(err.message)) {
    return 'Too many tries from here. Wait a few minutes and try again.'
  }

  return 'We could not send that. Check the address and try again.'
}

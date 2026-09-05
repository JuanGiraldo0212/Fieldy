import { test as base, type Page } from '@playwright/test'

/*
  A signed-in page, when the environment can provide one.

  `E2E_COOKIE` is the `name=value` half of what `pnpm dev:login <email>`
  prints. It is a real Supabase session for a real account, minted with the
  service key; nothing in the app is bypassed. Specs that need it call
  `signedIn(test)` and are skipped, with the reason, when it is absent.
*/
export const COOKIE = process.env.E2E_COOKIE ?? ''

export function hasSession(): boolean {
  return COOKIE.includes('=')
}

export async function applySession(page: Page, baseURL: string): Promise<void> {
  const eq = COOKIE.indexOf('=')
  const name = COOKIE.slice(0, eq)
  const value = COOKIE.slice(eq + 1)
  const url = new URL(baseURL)
  await page.context().addCookies([
    { name, value, domain: url.hostname, path: '/', httpOnly: false, secure: false },
  ])
}

export const test = base.extend<{ signedIn: Page }>({
  signedIn: async ({ page, baseURL }, use) => {
    base.skip(!hasSession(), 'E2E_COOKIE is not set: run `pnpm dev:login <email>` and export the cookie')
    await applySession(page, baseURL ?? 'http://localhost:3000')
    await use(page)
  },
})

export { expect } from '@playwright/test'

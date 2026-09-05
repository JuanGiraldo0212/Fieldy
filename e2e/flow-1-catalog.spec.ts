import { expect, test } from '@playwright/test'

/*
  Plan §9 flow 1, the anonymous half: open the catalog, narrow it to one to
  three year olds walking, watch it reorder, open a program, tap Plan and be
  asked to sign in.

  The second half — completing a magic link, creating a centre and a room,
  landing back on the plan screen — needs an inbox to intercept the link
  from. It is not automated here; docs/build-order.md says so.
*/
test('anonymous visitor narrows the catalog and is asked to sign in to plan', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

  const before = await page.locator('a[href^="/outing/"]').count()
  expect(before).toBeGreaterThan(3)

  /* Walking only, from the URL — the controls write exactly this. */
  await page.goto('/?ages=1&to=walking')
  await expect(page).toHaveURL(/to=walking/)
  const after = await page.locator('a[href^="/outing/"]').count()
  expect(after).toBeGreaterThan(0)
  expect(after).toBeLessThanOrEqual(before)

  /* Open the first card. */
  await page.locator('a[href^="/outing/"]').first().click()
  await expect(page).toHaveURL(/\/outing\//)
  await expect(page.getByRole('link', { name: /plan this trip/i })).toBeVisible()

  /* Plan asks for a session, and remembers where she was going. */
  await page.getByRole('link', { name: /plan this trip/i }).click()
  await expect(page).toHaveURL(/\/login\?next=%2Fplan%2F/)
  await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible()
})

test('the catalog renders without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('/')
  expect(await page.locator('a[href^="/outing/"]').count()).toBeGreaterThan(0)
  await context.close()
})

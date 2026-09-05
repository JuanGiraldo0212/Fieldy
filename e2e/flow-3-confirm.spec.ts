import { expect, test } from './auth'

/*
  Plan §9 flow 3: a venue reply confirming the first date arrives, the
  banner appears with its evidence, Mark confirmed sets the status, writes
  a system message, moves the dates, and My trips shows the trip under
  Upcoming with no waiting pill.

  The reply itself comes from `pnpm seed:demo`, which writes a trip in
  exactly this state ("They answered" with an unaccepted confirmation), so
  the spec needs no mail and no fixture server. Needs E2E_COOKIE.
*/
test('a confirmation becomes a confirmed trip in one tap', async ({ signedIn: page }) => {
  /* Needs action holds every trip the venue answered last, read or not. */
  await page.goto('/trips?tab=needs')
  const row = page.locator('a[href^="/trips/"]').first()
  test.skip((await row.count()) === 0, 'no trip awaiting a reply: run `pnpm seed:demo <email>`')
  await row.click()

  await expect(page.getByText(/looks like the venue confirmed/i)).toBeVisible()
  await expect(page.getByText(/^“.+”$/)).toBeVisible()

  await page.getByRole('button', { name: 'Mark confirmed' }).click()

  await expect(page.getByText(/looks like the venue confirmed/i)).toHaveCount(0)
  await expect(page.getByText(/status set to confirmed/i)).toBeVisible()
  await expect(page.getByText('set by you')).toBeVisible()
  await expect(page.getByRole('heading', { name: /^trip date$/i })).toBeVisible()

  await page.goto('/trips?tab=upcoming')
  await expect(page.locator('a[href^="/trips/"]').first()).toBeVisible()
  await expect(page.getByText(/waiting on venue/i)).toHaveCount(0)
})

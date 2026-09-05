import { expect, test } from './auth'

/*
  Plan §9 flow 2: a signed-in director plans a trip with two date options and
  two asks, sends it, and sees the trip page with status Asked, the send
  request task done, and the request card at the top of the thread.

  Needs E2E_COOKIE (see auth.ts). With no RESEND_API_KEY the request is
  written rather than delivered, and the page says so — the assertions here
  hold either way.
*/
test('plan a request and land on the trip page', async ({ signedIn: page }) => {
  await page.goto('/plan/beacon-hill-childrens-farm/weekly-animal-talks')
  await expect(page.getByRole('heading', { name: /plan your request/i })).toBeVisible()

  const dates = page.locator('input[type="date"]')
  await dates.nth(0).fill('2026-11-18')
  await expect(page.locator('input[type="date"]')).toHaveCount(2)
  await page.locator('input[type="date"]').nth(1).fill('2026-11-20')

  /* Two asks beyond the pre-selected gaps: toggle Washrooms on if it is off. */
  const washrooms = page.getByRole('button', { name: /washrooms/i })
  if ((await washrooms.getAttribute('aria-pressed')) === 'false') await washrooms.click()

  await page.getByRole('button', { name: /send request|save request/i }).click()

  await expect(page).toHaveURL(/\/trips\/[0-9A-Z]{26}$/)
  await expect(page.getByRole('heading', { name: /weekly animal talks/i })).toBeVisible()
  await expect(page.getByText('Asked', { exact: true }).first()).toBeVisible()
  await expect(page.getByText(/request (sent|written)/i)).toBeVisible()
  await expect(page.getByText(/1st choice/i).first()).toBeVisible()
  /* send_request is created done: the checklist shows it ticked. */
  await expect(page.getByText(/send request to beacon hill/i)).toBeVisible()
})

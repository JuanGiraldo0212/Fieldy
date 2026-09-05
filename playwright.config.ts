import { defineConfig, devices } from '@playwright/test'

/*
  The three end-to-end flows of plan §9, at the design's own 390px.

  They run against a dev server on a database seeded the way
  docs/build-order.md slice 8 describes. Two of the three need a session,
  and a session means Supabase: `pnpm dev:login <email>` prints the cookie,
  and `E2E_COOKIE` carries it in (see e2e/auth.ts). Without it those specs
  skip rather than fail, so `pnpm e2e` on a clean checkout is green on the
  anonymous half and honest about the rest.
*/
export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:3000',
    trace: 'retain-on-failure',
    ...devices['Pixel 7'],
    viewport: { width: 390, height: 844 },
  },
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: 'pnpm dev',
        url: 'http://localhost:3000',
        reuseExistingServer: true,
        timeout: 120_000,
      },
})

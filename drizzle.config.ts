import { defineConfig } from 'drizzle-kit'

/*
  Migrations run against the DIRECT connection (port 5432), not the pooler.
  drizzle-kit needs session-level features that pgbouncer's transaction mode
  does not provide. The running app uses DATABASE_POOL_URL.
*/
export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
  casing: 'snake_case',
  verbose: true,
  strict: true,
})

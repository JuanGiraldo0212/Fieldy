import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

/*
  The app uses the POOLED connection (pgbouncer, port 6543). Migrations use the
  direct one — see drizzle.config.ts.

  `prepare: false` is required: pgbouncer in transaction mode does not support
  prepared statements.
*/
const connectionString =
  process.env.DATABASE_POOL_URL ?? process.env.DATABASE_URL!

const client = postgres(connectionString, { prepare: false })

export const db = drizzle(client, { schema })
export * from './schema'

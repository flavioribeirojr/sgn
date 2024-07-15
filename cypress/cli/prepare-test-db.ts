import { config } from 'dotenv'
import path from 'path'
config({ path: path.join(__dirname, '..', '..', '.env.test') })

import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from '../../db/schema'
import postgres from 'postgres'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { sql } from 'drizzle-orm'

(async () => {
  const migrationClient = postgres(process.env.DATABASE_URL as string, { max: 1 })
  const db = drizzle(migrationClient, { schema })

  await migrate(db, { migrationsFolder: path.join(__dirname, '..', '..', 'db', 'drizzle') })
  await db.execute(sql`SELECT 1`)

  await migrationClient.end()
})()
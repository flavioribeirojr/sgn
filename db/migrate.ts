import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import path from 'path'
import * as schema from './schema'

(async () => {
  const migrationClient = postgres(process.env.DATABASE_CONNECTION_URL as string, { max: 1 })
  const db = drizzle(migrationClient, { logger: true, schema })
  await migrate(db, { migrationsFolder: path.join(__dirname, 'drizzle') })
  await migrationClient.end()
})()
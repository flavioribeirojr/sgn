import { PostgreSqlContainer } from '@testcontainers/postgresql'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import * as schema from '../db/schema'
import { sql } from 'drizzle-orm'
import path from 'path'

export async function setupTestDB() {
  const POSTGRES_USER = 'test'
  const POSTGRES_PASSWORD = 'test'
  const POSTGRES_DB = 'test'

  const container = await new PostgreSqlContainer()
    .withEnvironment({
      POSTGRES_USER,
      POSTGRES_PASSWORD,
      POSTGRES_DB
    })
    .withExposedPorts(5432)
    .start()

  const DATABASE_URL = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${container.getHost()}:${container.getFirstMappedPort()}/${POSTGRES_DB}`
  process.env.DATABASE_URL = DATABASE_URL

  const migrationClient = postgres(DATABASE_URL, { max: 1 })
  const db = drizzle(migrationClient, { schema })
  await migrate(db, { migrationsFolder: path.join(__dirname, '..', 'db', 'drizzle') })
  await db.execute(sql`SELECT 1`)

  await migrationClient.end()

  return container
}
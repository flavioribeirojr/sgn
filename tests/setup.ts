import { StartedPostgreSqlContainer } from '@testcontainers/postgresql'
import { setupTestDB } from './db-setup'
import { setupRedis } from './redis-setup'
import { StartedRedisContainer } from '@testcontainers/redis'

declare global {
  var databaseContainer: StartedPostgreSqlContainer
  var redisContainer: StartedRedisContainer
}

process.env.MAIL_HOST = 'host'
process.env.MAIL_PORT = '0'

export default async function setup() {
  const dbContainer = await setupTestDB()
  const redisContainer = await setupRedis()

  globalThis.databaseContainer = dbContainer
  globalThis.redisContainer = redisContainer
}
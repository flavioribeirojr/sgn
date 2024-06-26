import { StartedPostgreSqlContainer } from '@testcontainers/postgresql'
import { StartedRedisContainer } from '@testcontainers/redis'

declare global {
  var databaseContainer: StartedPostgreSqlContainer
  var redisContainer: StartedRedisContainer
}

export default async function teardown() {
  if (globalThis.databaseContainer) {
    await globalThis.databaseContainer.stop()
  }

  if (globalThis.redisContainer) {
    await globalThis.redisContainer.stop()
  }
}
import { RedisContainer } from '@testcontainers/redis'

export async function setupRedis() {
  const container = await new RedisContainer().start()

  process.env.REDIS_CONNECTION_URL = `redis://${container.getHost()}:${container.getFirstMappedPort()}`

  return container
}
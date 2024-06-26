import { env } from '../config/env'
import { createClient } from 'redis'

let redisClient: ReturnType<typeof createClient>

export async function getRedisClient() {
  if (redisClient) {
    return redisClient
  }

  redisClient = await createClient({
    url: env.REDIS_CONNECTION_URL,
  })
  .connect()

  return redisClient
}
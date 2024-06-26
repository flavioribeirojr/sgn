import { EventBus } from '@/server/events/bus'
import { UserEmailVerificationCreated } from '@/server/events/schema'
import { getRedisClient } from 'cache/redis-client'
import { randomInt } from 'crypto'
import { db } from 'db/index'
import { userCredentials } from 'db/schema'
import { sql } from 'drizzle-orm'

async function create(email: string) {
  const redisClient = await getRedisClient()
  const existentVerification = await redisClient.get(`email_verification_${email}`)

  if (existentVerification) {
    throw new UserEmailInUse
  }

  const credentialsUsingEmail = await db()
    .select()
    .from(userCredentials)
    .where(sql`${userCredentials.credentials}->>'email' = ${email}`)

  if (credentialsUsingEmail.length) {
    throw new UserEmailInUse
  }

  const code = randomInt(1000, 9999)
  const expirationTimeInSeconds = 60 * 10
  await redisClient.set(`email_verification_${email}`, code, {
    EX: expirationTimeInSeconds
  })

  EventBus.fire(UserEmailVerificationCreated({
    email,
    code
  }))
}

export const UserEmailVerificationCreator = {
  create
}

export class UserEmailInUse extends Error {}
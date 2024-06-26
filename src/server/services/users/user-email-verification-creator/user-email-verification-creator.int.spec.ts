import { faker } from '@faker-js/faker'
import { UserEmailInUse, UserEmailVerificationCreator } from './user-email-verification-creator'
import { getRedisClient } from 'cache/redis-client'
import { db } from 'db/index'
import { userCredentials, users } from 'db/schema'
import { sql } from 'drizzle-orm'
import { expect } from '@jest/globals'

describe('UserEmailVerificationCreator', () => {
  let emailVerificationKeys: string[] = []

  beforeEach(async () => {
    if (emailVerificationKeys.length) {
      const redisClient = await getRedisClient()
      await redisClient.del(emailVerificationKeys)

      emailVerificationKeys = []
    }

    await db().delete(userCredentials)
    await db().delete(users)
  })

  it('integration with email must work without errors', async () => {
    const email = faker.internet.email()
    emailVerificationKeys.push(`email_verification_${email}`)

    await expect(UserEmailVerificationCreator.create(email)).resolves.not.toThrow()
  })

  it('should throw error if email is already being used', async () => {
    const [ user ] = await db().insert(users).values({
      name: faker.person.firstName(),
      dateOfBirth: faker.date.birthdate().toISOString()
    }).returning()

    const email = faker.internet.email()
    emailVerificationKeys.push(`email_verification_${email}`)
    await db().insert(userCredentials).values({
      userId: user.id,
      credentials: sql`${{
        type: 'EMAIL_PASSWORD',
        email,
        password: 'fake_password'
      }}::jsonb`
    })

    await expect(UserEmailVerificationCreator.create(email)).rejects.toThrow(UserEmailInUse)
  })

  afterAll(async () => {
    (await getRedisClient()).disconnect()
  })
})
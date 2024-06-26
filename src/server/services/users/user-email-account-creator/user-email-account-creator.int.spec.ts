import { faker } from '@faker-js/faker'
import { EmailNotAvailable, InvalidVerificationCode, UserEmailAccountCreator } from './user-email-account-creator'
import { getRedisClient } from 'cache/redis-client'
import { db } from 'db/index'
import { userCredentials, users } from 'db/schema'
import { sql } from 'drizzle-orm'
import { randomInt } from 'crypto'
import { afterAll, expect } from '@jest/globals'

describe('UserEmailAccountCreator', () => {
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

  it('must throw InvalidVerificationCode when provided verification code does not exist', async () => {
    const email = faker.internet.email()
    const promiseToError = UserEmailAccountCreator.create({
      name: faker.person.fullName(),
      dateOfBirth: faker.date.birthdate().toISOString(),
      email,
      password: faker.internet.password(),
      verificationCode: '123'
    })

    emailVerificationKeys.push(`email_verification_${email}`)
    await expect(promiseToError).rejects.toThrow(InvalidVerificationCode)
  })

  it('must throw EmailNotAvailable when the given email is already being used', async () => {
    const [ user ] = await db().insert(users).values({
      name: faker.person.firstName(),
      dateOfBirth: faker.date.birthdate().toISOString()
    }).returning()

    const email = faker.internet.email()
    await db().insert(userCredentials).values({
      userId: user.id,
      credentials: sql`${{
        type: 'EMAIL_PASSWORD',
        email,
        password: 'fake_password'
      }}::jsonb`
    })

    const redisClient = await getRedisClient()

    const code = randomInt(1000, 9999)
    await redisClient.set(`email_verification_${email}`, code)

    const promiseToError = UserEmailAccountCreator.create({
      name: faker.person.fullName(),
      dateOfBirth: faker.date.birthdate().toISOString(),
      email,
      password: faker.internet.password(),
      verificationCode: code.toString(),
    })

    emailVerificationKeys.push(`email_verification_${email}`)
    await expect(promiseToError).rejects.toThrow(EmailNotAvailable)
  })

  it('must create the user in the database with the given credentials', async () => {
    const redisClient = await getRedisClient()

    const code = randomInt(1000, 9999)
    const email = faker.internet.email()
    await redisClient.set(`email_verification_${email}`, code)

    const user = await UserEmailAccountCreator.create({
      name: faker.person.fullName(),
      dateOfBirth: faker.date.birthdate().toISOString(),
      email,
      password: faker.internet.password(),
      verificationCode: code.toString(),
    })

    const userQueryResult = await db()
      .query
      .users
      .findFirst({
        where: (users, { eq }) => eq(users.id, user.id)
      })

    expect(userQueryResult).toBeDefined()
  })

  afterAll(async () => {
    (await getRedisClient()).disconnect()
  })
})
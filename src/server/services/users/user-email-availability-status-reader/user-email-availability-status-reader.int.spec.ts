import { db } from 'db/index'
import { userCredentials, users } from 'db/schema'
import { UserEmailAvailabilityStatusReader } from './user-email-availability-status-reader'
import { sql } from 'drizzle-orm'
import { faker } from '@faker-js/faker'
import { expect } from '@jest/globals'

describe('UserEmailAvailabilityStatusReader', () => {
  beforeEach(async () => {
    await db().delete(userCredentials)
    await db().delete(users)
  })

  test('should return in-use when the database return an user with the provided email', async () => {
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

    const emailAvailabilityStatus = await UserEmailAvailabilityStatusReader.read(email)
    expect(emailAvailabilityStatus).toBe('in-use')
  })

  test('should return available when there is no userCredential with given email', async () => {
    const email = faker.internet.email()

    const emailAvailabilityStatus = await UserEmailAvailabilityStatusReader.read(email)
    expect(emailAvailabilityStatus).toBe('available')
  })
})
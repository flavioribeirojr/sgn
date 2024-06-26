import { getRedisClient } from 'cache/redis-client'
import { db } from 'db/index'
import { userCredentials, users } from 'db/schema'
import { sql } from 'drizzle-orm'
import argon2 from 'argon2'

async function create(input: Input) {
  const redisClient = await getRedisClient()
  const emailVerificationKey = `email_verification_${input.email}`
  const emailCode = await redisClient.get(emailVerificationKey)

  if (!emailCode || emailCode !== input.verificationCode) {
    throw new InvalidVerificationCode(input.verificationCode)
  }

  const existentEmailCredentials = await db()
    .query
    .userCredentials
    .findFirst({
      where: sql`${userCredentials.credentials}->>'email' = ${input.email}`
    })

  if (existentEmailCredentials) {
    throw new EmailNotAvailable
  }

  const [ userCreated ] = await db()
    .insert(users)
    .values({
      name: input.name,
      dateOfBirth: input.dateOfBirth,
    })
    .returning()

   await db()
    .insert(userCredentials)
    .values({
      userId: userCreated.id,
      credentials: sql`${{
        type: 'EMAIL_PASSWORD',
        email: input.email,
        password: await argon2.hash(input.password),
      }}`
    })

  await redisClient.del(emailVerificationKey)

  return userCreated
}

interface Input {
  name: string
  dateOfBirth: string
  email: string
  password: string
  verificationCode: string
}

export class InvalidVerificationCode extends Error {
  constructor(public codeProvided: string) {
    super()
  }
}

export class EmailNotAvailable extends Error {}

export const UserEmailAccountCreator = {
  create
}
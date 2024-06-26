import { db } from 'db/index'
import { userCredentials } from 'db/schema'
import { sql } from 'drizzle-orm'

async function read(email: string) {
  const userCredentialsResult = await db()
    .select()
    .from(userCredentials)
    .where(sql`${userCredentials.credentials}->>'email' = ${email}`)

  if (userCredentialsResult.length) {
    return 'in-use'
  }

  return 'available'
}

export const UserEmailAvailabilityStatusReader = {
  read
}
import { db } from 'db/index'
import { users } from 'db/schema'

async function create(input: {
  name: string;
  email: string;
  dateOfBirth: string;
  authUserId: string;
}) {
  const [ createdUser ] = await db()
    .insert(users)
    .values({
      name: input.name,
      email: input.email,
      dateOfBirth: input.dateOfBirth,
      authUserId: input.authUserId,
    })
    .returning()

  return createdUser
}

export const UserAccountCreator = {
  create
}
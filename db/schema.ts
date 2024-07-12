import { sql } from 'drizzle-orm'
import { pgTable, varchar, uuid, date } from 'drizzle-orm/pg-core'

const generatedPrimaryUUID = () => uuid('id').primaryKey().default(sql`gen_random_uuid()`)

export const users = pgTable('users', {
  id: generatedPrimaryUUID(),
  name: varchar('name', { length: 70 }),
  email: varchar('email'),
  dateOfBirth: date('date_of_birth'),
  authUserId: varchar('auth_user_id', { length: 32 })
})
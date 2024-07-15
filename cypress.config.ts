import { config } from 'dotenv'
config({ path: './.env.test' })

import { defineConfig } from 'cypress'
import { db } from './db'
import { users } from './db/schema'
import { clerkSetup } from '@clerk/testing/cypress'
import { clerkClient } from '@clerk/nextjs/server'

export default defineConfig({
  projectId: '3mupk2',
  e2e: {
    baseUrl: 'http://localhost:3000',
    async setupNodeEvents(on, config) {
      on('task', {
        'clean_db': async () => {
          await db().delete(users)

          return null
        },
        'delete_clerk_user_by_email': async (email: string) => {
          const { data } = await clerkClient.users.getUserList({ emailAddress: [email] })
          await clerkClient.users.deleteUser(data[0].id)

          return null
        }
      })

      return clerkSetup({ config })
    }
  },
  env: {
    TEST_ACCOUNT_USER: process.env.TEST_ACCOUNT_USER,
    TEST_ACCOUNT_PASSWORD: process.env.TEST_ACCOUNT_PASSWORD,
  },
})

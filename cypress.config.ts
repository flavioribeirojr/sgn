import { config } from 'dotenv'
config({ path: './.env.test' })

import { defineConfig } from 'cypress'
import { db } from './db'
import { users } from './db/schema'
import { clerkSetup } from '@clerk/testing/cypress'

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
      })

      return clerkSetup({ config })
    }
  },
})

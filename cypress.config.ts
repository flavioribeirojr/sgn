import { config } from 'dotenv'
config({ path: './.env.test' })

import { defineConfig } from 'cypress'
import { db } from './db'
import { users } from './db/schema'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    async setupNodeEvents(on) {
      on('task', {
        'clean_db': async () => {
          await db().delete(users)

          return null
        },
      })
    }
  },
})

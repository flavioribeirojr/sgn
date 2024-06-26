import { config } from 'dotenv'
config({ path: './.env.test' })

import { defineConfig } from 'cypress'
import { createClient } from 'redis'
import { db } from './db'
import { userCredentials, users } from './db/schema'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    async setupNodeEvents(on) {
      const redisClient = await createClient({
        url: process.env.REDIS_CONNECTION_URL,
      })
      .connect()

      on('task', {
        'clean_db_and_redis': async () => {
          await db().delete(userCredentials)
          await db().delete(users)

          await redisClient.flushDb()

          return null
        },
        'get_email_verification_code': async (email: string) => {
          const code = await redisClient.get(`email_verification_${email}`)
          console.log({ code })

          return code
        }
      })
    }
  },
})

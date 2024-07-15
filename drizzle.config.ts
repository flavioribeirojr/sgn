import { config } from 'dotenv'
import path from 'path'

config({ path: path.join(__dirname, '.env.local') })

import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './db/schema.ts',
  out: './db/drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_CONNECTION_URL as string,
  }
})
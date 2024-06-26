import { defineConfig } from 'drizzle-kit'
import { env } from 'config/env'

export default defineConfig({
  schema: './schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_CONNECTION_URL,
  }
})
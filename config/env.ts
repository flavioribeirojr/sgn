import { z } from 'zod'

const schema = z.object({
  DATABASE_CONNECTION_URL: z.string().url(),
  REDIS_CONNECTION_URL: z.string().url(),
  MAIL_FROM: z.string().email(),
  POSTMARK_SERVER_TOKEN: z.string(),
})

export const env = schema.parse(process.env)
import { z } from 'zod'

const schema = z.object({
  DATABASE_CONNECTION_URL: z.string().url(),
  REDIS_CONNECTION_URL: z.string().url(),
  MAIL_HOST: z.string(),
  MAIL_PORT: z.number({ coerce: true }),
  MAIL_SECURE: z.boolean({ coerce: true }).default(false).optional(),
  MAIL_USER: z.string().optional(),
  MAIL_PASS: z.string().optional(),
  REGISTER_EVENTS: z.enum(['1', '0']).optional().default('1')
})

export const env = schema.parse(process.env)
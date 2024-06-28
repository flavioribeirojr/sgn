import { env } from 'config/env'
import { createTransport } from 'nodemailer'

export const mailClient = createTransport({
  host: env.MAIL_HOST,
  port: env.MAIL_PORT,
  secure: env.MAIL_SECURE,
  from: env.MAIL_FROM,
  ...env.MAIL_SECURE && {
    auth: {
      user: env.MAIL_USER,
      pass: env.MAIL_PASS,
    },
  },
})
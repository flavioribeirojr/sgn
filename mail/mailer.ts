import { env } from 'config/env'
import * as postmark from 'postmark'

const client = new postmark.ServerClient(env.POSTMARK_SERVER_TOKEN)

async function send(input: {
  to: string;
  subject: string;
  htmlBody?: string;
}) {
  await client.sendEmail({
    Subject: input.subject,
    To: input.to,
    HtmlBody: input.htmlBody,
    From: env.MAIL_FROM,
  })
}

export const Mailer = {
  send
}
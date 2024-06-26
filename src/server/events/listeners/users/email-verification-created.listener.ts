import { UserEmailVerificationCreated } from '../../schema'
import { mailClient } from 'mail/mail-client'

async function handle(payload: ReturnType<typeof UserEmailVerificationCreated>['payload']) {
  await mailClient.sendMail({
    to: payload.email,
    subject: 'Verify your email',
    html: `
      <div style="text-align: center">
        <h2>Use the code below to confirm your identity</h2>
        <p>${payload.code}</p>
      </div>
    `
  })
}

export const EmailVerificationCreatedListener = {
  handle
}
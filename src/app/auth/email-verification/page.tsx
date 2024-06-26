import { AppConfig } from 'config/app'
import { Metadata } from 'next'
import { EmailVerification } from './EmailVerification'

export const metadata: Metadata = {
  title: `${AppConfig.name} / Create your account`,
}

export default function EmailVerificationPage() {
  return (
    <EmailVerification />
  )
}
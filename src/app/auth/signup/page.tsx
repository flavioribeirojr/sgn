import { AppConfig } from 'config/app'
import type { Metadata } from 'next'
import { Signup } from './Signup'

export const metadata: Metadata = {
  title: `${AppConfig.name} / Create your account`,
}

export default function SignupPage() {
  return <Signup />
}
import { AppConfig } from 'config/app'
import type { Metadata } from 'next'
import { Signin } from './Signin'

export const metadata: Metadata = {
  title: `${AppConfig.name} / Sign in`,
}

export default function SigninPage() {
  return (
    <Signin />
  )
}
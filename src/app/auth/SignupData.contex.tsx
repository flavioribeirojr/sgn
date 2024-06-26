'use client'

import { AppRouterInputs } from '@/server'
import { createContext, useState } from 'react'

export type SignupDataValue = Omit<AppRouterInputs['users']['emailSignup'], 'verificationCode'>

const defaultValue = {
  setValue: (_: SignupDataValue | undefined) => void 0,
  value: undefined as SignupDataValue | undefined,
}

export const SignupDataContext = createContext(defaultValue)

export function SignupDataProvider({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  const [ signupContextValue, setSignupContextValue ] = useState<SignupDataValue | undefined>(undefined)

  return (
    <SignupDataContext.Provider value={{ value: signupContextValue, setValue: value => {setSignupContextValue(value)} }}>
      { children }
    </SignupDataContext.Provider>
  )
}
'use client'

import { FormTextInput } from '@/components/form-text-input/form-text-input'
import { SubmitButton } from '@/components/submit-button/submit-button'
import { IBM_Plex_Serif } from 'next/font/google'
import { useForm } from 'react-hook-form'
import type { AppRouterInputs } from '@/server'
import { useCallback, useState } from 'react'
import { FormErrorMessage } from '@/components/form-error-message/form-error-message'
import { LoadingSpinner } from '@/components/loading-spinner/loading-spinner'
import { useSignUp } from '@clerk/nextjs'
import { ClerkAPIError } from '@clerk/types'
import { EmailVerification } from './EmailVerification'
import { isClerkAPIResponseError } from '@clerk/nextjs/errors'
import { FormField } from '@/components/form-field/FormField'
import Link from 'next/link'

const ibmPlexSerif = IBM_Plex_Serif({ weight: '600', subsets: ['latin'] })
type SignupForm = AppRouterInputs['users']['createUser'] & {
  password: string;
}

export function Signup() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const [ isLoading, setIsLoading ] = useState(false)
  const [ isVerifying, setIsVerifying ] = useState(false)
  const [ createUserInput, setCreateUserInput ] = useState<AppRouterInputs['users']['createUser'] | null>(null)
  const [ clerkErrors, setClerkErrors ] = useState<ClerkAPIError[]>([])
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    mode: 'onBlur',
  })

  const handleVerificationExpired = useCallback(function() {
    if (!isLoaded) {
      return
    }

    setIsVerifying(false)
    signUp.reload()
  }, [isLoaded, signUp, setIsVerifying])

  async function submit(values: SignupForm) {
    if (!isLoaded) {
      return
    }

    setClerkErrors([])
    setIsLoading(true)

    try {
      await signUp.create({
        emailAddress: values.email,
        password: values.password,
      })

      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      })

      setCreateUserInput(values)
      setIsVerifying(true)
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setClerkErrors(err.errors)
      }
      console.log(JSON.stringify(err, null, 2))
    } finally {
      setIsLoading(false)
    }
  }

  if (isVerifying && signUp && createUserInput) {
    return (
      <EmailVerification
        signUp={signUp}
        setActive={setActive}
        isLoaded={isLoaded}
        values={createUserInput}
        onVerificationExpired={handleVerificationExpired}
      />
    )
  }

  return (
    <div className='w-full md:w-2/6 2xl:w-1/5 py-8 px-8 rounded-md bg-white'>
      <h2 className={`${ibmPlexSerif.className} text-center text-2.5xl`}>create your profile</h2>
      <p className='text-center py-3'>
        complete this simple step to start your new learning journey
      </p>
      <form onSubmit={e => {
        e.preventDefault()
        handleSubmit(submit)(e)
      }}>
        <FormField label='Name' className='mb-4'>
          <FormTextInput
            placeholder="what's your name?"
            type='text'
            {...register('name', { required: { value: true, message: 'Please tell us your name' } })}
          />
          { errors.name &&
            <FormErrorMessage>
              { errors.name.message }
            </FormErrorMessage>
          }
        </FormField>
        <FormField label='Date of Birth' className='mb-4'>
          <FormTextInput
            placeholder='when were you born?'
            type='date'
            {...register('dateOfBirth', { required: { value: true, message: 'Please inform your date of birth' } })}
          />
          { errors.dateOfBirth &&
            <FormErrorMessage>
              { errors.dateOfBirth.message }
            </FormErrorMessage>
          }
        </FormField>
        <FormField label='Email Address' className='mb-4'>
          <FormTextInput
            placeholder='your best email'
            type='email'
            {...register('email', {
              required: { value: true, message: 'Please provide an email address' },
              pattern: {
                value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: 'Please provide a valid email'
              }
            })}
          />
          { errors.email &&
            <FormErrorMessage>
              { errors.email.message }
            </FormErrorMessage>
          }
        </FormField>
        <FormField label='Password' className='mb-4'>
          <FormTextInput
            placeholder='set a password'
            type='password'
            {...register('password', { required: { value: true, message: 'Please provide a password' } })}
          />
          { errors.password &&
            <FormErrorMessage>
              { errors.password.message }
            </FormErrorMessage>
          }
        </FormField>

        { clerkErrors.length > 0 && (
          <div className='mt-7'>
            { clerkErrors.map(err => (
              <FormErrorMessage key={err.code} className='last:mt-3 child first:pb-2 font-semibold text-xs'>
                { getClerkErrorMessage(err) }
              </FormErrorMessage>
            )) }
          </div>
        )}
        <SubmitButton className='mt-7' type='submit'>
          { isLoading ?
            <LoadingSpinner /> :
            'create my account'
          }
        </SubmitButton>
      </form>

      <hr className='mt-7 mb-5' />

      <Link href='/auth/signin' className='text-center block'>
        Sign in to my account
      </Link>
    </div>
  )
}

function getClerkErrorMessage(err: ClerkAPIError) {
  switch (err.code) {
  case 'form_identifier_exists':
    return 'The provided email is already being used'
  case 'form_password_pwned':
    return 'This password is compromised. Please use another one.'
  default:
    return err.longMessage
  }
}
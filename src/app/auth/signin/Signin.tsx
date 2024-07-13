'use client'

import { FormErrorMessage } from '@/components/form-error-message/form-error-message'
import { FormTextInput } from '@/components/form-text-input/form-text-input'
import { LoadingSpinner } from '@/components/loading-spinner/loading-spinner'
import { SubmitButton } from '@/components/submit-button/submit-button'
import { useSignIn } from '@clerk/nextjs'
import { isClerkAPIResponseError } from '@clerk/nextjs/errors'
import { ClerkAPIError } from '@clerk/types'
import { IBM_Plex_Serif } from 'next/font/google'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

const ibmPlexSerif = IBM_Plex_Serif({ weight: '600', subsets: ['latin'] })

export function Signin() {
  const [ isLoading, setIsLoading ] = useState(false)
  const { isLoaded, setActive, signIn } = useSignIn()
  const [ clerkErrors, setClerkErrors ] = useState<ClerkAPIError[]>([])
  const router = useRouter()
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SigninForm>({
    mode: 'onBlur'
  })

  async function submit(values: SigninForm) {
    console.log('vai', isLoaded)
    if (!isLoaded) {
      return
    }

    setIsLoading(true)

    try {
      const signinAttempt = await signIn.create({
        strategy: 'password',
        identifier: values.email,
        password: values.password,
      })

      if (signinAttempt.status === 'complete') {
        await setActive({ session: signinAttempt.createdSessionId })
        router.push('/')
        return
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setClerkErrors(err.errors)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='w-full md:w-2/6 2xl:w-1/5 py-8 px-8 rounded-md bg-white'>
      <h2 className={`${ibmPlexSerif.className} text-center text-2.5xl mb-3 leading-8`}>sign-in to your account</h2>
      <form onSubmit={e => {
        e.preventDefault()
        handleSubmit(submit)(e)
      }}>
        <div className='mb-4'>
          <FormTextInput
            placeholder='your email address'
            type='email'
            {...register('email', {
              required: { value: true, message: 'Please provide an email address' },
              pattern: {
                value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: 'Must be a valid email address'
              }
            })}
          />
          { errors.email && (
            <FormErrorMessage>
              { errors.email.message }
            </FormErrorMessage>
          )}
        </div>
        <div className='mb-4'>
          <FormTextInput
            type='password'
            placeholder='******'
            {...register('password', {
              required: { value: true, message: 'Please provide a password' }
            })}
          />
          { errors.password && (
            <FormErrorMessage>
              { errors.password.message }
            </FormErrorMessage>
          )}
        </div>
        { clerkErrors.length > 0 && (
          <div className='mt-7'>
            { clerkErrors.map(err => (
              <FormErrorMessage key={err.code} className='last:mt-3 child first:pb-2 font-semibold text-xs'>
                { getClerkErrorMessage(err) }
              </FormErrorMessage>
            )) }
          </div>
        )}
        <SubmitButton className='mt-7 mb-3' type='submit'>
          { isLoading ?
            <LoadingSpinner /> :
            'create my account'
          }
        </SubmitButton>
      </form>
    </div>
  )
}

type SigninForm = {
  email: string;
  password: string;
}

function getClerkErrorMessage(err: ClerkAPIError) {
  switch (err.code) {
  case 'form_password_incorrect':
    return 'Incorrect password. Please try again.'
  default:
    return err.longMessage
  }
}
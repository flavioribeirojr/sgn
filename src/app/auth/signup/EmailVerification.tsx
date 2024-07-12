'use client'

import { FormTextInput } from '@/components/form-text-input/form-text-input'
import { SubmitButton } from '@/components/submit-button/submit-button'
import { IBM_Plex_Serif } from 'next/font/google'
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FormErrorMessage } from '@/components/form-error-message/form-error-message'
import { LoadingSpinner } from '@/components/loading-spinner/loading-spinner'
import { useRouter } from 'next/navigation'
import { useSignUp } from '@clerk/nextjs'
import { ClerkAPIError } from '@clerk/types'
import { trpc } from '@/client'
import type { AppRouterInputs } from '@/server'
import { isClerkAPIResponseError } from '@clerk/nextjs/errors'

const ibmPlexSerif = IBM_Plex_Serif({ weight: '600', subsets: ['latin'] })

export function EmailVerification(props: {
  onVerificationExpired: () => void,
  values: AppRouterInputs['users']['createUser']
} & ReturnType<typeof useSignUp>) {
  const router = useRouter()
  const createUserMutation = trpc.users.createUser.useMutation()
  const [ isLoading, setIsLoading ] = useState(false)
  const [ clerkErrors, setClerkErrors ] = useState<ClerkAPIError[]>([])
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<{ verificationCode: string }>({ mode: 'onBlur' })

  const submitCallback = useCallback(async function(values: { verificationCode: string }) {
    if (!props.isLoaded) {
      return
    }

    setClerkErrors([])
    setIsLoading(true)

    try {
      const completeSignUp = await props.signUp.attemptEmailAddressVerification({
        code: values.verificationCode,
      })

      if (completeSignUp.status === 'complete') {
        await props.setActive({
          session: completeSignUp.createdSessionId
        })

        await createUserMutation.mutateAsync(props.values)

        alert('Thanks for creating an account')
        router.push('/')
        return
      }

      // handle verification_expired
      console.error(JSON.stringify(completeSignUp, null, 2))
      props.onVerificationExpired()
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setClerkErrors(err.errors)
      }
      console.error(JSON.stringify(err, null, 2))
    } finally {
      setIsLoading(false)
    }
  }, [props, router, setIsLoading, createUserMutation])

  return (
    <div className='w-full md:w-3/6 2xl:w-1/5 py-8 px-8 rounded-md bg-white'>
      <h2 className={`${ibmPlexSerif.className} text-center text-2.5xl`}>verify your email</h2>
      <p className='text-center py-3 text-sm'>
        please enter the code you received on your inbox below to verify your email
      </p>
      <form onSubmit={handleSubmit(submitCallback)}>
        <FormTextInput
          {...register('verificationCode', { required: { message: 'Please provide the verification code', value: true } })}
          type='text'
          placeholder='6 digit code'
          inputMode='numeric'
          className='mt-6'
        />
        { errors.verificationCode &&
          <FormErrorMessage>
            { errors.verificationCode.message }
          </FormErrorMessage>
        }
        { clerkErrors.length > 0 && (
          <div className='mt-4'>
            { clerkErrors.map(err => (
              <FormErrorMessage key={err.code} className='last:mt-3 child first:pb-2 font-semibold text-xs'>
                { err.code === 'form_code_incorrect' && 'Incorrect code provided' }
                { err.code === 'verification_expired' && 'Code expired. Please start again.' }
              </FormErrorMessage>
            )) }
          </div>
        )}
        <SubmitButton className='mt-7 mb-3' type='submit'>
          { isLoading ?
            <LoadingSpinner /> :
            'confirm'
          }
        </SubmitButton>
      </form>
    </div>
  )
}
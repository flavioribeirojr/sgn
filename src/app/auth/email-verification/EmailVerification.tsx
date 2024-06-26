'use client'

import { FormTextInput } from '@/components/form-text-input/form-text-input'
import { SubmitButton } from '@/components/submit-button/submit-button'
import { IBM_Plex_Serif } from 'next/font/google'
import { useCallback, useContext, useEffect } from 'react'
import { SignupDataContext } from '../SignupData.contex'
import { useForm } from 'react-hook-form'
import { FormErrorMessage } from '@/components/form-error-message/form-error-message'
import { trpc } from '@/client'
import { LoadingSpinner } from '@/components/loading-spinner/loading-spinner'
import { useRouter } from 'next/navigation'

const ibmPlexSerif = IBM_Plex_Serif({ weight: '600', subsets: ['latin'] })

export function EmailVerification() {
  const { mutate, ...signupMutation } = trpc.users.emailSignup.useMutation()
  const signupDataContext = useContext(SignupDataContext)
  const router = useRouter()
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<{ verificationCode: string }>({ mode: 'onBlur' })

  const signupMutationCallback = useCallback((data: { verificationCode: string}) => {
    if (!signupDataContext.value) {
      return
    }

    mutate({
      ...signupDataContext.value,
      verificationCode: data.verificationCode,
    })
  }, [mutate, signupDataContext.value])

  useEffect(() => {
    if (!signupMutation.isSuccess) {
      return
    }

    alert('Thanks for creating an account')

    router.push('/')
    signupMutation.reset()
  }, [signupMutation, router])

  return (
    <div className='w-full md:w-3/6 2xl:w-1/5 py-8 px-8 rounded-md bg-white'>
      <h2 className={`${ibmPlexSerif.className} text-center text-2.5xl`}>verify your email</h2>
      <p className='text-center py-3 text-sm'>
        please enter the code you received on your inbox below to verify your email
      </p>
      <form onSubmit={handleSubmit(signupMutationCallback)}>
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
        {
          signupMutation.error &&
          <FormErrorMessage className='text-center mt-3'>
            { signupMutation.error.data?.code === 'FORBIDDEN' && 'Invalid verification code. Please try again' }
            { signupMutation.error.data?.code === 'INTERNAL_SERVER_ERROR' && 'Invalid verification code. Please try again' }
          </FormErrorMessage>
        }
        <SubmitButton className='mt-7 mb-3' type='submit'>
          { signupMutation.isPending ?
            <LoadingSpinner /> :
            'confirm'
          }
        </SubmitButton>
      </form>
    </div>
  )
}
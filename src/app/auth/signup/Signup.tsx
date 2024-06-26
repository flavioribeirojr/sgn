'use client'

import { FormTextInput } from '@/components/form-text-input/form-text-input'
import { SubmitButton } from '@/components/submit-button/submit-button'
import { IBM_Plex_Serif } from 'next/font/google'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import type { AppRouterInputs } from '@/server'
import { trpc } from '@/client'
import { useContext, useEffect } from 'react'
import { FormErrorMessage } from '@/components/form-error-message/form-error-message'
import { LoadingSpinner } from '@/components/loading-spinner/loading-spinner'
import { SignupDataContext } from '../SignupData.contex'
import { useRouter } from 'next/navigation'

const ibmPlexSerif = IBM_Plex_Serif({ weight: '600', subsets: ['latin'] })
type SignupForm = Omit<AppRouterInputs['users']['emailSignup'], 'verificationCode'>

export function Signup() {
  const { isSuccess, reset, ...emailVerificationCreateMutation } = trpc.users.emailVerificationCreate.useMutation()
  const signupDataContext = useContext(SignupDataContext)
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<SignupForm>({
    mode: 'onBlur',
  })

  useEffect(() => {
    if (!isSuccess) {
      return
    }

    const values = getValues()
    signupDataContext.setValue(values)

    router.push('/auth/email-verification')
    reset()
  }, [isSuccess, getValues, signupDataContext, router, reset])

  return (
    <>
      <div className='w-full md:w-3/6 2xl:w-1/5 py-8 px-8 rounded-md bg-white'>
        <h2 className={`${ibmPlexSerif.className} text-center text-2.5xl`}>create your profile</h2>
        <p className='text-center py-3'>
          complete this simple step to start your new learning journey
        </p>
        <form onSubmit={handleSubmit(data => { emailVerificationCreateMutation.mutate(data.email) })}>
          <div className='mb-4'>
            <FormTextInput
              placeholder="what's your name?"
              type='text'
              className='mt-6'
              {...register('name', { required: { value: true, message: 'Please tell us your name' } })}
            />
            { errors.name &&
              <FormErrorMessage>
                { errors.name.message }
              </FormErrorMessage>
            }
          </div>
          <div className='mb-4'>
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
          </div>
          <div className='mb-4'>
            <FormTextInput
              placeholder='email'
              type='your best email'
              {...register('email', {
                required: { value: true, message: 'Please provide an email address' },
                pattern: { value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, message: 'Please provide a valid email' }
              })}
            />
            { errors.email &&
              <FormErrorMessage>
                { errors.email.message }
              </FormErrorMessage>
            }
          </div>
          <div className='mb-4'>
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
          </div>

          { emailVerificationCreateMutation.error !== null &&
            <FormErrorMessage className='text-center mt-7'>
              { emailVerificationCreateMutation.error.data?.code === 'CONFLICT' &&
                'Email is already being used'
              }
              { emailVerificationCreateMutation.error.data?.code === 'INTERNAL_SERVER_ERROR' &&
                'Something went wrong. Please try again later.'
              }
            </FormErrorMessage>
          }
          <SubmitButton className='mt-7 mb-3' type='submit'>
            { emailVerificationCreateMutation.isPending ?
              <LoadingSpinner /> :
              'create my account'
            }
          </SubmitButton>
        </form>
      </div>
      <button
        className='bg-black justify-center flex items-center text-white py-3 px-8 font-medium mt-6 lg:w-2/6 2xl:w-1/6'
        style={{ fontFamily: 'arial' }}
      >
        <Image
          src='/gh.png'
          alt='github octocat'
          width={30}
          height={30}
          className='mr-4'
        />
        Sign in with Github
      </button>
    </>
  )
}
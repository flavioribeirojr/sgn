import { TRPCError, type inferRouterInputs, type inferRouterOutputs } from '@trpc/server'
import { z } from 'zod'
import { publicProcedure, router } from './trpc'
import { EmailNotAvailable, InvalidVerificationCode, UserEmailAccountCreator } from './services/users/user-email-account-creator/user-email-account-creator'
import { UserEmailAvailabilityStatusReader } from './services/users/user-email-availability-status-reader/user-email-availability-status-reader'
import { UserEmailInUse, UserEmailVerificationCreator } from './services/users/user-email-verification-creator/user-email-verification-creator'

export const appRouter = router({
  users: {
    emailSignup: publicProcedure
      .input(z.object({
        name: z.string(),
        dateOfBirth: z.string().date(),
        email: z.string().email(),
        password: z.string(),
        verificationCode: z.string()
      }))
      .mutation(async opts => {
        try {
          const user = await UserEmailAccountCreator.create(opts.input)

          return {
            id: user.id,
            name: user.name,
            dateOfBirth: user.dateOfBirth,
          }
        } catch (err) {
          switch (true) {
            case err instanceof InvalidVerificationCode:
              throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'The provided verification code is invalid',
                cause: err,
              })

            case err instanceof EmailNotAvailable:
              throw new TRPCError({
                code: 'CONFLICT',
                message: 'The email is already being used',
                cause: err,
              })
          }

          throw err
        }
      }),
    emailAvailability: publicProcedure
      .input(z.string().email())
      .query(async opts => {
        const availability = await UserEmailAvailabilityStatusReader.read(opts.input)

        return availability
      }),
    emailVerificationCreate: publicProcedure
      .input(z.string().email())
      .mutation(async opts => {
        try {
          await UserEmailVerificationCreator.create(opts.input)
        } catch (err) {
          if (err instanceof UserEmailInUse) {
            throw new TRPCError({
              code: 'CONFLICT',
              message: 'The email is already being used',
              cause: err,
            })
          }

          throw err
        }
      })
  }
})

export type AppRouter = typeof appRouter
export type AppRouterInputs = inferRouterInputs<AppRouter>
export type AppRouterOutputs = inferRouterOutputs<AppRouter>
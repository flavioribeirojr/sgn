import { z } from 'zod'
import { protectedProcedure } from '../trpc'
import { UserAccountCreator } from '../services/users/user-account-creator/user-account-creator'

export const UserProcedures = {
  createUser: protectedProcedure
    .input(z.object({
      name: z.string(),
      email: z.string().email(),
      dateOfBirth: z.string().date(),
    }))
    .mutation(async opts => {
      const { input, ctx } = opts

      const user = await UserAccountCreator.create({
        ...input,
        authUserId: ctx.auth.userId,
      })

      return user
    }),
}
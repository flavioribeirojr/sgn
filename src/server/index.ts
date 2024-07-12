import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server'
import { router } from './trpc'
import { UserProcedures } from './procedures/user.procedures'

export const appRouter = router({
  users: UserProcedures,
})

export type AppRouter = typeof appRouter
export type AppRouterInputs = inferRouterInputs<AppRouter>
export type AppRouterOutputs = inferRouterOutputs<AppRouter>
import { TRPCError, initTRPC } from '@trpc/server'
import { Context } from './context'

const t = initTRPC.context<Context>().create({
  errorFormatter: opts => {
    const { shape, error } = opts
    console.log(error.cause)

    return shape
  }
})

const isAuthed = t.middleware(opts => {
  const { ctx, next } = opts

  if (!ctx.auth.userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED'
    })
  }

  return next({
    ctx: {
      auth: ctx.auth,
    }
  })
})

export const router = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(isAuthed)
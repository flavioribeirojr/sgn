import { initTRPC } from '@trpc/server'

const t = initTRPC.create({
  errorFormatter: opts => {
    const { shape, error } = opts
    console.log(error.cause)

    return shape
  }
})

export const router = t.router
export const publicProcedure = t.procedure
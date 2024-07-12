import { getAuth } from '@clerk/nextjs/server'
import * as trpcNext from '@trpc/server/adapters/next'

export const createContext = async (opts: trpcNext.CreateNextContextOptions) => ({
  auth: getAuth(opts.req)
})

export type Context = Awaited<ReturnType<typeof createContext>>
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '@/server'
import { getAuth } from '@clerk/nextjs/server'

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api',
    req,
    router: appRouter,
    createContext: async () => {
      return {
        // @ts-expect-error
        auth: getAuth(req)
      }
    },
  })

export { handler as GET, handler as POST }
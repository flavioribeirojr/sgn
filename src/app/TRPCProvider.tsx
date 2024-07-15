'use client'

import { trpc } from '@/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { useState } from 'react'

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [ queryClient ] = useState(() => new QueryClient())
  const [ trpcClient ] = useState(() => trpc.createClient({
    links: [
      httpBatchLink({
        url: `${getBaseUrl()}/api`
      })
    ]
  }))

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        { children }
      </QueryClientProvider>
    </trpc.Provider>
  )
}

function getBaseUrl() {
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL}`

  return ''
}
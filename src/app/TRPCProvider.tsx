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
        url: '/api'
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
"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { StacksProvider } from "./StacksProvider"

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 1000 * 60 * 30 } } })

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <StacksProvider>{children}</StacksProvider>
    </QueryClientProvider>
  )
}

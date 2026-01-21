"use client"

import { connect, disconnect, getLocalStorage, isConnected } from "@stacks/connect"
import { createContext, useContext, useState } from "react"

interface AddressEntry {
  address: string
  publicKey?: string
}

interface StacksLocalStorage {
  addresses: {
    stx: AddressEntry[]
    btc: AddressEntry[]
  }
}

interface StacksContextValue {
  userData: StacksLocalStorage | null
  stxAddress: string | null
  authenticate: () => Promise<void>
  signOut: () => void
  isAuthenticated: boolean
}

const StacksContext = createContext<StacksContextValue | undefined>(undefined)

export function StacksProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<StacksLocalStorage | null>(() => {
    if (typeof window === "undefined") return null
    return isConnected() ? (getLocalStorage() as StacksLocalStorage) : null
  })

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === "undefined") return false
    return isConnected()
  })

  const authenticate = async () => {
    await connect({ walletConnectProjectId: "YOUR_PROJECT_ID" })
    setUserData(getLocalStorage() as StacksLocalStorage)
    setIsAuthenticated(true)
  }

  const signOut = () => {
    disconnect()
    setUserData(null)
    setIsAuthenticated(false)
  }

  const stxAddress = userData?.addresses?.stx?.[0]?.address ?? null

  return <StacksContext.Provider value={{ userData, stxAddress, authenticate, signOut, isAuthenticated }}>{children}</StacksContext.Provider>
}

export function useStacks() {
  const context = useContext(StacksContext)
  if (!context) throw new Error("useStacks must be used within a StacksProvider")
  return context
}

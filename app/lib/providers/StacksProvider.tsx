"use client"

import { AppConfig, showConnect, UserSession } from "@stacks/connect"
import { createContext, useContext, useEffect, useState } from "react"
import { MINIAPP } from "../constants"

interface StacksContextValue {
  userSession: UserSession
  userData: any
  authenticate: () => void
  signOut: () => void
  isAuthenticated: boolean
}

const StacksContext = createContext<StacksContextValue | undefined>(undefined)

export function StacksProvider({ children }: { children: React.ReactNode }) {
  const [userSession] = useState(() => {
    const appConfig = new AppConfig(["store_write", "publish_data"])
    return new UserSession({ appConfig })
  })

  const [userData, setUserData] = useState<any>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        setUserData(userData)
        setIsAuthenticated(true)
      })
    } else if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData())
      setIsAuthenticated(true)
    }
  }, [userSession])

  const authenticate = () => {
    showConnect({
      appDetails: {
        name: MINIAPP.title,
        icon: window.location.origin + "/images/og/icon.png",
      },
      redirectTo: "/",
      onFinish: () => {
        setUserData(userSession.loadUserData())
        setIsAuthenticated(true)
      },
      userSession,
    })
  }

  const signOut = () => {
    userSession.signUserOut()
    setUserData(null)
    setIsAuthenticated(false)
  }

  return (
    <StacksContext.Provider value={{ userSession, userData, authenticate, signOut, isAuthenticated }}>
      {children}
    </StacksContext.Provider>
  )
}

export function useStacks() {
  const context = useContext(StacksContext)
  if (!context) {
    throw new Error("useStacks must be used within a StacksProvider")
  }
  return context
}

import sdk from "@farcaster/miniapp-sdk"
import clsx from "clsx"
import NextImage from "next/image"
import { useEffect } from "react"
import { NavLink } from "react-router"
import { base } from "viem/chains"
import { useConnect, useConnectors, useSwitchChain } from "wagmi"
import { store } from "../../lib/store"

const Header = () => {
  const { user } = store()

  const { mutate: connect } = useConnect()
  const connectors = useConnectors()
  const { mutate: switchChain } = useSwitchChain()
  const session = store.getState().session

  useEffect(() => {
    connect({ connector: connectors[0] })
    switchChain({ chainId: base.id })

    setTimeout(() => {
      connect({ connector: connectors[0] })
      switchChain({ chainId: base.id })
    }, 2000)
  }, [session])

  return (
    <header className={clsx("fixed top-5 inset-x-9", "flex justify-between items-center", "z-30")}>
      <div className={clsx("w-8 bg-white/10 glass", "border-2 border-(--bg-border) rounded-full")}>
        <NextImage className="rounded-full" src={"/images/og/icon.png"} alt="logo" width={32} height={32} priority />
      </div>

      <NavLink to="/home" onClick={() => sdk.haptics.impactOccurred("medium")}>
        <div className={clsx("relative flex items-center", "bg-white/10 glass rounded-2xl", "h-8", "pl-2 pr-[35px]")}>
          <div className="text-base text-(--heading) pb-px">{user ? user.displayName : "nickname"}</div>

          <div className={clsx("absolute right-0 top-0 aspect-square w-[30px]", "border-2 border-(--bg-border) rounded-full", "cursor-pointer")}>
            <NextImage src={user?.pfpUrl || "https://placekittens.com/32/32"} fill alt="pfp" className="rounded-full" priority />
          </div>
        </div>
      </NavLink>
    </header>
  )
}

export default Header

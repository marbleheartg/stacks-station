import { useStacks } from "@/lib/providers/StacksProvider"
import sdk from "@farcaster/miniapp-sdk"
import clsx from "clsx"
import NextImage from "next/image"
import { store } from "../../lib/store"

const Header = () => {
  const { authenticate, signOut, isAuthenticated, stxAddress } = useStacks()

  const user = store((state) => state.user)
  const session = store((state) => state.session)

  const handleAuth = () => {
    sdk.haptics.impactOccurred("medium")
    if (isAuthenticated) signOut()
    else authenticate()
  }

  return (
    <header className={clsx("fixed top-5 left-0 right-0 mx-auto w-full max-w-6xl px-5", "flex justify-between items-center", "z-30")}>
      <div className={clsx("w-8 bg-white/10 glass", "border-2 border-(--bg-border) rounded-full")}>
        <NextImage className="rounded-full" src={"/images/og/icon.png"} alt="logo" width={32} height={32} priority />
      </div>

      <div onClick={handleAuth} className="cursor-pointer">
        <div className={clsx("relative flex items-center", "bg-white/10 glass rounded-2xl", "h-8", "pl-2 pr-[35px]")}>
          <div className="text-base text-(--heading) pb-px">
            {isAuthenticated && stxAddress ? stxAddress.slice(0, 4) + "..." + stxAddress.slice(-4) : "connect"}
          </div>

          <div className={clsx("absolute right-0 top-0 aspect-square w-[30px]", "border-2 border-(--bg-border) rounded-full", "cursor-pointer")}>
            <NextImage
              src={user?.pfpUrl || "/images/og/icon.png"}
              fill
              alt="pfp"
              className="rounded-full"
              priority
              unoptimized={!user?.pfpUrl} // Use unoptimized for external or fallback
            />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

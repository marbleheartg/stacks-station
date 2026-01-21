import { useStacks } from "@/lib/providers/StacksProvider"
import { Button } from "./ui"

export default function StacksConnectButton() {
  const { authenticate, signOut, isAuthenticated, userData } = useStacks()

  if (isAuthenticated && userData) {
    const address = userData.profile?.stxAddress?.mainnet || userData.profile?.stxAddress?.testnet

    return (
      <div className="flex flex-col gap-2 items-center">
        <span className="text-xs text-(--text) truncate max-w-[200px]">
          Connected: {address}
        </span>
        <Button variant="secondary" size="sm" onClick={signOut}>
          Disconnect Stacks
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={authenticate}>
      Connect Stacks Wallet
    </Button>
  )
}

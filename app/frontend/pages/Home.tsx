import { useStacks } from "@/lib/providers/StacksProvider"
import { useQuery } from "@tanstack/react-query"
import clsx from "clsx"
import { Card, CardContent, CardHeader, CardTitle, Spinner } from "../components/ui"

interface StxData {
  balance: string
  total_sent: string
  total_received: string
  total_fees_sent: string
  total_miner_rewards_received: string
  locked: string
}

interface BalancesData {
  stx: StxData
  fungible_tokens: Record<string, { balance: string; total_sent: string; total_received: string }>
  non_fungible_tokens: Record<string, { count: string; total_sent: string; total_received: string }>
}

export default function Home() {
  const { stxAddress, isAuthenticated } = useStacks()

  const { data: balances, isLoading } = useQuery({
    queryKey: ["stx-balances", stxAddress],
    queryFn: async () => {
      const res = await fetch(`https://api.mainnet.hiro.so/extended/v1/address/${stxAddress}/balances`)
      return res.json() as Promise<BalancesData>
    },
    enabled: !!stxAddress,
  })

  const formatStx = (microStx: string | undefined) => {
    if (!microStx) return "0"
    const stx = Number(microStx) / 1_000_000
    return stx.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })
  }

  const fungibleTokens = balances?.fungible_tokens ? Object.entries(balances.fungible_tokens) : []
  const nftCount = balances?.non_fungible_tokens ? Object.values(balances.non_fungible_tokens).reduce((acc, t) => acc + Number(t.count), 0) : 0

  return (
    <main className={clsx("flex flex-col gap-5", "px-5 pt-20 pb-26", "overflow-y-scroll overflow-x-hidden")}>
      {/* STX Balance Card */}
      <Card>
        <CardHeader>
          <CardTitle>STX Balance</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {!isAuthenticated ?
            <p className="text-muted-foreground">Connect your wallet to view balance</p>
          : isLoading ?
            <Spinner size="sm" />
          : balances?.stx ?
            <p className="text-2xl font-semibold">{formatStx(balances.stx.balance)} STX</p>
          : <p className="text-muted-foreground">0 STX</p>}
        </CardContent>
      </Card>

      {/* Stacking (Locked) Card */}
      {isAuthenticated && balances?.stx?.locked && Number(balances.stx.locked) > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Stacked STX</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{formatStx(balances.stx.locked)} STX</p>
            <p className="text-sm text-muted-foreground">Currently locked in stacking</p>
          </CardContent>
        </Card>
      )}

      {/* Activity Card */}
      {isAuthenticated && balances?.stx && (
        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Received</span>
              <span className="font-medium">{formatStx(balances.stx.total_received)} STX</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Sent</span>
              <span className="font-medium">{formatStx(balances.stx.total_sent)} STX</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Fees</span>
              <span className="font-medium">{formatStx(balances.stx.total_fees_sent)} STX</span>
            </div>
            {Number(balances.stx.total_miner_rewards_received) > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Miner Rewards</span>
                <span className="font-medium">{formatStx(balances.stx.total_miner_rewards_received)} STX</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Fungible Tokens Card */}
      {isAuthenticated && fungibleTokens.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tokens ({fungibleTokens.length})</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {fungibleTokens.slice(0, 10).map(([tokenId, token]) => {
              const name = tokenId.split("::")[1] || tokenId
              return (
                <div key={tokenId} className="flex justify-between">
                  <span className="text-muted-foreground truncate max-w-[60%]">{name}</span>
                  <span className="font-medium">{Number(token.balance).toLocaleString()}</span>
                </div>
              )
            })}
            {fungibleTokens.length > 10 && <p className="text-sm text-muted-foreground">+{fungibleTokens.length - 10} more tokens</p>}
          </CardContent>
        </Card>
      )}

      {/* NFTs Card */}
      {isAuthenticated && nftCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>NFTs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{nftCount}</p>
            <p className="text-sm text-muted-foreground">Across {Object.keys(balances?.non_fungible_tokens || {}).length} collections</p>
          </CardContent>
        </Card>
      )}
    </main>
  )
}

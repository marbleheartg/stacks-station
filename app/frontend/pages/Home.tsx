import { useStacks } from "@/lib/providers/StacksProvider"
import { request } from "@stacks/connect"
import { ClarityType, hexToCV } from "@stacks/transactions"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import clsx from "clsx"
import { useState } from "react"
import { Button, Card, CardContent, CardHeader, CardTitle, Spinner } from "../components/ui"

const COUNTER_CONTRACT = "SPED77EEM0WYPMNKEWZX81V8NTVK5NEZ6CY09632.my-counter"

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
  const queryClient = useQueryClient()
  const [isIncrementing, setIsIncrementing] = useState(false)

  const { data: balances, isLoading } = useQuery({
    queryKey: ["stx-balances", stxAddress],
    queryFn: async () => {
      const res = await fetch(`https://api.hiro.so/extended/v1/address/${stxAddress}/balances`)
      return res.json() as Promise<BalancesData>
    },
    enabled: !!stxAddress,
  })

  const {
    data: counterValue,
    isLoading: isCounterLoading,
    refetch,
  } = useQuery({
    queryKey: ["counter-value", stxAddress],
    queryFn: async () => {
      const [contractAddress, contractName] = COUNTER_CONTRACT.split(".")

      const res = await fetch(`https://api.hiro.so/v2/contracts/call-read/${contractAddress}/${contractName}/get-count`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: stxAddress, arguments: [] }),
      })

      const data = await res.json()

      if (data.okay && data.result) {
        const cv = hexToCV(data.result)
        if (cv.type === ClarityType.Int || cv.type === ClarityType.UInt) return Number(cv.value)
      }
      return 0
    },
    enabled: !!stxAddress,
    refetchInterval: 5000,
  })

  const handleIncrement = async () => {
    if (!isAuthenticated) return
    setIsIncrementing(true)
    try {
      await request("stx_callContract", {
        contract: COUNTER_CONTRACT,
        functionName: "increment",
        functionArgs: [],
      })
      // Refetch counter after tx is submitted
      setTimeout(() => {
        refetch()
      }, 2000)
    } catch (error) {
      console.error("Failed to increment:", error)
    } finally {
      setIsIncrementing(false)
    }
  }

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

      {/* Counter Interaction Card */}
      <Card>
        <CardHeader>
          <CardTitle>Counter Contract</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Current Count</span>
            {!isAuthenticated ?
              <span className="text-muted-foreground">—</span>
            : isCounterLoading ?
              <Spinner size="xs" />
            : <span className="text-2xl font-semibold">{counterValue ?? 0}</span>}
          </div>
          <Button onClick={handleIncrement} disabled={!isAuthenticated || isIncrementing} className="w-full">
            {isIncrementing ?
              <Spinner size="xs" />
            : "Increment"}
          </Button>
          {!isAuthenticated && <p className="text-sm text-muted-foreground text-center">Connect wallet to interact</p>}
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

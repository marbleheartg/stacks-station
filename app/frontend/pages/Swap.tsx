import { useStacks } from "@/lib/providers/StacksProvider"
import { useStxBalances } from "@/lib/hooks/useStxQueries"
import { TOKEN_CONTRACTS, TOKEN_DECIMALS } from "@/lib/constants"
import clsx from "clsx"
import { useState } from "react"
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Select, Spinner } from "../components/ui"

const TOKENS = [
  { value: "STX", label: "STX", icon: null },
  { value: "ALEX", label: "ALEX", icon: null },
  { value: "USDA", label: "USDA", icon: null },
  { value: "xBTC", label: "xBTC", icon: null },
]

export default function Swap() {
  const { stxAddress, isAuthenticated } = useStacks()
  const { data: balances, isLoading: isBalancesLoading } = useStxBalances(stxAddress)

  const [fromToken, setFromToken] = useState("STX")
  const [toToken, setToToken] = useState("ALEX")
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [isSwapping, setIsSwapping] = useState(false)

  // Mock exchange rate
  const EXCHANGE_RATE = 1.5

  const getTokenBalance = (tokenSymbol: string) => {
    if (!balances) return "0.00"

    let balance = "0"
    if (tokenSymbol === "STX") {
      balance = balances.stx.balance
    } else {
      const contractId = TOKEN_CONTRACTS[tokenSymbol]
      if (contractId && balances.fungible_tokens[contractId]) {
        balance = balances.fungible_tokens[contractId].balance
      }
    }

    const decimals = TOKEN_DECIMALS[tokenSymbol] || 6
    const formatted = Number(balance) / Math.pow(10, decimals)

    return formatted.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    })
  }

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*\.?\d*$/.test(value)) {
      setFromAmount(value)
      if (value) {
        setToAmount((parseFloat(value) * EXCHANGE_RATE).toFixed(6))
      } else {
        setToAmount("")
      }
    }
  }

  const handleSwitch = () => {
    setFromToken(toToken)
    setToToken(fromToken)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  const handleSwap = async () => {
    if (!isAuthenticated) return
    setIsSwapping(true)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSwapping(false)
    setFromAmount("")
    setToAmount("")

    // In a real app, this would trigger a contract call
    // request("stx_callContract", { ... })
  }

  return (
    <main className={clsx("grid grid-cols-1 gap-5", "px-5 pt-24 pb-26 mx-auto max-w-lg w-full", "overflow-y-auto overflow-x-hidden")}>
      <Card>
        <CardHeader>
          <CardTitle>Swap Tokens</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {/* From Section */}
          <div className="flex flex-col gap-2 p-3 bg-secondary/10 rounded-xl border border-border/50">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-muted-foreground font-medium">You Pay</span>
              {isAuthenticated && (
                <span className="text-xs text-muted-foreground">
                  Balance: {isBalancesLoading ? <Spinner size="xs" className="inline ml-1" /> : getTokenBalance(fromToken)}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="0.0"
                className="flex-1 bg-transparent border-none text-2xl font-semibold p-0 h-auto focus:ring-0"
                value={fromAmount}
                onChange={handleFromAmountChange}
              />
              <div className="w-32 shrink-0">
                <Select options={TOKENS} value={fromToken} onChange={setFromToken} className="w-full" />
              </div>
            </div>
          </div>

          {/* Switcher */}
          <div className="flex justify-center -my-2 relative z-10">
            <button onClick={handleSwitch} className="bg-background border border-border rounded-full p-2 hover:bg-secondary/20 transition-colors">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 10l5 5 5-5" />
                <path d="M7 14l5-5 5 5" />
              </svg>
            </button>
          </div>

          {/* To Section */}
          <div className="flex flex-col gap-2 p-3 bg-secondary/10 rounded-xl border border-border/50">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-muted-foreground font-medium">You Receive</span>
              {isAuthenticated && (
                <span className="text-xs text-muted-foreground">
                  Balance: {isBalancesLoading ? <Spinner size="xs" className="inline ml-1" /> : getTokenBalance(toToken)}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="0.0"
                className="flex-1 bg-transparent border-none text-2xl font-semibold p-0 h-auto focus:ring-0"
                value={toAmount}
                readOnly
              />
              <div className="w-32 shrink-0">
                <Select options={TOKENS} value={toToken} onChange={setToToken} className="w-full" />
              </div>
            </div>
          </div>

          {/* Exchange Rate Info */}
          {fromAmount && (
            <div className="flex justify-between text-xs text-muted-foreground px-1">
              <span>Rate</span>
              <span>
                1 {fromToken} ≈ {EXCHANGE_RATE} {toToken}
              </span>
            </div>
          )}

          <Button size="lg" className="w-full mt-2 font-bold text-lg" onClick={handleSwap} disabled={!isAuthenticated || !fromAmount || isSwapping}>
            {!isAuthenticated ? <Spinner size="xs" className="hidden" /> : null}
            {!isAuthenticated ? "Connect Wallet" : isSwapping ? <Spinner /> : "Swap"}
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}

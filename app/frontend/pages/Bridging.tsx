import { useStacks } from "@/lib/providers/StacksProvider"
import { useQuery } from "@tanstack/react-query"
import clsx from "clsx"
import { Button, Card, CardContent, CardHeader, CardTitle, Spinner } from "../components/ui"

// Common USDC contract on Stacks (Simulated/Example)
// You should verify the exact contract principal for USDCx on mainnet
const USDC_CONTRACT = "SP3XD84X3PE79SHJAZCDM1CF5JWFUA65KLJQP2V0X.usdc-token"

const ExternalLinkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

export default function Bridging() {
  const { stxAddress, isAuthenticated } = useStacks()

  const { data: usdcBalance, isLoading } = useQuery({
    queryKey: ["usdc-balance", stxAddress],
    queryFn: async () => {
        if (!stxAddress) return "0"
        // Using Hiro API to fetch fungible token balances
        const res = await fetch(`https://api.hiro.so/extended/v1/address/${stxAddress}/balances`)
        const data = await res.json()
        const usdc = data.fungible_tokens?.[USDC_CONTRACT]
        if (usdc) {
             return (Number(usdc.balance) / 1_000_000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })
        }
        return "0"
    },
    enabled: !!stxAddress,
  })

  return (
    <main className={clsx("flex flex-col gap-5", "px-5 pt-20 pb-26", "overflow-y-scroll overflow-x-hidden")}>
      <Card>
        <CardHeader>
          <CardTitle>USDCx Bridge</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
            <p className="text-muted-foreground text-sm">
                Bridge your USDC from Ethereum and other chains to Stacks (USDCx) using the Cross-Chain Transfer Protocol (CCTP).
            </p>
            
            <div className="flex flex-col gap-2 p-3 bg-secondary/10 rounded-lg border border-border">
                <span className="text-xs text-muted-foreground font-medium uppercase">Your USDCx Balance</span>
                {!isAuthenticated ? (
                    <span className="text-muted-foreground">—</span>
                ) : isLoading ? (
                    <Spinner size="sm" />
                ) : (
                    <span className="text-2xl font-bold">{usdcBalance} USDC</span>
                )}
            </div>

            <div className="flex flex-col gap-3 mt-2">
                 <Button 
                    className="w-full gap-2" 
                    onClick={() => window.open("https://app.xlink.network/bridge", "_blank")}
                 >
                    Bridge via XLink <ExternalLinkIcon />
                 </Button>
                 
                 <Button 
                    variant="outline" 
                    className="w-full gap-2"
                    onClick={() => window.open("https://docs.stacks.co/more-guides/bridging-usdcx", "_blank")}
                 >
                    View Guide <ExternalLinkIcon />
                 </Button>
            </div>
        </CardContent>
      </Card>

      <Card>
          <CardHeader>
              <CardTitle>How it works</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
              <p>
                  1. <strong>Deposit</strong> USDC on the source chain (e.g., Ethereum).
              </p>
              <p>
                  2. <strong>Burn</strong> happens on the source chain via Circle's CCTP.
              </p>
              <p>
                  3. <strong>Mint</strong> happens on Stacks, delivering USDCx to your wallet.
              </p>
              <p className="mt-2 text-xs opacity-70">
                  Powered by Circle CCTP and Stacks ecosystem partners.
              </p>
          </CardContent>
      </Card>
    </main>
  )
}

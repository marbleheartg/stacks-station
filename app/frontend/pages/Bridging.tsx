import { BASE_TOKEN_MESSENGER_CONTRACT, BASE_USDC_CONTRACT, USDC_CONTRACT } from "@/lib/constants"
import { useStxBalances } from "@/lib/hooks/useStxQueries"
import { useStacks } from "@/lib/providers/StacksProvider"
import { c32addressDecode } from "c32check"
import clsx from "clsx"
import { useState } from "react"
import { pad, parseUnits } from "viem"
import { useAccount, useConnect, useSwitchChain, useWriteContract } from "wagmi"
import { base } from "wagmi/chains"
import { injected } from "wagmi/connectors"
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Spinner } from "../components/ui"

const ERC20_ABI = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const

const TOKEN_MESSENGER_ABI = [
  {
    name: "depositForBurn",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "amount", type: "uint256" },
      { name: "destinationDomain", type: "uint32" },
      { name: "mintRecipient", type: "bytes32" },
      { name: "burnToken", type: "address" },
    ],
    outputs: [{ name: "", type: "uint64" }],
  },
] as const

const ExternalLinkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

export default function Bridging() {
  const { stxAddress, isAuthenticated: isStacksAuthenticated } = useStacks()
  const { data: balances, isLoading: isStacksLoading } = useStxBalances(stxAddress)

  const { address: evmAddress, isConnected: isEvmConnected, chainId } = useAccount()
  const { connect } = useConnect()
  const { switchChain } = useSwitchChain()
  const { writeContractAsync } = useWriteContract()

  const [amount, setAmount] = useState("")
  const [isBridging, setIsBridging] = useState(false)
  const [status, setStatus] = useState("")

  const getUsdcBalance = () => {
    if (!balances?.fungible_tokens?.[USDC_CONTRACT]) return "0"
    const usdc = balances.fungible_tokens[USDC_CONTRACT]
    return (Number(usdc.balance) / 1_000_000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })
  }

  const usdcBalance = getUsdcBalance()

  const handleConnectEvm = () => {
    connect({ connector: injected() })
  }

  const handleBridge = async () => {
    if (!amount || isNaN(Number(amount))) return
    if (!stxAddress) return

    setIsBridging(true)
    setStatus("Initializing...")

    try {
      if (chainId !== base.id) {
        setStatus("Switching to Base...")
        await switchChain({ chainId: base.id })
      }

      const amountWei = parseUnits(amount, 6) // USDC has 6 decimals

      setStatus("Approving USDC...")
      const approveTx = await writeContractAsync({
        address: BASE_USDC_CONTRACT as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [BASE_TOKEN_MESSENGER_CONTRACT as `0x${string}`, amountWei],
      })

      setStatus("Waiting for Approval confirmation...")
      await new Promise((r) => setTimeout(r, 2000))

      setStatus("Bridging USDC...")

      const [version, hash160] = c32addressDecode(stxAddress)
      const addressHex = hash160.startsWith("0x") ? hash160 : `0x${hash160}`
      const mintRecipient = pad(addressHex as `0x${string}`, { size: 32 })

      const DESTINATION_DOMAIN = 0

      await writeContractAsync({
        address: BASE_TOKEN_MESSENGER_CONTRACT as `0x${string}`,
        abi: TOKEN_MESSENGER_ABI,
        functionName: "depositForBurn",
        args: [amountWei, DESTINATION_DOMAIN, mintRecipient, BASE_USDC_CONTRACT as `0x${string}`],
      })

      setStatus("Transaction Submitted!")
      setAmount("")
    } catch (e) {
      console.error(e)
      setStatus(`Error: ${(e as Error).message}`)
    } finally {
      setIsBridging(false)
      setTimeout(() => setStatus(""), 5000)
    }
  }

  return (
    <main className={clsx("grid grid-cols-1 md:grid-cols-2 gap-5", "px-5 pt-24 pb-26 mx-auto max-w-6xl w-full", "overflow-y-auto overflow-x-hidden")}>
      <Card>
        <CardHeader>
          <CardTitle>USDC Bridge (Base → Stacks)</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-muted-foreground text-sm">
            Bridge your USDC from Base to Stacks (USDCx) using the Cross-Chain Transfer Protocol (CCTP).
          </p>

          <div className="flex flex-col gap-2 p-3 bg-secondary/10 rounded-lg border border-border">
            <span className="text-xs text-muted-foreground font-medium uppercase">Your USDCx Balance</span>
            {!isStacksAuthenticated ?
              <span className="text-muted-foreground">—</span>
            : isStacksLoading ?
              <Spinner size="sm" />
            : <span className="text-2xl font-bold">{usdcBalance} USDC</span>}
          </div>

          <div className="flex flex-col gap-3 mt-2">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-muted-foreground">Amount to Bridge</label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={isBridging || !isEvmConnected}
                  className="pr-16"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">USDC</div>
              </div>
            </div>

            {!isEvmConnected ?
              <Button className="w-full" onClick={handleConnectEvm}>
                Connect EVM Wallet
              </Button>
            : <Button className="w-full gap-2" onClick={handleBridge} disabled={!isStacksAuthenticated || !amount || isBridging}>
                {isBridging ?
                  <>
                    <Spinner size="sm" /> {status}
                  </>
                : "Bridge USDC"}
              </Button>
            }

            {status && !isBridging && <p className="text-xs text-center text-muted-foreground">{status}</p>}

            <div className="flex gap-2 justify-center text-xs text-muted-foreground mt-2">
              <span className="opacity-70">Powered by Circle CCTP</span>
              <span>•</span>
              <a href="https://app.xlink.network/bridge" target="_blank" className="hover:text-primary flex items-center gap-1">
                XLink <ExternalLinkIcon />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How it works</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
          <p>
            1. <strong>Connect</strong> your EVM wallet (Base) and Stacks wallet.
          </p>
          <p>
            2. <strong>Deposit</strong> USDC on Base. This initiates a CCTP burn.
          </p>
          <p>
            3. <strong>Wait</strong> for the bridge to mint USDCx to your Stacks address.
          </p>
          <p className="mt-2 text-xs opacity-70">Note: Ensure you have ETH on Base for gas fees.</p>
        </CardContent>
      </Card>
    </main>
  )
}

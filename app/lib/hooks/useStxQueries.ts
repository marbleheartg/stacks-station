import { STACKS_API, COUNTER_CONTRACT } from "@/lib/constants"
import { useQuery } from "@tanstack/react-query"
import { ClarityType, hexToCV } from "@stacks/transactions"

export interface StxData {
  balance: string
  total_sent: string
  total_received: string
  total_fees_sent: string
  total_miner_rewards_received: string
  locked: string
}

export interface BalancesData {
  stx: StxData
  fungible_tokens: Record<string, { balance: string; total_sent: string; total_received: string }>
  non_fungible_tokens: Record<string, { count: string; total_sent: string; total_received: string }>
}

export function useStxBalances(address: string | null) {
  return useQuery({
    queryKey: ["stx-balances", address],
    queryFn: async () => {
      const res = await fetch(`${STACKS_API}/extended/v1/address/${address}/balances`)
      if (!res.ok) throw new Error("Failed to fetch balances")
      return res.json() as Promise<BalancesData>
    },
    enabled: !!address,
  })
}

export function useCounterValue(address: string | null) {
  return useQuery({
    queryKey: ["counter-value", address],
    queryFn: async () => {
      const [contractAddress, contractName] = COUNTER_CONTRACT.split(".")

      const res = await fetch(`${STACKS_API}/v2/contracts/call-read/${contractAddress}/${contractName}/get-count`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: address, arguments: [] }),
      })

      const data = await res.json()

      if (data.okay && data.result) {
        const cv = hexToCV(data.result)
        if (cv.type === ClarityType.Int || cv.type === ClarityType.UInt) return Number(cv.value)
      }
      return 0
    },
    enabled: !!address,
    refetchInterval: 5000,
  })
}

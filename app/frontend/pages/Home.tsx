import { useStacks } from "@/lib/providers/StacksProvider"
import clsx from "clsx"
import { useStxBalances } from "@/lib/hooks/useStxQueries"
import { BalanceCard } from "@/frontend/components/dashboard/BalanceCard"
import { CounterCard } from "@/frontend/components/dashboard/CounterCard"
import { StackedCard } from "@/frontend/components/dashboard/StackedCard"
import { ActivityCard } from "@/frontend/components/dashboard/ActivityCard"
import { TokensCard } from "@/frontend/components/dashboard/TokensCard"
import { NFTCard } from "@/frontend/components/dashboard/NFTCard"

export default function Home() {
  const { stxAddress, isAuthenticated } = useStacks()
  const { data: balances, isLoading } = useStxBalances(stxAddress)

  return (
    <main className={clsx("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5", "px-5 pt-24 pb-26 mx-auto max-w-6xl w-full", "overflow-y-auto overflow-x-hidden")}>
      <BalanceCard balances={balances} isLoading={isLoading} isAuthenticated={isAuthenticated} />
      
      <CounterCard />

      {isAuthenticated && balances && (
        <>
          <StackedCard balances={balances} />
          <ActivityCard balances={balances} />
          <TokensCard balances={balances} />
          <NFTCard balances={balances} />
        </>
      )}
    </main>
  )
}

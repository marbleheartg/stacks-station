import { Button, Card, CardContent, CardHeader, CardTitle, Spinner } from "@/frontend/components/ui"
import { COUNTER_CONTRACT } from "@/lib/constants"
import { useCounterValue } from "@/lib/hooks/useStxQueries"
import { useStacks } from "@/lib/providers/StacksProvider"
import { request } from "@stacks/connect"
import { useState } from "react"

export function CounterCard() {
  const { stxAddress, isAuthenticated } = useStacks()
  const { data: counterValue, isLoading: isCounterLoading, refetch } = useCounterValue(stxAddress)
  const [isIncrementing, setIsIncrementing] = useState(false)

  const handleIncrement = async () => {
    if (!isAuthenticated) return
    setIsIncrementing(true)
    try {
      await request("stx_callContract", {
        contract: COUNTER_CONTRACT,
        functionName: "increment",
        functionArgs: [],
      })
      setTimeout(() => {
        refetch()
      }, 2000)
    } catch (error) {
      console.error("Failed to increment:", error)
    } finally {
      setIsIncrementing(false)
    }
  }

  return (
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
  )
}

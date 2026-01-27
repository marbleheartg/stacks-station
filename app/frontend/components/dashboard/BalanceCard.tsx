import { Card, CardContent, CardHeader, CardTitle, Spinner } from "@/frontend/components/ui"
import { formatStx } from "@/lib/utils/format"
import { BalancesData } from "@/lib/hooks/useStxQueries"

interface BalanceCardProps {
  balances: BalancesData | undefined
  isLoading: boolean
  isAuthenticated: boolean
}

export function BalanceCard({ balances, isLoading, isAuthenticated }: BalanceCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>STX Balance</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {!isAuthenticated ? (
          <p className="text-muted-foreground">Connect your wallet to view balance</p>
        ) : isLoading ? (
          <Spinner size="sm" />
        ) : balances?.stx ? (
          <p className="text-2xl font-semibold">{formatStx(balances.stx.balance)} STX</p>
        ) : (
          <p className="text-muted-foreground">0 STX</p>
        )}
      </CardContent>
    </Card>
  )
}

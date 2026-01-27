import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui"
import { formatStx } from "@/lib/utils/format"
import { BalancesData } from "@/lib/hooks/useStxQueries"

interface StackedCardProps {
  balances: BalancesData
}

export function StackedCard({ balances }: StackedCardProps) {
  if (!balances?.stx?.locked || Number(balances.stx.locked) <= 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stacked STX</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">{formatStx(balances.stx.locked)} STX</p>
        <p className="text-sm text-muted-foreground">Currently locked in stacking</p>
      </CardContent>
    </Card>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui"
import { formatStx } from "@/lib/utils/format"
import { BalancesData } from "@/lib/hooks/useStxQueries"

interface ActivityCardProps {
  balances: BalancesData
}

export function ActivityCard({ balances }: ActivityCardProps) {
  return (
    <Card className="md:col-span-2 lg:col-span-1 lg:row-span-2">
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
  )
}

import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui"
import { BalancesData } from "@/lib/hooks/useStxQueries"

interface NFTCardProps {
  balances: BalancesData
}

export function NFTCard({ balances }: NFTCardProps) {
  const nftCount = balances?.non_fungible_tokens
    ? Object.values(balances.non_fungible_tokens).reduce((acc, t) => acc + Number(t.count), 0)
    : 0

  if (nftCount === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>NFTs</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">{nftCount}</p>
        <p className="text-sm text-muted-foreground">Across {Object.keys(balances?.non_fungible_tokens || {}).length} collections</p>
      </CardContent>
    </Card>
  )
}

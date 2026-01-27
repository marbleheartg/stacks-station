import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui"
import { BalancesData } from "@/lib/hooks/useStxQueries"

interface TokensCardProps {
  balances: BalancesData
}

export function TokensCard({ balances }: TokensCardProps) {
  const fungibleTokens = balances?.fungible_tokens ? Object.entries(balances.fungible_tokens) : []

  if (fungibleTokens.length === 0) return null

  return (
    <Card className="md:col-span-2 lg:col-span-1">
      <CardHeader>
        <CardTitle>Tokens ({fungibleTokens.length})</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {fungibleTokens.slice(0, 10).map(([tokenId, token]) => {
          const name = tokenId.split("::")[1] || tokenId
          return (
            <div key={tokenId} className="flex justify-between">
              <span className="text-muted-foreground truncate max-w-[60%]">{name}</span>
              <span className="font-medium">{Number(token.balance).toLocaleString()}</span>
            </div>
          )
        })}
        {fungibleTokens.length > 10 && <p className="text-sm text-muted-foreground">+{fungibleTokens.length - 10} more tokens</p>}
      </CardContent>
    </Card>
  )
}

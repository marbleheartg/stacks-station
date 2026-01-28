import clsx from "clsx"
import { Card, CardHeader, CardTitle, CardContent } from "@/frontend/components/ui"

const RESOURCES = [
  {
    category: "Documentation",
    links: [
      { name: "Stacks Docs", url: "https://docs.stacks.co" },
      { name: "Hiro Docs", url: "https://docs.hiro.so" },
      { name: "Clarity Language", url: "https://clarity-lang.org" },
    ]
  },
  {
    category: "Explorers",
    links: [
      { name: "Stacks Explorer", url: "https://explorer.stacks.co" },
    ]
  },
  {
    category: "Wallets",
    links: [
      { name: "Leather Wallet", url: "https://leather.io" },
      { name: "Xverse Wallet", url: "https://www.xverse.app" },
    ]
  },
  {
    category: "Community & Ecosystem",
    links: [
      { name: "Stacks.co", url: "https://www.stacks.co" },
      { name: "Stacks Foundation", url: "https://stacks.org" },
    ]
  }
]

export default function Resources() {
  return (
    <main className={clsx("grid grid-cols-1 gap-5", "px-5 pt-24 pb-26 mx-auto max-w-6xl w-full", "overflow-y-auto overflow-x-hidden")}>
      {RESOURCES.map((section) => (
        <Card key={section.category}>
          <CardHeader>
            <CardTitle>{section.category}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {section.links.map((link) => (
              <a 
                key={link.name} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <span className="font-medium text-orange-50">{link.name}</span>
                <span className="text-orange-200/50">↗</span>
              </a>
            ))}
          </CardContent>
        </Card>
      ))}
    </main>
  )
}

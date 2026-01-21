import { DM_Sans } from "next/font/google"
import { ReactNode } from "react"
import "./globals.css"
import { MINIAPP, MINIAPP_METADATA } from "./lib/constants"

const mainFont = DM_Sans({
  variable: "--mainFont",
  weight: "variable",
  subsets: ["latin"],
})

// const titleFont = DM_Sans({
//   variable: "--titleFont",
//   weight: "variable",
//   subsets: ["latin"],
// })

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://auth.farcaster.xyz" />
        <link rel="icon" type="image/png" sizes="256x256" href="/images/og/icon.png" />
        <meta name="fc:miniapp" content={JSON.stringify(MINIAPP_METADATA)} />
        <meta name="description" content={MINIAPP.description} />
        <meta name="base:app_id" content="6967786c4991800a6d9d627e" />
        <title>{MINIAPP.title}</title>
      </head>
      <body className={`${mainFont.variable} antialiased`}>{children}</body>
    </html>
  )
}

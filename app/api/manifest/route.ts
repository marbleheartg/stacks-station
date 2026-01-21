import { MINIAPP } from "@/lib/constants"
import { NextResponse } from "next/server"

const { NEXT_PUBLIC_HOST } = process.env

export async function GET() {
  return NextResponse.json({
    accountAssociation: {
      header: "eyJmaWQiOjEwMjEyMTQsInR5cGUiOiJhdXRoIiwia2V5IjoiMHgzMTU3NDk3YjgyZUM5MUEyMzRmMTFFZTQ0NTUzRDJhMzAzZThkNTllIn0",
      payload: "eyJkb21haW4iOiJ0Lm1hcmJsZWhlYXJ0Lnh5eiJ9",
      signature: "IE1i8D1YdWhhYsGObuYAXjs62HG15z0QtPV4AbFX0S95dPWKX0uU/AwLJDQg2tTpJVDR5rpbMkjymgfibTcLfRw=",
    },
    miniapp: {
      version: "1",
      name: MINIAPP.title,
      iconUrl: `https://${NEXT_PUBLIC_HOST}/images/og/icon.png`,
      homeUrl: `https://${NEXT_PUBLIC_HOST}`,
      splashImageUrl: `https://${NEXT_PUBLIC_HOST}/images/og/splash.png`,
      splashBackgroundColor: MINIAPP.bgColor,
      subtitle: MINIAPP.description,
      description: MINIAPP.description,
      primaryCategory: MINIAPP.primaryCategory,
      tagline: MINIAPP.description,
      ogTitle: MINIAPP.title,
      ogDescription: MINIAPP.description,
      ogImageUrl: `https://${NEXT_PUBLIC_HOST}/images/og/cast.png`,
      castShareUrl: `https://${NEXT_PUBLIC_HOST}`,
      heroImageUrl: `https://${NEXT_PUBLIC_HOST}/images/og/hero.png`,
      canonicalDomain: NEXT_PUBLIC_HOST,
      screenshotUrls: [`https://${NEXT_PUBLIC_HOST}/images/og/screenshot.png`],
      requiredChains: MINIAPP.requiredChains,
      requiredCapabilities: MINIAPP.requiredCapabilities,
      tags: MINIAPP.tags,
      webhookUrl: MINIAPP.webhookUrl,
    },
  })
}

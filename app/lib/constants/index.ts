const CA = "0x980C93A5A5706Cf9B2cEa8E5f4b88070AF1155AA"

const MINIAPP = {
  title: "title",
  description: "description",
  tags: ["1", "2", "3", "4", "5"],
  primaryCategory: "developer-tools",
  // "games, social, finance, utility, productivity, health-fitness, news-media, music, shopping, education, developer-tools, entertainment, art-creativity",
  webhookUrl: "https://api.neynar.com/f/app/8ebe7bf9-a1da-4bfb-9fa9-0c52a7aec475/event",
  bgColor: "#ffffff",
  requiredCapabilities: ["actions.ready"],
  requiredChains: ["eip155:8453"],
}

const MINIAPP_METADATA = {
  version: "next",
  imageUrl: `https://${process.env.NEXT_PUBLIC_HOST}/images/og/cast.png`,
  aspectRatio: "3:2",
  button: {
    title: "open",
    action: {
      type: "launch_miniapp",
      url: `https://${process.env.NEXT_PUBLIC_HOST}`,
      name: MINIAPP.title,
      splashImageUrl: `https://${process.env.NEXT_PUBLIC_HOST}/images/og/splash.png`,
      splashBackgroundColor: MINIAPP.bgColor,
    },
  },
}

export { CA, MINIAPP, MINIAPP_METADATA }

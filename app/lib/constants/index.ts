const CA = "0x980C93A5A5706Cf9B2cEa8E5f4b88070AF1155AA"

export const STACKS_API = "https://api.hiro.so"
export const COUNTER_CONTRACT = "SPED77EEM0WYPMNKEWZX81V8NTVK5NEZ6CY09632.my-counter"
export const USDC_CONTRACT = "SP3XD84X3PE79SHJAZCDM1CF5JWFUA65KLJQP2V0X.usdc-token"

export const BASE_USDC_CONTRACT = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
export const BASE_TOKEN_MESSENGER_CONTRACT = "0x1682Ae6375C4E4A97e4B583BC394c8c727A92BDF"
export const BASE_MESSAGE_TRANSMITTER_CONTRACT = "0xAD09780d193934d5099534AFaa29E70F86227288"

export const TOKEN_CONTRACTS: Record<string, string> = {
  STX: "native",
  ALEX: "SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.age000-governance-token::alex",
  USDA: "SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.usda-token::usda",
  xBTC: "SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin::xbtc",
}
export const TOKEN_DECIMALS: Record<string, number> = {
  STX: 6,
  ALEX: 8,
  USDA: 6,
  xBTC: 8,
}

const MINIAPP = {
  title: "stacks-station",
  description: "stacks-station",
  tags: ["stacks", "station", "3", "4", "5"],
  primaryCategory: "finance",
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

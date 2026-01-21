import { createClient } from "@farcaster/quick-auth"

const client = createClient()

export default async function verifySession(session: string): Promise<number> {
  const payload = await client.verifyJwt({ token: session, domain: process.env.NEXT_PUBLIC_HOST! })
  return payload.sub
}

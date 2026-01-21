import clsx from "clsx"
import { useConnection } from "wagmi"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui"

export default function Page() {
  const { address: userAddress } = useConnection()

  return (
    <main className={clsx("flex flex-col gap-5", "px-5 pt-20 pb-26", "overflow-y-scroll overflow-x-hidden")}>
      <Card>
        <CardHeader>
          <CardTitle>page card</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, reiciendis architecto quasi officia illum animi vero voluptas nihil corporis alias dolore ipsa odio commodi
          velit sed quis distinctio maxime numquam!
        </CardContent>
      </Card>
    </main>
  )
}

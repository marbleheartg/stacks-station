import clientErrorHandling from "@/lib/clientErrorsReporting"
import Providers from "@/lib/providers"
import { updateStore } from "@/lib/store"
import preloadImages from "@/lib/utils/preloadImages"
import sdk from "@farcaster/miniapp-sdk"
import { useEffect } from "react"
import { BrowserRouter, Route, Routes } from "react-router"
import Background from "./components/Background"
import Header from "./components/Header"
import Menu from "./components/Menu"
import { ToastProvider } from "./components/ui"
import Bridging from "./pages/Bridging"
import Home from "./pages/Home"

const pngImgSrcs: string[] = []
const svgImgSrcs: string[] = []

export default function App() {
  useEffect(() => {
    clientErrorHandling()
    ;(async function () {
      const isMiniApp = await sdk.isInMiniApp()

      if (isMiniApp) {
        try {
          const { user, client } = await sdk.context
          const capabilities = await sdk.getCapabilities()
          updateStore({ user, client, capabilities })
        } catch {}

        try {
          await preloadImages([...pngImgSrcs.map((src) => `${src}.png`), ...svgImgSrcs.map((src) => `${src}.svg`)].map((src) => `/images/${src}`))
        } catch {
        } finally {
          await sdk.actions.ready({ disableNativeGestures: true }).catch(() => {})
        }

        try {
          const { token: session } = await sdk.quickAuth.getToken()
          updateStore({ session })
        } catch {}
      } else {
      }
    })()
  }, [])

  return (
    <div onDragStart={(e) => e.preventDefault()}>
      <Providers>
        <ToastProvider>
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/bridging" element={<Bridging />} />
            </Routes>
            <Menu />
            <Background />
          </BrowserRouter>
        </ToastProvider>
      </Providers>

      {/* {process.env.NODE_ENV === "development" && (
        <pre className={clsx("fixed bottom-0 inset-x-0 p-5 pb-15 rounded-t-4xl", "text-xs text-wrap bg-amber-200/50 pointer-events-none z-50")}>
          <div>{JSON.stringify({ userAddress, isLoading, ua: navigator.userAgent }, null, 2)}</div>
        </pre>
      )} */}
    </div>
  )
}

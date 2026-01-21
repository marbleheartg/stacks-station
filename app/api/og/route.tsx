import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  return new NextResponse("Opengraph image", { status: 200 })
}

// import { ImageResponse } from "next/og"

// const { NEXT_PUBLIC_HOST } = process.env

// // async function loadGoogleFont(font: string, text: string) {
// //   const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}`
// //   const css = await (await fetch(url)).text()
// //   const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/)

// //   if (resource) {
// //     const response = await fetch(resource[1])
// //     if (response.status == 200) {
// //       return await response.arrayBuffer()
// //     }
// //   }

// //   throw new Error("failed to load font data")
// // }

// const offsets = {
//   param1: {
//     top: "0",
//     right: "19%",
//   },
//   param2: {
//     top: "0",
//     right: "10%",
//   },
//   param3: {
//     top: "8%",
//     right: "10%",
//   },
//   param4: {
//     top: "0",
//     right: "17%",
//   },
//   param5: {
//     top: "5%",
//     right: "18%",
//   },
// }

//   const { searchParams } = new URL(req.url)
//   const param = searchParams.get("param") as keyof typeof offsets
//   const username = searchParams.get("username") || "username"
//   return new ImageResponse(
//     (
//       <div
//         style={{
//           position: "relative",
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           // alignItems: "center",
//           width: "100%",
//           height: "100%",
//           padding: "30px 100px",
//           background: "white",
//           backgroundImage: `url("https://${NEXT_PUBLIC_HOST}/images/og/cast/${param}.jpg")`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//         }}
//       >
//         <div
//           style={{
//             position: "absolute",
//             left: "24%",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             width: "435px",
//             height: "100px",
//             background: "white",
//             fontSize: username.length > 12 ? 44 : 52,
//             color: "#733DA2",
//           }}
//         >
//           {"@" + username}
//         </div>
//       </div>
//     ),
//     {
//       width: 1200,
//       height: 630,
//       // fonts: [
//       //   {
//       //     name: "Mogra",
//       //     data: await loadGoogleFont("Mogra", `@${username}`),
//       //     style: "normal",
//       //   },
//       // ],
//     },
//   )

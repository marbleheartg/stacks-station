import sdk from "@farcaster/miniapp-sdk"
import clsx from "clsx"
import { NavLink } from "react-router"

const menuItems = [
  {
    to: "/bridging",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 2.1l4 4-4 4" />
        <path d="M3 12.2v-2a4 4 0 0 1 4-4h12.8" />
        <path d="M7 21.9l-4-4 4-4" />
        <path d="M21 11.8v2a4 4 0 0 1-4 4H4.2" />
      </svg>
    ),
  },
  {
    to: "/",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
]

const Menu = () => {
  return (
    <nav className={clsx("fixed bottom-7 left-1/2 -translate-x-1/2", "flex justify-around gap-1", "p-1 rounded-full bg-white/5", "glass", "z-30")}>
      {menuItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            clsx(
              "flex items-center justify-center",
              "p-2 px-3 rounded-full",
              "text-white/85 hover:text-white",
              "hover:bg-white/8",
              "menu-item",
              isActive && "bg-white/15 text-white menu-item--active",
            )
          }
          onClick={() => sdk.haptics.selectionChanged()}
        >
          {item.icon}
        </NavLink>
      ))}
    </nav>
  )
}

export default Menu

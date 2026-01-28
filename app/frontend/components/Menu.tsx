import sdk from "@farcaster/miniapp-sdk"
import clsx from "clsx"
import { NavLink } from "react-router"

const menuItems = [
  {
    to: "/",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    to: "/swap",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3 4 7l4 4" />
        <path d="M4 7h16" />
        <path d="m16 21 4-4-4-4" />
        <path d="M20 17H4" />
      </svg>
    ),
  },
  {
    to: "/bridging",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 8 7 4l4 4" />
        <path d="M7 4v16" />
        <path d="m21 16-4 4-4-4" />
        <path d="M17 20V4" />
      </svg>
    ),
  },
  {
    to: "/resources",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
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

import sdk from "@farcaster/miniapp-sdk"
import clsx from "clsx"
import { type ButtonHTMLAttributes, forwardRef } from "react"

type IconButtonVariant = "default" | "ghost" | "danger"
type IconButtonSize = "sm" | "md" | "lg"

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant
  size?: IconButtonSize
  haptic?: boolean
  "aria-label": string
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = "default", size = "md", haptic = true, disabled, onClick, children, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (haptic) {
        sdk.haptics.impactOccurred("light")
      }
      onClick?.(e)
    }

    return (
      <button
        ref={ref}
        disabled={disabled}
        onClick={handleClick}
        className={clsx(
          "inline-flex items-center justify-center",
          "rounded-full",
          "transition-all duration-200 ease-out",
          "active:scale-95",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--heading)/50",

          // Size variants
          size === "sm" && "w-7 h-7",
          size === "md" && "w-9 h-9",
          size === "lg" && "w-11 h-11",

          // Color variants
          variant === "default" && [
            "bg-white/10 text-(--text)",
            "border border-(--border)",
            "hover:bg-white/15 hover:text-(--heading)",
            "glass",
          ],
          variant === "ghost" && ["bg-transparent text-(--text)", "hover:bg-white/8 hover:text-(--heading)"],
          variant === "danger" && [
            "bg-red-500/20 text-red-300",
            "border border-red-500/30",
            "hover:bg-red-500/30 hover:text-red-200",
          ],

          className,
        )}
        {...props}
      >
        {children}
      </button>
    )
  },
)

IconButton.displayName = "IconButton"

export default IconButton

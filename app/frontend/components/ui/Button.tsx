import sdk from "@farcaster/miniapp-sdk"
import clsx from "clsx"
import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from "react"

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger"
type ButtonSize = "sm" | "md" | "lg"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  haptic?: boolean
  startIcon?: ReactNode
  endIcon?: ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading = false, haptic = true, disabled, children, onClick, startIcon, endIcon, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (haptic) {
        sdk.haptics.impactOccurred("light")
      }
      onClick?.(e)
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        onClick={handleClick}
        className={clsx(
          "relative inline-flex items-center justify-center",
          "font-bold lowercase tracking-wide",
          "transition-all duration-200 ease-out",
          "active:scale-[0.97]",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",

          // Size variants
          size === "sm" && "text-[10px] px-2.5 py-1 rounded-lg",
          size === "md" && "text-xs px-3.5 py-1.5 rounded-xl",
          size === "lg" && "text-sm px-5 py-2.5 rounded-xl",

          // Color variants
          variant === "primary" && [
            "bg-(--heading)/90 text-(--bg)",
            "border border-(--heading)/20",
            "hover:bg-(--heading) hover:shadow-lg hover:shadow-(--heading)/20",
            "glass",
          ],
          variant === "secondary" && [
            "bg-white/10 text-(--text)",
            "border border-(--border)",
            "hover:bg-white/15 hover:text-(--heading)",
            "glass",
          ],
          variant === "ghost" && [
            "bg-transparent text-(--text)",
            "border border-transparent",
            "hover:bg-white/8 hover:text-(--heading)",
          ],
          variant === "danger" && [
            "bg-red-500/80 text-white",
            "border border-red-400/30",
            "hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/20",
            "glass",
          ],

          className,
        )}
        {...props}
      >
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </span>
        )}
        <span className={clsx("flex items-center gap-2", loading && "opacity-0")}>
          {startIcon}
          {children}
          {endIcon}
        </span>
      </button>
    )
  },
)

Button.displayName = "Button"

export default Button

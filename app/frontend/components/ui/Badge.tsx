import clsx from "clsx"
import { type HTMLAttributes, forwardRef } from "react"

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info"
type BadgeSize = "sm" | "md"

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: BadgeSize
  dot?: boolean
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(({ className, variant = "default", size = "md", dot = false, children, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={clsx(
        "inline-flex items-center gap-1.5",
        "font-bold lowercase tracking-wide",
        "rounded-full",
        "transition-colors duration-200",

        // Size variants
        size === "sm" && "text-[9px] px-2 py-0.5",
        size === "md" && "text-[10px] px-2.5 py-1",

        // Color variants
        variant === "default" && "bg-white/15 text-(--text) border border-(--border)",
        variant === "success" && "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
        variant === "warning" && "bg-amber-500/20 text-amber-300 border border-amber-500/30",
        variant === "danger" && "bg-red-500/20 text-red-300 border border-red-500/30",
        variant === "info" && "bg-sky-500/20 text-sky-300 border border-sky-500/30",

        className,
      )}
      {...props}
    >
      {dot && (
        <span
          className={clsx(
            "w-1.5 h-1.5 rounded-full",
            variant === "default" && "bg-(--text)",
            variant === "success" && "bg-emerald-400",
            variant === "warning" && "bg-amber-400",
            variant === "danger" && "bg-red-400",
            variant === "info" && "bg-sky-400",
          )}
        />
      )}
      {children}
    </span>
  )
})

Badge.displayName = "Badge"

export default Badge

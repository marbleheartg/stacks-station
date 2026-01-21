import sdk from "@farcaster/miniapp-sdk"
import clsx from "clsx"
import { type HTMLAttributes, forwardRef, type ReactNode } from "react"

type ChipVariant = "default" | "primary" | "success" | "warning" | "danger"
type ChipSize = "sm" | "md"

interface ChipProps extends HTMLAttributes<HTMLDivElement> {
  variant?: ChipVariant
  size?: ChipSize
  icon?: ReactNode
  onRemove?: () => void
  removable?: boolean
  selected?: boolean
  clickable?: boolean
  haptic?: boolean
}

const Chip = forwardRef<HTMLDivElement, ChipProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      icon,
      onRemove,
      removable = false,
      selected = false,
      clickable = false,
      haptic = true,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (clickable && haptic) {
        sdk.haptics.selectionChanged()
      }
      onClick?.(e)
    }

    const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation()
      if (haptic) {
        sdk.haptics.impactOccurred("light")
      }
      onRemove?.()
    }

    return (
      <div
        ref={ref}
        onClick={handleClick}
        className={clsx(
          "inline-flex items-center gap-1.5",
          "font-bold lowercase tracking-wide",
          "rounded-full",
          "transition-all duration-200",

          // Size
          size === "sm" && "text-[9px] px-2 py-0.5",
          size === "md" && "text-[10px] px-2.5 py-1",

          // Clickable
          clickable && "cursor-pointer active:scale-95",

          // Variants
          variant === "default" && [
            selected
              ? "bg-white/25 text-(--heading) border border-white/30"
              : "bg-white/10 text-(--text) border border-(--border)",
            clickable && !selected && "hover:bg-white/15 hover:text-(--heading)",
          ],
          variant === "primary" && [
            selected
              ? "bg-(--heading)/90 text-(--bg) border border-(--heading)/30"
              : "bg-(--heading)/20 text-(--heading) border border-(--heading)/30",
            clickable && !selected && "hover:bg-(--heading)/30",
          ],
          variant === "success" && [
            selected
              ? "bg-emerald-500/80 text-white border border-emerald-400/30"
              : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
            clickable && !selected && "hover:bg-emerald-500/30",
          ],
          variant === "warning" && [
            selected
              ? "bg-amber-500/80 text-white border border-amber-400/30"
              : "bg-amber-500/20 text-amber-300 border border-amber-500/30",
            clickable && !selected && "hover:bg-amber-500/30",
          ],
          variant === "danger" && [
            selected
              ? "bg-red-500/80 text-white border border-red-400/30"
              : "bg-red-500/20 text-red-300 border border-red-500/30",
            clickable && !selected && "hover:bg-red-500/30",
          ],

          className
        )}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
        {removable && (
          <button
            type="button"
            onClick={handleRemove}
            className={clsx(
              "shrink-0 rounded-full p-0.5 -mr-0.5",
              "transition-colors duration-150",
              "hover:bg-black/20"
            )}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    )
  }
)

Chip.displayName = "Chip"

interface ChipGroupProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

const ChipGroup = forwardRef<HTMLDivElement, ChipGroupProps>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={clsx("flex flex-wrap gap-2", className)} {...props}>
      {children}
    </div>
  )
})

ChipGroup.displayName = "ChipGroup"

export { Chip, ChipGroup }
export default Chip

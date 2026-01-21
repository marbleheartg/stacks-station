import sdk from "@farcaster/miniapp-sdk"
import clsx from "clsx"
import { type InputHTMLAttributes, forwardRef } from "react"

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "size"> {
  checked?: boolean
  onChange?: (checked: boolean) => void
  size?: "sm" | "md"
  haptic?: boolean
}

const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, checked = false, onChange, size = "md", haptic = true, disabled, ...props }, ref) => {
    const handleChange = () => {
      if (disabled) return
      if (haptic) {
        sdk.haptics.impactOccurred("light")
      }
      onChange?.(!checked)
    }

    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleChange}
        className={clsx(
          "relative inline-flex shrink-0 cursor-pointer items-center",
          "rounded-full transition-colors duration-200 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--heading)/50",
          "disabled:cursor-not-allowed disabled:opacity-50",

          // Size variants
          size === "sm" && "h-5 w-9",
          size === "md" && "h-6 w-11",

          // State colors
          checked ? "bg-(--heading)/80" : "bg-white/15 border border-(--border)",

          className,
        )}
      >
        <input ref={ref} type="checkbox" checked={checked} onChange={() => {}} className="sr-only" {...props} />
        <span
          className={clsx(
            "pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-white shadow-md",
            "transition-transform duration-200 ease-out",

            // Size variants
            size === "sm" && "h-4 w-4",
            size === "md" && "h-5 w-5",

            // Horizontal position
            checked ? (size === "sm" ? "translate-x-4" : "translate-x-5") : "translate-x-0.5",
          )}
        />
      </button>
    )
  },
)

Toggle.displayName = "Toggle"

export default Toggle

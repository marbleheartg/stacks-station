import sdk from "@farcaster/miniapp-sdk"
import clsx from "clsx"
import { type InputHTMLAttributes, forwardRef, type ReactNode } from "react"

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "size"> {
  checked?: boolean
  onChange?: (checked: boolean) => void
  label?: ReactNode
  description?: string
  size?: "sm" | "md"
  haptic?: boolean
  indeterminate?: boolean
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      checked = false,
      onChange,
      label,
      description,
      size = "md",
      haptic = true,
      indeterminate = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const handleChange = () => {
      if (disabled) return
      if (haptic) {
        sdk.haptics.impactOccurred("light")
      }
      onChange?.(!checked)
    }

    return (
      <label
        className={clsx(
          "inline-flex gap-2.5 cursor-pointer",
          "select-none",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <div className="relative shrink-0 flex items-center justify-center">
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            onChange={() => {}}
            disabled={disabled}
            className="sr-only peer"
            {...props}
          />
          <div
            onClick={handleChange}
            className={clsx(
              "flex items-center justify-center",
              "rounded-md border-2 transition-all duration-200",
              size === "sm" && "w-4 h-4",
              size === "md" && "w-5 h-5",
              checked || indeterminate
                ? "bg-(--heading)/90 border-(--heading)/30"
                : "bg-white/5 border-(--border) hover:border-(--heading)/50"
            )}
          >
            {checked && !indeterminate && (
              <svg
                width={size === "sm" ? 10 : 12}
                height={size === "sm" ? 10 : 12}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-(--bg) animate-in zoom-in duration-150"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
            {indeterminate && !checked && (
              <div
                className={clsx(
                  "bg-(--bg) rounded-sm",
                  size === "sm" && "w-2 h-0.5",
                  size === "md" && "w-2.5 h-0.5"
                )}
              />
            )}
          </div>
        </div>
        {(label || description) && (
          <div className="flex flex-col gap-0.5 pt-0.5">
            {label && (
              <span
                className={clsx(
                  "font-medium text-(--text)",
                  size === "sm" && "text-[10px]",
                  size === "md" && "text-xs"
                )}
              >
                {label}
              </span>
            )}
            {description && <span className="text-[10px] text-(--text)/60">{description}</span>}
          </div>
        )}
      </label>
    )
  }
)

Checkbox.displayName = "Checkbox"

export default Checkbox

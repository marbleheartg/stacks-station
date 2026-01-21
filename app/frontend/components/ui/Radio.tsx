import sdk from "@farcaster/miniapp-sdk"
import clsx from "clsx"
import { type InputHTMLAttributes, forwardRef, type ReactNode, createContext, useContext } from "react"

// Radio Group Context
interface RadioGroupContextValue {
  value?: string
  onChange?: (value: string) => void
  name?: string
  disabled?: boolean
  size?: "sm" | "md"
  haptic?: boolean
}

const RadioGroupContext = createContext<RadioGroupContextValue>({})

interface RadioGroupProps {
  value?: string
  onChange?: (value: string) => void
  name?: string
  disabled?: boolean
  size?: "sm" | "md"
  haptic?: boolean
  orientation?: "horizontal" | "vertical"
  className?: string
  children: ReactNode
}

export function RadioGroup({
  value,
  onChange,
  name,
  disabled = false,
  size = "md",
  haptic = true,
  orientation = "vertical",
  className,
  children,
}: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ value, onChange, name, disabled, size, haptic }}>
      <div
        role="radiogroup"
        className={clsx(
          "flex",
          orientation === "vertical" && "flex-col gap-2.5",
          orientation === "horizontal" && "flex-row gap-4 flex-wrap",
          className
        )}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
}

interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "size"> {
  value: string
  label?: ReactNode
  description?: string
  size?: "sm" | "md"
  haptic?: boolean
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, value, label, description, size: propSize, haptic: propHaptic, disabled: propDisabled, ...props }, ref) => {
    const context = useContext(RadioGroupContext)
    const size = propSize ?? context.size ?? "md"
    const haptic = propHaptic ?? context.haptic ?? true
    const disabled = propDisabled ?? context.disabled ?? false
    const checked = context.value === value

    const handleChange = () => {
      if (disabled) return
      if (haptic) {
        sdk.haptics.selectionChanged()
      }
      context.onChange?.(value)
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
            type="radio"
            name={context.name}
            value={value}
            checked={checked}
            onChange={() => {}}
            disabled={disabled}
            className="sr-only"
            {...props}
          />
          <div
            onClick={handleChange}
            className={clsx(
              "flex items-center justify-center",
              "rounded-full border-2 transition-all duration-200",
              size === "sm" && "w-4 h-4",
              size === "md" && "w-5 h-5",
              checked
                ? "border-(--heading)/90"
                : "bg-white/5 border-(--border) hover:border-(--heading)/50"
            )}
          >
            {checked && (
              <div
                className={clsx(
                  "rounded-full bg-(--heading)/90",
                  "animate-in zoom-in duration-150",
                  size === "sm" && "w-2 h-2",
                  size === "md" && "w-2.5 h-2.5"
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

Radio.displayName = "Radio"

export { Radio }
export default Radio

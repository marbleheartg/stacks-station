import sdk from "@farcaster/miniapp-sdk"
import clsx from "clsx"
import { type HTMLAttributes, forwardRef, useEffect, useRef, useState } from "react"

interface SliderProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: number
  min?: number
  max?: number
  step?: number
  onChange?: (value: number) => void
  disabled?: boolean
  showValue?: boolean
  label?: string
  variant?: "default" | "success" | "warning" | "danger"
  size?: "sm" | "md"
  haptic?: boolean
}

const Slider = forwardRef<HTMLDivElement, SliderProps>(
  ({ className, value, min = 0, max = 100, step = 1, onChange, disabled = false, showValue = false, label, variant = "default", size = "md", haptic = true, ...props }, ref) => {
    const percentage = ((value - min) / (max - min)) * 100
    const inputRef = useRef<HTMLInputElement>(null)
    const [isDragging, setIsDragging] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(e.target.value)
      onChange?.(newValue)
    }

    const handleMouseDown = () => {
      if (haptic) {
        sdk.haptics.impactOccurred("light")
      }
      setIsDragging(true)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    useEffect(() => {
      document.addEventListener("mouseup", handleMouseUp)
      document.addEventListener("touchend", handleMouseUp)
      return () => {
        document.removeEventListener("mouseup", handleMouseUp)
        document.removeEventListener("touchend", handleMouseUp)
      }
    }, [])

    return (
      <div ref={ref} className={clsx("flex flex-col gap-2", className)} {...props}>
        {(label || showValue) && (
          <div className="flex justify-between items-center">
            {label && <label className="text-[10px] font-bold text-(--text)/80 lowercase tracking-wide">{label}</label>}
            {showValue && (
              <span
                className={clsx(
                  "text-[10px] font-bold tabular-nums",
                  "transition-transform duration-150",
                  isDragging && "scale-110",
                  variant === "default" && "text-(--heading)",
                  variant === "success" && "text-emerald-400",
                  variant === "warning" && "text-amber-400",
                  variant === "danger" && "text-red-400",
                )}
              >
                {value}
              </span>
            )}
          </div>
        )}
        <div className="relative">
          {/* Track */}
          <div className={clsx("absolute left-0 right-0 inset-y-0 my-auto rounded-full bg-white/10", size === "sm" && "h-1.5", size === "md" && "h-2")} />
          {/* Filled track */}
          <div
            className={clsx(
              "absolute left-0 inset-y-0 my-auto rounded-full transition-all duration-100",
              size === "sm" && "h-1.5",
              size === "md" && "h-2",
              variant === "default" && "bg-(--heading)/80",
              variant === "success" && "bg-emerald-500",
              variant === "warning" && "bg-amber-500",
              variant === "danger" && "bg-red-500",
            )}
            style={{ width: `${percentage}%` }}
          />
          {/* Input */}
          <input
            ref={inputRef}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleChange}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
            disabled={disabled}
            className={clsx(
              "relative w-full appearance-none bg-transparent cursor-pointer",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              size === "sm" && "h-4",
              size === "md" && "h-5",
              // Thumb styles via CSS
              "[&::-webkit-slider-thumb]:appearance-none",
              "[&::-webkit-slider-thumb]:rounded-full",
              "[&::-webkit-slider-thumb]:bg-white",
              "[&::-webkit-slider-thumb]:shadow-lg",
              "[&::-webkit-slider-thumb]:transition-transform",
              "[&::-webkit-slider-thumb]:duration-150",
              isDragging && "[&::-webkit-slider-thumb]:scale-110",
              size === "sm" && "[&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3",
              size === "md" && "[&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4",
              "[&::-moz-range-thumb]:appearance-none",
              "[&::-moz-range-thumb]:border-none",
              "[&::-moz-range-thumb]:rounded-full",
              "[&::-moz-range-thumb]:bg-white",
              "[&::-moz-range-thumb]:shadow-lg",
              size === "sm" && "[&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3",
              size === "md" && "[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4",
            )}
          />
        </div>
      </div>
    )
  },
)

Slider.displayName = "Slider"

export default Slider

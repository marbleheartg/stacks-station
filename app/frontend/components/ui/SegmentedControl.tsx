import sdk from "@farcaster/miniapp-sdk"
import clsx from "clsx"
import { type ReactNode, useRef, useLayoutEffect, useState } from "react"

interface Segment {
  value: string
  label: string
  icon?: ReactNode
  disabled?: boolean
}

interface SegmentedControlProps {
  segments: Segment[]
  value: string
  onChange: (value: string) => void
  size?: "sm" | "md"
  fullWidth?: boolean
  className?: string
  haptic?: boolean
}

export function SegmentedControl({
  segments,
  value,
  onChange,
  size = "md",
  fullWidth = false,
  className,
  haptic = true,
}: SegmentedControlProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    const activeElement = container.querySelector(`[data-segment-value="${value}"]`) as HTMLElement
    if (activeElement) {
      setIndicatorStyle({
        left: activeElement.offsetLeft,
        width: activeElement.offsetWidth,
      })
    }
  }, [value])

  const handleSelect = (segment: Segment) => {
    if (segment.disabled || segment.value === value) return
    if (haptic) {
      sdk.haptics.selectionChanged()
    }
    onChange(segment.value)
  }

  return (
    <div
      ref={containerRef}
      className={clsx(
        "relative inline-flex",
        "bg-white/5 rounded-xl p-1",
        fullWidth && "w-full",
        className
      )}
    >
      {/* Animated indicator */}
      <div
        className={clsx(
          "absolute bg-white/15 glass rounded-lg",
          "transition-all duration-300 ease-out",
          size === "sm" && "top-1 bottom-1",
          size === "md" && "top-1 bottom-1"
        )}
        style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
      />

      {segments.map(segment => (
        <button
          key={segment.value}
          data-segment-value={segment.value}
          onClick={() => handleSelect(segment)}
          disabled={segment.disabled}
          className={clsx(
            "relative z-10 flex items-center justify-center gap-1.5",
            "font-bold lowercase tracking-wide",
            "transition-colors duration-200",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            fullWidth && "flex-1",

            // Size
            size === "sm" && "text-[10px] px-2.5 py-1.5 rounded-lg",
            size === "md" && "text-xs px-3.5 py-2 rounded-lg",

            // Active state
            value === segment.value ? "text-(--heading)" : "text-(--text)/60 hover:text-(--text)"
          )}
        >
          {segment.icon}
          {segment.label}
        </button>
      ))}
    </div>
  )
}

export default SegmentedControl

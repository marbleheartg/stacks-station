import clsx from "clsx"
import { type HTMLAttributes, forwardRef } from "react"

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  size?: "sm" | "md"
  variant?: "default" | "success" | "warning" | "danger"
  showLabel?: boolean
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, size = "md", variant = "default", showLabel = false, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    return (
      <div ref={ref} className={clsx("flex flex-col gap-1", className)} {...props}>
        {showLabel && (
          <div className="flex justify-between text-[10px]">
            <span className="text-(--text)/60">{Math.round(percentage)}%</span>
          </div>
        )}
        <div
          className={clsx(
            "w-full overflow-hidden rounded-full bg-white/10",
            size === "sm" && "h-1.5",
            size === "md" && "h-2.5",
          )}
        >
          <div
            className={clsx(
              "h-full rounded-full transition-all duration-500 ease-out",
              variant === "default" && "bg-(--heading)/80",
              variant === "success" && "bg-emerald-500",
              variant === "warning" && "bg-amber-500",
              variant === "danger" && "bg-red-500",
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  },
)

Progress.displayName = "Progress"

interface CircularProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  showLabel?: boolean
}

const CircularProgress = forwardRef<HTMLDivElement, CircularProgressProps>(
  ({ className, value, max = 100, size = 48, strokeWidth = 4, showLabel = true, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (percentage / 100) * circumference

    return (
      <div ref={ref} className={clsx("relative inline-flex items-center justify-center", className)} {...props}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} className="fill-none stroke-white/10" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="fill-none stroke-(--heading)/80 transition-all duration-500 ease-out"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset,
            }}
          />
        </svg>
        {showLabel && (
          <span className="absolute text-[10px] font-bold text-(--text)">{Math.round(percentage)}%</span>
        )}
      </div>
    )
  },
)

CircularProgress.displayName = "CircularProgress"

export { Progress, CircularProgress }
export default Progress

import clsx from "clsx"
import { type HTMLAttributes, forwardRef } from "react"

type SpinnerSize = "xs" | "sm" | "md" | "lg"

interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize
}

const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(({ className, size = "md", ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="status"
      aria-label="Loading"
      className={clsx(
        "animate-spin",
        size === "xs" && "w-3 h-3",
        size === "sm" && "w-4 h-4",
        size === "md" && "w-6 h-6",
        size === "lg" && "w-8 h-8",
        className,
      )}
      {...props}
    >
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
        <path
          className="opacity-90"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  )
})

Spinner.displayName = "Spinner"

interface LoadingOverlayProps extends HTMLAttributes<HTMLDivElement> {
  visible?: boolean
  blur?: boolean
}

const LoadingOverlay = forwardRef<HTMLDivElement, LoadingOverlayProps>(({ className, visible = true, blur = true, ...props }, ref) => {
  if (!visible) return null

  return (
    <div
      ref={ref}
      className={clsx(
        "absolute inset-0 flex items-center justify-center",
        "bg-(--bg)/60 rounded-2xl",
        blur && "backdrop-blur-sm",
        "transition-opacity duration-200",
        className,
      )}
      {...props}
    >
      <Spinner size="lg" className="text-(--heading)" />
    </div>
  )
})

LoadingOverlay.displayName = "LoadingOverlay"

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string | number
  height?: string | number
  rounded?: "none" | "sm" | "md" | "lg" | "full"
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(({ className, width, height, rounded = "md", style, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={clsx(
        "animate-pulse bg-white/10",
        rounded === "none" && "rounded-none",
        rounded === "sm" && "rounded",
        rounded === "md" && "rounded-lg",
        rounded === "lg" && "rounded-xl",
        rounded === "full" && "rounded-full",
        className,
      )}
      style={{ width, height, ...style }}
      {...props}
    />
  )
})

Skeleton.displayName = "Skeleton"

export { Spinner, LoadingOverlay, Skeleton }
export default Spinner

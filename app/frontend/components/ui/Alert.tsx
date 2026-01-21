import clsx from "clsx"
import { type HTMLAttributes, forwardRef, type ReactNode } from "react"

type AlertVariant = "info" | "success" | "warning" | "danger"

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
  title?: string
  icon?: ReactNode
  onClose?: () => void
  closable?: boolean
}

const icons: Record<AlertVariant, ReactNode> = {
  info: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  success: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  warning: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  danger: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "info", title, icon, onClose, closable = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={clsx(
          "relative flex gap-3 p-3 rounded-xl",
          "animate-in fade-in slide-in-from-top-2 duration-300",

          variant === "info" && "bg-sky-500/15 border border-sky-500/25 text-sky-200",
          variant === "success" && "bg-emerald-500/15 border border-emerald-500/25 text-emerald-200",
          variant === "warning" && "bg-amber-500/15 border border-amber-500/25 text-amber-200",
          variant === "danger" && "bg-red-500/15 border border-red-500/25 text-red-200",

          className
        )}
        {...props}
      >
        <div
          className={clsx(
            "shrink-0 mt-0.5",
            variant === "info" && "text-sky-400",
            variant === "success" && "text-emerald-400",
            variant === "warning" && "text-amber-400",
            variant === "danger" && "text-red-400"
          )}
        >
          {icon || icons[variant]}
        </div>
        <div className="flex-1 min-w-0">
          {title && <div className="font-bold text-xs mb-0.5">{title}</div>}
          <div className="text-[11px] leading-relaxed opacity-90">{children}</div>
        </div>
        {closable && onClose && (
          <button
            type="button"
            onClick={onClose}
            className={clsx(
              "shrink-0 p-1 rounded-lg",
              "transition-colors duration-150",
              "hover:bg-white/10"
            )}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    )
  }
)

Alert.displayName = "Alert"

export default Alert

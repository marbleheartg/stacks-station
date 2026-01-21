import sdk from "@farcaster/miniapp-sdk"
import clsx from "clsx"
import { type ReactNode, useState, useRef, useEffect, useLayoutEffect } from "react"

interface Tab {
  id: string
  label: string
  icon?: ReactNode
  disabled?: boolean
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (tabId: string) => void
  variant?: "default" | "pills" | "underline"
  size?: "sm" | "md"
  fullWidth?: boolean
  className?: string
  haptic?: boolean
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = "default",
  size = "md",
  fullWidth = false,
  className,
  haptic = true,
}: TabsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })

  useLayoutEffect(() => {
    if (variant !== "underline") return

    const container = containerRef.current
    if (!container) return

    const activeElement = container.querySelector(`[data-tab-id="${activeTab}"]`) as HTMLElement
    if (activeElement) {
      setIndicatorStyle({
        left: activeElement.offsetLeft,
        width: activeElement.offsetWidth,
      })
    }
  }, [activeTab, variant])

  const handleTabClick = (tab: Tab) => {
    if (tab.disabled) return
    if (haptic) {
      sdk.haptics.selectionChanged()
    }
    onChange(tab.id)
  }

  return (
    <div
      ref={containerRef}
      className={clsx(
        "relative flex",
        fullWidth && "w-full",
        variant === "default" && "bg-white/5 rounded-xl p-1 gap-1",
        variant === "pills" && "gap-2",
        variant === "underline" && "border-b border-(--border)/30",
        className
      )}
    >
      {tabs.map(tab => (
        <button
          key={tab.id}
          data-tab-id={tab.id}
          onClick={() => handleTabClick(tab)}
          disabled={tab.disabled}
          className={clsx(
            "relative flex items-center justify-center gap-1.5",
            "font-bold lowercase tracking-wide",
            "transition-all duration-200",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            fullWidth && "flex-1",

            // Size
            size === "sm" && "text-[10px] px-2.5 py-1.5",
            size === "md" && "text-xs px-3.5 py-2",

            // Variant: default (segmented)
            variant === "default" && [
              "rounded-lg",
              activeTab === tab.id
                ? "bg-white/15 text-(--heading) glass"
                : "text-(--text)/70 hover:text-(--text) hover:bg-white/5",
            ],

            // Variant: pills
            variant === "pills" && [
              "rounded-full",
              activeTab === tab.id
                ? "bg-(--heading)/90 text-(--bg)"
                : "bg-white/10 text-(--text)/70 hover:text-(--text) hover:bg-white/15",
            ],

            // Variant: underline
            variant === "underline" && [
              "pb-2.5 border-b-2 -mb-px",
              activeTab === tab.id
                ? "text-(--heading) border-transparent"
                : "text-(--text)/70 hover:text-(--text) border-transparent",
            ]
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}

      {/* Animated underline indicator */}
      {variant === "underline" && (
        <div
          className="absolute bottom-0 h-0.5 bg-(--heading) rounded-full transition-all duration-300 ease-out"
          style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
        />
      )}
    </div>
  )
}

interface TabPanelProps {
  children: ReactNode
  className?: string
}

export function TabPanel({ children, className }: TabPanelProps) {
  return (
    <div className={clsx("animate-in fade-in slide-in-from-bottom-2 duration-300", className)}>
      {children}
    </div>
  )
}

export default Tabs

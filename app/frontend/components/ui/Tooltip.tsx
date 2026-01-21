import clsx from "clsx"
import { type ReactNode, useState, useRef, useEffect, useCallback } from "react"

type TooltipPosition = "top" | "bottom" | "left" | "right"

interface TooltipProps {
  content: ReactNode
  children: ReactNode
  position?: TooltipPosition
  delay?: number
  className?: string
}

export function Tooltip({ content, children, position = "top", delay = 200, className }: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return

    const trigger = triggerRef.current.getBoundingClientRect()
    const tooltip = tooltipRef.current.getBoundingClientRect()
    const gap = 8

    let x = 0
    let y = 0

    switch (position) {
      case "top":
        x = trigger.left + trigger.width / 2 - tooltip.width / 2
        y = trigger.top - tooltip.height - gap
        break
      case "bottom":
        x = trigger.left + trigger.width / 2 - tooltip.width / 2
        y = trigger.bottom + gap
        break
      case "left":
        x = trigger.left - tooltip.width - gap
        y = trigger.top + trigger.height / 2 - tooltip.height / 2
        break
      case "right":
        x = trigger.right + gap
        y = trigger.top + trigger.height / 2 - tooltip.height / 2
        break
    }

    // Keep within viewport
    x = Math.max(8, Math.min(x, window.innerWidth - tooltip.width - 8))
    y = Math.max(8, Math.min(y, window.innerHeight - tooltip.height - 8))

    setCoords({ x, y })
  }, [position])

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setVisible(true)
    }, delay)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setVisible(false)
  }

  useEffect(() => {
    if (visible) {
      updatePosition()
      window.addEventListener("resize", updatePosition)
      window.addEventListener("scroll", updatePosition, true)
    }

    return () => {
      window.removeEventListener("resize", updatePosition)
      window.removeEventListener("scroll", updatePosition, true)
    }
  }, [visible, updatePosition])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <>
      <div ref={triggerRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="inline-flex">
        {children}
      </div>
      {visible && (
        <div
          ref={tooltipRef}
          style={{ left: coords.x, top: coords.y }}
          className={clsx(
            "fixed z-50 pointer-events-none",
            "px-2.5 py-1.5 rounded-lg",
            "text-[10px] font-medium lowercase text-(--heading)",
            "bg-(--surface)/90 glass",
            "animate-in fade-in zoom-in-95 duration-150",
            position === "top" && "origin-bottom",
            position === "bottom" && "origin-top",
            position === "left" && "origin-right",
            position === "right" && "origin-left",
            className
          )}
        >
          {content}
          <div
            className={clsx(
              "absolute w-2 h-2 rotate-45 bg-(--surface)/90",
              position === "top" && "bottom-[-4px] left-1/2 -translate-x-1/2",
              position === "bottom" && "top-[-4px] left-1/2 -translate-x-1/2",
              position === "left" && "right-[-4px] top-1/2 -translate-y-1/2",
              position === "right" && "left-[-4px] top-1/2 -translate-y-1/2"
            )}
          />
        </div>
      )}
    </>
  )
}

export default Tooltip

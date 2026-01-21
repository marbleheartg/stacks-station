import sdk from "@farcaster/miniapp-sdk"
import clsx from "clsx"
import { type HTMLAttributes, type ReactNode, createContext, forwardRef, useContext, useState } from "react"

// Accordion Context for managing open state
interface AccordionContextValue {
  openItems: string[]
  toggleItem: (id: string) => void
  allowMultiple: boolean
}

const AccordionContext = createContext<AccordionContextValue | null>(null)

interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  allowMultiple?: boolean
  defaultOpenItems?: string[]
}

const Accordion = forwardRef<HTMLDivElement, AccordionProps>(({ className, allowMultiple = false, defaultOpenItems = [], children, ...props }, ref) => {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpenItems)

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id)
      }
      return allowMultiple ? [...prev, id] : [id]
    })
  }

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, allowMultiple }}>
      <div ref={ref} className={clsx("flex flex-col", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
})

Accordion.displayName = "Accordion"

interface AccordionItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  id: string
  title: ReactNode
  subtitle?: string
  icon?: ReactNode
  disabled?: boolean
  haptic?: boolean
}

const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(({ className, id, title, subtitle, icon, disabled = false, haptic = true, children, ...props }, ref) => {
  const context = useContext(AccordionContext)
  if (!context) throw new Error("AccordionItem must be used within an Accordion")

  const isOpen = context.openItems.includes(id)

  const handleToggle = () => {
    if (disabled) return
    if (haptic) {
      sdk.haptics.impactOccurred("light")
    }
    context.toggleItem(id)
  }

  return (
    <div ref={ref} className={clsx("border-b border-(--border)/30 last:border-b-0", disabled && "opacity-50", className)} {...props}>
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={clsx("w-full flex items-center gap-3 p-3", "text-left transition-colors duration-150", !disabled && "cursor-pointer hover:bg-white/5")}
        aria-expanded={isOpen}
      >
        {icon && <div className="shrink-0 text-(--text)/60">{icon}</div>}
        <div className="flex-1 min-w-0">
          <div className="text-(--heading) font-semibold truncate">{title}</div>
          {subtitle && <div className="text-[10px] text-(--text)/60 truncate">{subtitle}</div>}
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={clsx("shrink-0 text-(--text)/50 transition-transform duration-300", isOpen && "rotate-180")}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div className={clsx("overflow-hidden transition-all duration-300 ease-out", isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0")}>
        <div className="p-3 text-(--text) text-xs leading-relaxed">{children}</div>
      </div>
    </div>
  )
})

AccordionItem.displayName = "AccordionItem"

export { Accordion, AccordionItem }
export default Accordion

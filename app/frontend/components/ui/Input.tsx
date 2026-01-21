import clsx from "clsx"
import { forwardRef, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes, useState } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, label, error, hint, leftIcon, rightIcon, type = "text", ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === "password"
  const inputType =
    isPassword ?
      showPassword ? "text"
      : "password"
    : type

  const handleTogglePassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[10px] font-bold text-(--text)/80 lowercase tracking-wide">{label}</label>}
      <div className="relative">
        {leftIcon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text)/50 pointer-events-none">{leftIcon}</div>}
        <input
          ref={ref}
          type={inputType}
          className={clsx("w-full", leftIcon && "pl-9", (rightIcon || isPassword) && "pr-10", error && "border-red-500/50 focus:border-red-500", className)}
          {...props}
        />
        {isPassword ?
          <button
            type="button"
            onClick={handleTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text)/50 hover:text-(--text) transition-colors focus:outline-none"
          >
            {showPassword ?
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            }
          </button>
        : rightIcon && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text)/50">{rightIcon}</div>}
      </div>
      {error && <span className="text-[10px] text-red-400">{error}</span>}
      {hint && !error && <span className="text-[10px] text-(--text)/50">{hint}</span>}
    </div>
  )
})

Input.displayName = "Input"

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, label, error, hint, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[10px] font-bold text-(--text)/80 lowercase tracking-wide">{label}</label>}
      <textarea ref={ref} className={clsx("min-h-[80px]", error && "border-red-500/50 focus:border-red-500", className)} {...props} />
      {error && <span className="text-[10px] text-red-400">{error}</span>}
      {hint && !error && <span className="text-[10px] text-(--text)/50">{hint}</span>}
    </div>
  )
})

Textarea.displayName = "Textarea"

export { Input, Textarea }
export default Input

import sdk from "@farcaster/miniapp-sdk"
import clsx from "clsx"
import { forwardRef, useEffect, useRef, type HTMLAttributes } from "react"
import Button from "./Button"
import IconButton from "./IconButton"

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean
  onClose: () => void
  closeOnOverlay?: boolean
  closeOnEscape?: boolean
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(({ className, open, onClose, closeOnOverlay = true, closeOnEscape = true, children, ...props }, ref) => {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!closeOnEscape) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, onClose, closeOnEscape])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlay && contentRef.current && !contentRef.current.contains(e.target as Node)) {
      sdk.haptics.impactOccurred("light")
      onClose()
    }
  }

  if (!open) return null

  return (
    <div
      ref={ref}
      onClick={handleOverlayClick}
      className={clsx("fixed inset-0 z-50", "flex items-center justify-center p-5", "bg-black/60 backdrop-blur-sm", "animate-in fade-in duration-200", className)}
      {...props}
    >
      <div ref={contentRef} className={clsx("relative w-full max-w-sm", "bg-(--surface)/80 rounded-3xl", "animate-in zoom-in-95 slide-in-from-bottom-4 duration-300")}>
        {children}
      </div>
    </div>
  )
})

Modal.displayName = "Modal"

interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  onClose?: () => void
}

const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(({ className, onClose, children, ...props }, ref) => {
  return (
    <div ref={ref} className={clsx("flex items-center justify-between", "px-5 pt-5 pb-3", className)} {...props}>
      <h1 className="mb-0">{children}</h1>
      {onClose && (
        <IconButton variant="ghost" size="md" aria-label="Close modal" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </IconButton>
      )}
    </div>
  )
})

ModalHeader.displayName = "ModalHeader"

type ModalBodyProps = HTMLAttributes<HTMLDivElement>

const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={clsx("px-5 py-3", className)} {...props}>
      {children}
    </div>
  )
})

ModalBody.displayName = "ModalBody"

type ModalFooterProps = HTMLAttributes<HTMLDivElement>

const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={clsx("flex items-center justify-end gap-2", "px-5 pb-5 pt-3", className)} {...props}>
      {children}
    </div>
  )
})

ModalFooter.displayName = "ModalFooter"

interface ConfirmModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: "default" | "danger"
  loading?: boolean
}

const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "confirm",
  cancelText = "cancel",
  variant = "default",
  loading = false,
}: ConfirmModalProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalHeader onClose={onClose}>{title}</ModalHeader>
      {description && <ModalBody>{description}</ModalBody>}
      <ModalFooter>
        <Button variant="ghost" onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button variant={variant === "danger" ? "danger" : "primary"} onClick={onConfirm} loading={loading}>
          {confirmText}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export { ConfirmModal, Modal, ModalBody, ModalFooter, ModalHeader }
export default Modal

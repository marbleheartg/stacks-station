import clsx from "clsx"
import NextImage from "next/image"
import { type HTMLAttributes, forwardRef } from "react"

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl"

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string | null
  alt?: string
  size?: AvatarSize
  fallback?: string
  status?: "online" | "offline" | "busy" | "away"
  bordered?: boolean
}

const sizeMap = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt = "avatar", size = "md", fallback, status, bordered = false, ...props }, ref) => {
    const dimension = sizeMap[size]

    return (
      <div
        ref={ref}
        className={clsx(
          "relative inline-flex shrink-0",
          "rounded-full overflow-hidden",
          bordered && "ring-2 ring-(--bg-border)",

          // Size classes for container
          size === "xs" && "w-6 h-6",
          size === "sm" && "w-8 h-8",
          size === "md" && "w-10 h-10",
          size === "lg" && "w-14 h-14",
          size === "xl" && "w-20 h-20",

          className,
        )}
        {...props}
      >
        {src ? (
          <NextImage src={src} alt={alt} width={dimension} height={dimension} className="rounded-full object-cover" />
        ) : (
          <div
            className={clsx(
              "w-full h-full flex items-center justify-center",
              "bg-(--surface)/50 text-(--heading)",
              "font-bold uppercase",
              size === "xs" && "text-[8px]",
              size === "sm" && "text-[10px]",
              size === "md" && "text-xs",
              size === "lg" && "text-sm",
              size === "xl" && "text-lg",
            )}
          >
            {fallback?.slice(0, 2) || "?"}
          </div>
        )}

        {status && (
          <span
            className={clsx(
              "absolute bottom-0 right-0",
              "rounded-full border-2 border-(--bg)",
              size === "xs" && "w-2 h-2",
              size === "sm" && "w-2.5 h-2.5",
              size === "md" && "w-3 h-3",
              size === "lg" && "w-3.5 h-3.5",
              size === "xl" && "w-4 h-4",

              status === "online" && "bg-emerald-400",
              status === "offline" && "bg-gray-400",
              status === "busy" && "bg-red-400",
              status === "away" && "bg-amber-400",
            )}
          />
        )}
      </div>
    )
  },
)

Avatar.displayName = "Avatar"

interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  max?: number
}

const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(({ className, children, max, ...props }, ref) => {
  const childArray = Array.isArray(children) ? children : [children]
  const visibleChildren = max ? childArray.slice(0, max) : childArray
  const overflow = max && childArray.length > max ? childArray.length - max : 0

  return (
    <div ref={ref} className={clsx("flex -space-x-2", className)} {...props}>
      {visibleChildren}
      {overflow > 0 && (
        <div
          className={clsx(
            "relative inline-flex items-center justify-center",
            "w-8 h-8 rounded-full",
            "bg-(--surface)/50 text-(--text)",
            "text-[10px] font-bold",
            "ring-2 ring-(--bg)",
          )}
        >
          +{overflow}
        </div>
      )}
    </div>
  )
})

AvatarGroup.displayName = "AvatarGroup"

export { Avatar, AvatarGroup }
export default Avatar

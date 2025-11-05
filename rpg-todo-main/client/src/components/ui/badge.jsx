import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-secondary dark:bg-secondary-light text-white",
        primary: "bg-primary text-white",
        secondary: "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100",
        destructive: "bg-red-500 text-white",
        outline: "border-2 border-primary bg-transparent text-primary",
        success: "bg-success text-white",
        high: "bg-red-500 text-white",
        medium: "bg-amber-500 text-white",
        low: "bg-green-500 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Badge = React.forwardRef(({ className, variant, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
})
Badge.displayName = "Badge"

export { Badge, badgeVariants }


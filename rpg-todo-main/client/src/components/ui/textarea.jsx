import * as React from "react"
import { cn } from "@/lib/utils"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[100px] w-full rounded-lg border-2 border-gray-200 dark:border-primary-light bg-white dark:bg-primary-dark px-4 py-3 text-base shadow-sm transition-all",
        "placeholder:text-gray-400 dark:placeholder:text-gray-500",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "text-primary dark:text-white",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }


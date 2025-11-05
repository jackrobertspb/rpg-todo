import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "h-12 w-full rounded-lg border-2 border-gray-200 dark:border-primary-light bg-white dark:bg-primary-dark px-4 py-3 text-base shadow-sm transition-all",
        "placeholder:text-gray-400 dark:placeholder:text-gray-500",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "text-primary dark:text-white",
        // Date input - position calendar icon inside on the right
        type === "date" && "relative [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:top-1/2 [&::-webkit-calendar-picker-indicator]:-translate-y-1/2 [&::-webkit-calendar-picker-indicator]:w-6 [&::-webkit-calendar-picker-indicator]:h-6 [&::-webkit-calendar-picker-indicator]:cursor-pointer",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }


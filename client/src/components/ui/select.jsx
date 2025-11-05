import * as React from "react"
import { cn } from "@/lib/utils"

const Select = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <select
      className={cn(
        "h-12 w-full rounded-lg border-2 border-gray-200 dark:border-primary-light bg-white dark:bg-primary-dark pl-4 pr-14 py-3 text-base shadow-sm transition-all",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "text-primary dark:text-white",
        "appearance-none bg-no-repeat bg-[right_1rem_center] bg-[length:1.25rem_1.25rem]",
        "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3E%3Cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27m6 8 4 4 4-4%27/%3E%3C/svg%3E')]",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Select.displayName = "Select"

export { Select }


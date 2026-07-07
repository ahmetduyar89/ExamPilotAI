import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/utils/cn"

export interface DropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Dropdown = React.forwardRef<HTMLSelectElement, DropdownProps>(
  ({ className, children, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)

    return (
      <div className={cn(
        "relative flex items-center w-full rounded-lg border border-border bg-background transition-shadow",
        isFocused ? "ring-2 ring-primary ring-offset-2 ring-offset-background border-primary" : "hover:border-text-secondary/50",
        className
      )}>
        <select
          className="h-10 w-full appearance-none bg-transparent px-3 py-2 text-body focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            props.onBlur?.(e)
          }}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-text-secondary" />
      </div>
    )
  }
)
Dropdown.displayName = "Dropdown"

export { Dropdown }

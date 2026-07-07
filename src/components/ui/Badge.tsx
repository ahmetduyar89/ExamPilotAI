import * as React from "react"
import { cn } from "@/utils/cn"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'warning' | 'error' | 'neutral'
}

function Badge({ className, variant = "neutral", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        {
          "bg-success/15 text-success": variant === "success",
          "bg-warning/15 text-warning-foreground": variant === "warning",
          "bg-danger/15 text-danger": variant === "error",
          "bg-secondary text-secondary-foreground": variant === "neutral",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }

import * as React from "react"
import { motion } from "framer-motion"
import type { HTMLMotionProps } from "framer-motion"
import { Loader2 } from "lucide-react"
import { cn } from "@/utils/cn"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'icon' | 'fab'
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'fab'
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", isLoading, disabled, children, ...props }, ref) => {
    const isFab = variant === 'fab'
    const isIcon = variant === 'icon' || size === 'icon'
    
    return (
      <motion.button
        ref={ref}
        whileTap={disabled || isLoading ? undefined : { scale: 0.97 }}
        className={cn(
          "relative inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 overflow-hidden",
          {
            "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm": variant === "primary" || variant === "fab",
            "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
            "border border-border bg-transparent hover:bg-secondary": variant === "outline",
            "bg-transparent text-text-primary hover:bg-secondary": variant === "ghost" || variant === "icon",
            "bg-danger text-danger-foreground hover:bg-danger/90 shadow-sm": variant === "danger",
            
            "h-10 px-4 py-2": size === "default" && !isFab && !isIcon,
            "h-8 rounded-md px-3 text-xs": size === "sm" && !isFab && !isIcon,
            "h-12 rounded-xl px-8 text-base": size === "lg" && !isFab && !isIcon,
            "h-10 w-10": size === "icon" || isIcon,
            "h-14 w-14 rounded-full shadow-lg hover:shadow-xl": size === "fab" || isFab,
          },
          className
        )}
        disabled={disabled || isLoading}
        {...(props as any)}
      >
        {isLoading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        <span className={cn("flex items-center justify-center", isLoading && "opacity-0")}>
          {children as React.ReactNode}
        </span>
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin" />
          </span>
        )}
      </motion.button>
    )
  }
)
Button.displayName = "Button"

export { Button }

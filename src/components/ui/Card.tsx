import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/utils/cn"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'statistic' | 'glass' | 'information' | 'action'
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    
    if (variant === 'action') {
      return (
        <motion.div
          ref={ref}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "rounded-xl border border-border bg-card text-card-foreground shadow-sm cursor-pointer transition-colors hover:border-primary/50",
            className
          )}
          {...(props as any)}
        />
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border border-border text-card-foreground",
          {
            "bg-card shadow-sm": variant === 'default' || variant === 'statistic' || variant === 'information',
            "bg-card/60 backdrop-blur-md shadow-glass": variant === 'glass',
            "border-l-4 border-l-primary": variant === 'information',
          },
          className
        )}
        {...props}
      />
    )
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-h3", className)}
      {...props}
    />
  )
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-body text-text-secondary", className)}
      {...props}
    />
  )
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  )
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

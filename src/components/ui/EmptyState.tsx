import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/utils/cn"

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ icon, title, description, action, className, ...props }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-8 text-center animate-in fade-in duration-500",
        className
      )}
      {...props}
    >
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.4 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-muted-foreground mb-6"
      >
        <div className="h-10 w-10 [&>svg]:h-full [&>svg]:w-full opacity-50">
          {icon}
        </div>
      </motion.div>
      <h3 className="text-h3 mb-2">{title}</h3>
      {description && <p className="text-body text-text-secondary max-w-sm mb-6">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  )
}

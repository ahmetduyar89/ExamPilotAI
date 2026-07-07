import * as React from "react"
import { cn } from "@/utils/cn"

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-secondary/80", className)}
      {...props}
    />
  )
}

export function Shimmer({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-secondary/50",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-background/40 to-transparent" />
    </div>
  )
}

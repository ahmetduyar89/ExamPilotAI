import * as React from "react"
import { cn } from "@/utils/cn"

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  variant?: 'linear' | 'circular'
  size?: number
}

function Progress({ className, value = 0, max = 100, variant = 'linear', size = 48, ...props }: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  if (variant === 'circular') {
    const strokeWidth = size * 0.1
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const offset = circumference - (percentage / 100) * circumference

    return (
      <div 
        className={cn("relative inline-flex items-center justify-center", className)} 
        style={{ width: size, height: size }}
        {...props}
      >
        <svg className="rotate-[-90deg] w-full h-full">
          <circle
            className="text-secondary stroke-current"
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            className="text-primary stroke-current transition-all duration-500 ease-in-out"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
      </div>
    )
  }

  // Linear
  return (
    <div
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-secondary", className)}
      {...props}
    >
      <div
        className="h-full w-full flex-1 bg-primary transition-all duration-500 ease-in-out"
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </div>
  )
}

export { Progress }

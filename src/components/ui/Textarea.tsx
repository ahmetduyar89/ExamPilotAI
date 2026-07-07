import * as React from "react"
import { cn } from "@/utils/cn"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)

    return (
      <div className={cn(
        "relative flex w-full rounded-lg border border-border bg-background transition-shadow",
        isFocused ? "ring-2 ring-primary ring-offset-2 ring-offset-background border-primary" : "hover:border-text-secondary/50",
        className
      )}>
        <textarea
          className="flex min-h-[80px] w-full bg-transparent px-3 py-2 text-body placeholder:text-text-secondary focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-y"
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
        />
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }

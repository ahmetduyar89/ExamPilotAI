import * as React from "react"
import { Search, Eye, EyeOff } from "lucide-react"
import { cn } from "@/utils/cn"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  variant?: 'default' | 'search' | 'password'
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = 'default', leftIcon, rightIcon, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [isFocused, setIsFocused] = React.useState(false)

    const isSearch = variant === 'search' || type === 'search'
    const isPassword = variant === 'password' || type === 'password'
    
    const actualType = isPassword ? (showPassword ? 'text' : 'password') : type

    return (
      <div className={cn(
        "relative flex items-center w-full rounded-lg border border-border bg-background px-3 transition-shadow",
        isFocused ? "ring-2 ring-primary ring-offset-2 ring-offset-background border-primary" : "hover:border-text-secondary/50",
        className
      )}>
        {isSearch && !leftIcon && (
          <Search className="mr-2 h-4 w-4 text-text-secondary shrink-0" />
        )}
        {leftIcon && <div className="mr-2 shrink-0 text-text-secondary">{leftIcon}</div>}
        
        <input
          type={actualType}
          className="flex h-10 w-full bg-transparent py-2 text-body placeholder:text-text-secondary focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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

        {rightIcon && <div className="ml-2 shrink-0 text-text-secondary">{rightIcon}</div>}
        {isPassword && !rightIcon && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="ml-2 rounded-md p-1 hover:bg-secondary text-text-secondary transition-colors focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }

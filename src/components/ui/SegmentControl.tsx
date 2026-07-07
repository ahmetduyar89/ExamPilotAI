import { motion } from "framer-motion"
import { cn } from "@/utils/cn"

interface Segment {
  label: string
  value: string
}

export interface SegmentControlProps {
  segments: Segment[]
  activeSegment: string
  onChange: (value: string) => void
  className?: string
}

export function SegmentControl({ segments, activeSegment, onChange, className }: SegmentControlProps) {
  return (
    <div className={cn("relative flex items-center bg-secondary/50 rounded-lg p-1", className)}>
      {segments.map((segment) => {
        const isActive = activeSegment === segment.value
        return (
          <button
            key={segment.value}
            onClick={() => onChange(segment.value)}
            className={cn(
              "relative flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none z-10",
              isActive ? "text-primary-foreground" : "text-text-secondary hover:text-text-primary"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="segment-active"
                className="absolute inset-0 bg-primary rounded-md shadow-sm -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-20">{segment.label}</span>
          </button>
        )
      })}
    </div>
  )
}

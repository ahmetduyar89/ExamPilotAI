import * as React from "react"
import { motion, AnimatePresence, useDragControls } from "framer-motion"
import { cn } from "@/utils/cn"

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export function BottomSheet({ isOpen, onClose, children, className }: BottomSheetProps) {
  const dragControls = useDragControls()

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          />
          <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center pointer-events-none">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              drag="y"
              dragControls={dragControls}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100 || info.velocity.y > 500) {
                  onClose()
                }
              }}
              className={cn(
                "relative w-full max-w-2xl rounded-t-[32px] bg-card border-t border-x border-border shadow-[0_-8px_32px_rgba(0,0,0,0.1)] pointer-events-auto pb-safe",
                className
              )}
            >
              <div 
                className="flex w-full cursor-grab active:cursor-grabbing justify-center p-4 touch-none"
                onPointerDown={(e) => dragControls.start(e)}
              >
                <div className="h-1.5 w-12 rounded-full bg-border" />
              </div>
              <div className="px-6 pb-6 pt-2 max-h-[80vh] overflow-y-auto">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

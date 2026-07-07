import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/utils/cn"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  // Prevent scrolling when modal is open
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className={cn(
                "relative w-full max-w-lg rounded-2xl bg-card border border-border shadow-xl pointer-events-auto",
                className
              )}
            >
              <div className="flex items-center justify-between p-6 border-b border-border/50">
                {title && <h2 className="text-h3">{title}</h2>}
                <button
                  onClick={onClose}
                  className="rounded-full p-2 hover:bg-secondary transition-colors focus:outline-none"
                >
                  <X className="h-5 w-5 text-text-secondary" />
                </button>
              </div>
              <div className="p-6">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

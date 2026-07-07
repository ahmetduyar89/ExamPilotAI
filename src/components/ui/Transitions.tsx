import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"

export function PageTransition({ children, locationKey }: { children: React.ReactNode, locationKey: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={locationKey}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className="h-full w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export function FadeTransition({ children, isVisible }: { children: React.ReactNode, isVisible: boolean }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

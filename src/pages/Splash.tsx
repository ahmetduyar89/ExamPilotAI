import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => navigate('/dashboard'), 2200)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-primary">
      {/* Ambient glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        className="pointer-events-none absolute h-[420px] w-[420px] rounded-full bg-primary-foreground/10 blur-3xl"
      />

      <div className="relative flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', bounce: 0.4, duration: 0.9 }}
          className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-primary-foreground shadow-2xl"
        >
          <Sparkles className="h-11 w-11 text-primary" strokeWidth={2.2} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="mt-7 font-display text-3xl font-semibold tracking-tight text-primary-foreground"
        >
          ExamPilot AI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="mt-2 text-sm font-medium text-primary-foreground"
        >
          Grade smarter. Learn faster.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-14"
        >
          <div className="h-1 w-24 overflow-hidden rounded-full bg-primary-foreground/20">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
              className="h-full w-1/2 rounded-full bg-primary-foreground/80"
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

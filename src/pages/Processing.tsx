import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Loader2, Sparkles, ScanLine, LayoutGrid, ListChecks, Calculator, Brain } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

const steps = [
  { id: 'upload', label: 'Uploading answer sheet', icon: ScanLine },
  { id: 'enhance', label: 'Enhancing image quality', icon: Sparkles },
  { id: 'layout', label: 'Detecting form layout', icon: LayoutGrid },
  { id: 'read', label: 'Reading marked answers', icon: ListChecks },
  { id: 'score', label: 'Scoring & grading', icon: Calculator },
  { id: 'insights', label: 'Building insights', icon: Brain },
]

export default function Processing() {
  const navigate = useNavigate()
  const [active, setActive] = React.useState(0)
  const done = active >= steps.length

  React.useEffect(() => {
    if (done) return
    const t = setTimeout(() => setActive((a) => a + 1), active === 0 ? 600 : 850)
    return () => clearTimeout(t)
  }, [active, done])

  const progress = Math.min(100, Math.round((active / steps.length) * 100))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-[70vh] flex-col items-center justify-center space-y-10 text-center"
    >
      {/* Ring */}
      <div className="relative flex h-44 w-44 items-center justify-center">
        <ProgressRing value={done ? 100 : progress} />
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="done"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="absolute flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg"
            >
              <Check className="h-10 w-10" strokeWidth={3} />
            </motion.div>
          ) : (
            <motion.div key="pct" className="absolute flex flex-col items-center">
              <span className="font-display text-4xl font-semibold tabular-nums tracking-tight">{progress}</span>
              <span className="text-xs font-medium text-text-secondary">percent</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          {done ? 'Analysis ready' : 'Analyzing exam'}
        </h1>
        <p className="mx-auto mt-2 max-w-xs text-sm text-text-secondary">
          {done
            ? 'We scored the sheet and mapped every topic. Take a look.'
            : 'Hang tight — this usually takes a few seconds.'}
        </p>
      </div>

      {/* Steps */}
      <div className="w-full max-w-sm space-y-1.5 rounded-3xl border border-border/70 bg-card p-3 shadow-sm">
        {steps.map((step, i) => {
          const isDone = i < active
          const isActive = i === active && !done
          return (
            <div key={step.id} className="flex items-center gap-3.5 rounded-2xl px-3 py-2.5">
              <span
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-300',
                  isDone ? 'bg-emerald-500 text-white' : isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary text-text-secondary'
                )}
              >
                {isDone ? (
                  <Check className="h-4 w-4" strokeWidth={3} />
                ) : isActive ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <step.icon className="h-4 w-4" />
                )}
              </span>
              <span
                className={cn(
                  'text-[15px] font-medium transition-colors duration-300',
                  isDone || isActive ? 'text-text-primary' : 'text-text-secondary'
                )}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>

      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm"
          >
            <Button size="lg" className="w-full rounded-2xl" onClick={() => navigate('/analytics')}>
              View analysis
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function ProgressRing({ value }: { value: number }) {
  const size = 176
  const stroke = 12
  const r = (size - stroke) / 2
  const c = r * 2 * Math.PI
  const offset = c - (value / 100) * c
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="text-secondary" stroke="currentColor" />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        strokeWidth={stroke}
        strokeLinecap="round"
        className="text-primary"
        stroke="currentColor"
        strokeDasharray={c}
        animate={{ strokeDashoffset: offset }}
        transition={{ type: 'spring', bounce: 0, duration: 0.7 }}
      />
    </svg>
  )
}

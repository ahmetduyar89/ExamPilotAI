import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  X, Check, Sparkles, ScanLine, Brain, Calendar, TrendingUp, ChevronRight,
} from 'lucide-react'
import { premiumFeatures, premiumPlans } from '@/mocks/data'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

const iconMap: Record<string, typeof ScanLine> = {
  ScanLine, Brain, Calendar, TrendingUp, Sparkles,
}

export default function Premium() {
  const navigate = useNavigate()
  const [plan, setPlan] = React.useState<'monthly' | 'annual'>('annual')
  const selected = premiumPlans[plan]

  return (
    <div className="relative min-h-[100dvh] overflow-y-auto bg-background text-text-primary">
      {/* Ambient header wash */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-primary/[0.07] to-transparent" />

      <div className="relative mx-auto w-full max-w-md px-6 pb-40 pt-[max(20px,env(safe-area-inset-top))]">
        {/* Close */}
        <div className="flex justify-end pt-3">
          <button
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-text-secondary transition-colors active:bg-border"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 flex flex-col items-center text-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-primary text-primary-foreground shadow-xl">
            <Sparkles className="h-8 w-8" />
          </div>
          <h1 className="mt-5 font-display text-[28px] font-semibold leading-tight tracking-tight">
            ExamPilot <span className="text-text-secondary">Premium</span>
          </h1>
          <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-text-secondary">
            Unlock unlimited scans, AI-powered analysis, and adaptive study plans.
          </p>
        </motion.div>

        {/* Features */}
        <motion.ul
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } }}
          className="mt-8 space-y-3"
        >
          {premiumFeatures.map((f) => {
            const Icon = iconMap[f.icon] ?? Sparkles
            return (
              <motion.li
                key={f.title}
                variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                className="flex items-center gap-4 rounded-3xl border border-border/70 bg-card p-4 shadow-sm"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary">
                  <Icon className="h-5 w-5 text-text-primary" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold">{f.title}</p>
                  <p className="text-[13px] leading-snug text-text-secondary">{f.desc}</p>
                </div>
                <Check className="h-5 w-5 shrink-0 text-emerald-500" strokeWidth={2.5} />
              </motion.li>
            )
          })}
        </motion.ul>

        {/* Plan toggle */}
        <div className="mt-8 grid grid-cols-2 gap-3">
          {(['annual', 'monthly'] as const).map((id) => {
            const p = premiumPlans[id]
            const active = plan === id
            return (
              <button
                key={id}
                onClick={() => setPlan(id)}
                className={cn(
                  'relative rounded-3xl border-2 p-4 text-left transition-all duration-300',
                  active ? 'border-primary bg-card shadow-md' : 'border-border/70 bg-card'
                )}
              >
                {p.badge && (
                  <span className="absolute -top-2.5 right-3 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
                    {p.badge}
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-text-secondary">{p.label}</span>
                  <span
                    className={cn(
                      'flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors',
                      active ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
                    )}
                  >
                    {active && <Check className="h-3 w-3" strokeWidth={3} />}
                  </span>
                </div>
                <p className="mt-2 font-display text-xl font-semibold tracking-tight">
                  {p.price}
                  <span className="text-[13px] font-medium text-text-secondary">{p.period}</span>
                </p>
                <p className="mt-0.5 text-[11px] text-text-secondary">{p.note}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-border/60 bg-card/80 px-6 pb-[max(20px,env(safe-area-inset-bottom))] pt-4 backdrop-blur-2xl">
        <div className="mx-auto w-full max-w-md">
          <Button size="lg" className="w-full rounded-2xl" onClick={() => navigate('/dashboard')}>
            Start 7-day free trial
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
          <p className="mt-2.5 text-center text-[11px] text-text-secondary">
            Then {selected.price}{selected.period} · Cancel anytime · Restore purchase
          </p>
        </div>
      </div>
    </div>
  )
}

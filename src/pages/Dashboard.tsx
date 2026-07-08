import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ScanLine, ChevronRight, TrendingUp, Flame, FileText, CalendarDays, ArrowRight,
} from 'lucide-react'
import { homeStats, recentExams, weeklyPlan, userProfile } from '@/mocks/data'
import { cn } from '@/utils/cn'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, bounce: 0, duration: 0.5 } },
}

export default function Dashboard() {
  const navigate = useNavigate()
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-7">
      {/* Header */}
      <motion.header variants={item} className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-text-secondary">{today}</p>
          <h1 className="mt-1 font-display text-[28px] font-semibold leading-tight tracking-tight">
            {greeting()}, {userProfile.name.split(' ')[0]}
          </h1>
        </div>
        <button
          onClick={() => navigate('/profile')}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-base font-semibold text-white shadow-md"
        >
          {userProfile.name.split(' ').map((n) => n[0]).join('')}
        </button>
      </motion.header>

      {/* Primary action */}
      <motion.button
        variants={item}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/exams/upload')}
        className="relative w-full overflow-hidden rounded-[28px] bg-primary p-6 text-left text-primary-foreground shadow-xl"
      >
        <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-primary-foreground/10 blur-2xl" />
        <div className="relative flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-foreground/15 backdrop-blur">
            <ScanLine className="h-7 w-7" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-lg font-semibold tracking-tight">Scan a new exam</p>
            <p className="mt-0.5 text-sm opacity-70">Snap the answer sheet — get instant analysis</p>
          </div>
          <ChevronRight className="h-5 w-5 opacity-70" />
        </div>
      </motion.button>

      {/* Stats grid */}
      <motion.section variants={item} className="grid grid-cols-2 gap-3">
        {homeStats.map((s) => (
          <div key={s.key} className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm">
            <p className="text-xs font-medium text-text-secondary">{s.label}</p>
            <p className="mt-2 font-display text-2xl font-semibold tracking-tight">{s.value}</p>
            <p className="mt-1 flex items-center gap-1 text-xs font-medium text-emerald-500">
              {s.key === 'streak' ? <Flame className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
              {s.delta}
            </p>
          </div>
        ))}
      </motion.section>

      {/* This week plan preview */}
      <motion.button
        variants={item}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/study-plan')}
        className="flex w-full items-center gap-4 rounded-3xl border border-border/70 bg-card p-5 text-left shadow-sm"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary">
          <CalendarDays className="h-6 w-6 text-text-primary" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold tracking-tight">This week's study plan</p>
          <p className="mt-0.5 text-sm text-text-secondary">
            {weeklyPlan.rangeLabel} · <span className="text-emerald-500 font-medium">+{weeklyPlan.expectedGain} net expected</span>
          </p>
        </div>
        <ArrowRight className="h-5 w-5 text-text-secondary" />
      </motion.button>

      {/* Recent exams */}
      <motion.section variants={item} className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-[17px] font-semibold tracking-tight">Recent exams</h2>
          <button onClick={() => navigate('/analytics')} className="text-sm font-medium text-text-secondary">
            See all
          </button>
        </div>

        <div className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm">
          {recentExams.map((exam, i) => (
            <button
              key={exam.id}
              onClick={() => navigate('/analytics')}
              className={cn(
                'flex w-full items-center gap-4 px-5 py-4 text-left transition-colors active:bg-secondary/60',
                i !== recentExams.length - 1 && 'border-b border-border/60'
              )}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary">
                <FileText className="h-5 w-5 text-text-primary" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold tracking-tight">{exam.examName}</p>
                <p className="mt-0.5 truncate text-[13px] text-text-secondary">
                  {exam.studentName} · {exam.publisher} · {exam.date}
                </p>
              </div>
              <div className="text-right">
                <p className={cn('font-display text-lg font-semibold tabular-nums', exam.accent)}>{exam.scorePct}</p>
                <p className="text-[11px] text-text-secondary">
                  {exam.net}/{exam.total} net
                </p>
              </div>
            </button>
          ))}
        </div>
      </motion.section>
    </motion.div>
  )
}

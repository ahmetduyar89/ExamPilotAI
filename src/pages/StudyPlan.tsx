import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb, Dumbbell, Repeat, Check, Clock, TrendingUp, Moon } from 'lucide-react'
import { weeklyPlan, type PlanTask } from '@/mocks/data'
import { cn } from '@/utils/cn'

const typeMeta: Record<PlanTask['type'], { label: string; icon: typeof Lightbulb; tone: string; chip: string }> = {
  learn: { label: 'Learn', icon: Lightbulb, tone: 'text-indigo-500', chip: 'bg-indigo-500/10 text-indigo-500' },
  practice: { label: 'Practice', icon: Dumbbell, tone: 'text-amber-500', chip: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  review: { label: 'Review', icon: Repeat, tone: 'text-emerald-500', chip: 'bg-emerald-500/10 text-emerald-500' },
}

export default function StudyPlan() {
  const todayIndex = Math.max(0, weeklyPlan.days.findIndex((d) => d.today))
  const [selected, setSelected] = React.useState(todayIndex)
  const [done, setDone] = React.useState<Record<string, boolean>>({})

  const day = weeklyPlan.days[selected]
  const dayMinutes = day.tasks.reduce((s, t) => s + t.duration, 0)
  const completed = day.tasks.filter((t) => done[t.id]).length
  const total = day.tasks.length

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      <header>
        <p className="text-sm font-medium text-text-secondary">Weekly plan</p>
        <h1 className="mt-1 font-display text-[28px] font-semibold leading-tight tracking-tight">Study schedule</h1>
        <p className="mt-1 text-sm text-text-secondary">{weeklyPlan.rangeLabel}</p>
      </header>

      {/* Summary */}
      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
            <TrendingUp className="h-5 w-5" />
          </div>
          <p className="font-display text-2xl font-semibold tracking-tight">+{weeklyPlan.expectedGain}</p>
          <p className="text-xs text-text-secondary">Projected net gain</p>
        </div>
        <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-secondary">
            <Clock className="h-5 w-5" />
          </div>
          <p className="font-display text-2xl font-semibold tracking-tight">{weeklyPlan.totalMinutes}<span className="text-base text-text-secondary"> min</span></p>
          <p className="text-xs text-text-secondary">Total this week</p>
        </div>
      </section>

      {/* Day selector */}
      <section className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {weeklyPlan.days.map((d, i) => {
          const active = i === selected
          return (
            <button
              key={d.day}
              onClick={() => setSelected(i)}
              className={cn(
                'relative flex h-[68px] w-[52px] shrink-0 flex-col items-center justify-center rounded-2xl border transition-all duration-300',
                active ? 'border-primary bg-primary text-primary-foreground shadow-sm' : 'border-border/70 bg-card text-text-primary'
              )}
            >
              <span className={cn('text-[11px] font-medium', active ? 'opacity-70' : 'text-text-secondary')}>{d.day}</span>
              <span className="mt-0.5 font-display text-lg font-semibold tabular-nums">{d.date}</span>
              {d.today && (
                <span className={cn('absolute bottom-1.5 h-1 w-1 rounded-full', active ? 'bg-primary-foreground' : 'bg-primary')} />
              )}
            </button>
          )
        })}
      </section>

      {/* Day header */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-[17px] font-semibold tracking-tight">
          {day.today ? 'Today' : day.day} · {day.focus}
        </h2>
        {total > 0 && (
          <span className="text-sm font-medium text-text-secondary tabular-nums">
            {completed}/{total} · {dayMinutes} min
          </span>
        )}
      </div>

      {/* Tasks */}
      <AnimatePresence mode="wait">
        <motion.section
          key={selected}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.25 }}
          className="space-y-2.5"
        >
          {day.tasks.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-card/60 p-10 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-text-secondary">
                <Moon className="h-6 w-6" />
              </span>
              <div>
                <p className="font-semibold">Rest day</p>
                <p className="text-sm text-text-secondary">Recover and reflect — you've earned it.</p>
              </div>
            </div>
          ) : (
            day.tasks.map((task) => {
              const meta = typeMeta[task.type]
              const isDone = !!done[task.id]
              return (
                <button
                  key={task.id}
                  onClick={() => setDone((p) => ({ ...p, [task.id]: !p[task.id] }))}
                  className={cn(
                    'flex w-full items-center gap-4 rounded-3xl border p-4 text-left transition-all duration-300',
                    isDone ? 'border-border/60 bg-secondary/40' : 'border-border/70 bg-card shadow-sm'
                  )}
                >
                  <span
                    className={cn(
                      'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-colors duration-300',
                      isDone ? 'bg-emerald-500 text-white' : 'bg-secondary'
                    )}
                  >
                    {isDone ? <Check className="h-5 w-5" strokeWidth={3} /> : <meta.icon className={cn('h-5 w-5', meta.tone)} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={cn('text-[15px] font-semibold transition-all', isDone && 'text-text-secondary line-through')}>
                      {task.topic}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-semibold', meta.chip)}>{meta.label}</span>
                      <span className="text-[12px] text-text-secondary">{task.domain}</span>
                    </div>
                  </div>
                  <span className="shrink-0 text-[13px] font-medium text-text-secondary tabular-nums">{task.duration}m</span>
                </button>
              )
            })
          )}
        </motion.section>
      </AnimatePresence>
    </motion.div>
  )
}

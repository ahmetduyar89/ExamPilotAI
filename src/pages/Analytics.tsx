import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, TrendingUp, TrendingDown, ShieldCheck, ArrowRight, CheckCircle2, XCircle, MinusCircle } from 'lucide-react'
import { analysis, type TopicScore } from '@/mocks/data'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

function masteryColor(m: number) {
  if (m >= 75) return { text: 'text-emerald-500', bar: 'bg-emerald-500' }
  if (m >= 55) return { text: 'text-amber-500', bar: 'bg-amber-500' }
  return { text: 'text-rose-500', bar: 'bg-rose-500' }
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } }
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, bounce: 0, duration: 0.5 } },
}

export default function Analytics() {
  const navigate = useNavigate()
  const topics = [...analysis.topics].sort((a, b) => b.mastery - a.mastery)

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.header variants={item} className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-text-secondary">Analysis result</p>
          <h1 className="mt-1 font-display text-[26px] font-semibold leading-tight tracking-tight">{analysis.examName}</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {analysis.student.name} · {analysis.publisher} · {analysis.date}
          </p>
        </div>
        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-500">
          <ShieldCheck className="h-3.5 w-3.5" />
          {analysis.qualityScore}% scan
        </span>
      </motion.header>

      {/* Score hero */}
      <motion.section
        variants={item}
        className="rounded-[28px] border border-border/70 bg-card p-6 shadow-sm"
      >
        <div className="flex items-center gap-6">
          <ScoreRing value={analysis.scorePct} />
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-sm text-text-secondary">Net score</p>
              <p className="font-display text-2xl font-semibold tracking-tight">
                {analysis.net}
                <span className="text-base font-medium text-text-secondary"> / {analysis.total}</span>
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/10 px-3 py-2 text-emerald-500">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-semibold">+{analysis.predictedGain} net projected</span>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2.5">
          <Tally icon={CheckCircle2} label="Correct" value={analysis.correct} tone="text-emerald-500" />
          <Tally icon={XCircle} label="Wrong" value={analysis.wrong} tone="text-rose-500" />
          <Tally icon={MinusCircle} label="Blank" value={analysis.blank} tone="text-text-secondary" />
        </div>
      </motion.section>

      {/* Topic breakdown */}
      <motion.section variants={item} className="space-y-3">
        <h2 className="px-1 text-[17px] font-semibold tracking-tight">Topic breakdown</h2>
        <div className="space-y-2.5 rounded-3xl border border-border/70 bg-card p-4 shadow-sm">
          {topics.map((t) => (
            <TopicRow key={t.id} topic={t} />
          ))}
        </div>
      </motion.section>

      {/* Coach notes */}
      <motion.section
        variants={item}
        className="rounded-3xl border border-border/70 bg-gradient-to-br from-primary/[0.03] to-primary/[0.07] p-5 shadow-sm"
      >
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          <h2 className="text-[17px] font-semibold tracking-tight">Coach notes</h2>
        </div>
        <ul className="space-y-2.5">
          {analysis.coachNotes.map((note, i) => (
            <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-text-primary">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {note}
            </li>
          ))}
        </ul>
      </motion.section>

      {/* CTA */}
      <motion.div variants={item}>
        <Button size="lg" className="w-full rounded-2xl" onClick={() => navigate('/study-plan')}>
          Create study plan
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </motion.div>
  )
}

function Tally({ icon: Icon, label, value, tone }: { icon: typeof CheckCircle2; label: string; value: number; tone: string }) {
  return (
    <div className="rounded-2xl bg-secondary/60 p-3 text-center">
      <Icon className={cn('mx-auto h-5 w-5', tone)} />
      <p className="mt-1.5 font-display text-lg font-semibold tabular-nums">{value}</p>
      <p className="text-[11px] font-medium text-text-secondary">{label}</p>
    </div>
  )
}

function TopicRow({ topic }: { topic: TopicScore }) {
  const c = masteryColor(topic.mastery)
  const up = topic.trend >= 0
  return (
    <div className="rounded-2xl px-2 py-2">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-medium">{topic.name}</p>
          <p className="text-[12px] text-text-secondary">{topic.domain}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn('flex items-center gap-0.5 text-[12px] font-medium', up ? 'text-emerald-500' : 'text-rose-500')}>
            {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {up ? '+' : ''}{topic.trend}
          </span>
          <span className={cn('w-9 text-right font-display text-[15px] font-semibold tabular-nums', c.text)}>
            {topic.mastery}
          </span>
        </div>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${topic.mastery}%` }}
          transition={{ type: 'spring', bounce: 0, duration: 0.9 }}
          className={cn('h-full rounded-full', c.bar)}
        />
      </div>
    </div>
  )
}

function ScoreRing({ value }: { value: number }) {
  const size = 104
  const stroke = 10
  const r = (size - stroke) / 2
  const circ = r * 2 * Math.PI
  const offset = circ - (value / 100) * circ
  return (
    <div className="relative flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
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
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ type: 'spring', bounce: 0, duration: 1 }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display text-2xl font-semibold tabular-nums tracking-tight">{value}</span>
        <span className="text-[10px] font-medium text-text-secondary">SCORE</span>
      </div>
    </div>
  )
}

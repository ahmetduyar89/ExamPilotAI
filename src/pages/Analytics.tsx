import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, TrendingUp, TrendingDown, ShieldCheck, ArrowRight, CheckCircle2, XCircle, MinusCircle, BarChart3, AlertCircle } from 'lucide-react'
import { useExams } from '@/features/exam/hooks'
import { useStudents } from '@/features/student/hooks'
import { studentFullName } from '@/features/student/types'
import { usePdfAnalysis } from '@/features/pdfAnalysis/hooks'
import { pdfAnalysisRepo } from '@/features/pdfAnalysis/repository'
import { useStudentTwin } from '@/features/studentTwin/hooks'
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
  const { data: exams = [] } = useExams()
  const { data: students = [] } = useStudents()

  // An exam only belongs in Analytics once its PdfAnalysis has actually
  // completed. exam.status is 'completed' the moment upload succeeds, so it
  // cannot be used as a proxy for "analysed" — otherwise a freshly uploaded
  // exam hides every genuinely completed analysis behind the default selection.
  const [analyzedExamIds, setAnalyzedExamIds] = React.useState<Set<string> | null>(null)

  React.useEffect(() => {
    let active = true
    pdfAnalysisRepo.findAll().then(list => {
      if (!active) return
      setAnalyzedExamIds(new Set(list.filter(a => a.status === 'completed').map(a => a.examId)))
    })
    return () => { active = false }
  }, [exams])

  const completedExams = React.useMemo(
    () => (analyzedExamIds ? exams.filter(e => analyzedExamIds.has(e.id)) : []),
    [exams, analyzedExamIds],
  )
  const [selectedExamId, setSelectedExamId] = React.useState('')

  React.useEffect(() => {
    // Keep the selection pointing at a still-valid analysed exam.
    if (completedExams.length === 0) return
    if (!selectedExamId || !completedExams.some(e => e.id === selectedExamId)) {
      setSelectedExamId(completedExams[0].id)
    }
  }, [completedExams, selectedExamId])

  const { analysis, loading: analysisLoading } = usePdfAnalysis(selectedExamId, false)
  const { twin } = useStudentTwin(analysis?.examId ? exams.find(e => e.id === analysis.examId)?.studentId : undefined, true)

  const activeExam = React.useMemo(() => completedExams.find(e => e.id === selectedExamId), [completedExams, selectedExamId])
  const activeStudentName = React.useMemo(() => {
    if (!activeExam) return '—'
    const std = students.find(s => s.id === activeExam.studentId)
    return std ? studentFullName(std) : '—'
  }, [activeExam, students])

  if (analyzedExamIds === null) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto py-4">
        <div className="h-6 w-24 bg-secondary/50 animate-pulse rounded-md" />
        <div className="h-44 w-full bg-secondary/30 animate-pulse rounded-3xl" />
      </div>
    )
  }

  if (completedExams.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center p-6 space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-text-secondary">
          <BarChart3 className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-semibold text-text-primary">Okunmuş Sınav Yok</h3>
          <p className="text-xs text-text-secondary mt-1">Konu analizlerini görüntüleyebilmek için öncelikle en az bir deneme sınavı analiz etmelisiniz.</p>
        </div>
        <Button className="rounded-xl px-4 py-2 text-xs" onClick={() => navigate('/exams/upload')}>
          Sınav Yükle
        </Button>
      </div>
    )
  }

  if (analysisLoading || !analysis) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto py-4">
        <div className="h-6 w-24 bg-secondary/50 animate-pulse rounded-md" />
        <div className="h-44 w-full bg-secondary/30 animate-pulse rounded-3xl" />
      </div>
    )
  }

  if (analysis.status !== 'completed') {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center text-center p-6 space-y-4">
        <AlertCircle className="h-8 w-8 text-amber-500" />
        <div>
          <h3 className="font-semibold text-text-primary">Analiz Tamamlanmadı</h3>
          <p className="text-xs text-text-secondary mt-1">Seçilen sınavın analizi henüz tamamlanmadı veya başarısız oldu.</p>
        </div>
      </div>
    )
  }

  const correct = analysis.examStatistics.correct ?? 0
  const wrong = analysis.examStatistics.wrong ?? 0
  const blank = analysis.examStatistics.blank ?? 0
  const total = correct + wrong + blank
  const scorePct = total > 0 ? Math.round((correct / total) * 100) : 0
  const net = analysis.examStatistics.net ?? 0

  const topics = [...analysis.topicAnalysis].sort((a, b) => b.successRate - a.successRate)

  // Generate dynamic coaching recommendations from twin metrics
  const coachNotes = [
    twin?.prediction?.likelyImprovement || 'Ders programındaki hedeflerin takip edilmesi akademik gelişimi destekliyor.',
    twin?.prediction?.likelyRegression || 'Zayıf kazanımlara yönelik soru çözümleri puan kararlılığını artıracaktır.',
    twin?.learning?.weakTopics && twin.learning.weakTopics.length > 0 
      ? `Kritik odaklanılması gereken konu: "${twin.learning.weakTopics[0]}"` 
      : 'Konu dağılımında kritik zayıflık bulunmuyor, genel tekrar pratikleri yapılmalıdır.'
  ]

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Selector and Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-sm font-medium text-text-secondary">Analiz Raporu</p>
          <h1 className="mt-1 font-display text-[26px] font-semibold leading-tight tracking-tight">Sınav Analizleri</h1>
        </div>
        <select
          value={selectedExamId}
          onChange={e => setSelectedExamId(e.target.value)}
          className="bg-card border border-border/40 text-xs rounded-xl p-2.5 text-text-primary shadow-sm"
        >
          {completedExams.map(e => (
            <option key={e.id} value={e.id}>{e.examTitle}</option>
          ))}
        </select>
      </div>

      {/* Header Info */}
      <motion.header variants={item} className="flex items-start justify-between gap-4 border-t border-border/40 pt-4">
        <div>
          <h2 className="font-display text-xl font-bold tracking-tight text-text-primary">{activeExam?.examTitle}</h2>
          <p className="mt-1 text-sm text-text-secondary">
            {activeStudentName} · {activeExam?.publisher || 'Yayıncı Yok'} · {new Date(activeExam?.createdAt ?? '').toLocaleDateString('tr-TR')}
          </p>
        </div>
        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-500">
          <ShieldCheck className="h-3.5 w-3.5" />
          %{analysis.documentStructure.containsSelectableText ? 100 : 90} tarama kalitesi
        </span>
      </motion.header>

      {/* Score hero */}
      <motion.section
        variants={item}
        className="rounded-[28px] border border-border/70 bg-card p-6 shadow-sm"
      >
        <div className="flex items-center gap-6">
          <ScoreRing value={scorePct} />
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-sm text-text-secondary">Net doğru sayısı</p>
              <p className="font-display text-2xl font-semibold tracking-tight">
                {net.toFixed(1)}
                <span className="text-base font-medium text-text-secondary"> / {total}</span>
              </p>
            </div>
            {analysis.examStatistics.score !== null && (
              <div className="flex items-center gap-2 rounded-2xl bg-primary/5 px-3 py-2 text-primary">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-bold">LGS Puanı: {analysis.examStatistics.score.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2.5">
          <Tally icon={CheckCircle2} label="Doğru" value={correct} tone="text-emerald-500" />
          <Tally icon={XCircle} label="Yanlış" value={wrong} tone="text-rose-500" />
          <Tally icon={MinusCircle} label="Boş" value={blank} tone="text-text-secondary" />
        </div>
      </motion.section>

      {/* Topic breakdown */}
      {topics.length > 0 && (
        <motion.section variants={item} className="space-y-3">
          <h2 className="px-1 text-[17px] font-semibold tracking-tight">Konu analizi</h2>
          <div className="space-y-2.5 rounded-3xl border border-border/70 bg-card p-4 shadow-sm">
            {topics.map((t, idx) => (
              <TopicRow key={idx} topic={t} />
            ))}
          </div>
        </motion.section>
      )}

      {/* Coach notes */}
      <motion.section
        variants={item}
        className="rounded-3xl border border-border/70 bg-gradient-to-br from-primary/[0.03] to-primary/[0.07] p-5 shadow-sm"
      >
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          <h2 className="text-[17px] font-semibold tracking-tight">Yapay zeka antrenör notları</h2>
        </div>
        <ul className="space-y-2.5">
          {coachNotes.map((note, i) => (
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
          Ders programı oluştur
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

function TopicRow({ topic }: { topic: any }) {
  const c = masteryColor(topic.successRate)
  const isGood = topic.successRate >= 60
  return (
    <div className="rounded-2xl px-2 py-2">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-medium text-text-primary">{topic.topicName}</p>
          <p className="text-[12px] text-text-secondary">{topic.lesson}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn('flex items-center gap-0.5 text-[12px] font-medium', isGood ? 'text-emerald-500' : 'text-rose-500')}>
            {isGood ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {isGood ? 'Gelişiyor' : 'Zayıf'}
          </span>
          <span className={cn('w-9 text-right font-display text-[15px] font-semibold tabular-nums', c.text)}>
            %{topic.successRate.toFixed(0)}
          </span>
        </div>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${topic.successRate}%` }}
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
        <span className="font-display text-2xl font-semibold tabular-nums tracking-tight">%{value}</span>
        <span className="text-[10px] font-medium text-text-secondary">BAŞARI</span>
      </div>
    </div>
  )
}

import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, ImageIcon, FileText, Check, ChevronRight, X } from 'lucide-react'
import { students } from '@/mocks/data'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

const sources = [
  { id: 'camera', label: 'Take photo', hint: 'Use the camera', icon: Camera },
  { id: 'library', label: 'Photo library', hint: 'JPG or PNG', icon: ImageIcon },
  { id: 'file', label: 'Upload file', hint: 'PDF document', icon: FileText },
]

export default function ExamUpload() {
  const navigate = useNavigate()
  const [studentId, setStudentId] = React.useState(students[0].id)
  const [publisher, setPublisher] = React.useState('Apotemi')
  const [examName, setExamName] = React.useState('Science Practice Test 4')
  const [attached, setAttached] = React.useState<string | null>('answer-sheet.jpg')

  const canAnalyze = !!studentId && !!examName && !!attached

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-7"
    >
      <header>
        <h1 className="font-display text-[28px] font-semibold leading-tight tracking-tight">Upload exam</h1>
        <p className="mt-1 text-sm text-text-secondary">Add an answer sheet to analyze in seconds.</p>
      </header>

      {/* Student picker */}
      <section className="space-y-3">
        <p className="px-1 text-sm font-medium text-text-secondary">Student</p>
        <div className="flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {students.map((s) => {
            const active = s.id === studentId
            return (
              <button
                key={s.id}
                onClick={() => setStudentId(s.id)}
                className={cn(
                  'flex shrink-0 items-center gap-2.5 rounded-2xl border px-3.5 py-2.5 transition-all duration-300',
                  active ? 'border-primary bg-primary text-primary-foreground shadow-sm' : 'border-border/70 bg-card text-text-primary'
                )}
              >
                <span
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br text-xs font-semibold text-white',
                    s.avatarColor
                  )}
                >
                  {s.name.split(' ').map((n) => n[0]).join('')}
                </span>
                <span className="pr-1 text-left">
                  <span className="block text-[13px] font-semibold leading-tight">{s.name}</span>
                  <span className={cn('block text-[11px] leading-tight', active ? 'opacity-70' : 'text-text-secondary')}>
                    {s.grade}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Details */}
      <section className="space-y-3 rounded-3xl border border-border/70 bg-card p-5 shadow-sm">
        <Field label="Exam name" value={examName} onChange={setExamName} placeholder="e.g. Science Practice Test 4" />
        <div className="h-px bg-border/60" />
        <Field label="Publisher" value={publisher} onChange={setPublisher} placeholder="e.g. Apotemi" />
        <div className="h-px bg-border/60" />
        <div className="flex items-center justify-between py-1">
          <span className="text-[15px] font-medium">Date taken</span>
          <span className="text-[15px] text-text-secondary">Jul 6, 2026</span>
        </div>
      </section>

      {/* Source / attachment */}
      <section className="space-y-3">
        <p className="px-1 text-sm font-medium text-text-secondary">Answer sheet</p>

        <AnimatePresence mode="wait">
          {attached ? (
            <motion.div
              key="attached"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-4 rounded-3xl border border-border/70 bg-card p-4 shadow-sm"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                <Check className="h-7 w-7" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold">{attached}</p>
                <p className="text-[13px] text-text-secondary">Ready to analyze · 2.4 MB</p>
              </div>
              <button
                onClick={() => setAttached(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-text-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="picker"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-2.5"
            >
              {sources.map((src) => (
                <button
                  key={src.id}
                  onClick={() => setAttached('answer-sheet.jpg')}
                  className="flex items-center gap-4 rounded-2xl border border-dashed border-border bg-card p-4 text-left transition-colors active:bg-secondary/60"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary">
                    <src.icon className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <p className="text-[15px] font-semibold">{src.label}</p>
                    <p className="text-[13px] text-text-secondary">{src.hint}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-text-secondary" />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* CTA */}
      <div className="sticky bottom-24 md:bottom-0">
        <Button
          size="lg"
          className="w-full rounded-2xl"
          disabled={!canAnalyze}
          onClick={() => navigate('/processing/demo')}
        >
          Analyze exam
        </Button>
      </div>
    </motion.div>
  )
}

function Field({
  label, value, onChange, placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <label className="flex items-center justify-between gap-4 py-1">
      <span className="shrink-0 text-[15px] font-medium">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-0 flex-1 bg-transparent text-right text-[15px] text-text-primary placeholder:text-text-secondary/60 focus:outline-none"
      />
    </label>
  )
}

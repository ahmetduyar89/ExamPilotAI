import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bell, Shield, HelpCircle, Info, LogOut, ChevronRight, Sparkles, Palette } from 'lucide-react'
import { userProfile } from '@/mocks/data'
import { useThemeStore } from '@/store/themeStore'
import { SegmentControl } from '@/components/ui/SegmentControl'
import { cn } from '@/utils/cn'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } }
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, bounce: 0, duration: 0.5 } },
}

export default function Profile() {
  const navigate = useNavigate()
  const { theme, setTheme } = useThemeStore()

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.h1 variants={item} className="font-display text-[28px] font-semibold leading-tight tracking-tight">
        Profile
      </motion.h1>

      {/* Identity */}
      <motion.section variants={item} className="flex flex-col items-center rounded-[28px] border border-border/70 bg-card p-7 text-center shadow-sm">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 font-display text-2xl font-semibold text-white shadow-md">
          {userProfile.name.split(' ').map((n) => n[0]).join('')}
        </div>
        <h2 className="mt-4 font-display text-xl font-semibold tracking-tight">{userProfile.name}</h2>
        <p className="text-sm text-text-secondary">{userProfile.email}</p>
        <span className="mt-3 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-text-secondary">
          {userProfile.role} · {userProfile.plan} plan
        </span>

        <div className="mt-6 grid w-full grid-cols-3 divide-x divide-border/60">
          {userProfile.stats.map((s) => (
            <div key={s.label} className="px-2">
              <p className="font-display text-xl font-semibold tabular-nums">{s.value}</p>
              <p className="text-xs text-text-secondary">{s.label}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Premium banner */}
      <motion.button
        variants={item}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/premium')}
        className="relative w-full overflow-hidden rounded-[28px] bg-primary p-5 text-left text-primary-foreground shadow-xl"
      >
        <div className="pointer-events-none absolute -right-6 -top-8 h-32 w-32 rounded-full bg-primary-foreground/10 blur-2xl" />
        <div className="relative flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-foreground/15 backdrop-blur">
            <Sparkles className="h-6 w-6" />
          </span>
          <div className="flex-1">
            <p className="text-[15px] font-semibold">Upgrade to Premium</p>
            <p className="text-sm opacity-70">Unlimited scans & AI insights</p>
          </div>
          <ChevronRight className="h-5 w-5 opacity-70" />
        </div>
      </motion.button>

      {/* Appearance */}
      <motion.section variants={item} className="space-y-3 rounded-3xl border border-border/70 bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2.5">
          <Palette className="h-[18px] w-[18px] text-text-secondary" />
          <span className="text-[15px] font-semibold">Appearance</span>
        </div>
        <SegmentControl
          activeSegment={theme}
          onChange={(v) => setTheme(v as 'light' | 'dark' | 'system')}
          segments={[
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
            { label: 'System', value: 'system' },
          ]}
        />
      </motion.section>

      {/* Settings list */}
      <motion.section variants={item} className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm">
        <Row icon={Bell} label="Notifications" trailing="On" />
        <Row icon={Shield} label="Privacy & Security" />
        <Row icon={HelpCircle} label="Help & Support" />
        <Row icon={Info} label="About ExamPilot AI" trailing="v1.0" last />
      </motion.section>

      {/* Sign out */}
      <motion.button
        variants={item}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/')}
        className="flex w-full items-center justify-center gap-2 rounded-3xl border border-border/70 bg-card py-4 text-[15px] font-semibold text-rose-500 shadow-sm"
      >
        <LogOut className="h-[18px] w-[18px]" />
        Sign out
      </motion.button>

      <p className="pb-2 text-center text-xs text-text-secondary">Member since {userProfile.memberSince}</p>
    </motion.div>
  )
}

function Row({
  icon: Icon, label, trailing, last,
}: {
  icon: typeof Bell
  label: string
  trailing?: string
  last?: boolean
}) {
  return (
    <button className={cn('flex w-full items-center gap-3.5 px-5 py-4 text-left transition-colors active:bg-secondary/60', !last && 'border-b border-border/60')}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary">
        <Icon className="h-[18px] w-[18px] text-text-primary" />
      </span>
      <span className="flex-1 text-[15px] font-medium">{label}</span>
      {trailing && <span className="text-[13px] text-text-secondary">{trailing}</span>}
      <ChevronRight className="h-4 w-4 text-text-secondary" />
    </button>
  )
}

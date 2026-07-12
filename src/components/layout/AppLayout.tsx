import { Suspense, useEffect, useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Upload, BarChart3, CalendarDays, User, Sparkles, Calendar, UserPlus, Bell, Users, LayoutGrid } from 'lucide-react'
import { cn } from '@/utils/cn'
import { SyncStatusIndicator } from '@/features/cloudkit/components/SyncStatusIndicator'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { PageLoader } from '@/components/PageLoader'
import { useSettings } from '@/features/settings/hooks'
import { useStudents } from '@/features/student/hooks'

// Full destination set — shown in the desktop sidebar.
const tabs = [
  { name: 'Ana Sayfa', href: '/dashboard', icon: Home },
  { name: 'Öğrenciler', href: '/students', icon: Users },
  { name: 'Öğrenci Kaydı', href: '/student-onboarding', icon: UserPlus },
  { name: 'Takvim', href: '/calendar', icon: Calendar },
  { name: 'Hatırlatıcılar', href: '/reminders', icon: Bell },
  { name: 'Sınav Yükle', href: '/exams/upload', icon: Upload },
  { name: 'Analiz', href: '/analytics', icon: BarChart3 },
  { name: 'Ders Programı', href: '/study-plan', icon: CalendarDays },
  { name: 'Profil', href: '/profile', icon: User },
]

// iOS HIG recommends ≤5 primary tabs. The mobile bottom bar shows four primary
// destinations plus a "Daha Fazla" trigger; that opens a sheet exposing every
// destination in `tabs`, so nothing is unreachable on mobile.
const primaryMobileHrefs = ['/dashboard', '/students', '/analytics', '/calendar']
const bottomTabs = primaryMobileHrefs
  .map((href) => tabs.find((t) => t.href === href))
  .filter((t): t is (typeof tabs)[number] => Boolean(t))

function isActive(pathname: string, href: string) {
  if (href === '/dashboard') return pathname === '/dashboard'
  return pathname.startsWith(href)
}

export default function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  const { settings } = useSettings()
  const { data: students = [], isLoading } = useStudents()

  const [moreOpen, setMoreOpen] = useState(false)
  // "Daha Fazla" is the active tab whenever the current route isn't one of the
  // four primary destinations pinned to the bar.
  const moreActive = !primaryMobileHrefs.some((href) => isActive(location.pathname, href))

  useEffect(() => {
    if (!isLoading) {
      const teacherName = settings?.general?.teacherName ?? '';
      if (!teacherName.trim() || students.length === 0) {
        navigate('/onboarding', { replace: true });
      }
    }
  }, [settings, students, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] bg-background text-text-primary">
      {/* Desktop sidebar */}
      <aside className="hidden w-72 shrink-0 flex-col border-r border-border/70 bg-card/60 px-4 py-6 backdrop-blur-xl md:flex">
        <Link to="/dashboard" className="mb-8 flex items-center gap-3 px-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">ExamPilot AI</span>
        </Link>

        <nav className="flex flex-1 flex-col gap-1">
          {tabs.map((item) => {
            const active = isActive(location.pathname, item.href)
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-300',
                  active ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
                )}
              >
                {active && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-secondary"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <item.icon className="relative z-10 h-[18px] w-[18px]" />
                <span className="relative z-10">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* iCloud Sync Status */}
        <div className="px-3 mb-4">
          <SyncStatusIndicator />
        </div>

        <button
          onClick={() => navigate('/premium')}
          className="group mt-4 flex items-center gap-3 overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-primary/5 to-primary/10 p-3.5 text-left transition-all duration-300 hover:shadow-md"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold">Premium'a Geç</span>
            <span className="block truncate text-xs text-text-secondary">AI analizi kilidini aç</span>
          </span>
        </button>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto overscroll-y-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="mx-auto w-full max-w-2xl px-5 pb-32 pt-8 md:max-w-3xl md:px-8 md:pb-12">
            <Suspense fallback={<PageLoader inline />}>
              <Outlet />
            </Suspense>
          </div>
        </main>

        {/* Mobile bottom tab bar */}
        <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(16px,env(safe-area-inset-bottom))] md:hidden">
          <div className="pointer-events-auto grid w-full max-w-md grid-cols-5 items-stretch gap-1 rounded-[26px] border border-border/60 bg-card/80 p-1.5 shadow-glass backdrop-blur-2xl">
            {bottomTabs.map((item) => {
              const active = isActive(location.pathname, item.href)
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  aria-label={item.name}
                  className="relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-[20px] py-2"
                >
                  {active && (
                    <motion.span
                      layoutId="tab-active"
                      className="absolute inset-0 rounded-[20px] bg-secondary"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <item.icon
                    className={cn(
                      'relative z-10 h-[22px] w-[22px] shrink-0 transition-colors duration-300',
                      active ? 'text-text-primary' : 'text-text-secondary'
                    )}
                    strokeWidth={active ? 2.4 : 2}
                  />
                  <span
                    className={cn(
                      'relative z-10 w-full truncate text-center text-[10px] font-medium leading-tight tracking-tight transition-colors duration-300',
                      active ? 'text-text-primary' : 'text-text-secondary'
                    )}
                  >
                    {item.name}
                  </span>
                </Link>
              )
            })}

            {/* "Daha Fazla" — opens a sheet with every destination */}
            <button
              type="button"
              onClick={() => setMoreOpen(true)}
              aria-label="Daha Fazla"
              className="relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-[20px] py-2"
            >
              {moreActive && (
                <motion.span
                  layoutId="tab-active"
                  className="absolute inset-0 rounded-[20px] bg-secondary"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                />
              )}
              <LayoutGrid
                className={cn(
                  'relative z-10 h-[22px] w-[22px] shrink-0 transition-colors duration-300',
                  moreActive ? 'text-text-primary' : 'text-text-secondary'
                )}
                strokeWidth={moreActive ? 2.4 : 2}
              />
              <span
                className={cn(
                  'relative z-10 w-full truncate text-center text-[10px] font-medium leading-tight tracking-tight transition-colors duration-300',
                  moreActive ? 'text-text-primary' : 'text-text-secondary'
                )}
              >
                Daha Fazla
              </span>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile "all destinations" sheet */}
      <BottomSheet isOpen={moreOpen} onClose={() => setMoreOpen(false)}>
        <div className="mb-4 flex items-center gap-2 px-1">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary text-text-primary">
            <LayoutGrid className="h-4 w-4" />
          </span>
          <h2 className="font-display text-lg font-semibold tracking-tight">Tüm Menü</h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {tabs.map((item) => {
            const active = isActive(location.pathname, item.href)
            return (
              <button
                key={item.href}
                type="button"
                onClick={() => {
                  navigate(item.href)
                  setMoreOpen(false)
                }}
                className={cn(
                  'flex flex-col items-center justify-center gap-2 rounded-2xl border px-2 py-4 text-center transition-colors',
                  active
                    ? 'border-primary/40 bg-primary/10 text-primary'
                    : 'border-border/60 bg-secondary/30 text-text-secondary active:bg-secondary/60'
                )}
              >
                <item.icon className="h-6 w-6 shrink-0" strokeWidth={active ? 2.4 : 2} />
                <span
                  className={cn(
                    'w-full truncate text-[11px] font-semibold leading-tight tracking-tight',
                    active ? 'text-primary' : 'text-text-primary'
                  )}
                >
                  {item.name}
                </span>
              </button>
            )
          })}
        </div>
      </BottomSheet>
    </div>
  )
}

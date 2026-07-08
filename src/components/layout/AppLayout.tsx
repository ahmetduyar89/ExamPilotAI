import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Upload, BarChart3, CalendarDays, User, Sparkles } from 'lucide-react'
import { cn } from '@/utils/cn'

const tabs = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Upload', href: '/exams/upload', icon: Upload },
  { name: 'Analysis', href: '/analytics', icon: BarChart3 },
  { name: 'Plan', href: '/study-plan', icon: CalendarDays },
  { name: 'Profile', href: '/profile', icon: User },
]

function isActive(pathname: string, href: string) {
  if (href === '/dashboard') return pathname === '/dashboard'
  return pathname.startsWith(href)
}

export default function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()

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

        <button
          onClick={() => navigate('/premium')}
          className="group mt-4 flex items-center gap-3 overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-primary/5 to-primary/10 p-3.5 text-left transition-all duration-300 hover:shadow-md"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold">Go Premium</span>
            <span className="block truncate text-xs text-text-secondary">Unlock AI analysis</span>
          </span>
        </button>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto overscroll-y-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="mx-auto w-full max-w-2xl px-5 pb-32 pt-8 md:max-w-3xl md:px-8 md:pb-12">
            <Outlet />
          </div>
        </main>

        {/* Mobile bottom tab bar */}
        <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(16px,env(safe-area-inset-bottom))] md:hidden">
          <div className="pointer-events-auto flex w-full max-w-md items-center justify-between gap-1 rounded-[26px] border border-border/60 bg-card/80 p-1.5 shadow-glass backdrop-blur-2xl">
            {tabs.map((item) => {
              const active = isActive(location.pathname, item.href)
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="relative flex flex-1 flex-col items-center gap-1 rounded-[20px] py-2.5"
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
                      'relative z-10 h-[22px] w-[22px] transition-colors duration-300',
                      active ? 'text-text-primary' : 'text-text-secondary'
                    )}
                    strokeWidth={active ? 2.4 : 2}
                  />
                  <span
                    className={cn(
                      'relative z-10 text-[10px] font-medium tracking-tight transition-colors duration-300',
                      active ? 'text-text-primary' : 'text-text-secondary'
                    )}
                  >
                    {item.name}
                  </span>
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </div>
  )
}

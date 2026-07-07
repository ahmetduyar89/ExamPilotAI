import { Outlet, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, FileUp, LineChart, BookOpen, Settings, User } from 'lucide-react'
import { cn } from '@/utils/cn'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Students', href: '/students', icon: Users },
  { name: 'Upload Exam', href: '/exams/upload', icon: FileUp },
  { name: 'Analytics', href: '/analytics', icon: LineChart },
  { name: 'Study Plan', href: '/study-plan', icon: BookOpen },
]

const bottomNav = [
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function AppLayout() {
  const location = useLocation()

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden w-64 flex-col border-r bg-card md:flex">
        <div className="flex h-16 items-center px-6">
          <h1 className="text-xl font-bold text-primary">ExamPilot AI</h1>
        </div>
        <div className="flex flex-1 flex-col justify-between overflow-y-auto py-4">
          <nav className="space-y-1 px-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium",
                  location.pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                {item.name}
              </Link>
            ))}
          </nav>
          <nav className="space-y-1 px-4 mt-8">
            {bottomNav.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium",
                  location.pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

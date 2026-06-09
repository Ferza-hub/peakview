import { NavLink } from 'react-router-dom'
import { LayoutDashboard, BarChart3, Calendar, Lightbulb, FileText, Image, DollarSign, Settings, Zap } from 'lucide-react'

const navItems = [
  { to: '/',          icon: LayoutDashboard, label: 'Dashboard',    end: true },
  { to: '/analytics', icon: BarChart3,       label: 'Analytics' },
  { to: '/calendar',  icon: Calendar,        label: 'Calendar' },
  { to: '/ideas',     icon: Lightbulb,       label: 'Ideas Board' },
  { to: '/scripts',   icon: FileText,        label: 'Scripts' },
  { to: '/media',     icon: Image,           label: 'Media Library' },
  { to: '/revenue',   icon: DollarSign,      label: 'Revenue' },
]

export default function Sidebar() {
  return (
    <aside className="w-60 bg-slate-900 flex flex-col h-full shrink-0">
      <div className="p-5 flex items-center gap-2.5 border-b border-white/10">
        <div className="w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center shadow-lg">
          <Zap className="w-4 h-4 text-white" fill="white" />
        </div>
        <span className="text-white font-bold text-lg tracking-tight">PeakView</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'text-white bg-violet-600 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`
            }
          >
            <Icon size={18} className="shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-3 border-t border-white/10 pt-3">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              isActive
                ? 'text-white bg-violet-600'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`
          }
        >
          <Settings size={18} />
          Settings
        </NavLink>

        <div className="mt-3 flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
            A
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">Alex Rivera</p>
            <p className="text-slate-400 text-xs truncate">@alexrivera</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

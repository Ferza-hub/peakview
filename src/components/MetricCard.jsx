import { TrendingUp, TrendingDown } from 'lucide-react'

const COLOR_MAP = {
  violet:  { bg: 'bg-violet-50',  icon: 'text-violet-500',  ring: 'ring-violet-100' },
  blue:    { bg: 'bg-blue-50',    icon: 'text-blue-500',    ring: 'ring-blue-100' },
  emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-500', ring: 'ring-emerald-100' },
  pink:    { bg: 'bg-pink-50',    icon: 'text-pink-500',    ring: 'ring-pink-100' },
  amber:   { bg: 'bg-amber-50',   icon: 'text-amber-500',   ring: 'ring-amber-100' },
}

export default function MetricCard({ title, value, suffix, growth, icon: Icon, color = 'violet' }) {
  const c = COLOR_MAP[color] || COLOR_MAP.violet
  const positive = growth > 0

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        {Icon && (
          <div className={`w-9 h-9 rounded-xl ${c.bg} ring-1 ${c.ring} flex items-center justify-center`}>
            <Icon size={18} className={c.icon} />
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-900">
        {value}{suffix}
      </p>
      {growth !== undefined && (
        <div className={`flex items-center gap-1 mt-1.5 text-xs font-medium ${positive ? 'text-emerald-600' : 'text-red-500'}`}>
          {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>{positive ? '+' : ''}{growth}% vs last month</span>
        </div>
      )}
    </div>
  )
}

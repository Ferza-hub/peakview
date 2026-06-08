import { TrendingUp, TrendingDown } from 'lucide-react'

const colorMap = {
  violet:  { bg: 'bg-violet-50',  text: 'text-violet-600',  ring: 'ring-violet-100' },
  pink:    { bg: 'bg-pink-50',    text: 'text-pink-600',    ring: 'ring-pink-100' },
  blue:    { bg: 'bg-blue-50',    text: 'text-blue-600',    ring: 'ring-blue-100' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-100' },
  amber:   { bg: 'bg-amber-50',   text: 'text-amber-600',   ring: 'ring-amber-100' },
}

export default function MetricCard({ title, value, growth, icon: Icon, color = 'violet', suffix = '' }) {
  const isPositive = growth >= 0
  const c = colorMap[color] || colorMap.violet

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${c.bg} ${c.text} flex items-center justify-center ring-4 ${c.ring}`}>
          <Icon size={20} />
        </div>
        <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
          isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
        }`}>
          {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {Math.abs(growth)}%
        </span>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}{suffix}</p>
      <p className="text-sm text-slate-500 mt-1">{title}</p>
      <p className="text-xs text-slate-400 mt-1">vs last month</p>
    </div>
  )
}

import { DollarSign, TrendingUp, TrendingDown, Target, Youtube, Instagram } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell
} from 'recharts'
import { revenueHistory, transactions, revenueGoal } from '../data/mockData'

const SOURCE_META = {
  adsense:    { label: 'YouTube AdSense', color: '#FF0000', amount: 5150 },
  brandDeals: { label: 'Brand Deals',     color: '#8B5CF6', amount: 1850 },
  memberships:{ label: 'Memberships',     color: '#06B6D4', amount: 540 },
  merchandise:{ label: 'Merchandise',     color: '#EC4899', amount: 340 },
  affiliate:  { label: 'Affiliate',       color: '#F59E0B', amount: 220 },
}

const PLATFORM_META = {
  youtube:   { color: '#FF0000', label: 'YouTube' },
  instagram: { color: '#E1306C', label: 'Instagram' },
  tiktok:    { color: '#06B6D4', label: 'TikTok' },
  twitter:   { color: '#1DA1F2', label: 'Twitter' },
  brand:     { color: '#8B5CF6', label: 'Brand Deal' },
  merch:     { color: '#EC4899', label: 'Merch' },
  affiliate: { color: '#F59E0B', label: 'Affiliate' },
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const total = payload.reduce((s, p) => s + (p.value || 0), 0)
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-sm">
      <p className="font-semibold text-slate-800 mb-2">{label} — ${total.toLocaleString()}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 text-slate-600 mb-0.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.fill }} />
          <span className="text-xs">{SOURCE_META[p.dataKey]?.label || p.dataKey}:</span>
          <span className="font-medium text-slate-900 text-xs">${p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

function StatCard({ label, value, sub, positive, icon: Icon }) {
  return (
    <div className="card">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-slate-500">{label}</p>
        {Icon && <Icon size={18} className="text-slate-300" />}
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      {sub && (
        <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${positive === true ? 'text-emerald-600' : positive === false ? 'text-red-500' : 'text-slate-400'}`}>
          {positive === true ? <TrendingUp size={12} /> : positive === false ? <TrendingDown size={12} /> : null}
          <span>{sub}</span>
        </div>
      )}
    </div>
  )
}

export default function Revenue() {
  const goalPct = Math.min(100, Math.round((revenueGoal.current / revenueGoal.target) * 100))
  const totalRevenue = Object.values(SOURCE_META).reduce((s, m) => s + m.amount, 0)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Revenue</h1>
          <p className="text-slate-500 mt-0.5">Track your creator earnings across all sources</p>
        </div>
        <select className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400">
          <option>June 2026</option>
          <option>May 2026</option>
          <option>Q2 2026</option>
        </select>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="This Month"     value="$8,450"  sub="+15.4% vs last month" positive={true}  icon={DollarSign} />
        <StatCard label="Last Month"     value="$7,340"  sub="May 2026"             positive={null}  />
        <StatCard label="YTD Earnings"   value="$52,800" sub="Jan – Jun 2026"       positive={null}  />
        <StatCard label="Projected YE"   value="$98,000" sub="+22% vs 2025"         positive={true}  icon={Target} />
      </div>

      {/* Goal + Source breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue goal */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Monthly Goal</h2>
            <Target size={18} className="text-violet-500" />
          </div>
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-3xl font-bold text-slate-900">${revenueGoal.current.toLocaleString()}</p>
              <p className="text-sm text-slate-500">of ${revenueGoal.target.toLocaleString()} goal</p>
            </div>
            <span className="text-2xl font-bold text-violet-600">{goalPct}%</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-2">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all duration-700"
              style={{ width: `${goalPct}%` }}
            />
          </div>
          <p className="text-xs text-slate-400">${(revenueGoal.target - revenueGoal.current).toLocaleString()} remaining to reach your goal</p>
        </div>

        {/* Revenue by source */}
        <div className="card lg:col-span-2">
          <h2 className="font-semibold text-slate-900 mb-4">Revenue Sources</h2>
          <div className="space-y-3">
            {Object.entries(SOURCE_META).map(([key, meta]) => {
              const pct = Math.round((meta.amount / totalRevenue) * 100)
              return (
                <div key={key}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: meta.color }} />
                      <span className="font-medium text-slate-700">{meta.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 text-xs">{pct}%</span>
                      <span className="font-bold text-slate-900">${meta.amount.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: meta.color }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Monthly Revenue Chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-semibold text-slate-900">Monthly Revenue</h2>
            <p className="text-xs text-slate-400 mt-0.5">Stacked by source — last 12 months</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={revenueHistory} margin={{ top: 5, right: 5, left: -5, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="adsense"     stackId="a" fill="#FF0000" radius={[0,0,0,0]} />
            <Bar dataKey="brandDeals"  stackId="a" fill="#8B5CF6" />
            <Bar dataKey="memberships" stackId="a" fill="#06B6D4" />
            <Bar dataKey="merchandise" stackId="a" fill="#EC4899" />
            <Bar dataKey="affiliate"   stackId="a" fill="#F59E0B" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Transactions */}
      <div className="card overflow-hidden">
        <h2 className="font-semibold text-slate-900 mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {['Date','Description','Platform','Amount','Status'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => {
                const meta = PLATFORM_META[tx.platform] || { color: '#94A3B8', label: tx.platform }
                return (
                  <tr key={tx.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{tx.description}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{
                        backgroundColor: meta.color + '20',
                        color: meta.color,
                      }}>
                        {meta.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">${tx.amount.toLocaleString()}</td>
                    <td className="py-3.5 px-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                        tx.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

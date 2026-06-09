import { useState } from 'react'
import { TrendingUp, Users, Eye, Clock, Heart } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import {
  viewsHistory, subscriberHistory, engagementHistory,
  topContent, audienceData,
} from '../data/mockData'

const PLATFORM_COLORS = {
  youtube:   '#FF0000',
  instagram: '#E1306C',
  tiktok:    '#69C9D0',
  twitter:   '#1DA1F2',
}

const PLATFORM_LABELS = {
  youtube:   'YouTube',
  instagram: 'Instagram',
  tiktok:    'TikTok',
  twitter:   'Twitter',
}

const TABS = ['youtube', 'instagram', 'tiktok', 'twitter']

const MEDALS = { 0: '🥇', 1: '🥈', 2: '🥉' }

function fmtNum(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return n.toString()
}

function fmtSubs(v) {
  if (v >= 1000000) return (v / 1000000).toFixed(1) + 'M'
  if (v >= 1000) return Math.round(v / 1000) + 'K'
  return v
}

function PlatformDot({ platform, size = 8 }) {
  return (
    <span
      className="inline-block rounded-full shrink-0"
      style={{ width: size, height: size, backgroundColor: PLATFORM_COLORS[platform] }}
    />
  )
}

const ViewsTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const total = payload.reduce((s, p) => s + (p.value || 0), 0)
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-sm min-w-[160px]">
      <p className="font-semibold text-slate-800 mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 text-slate-600 mb-0.5">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
          <span className="flex-1">{PLATFORM_LABELS[p.dataKey]}:</span>
          <span className="font-medium text-slate-900">{p.value}K</span>
        </div>
      ))}
      <div className="border-t border-slate-100 mt-2 pt-2 flex items-center justify-between">
        <span className="text-slate-500 text-xs">Total</span>
        <span className="font-bold text-slate-900 text-xs">{total}K</span>
      </div>
    </div>
  )
}

const SubsTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-sm min-w-[160px]">
      <p className="font-semibold text-slate-800 mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 text-slate-600 mb-0.5">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
          <span className="flex-1">{PLATFORM_LABELS[p.dataKey]}:</span>
          <span className="font-medium text-slate-900">{fmtSubs(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

const EngagementTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-sm min-w-[160px]">
      <p className="font-semibold text-slate-800 mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 text-slate-600 mb-0.5">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.fill }} />
          <span className="flex-1">{PLATFORM_LABELS[p.dataKey]}:</span>
          <span className="font-medium text-slate-900">{p.value}%</span>
        </div>
      ))}
    </div>
  )
}

export default function Analytics() {
  const [activeTab, setActiveTab] = useState('youtube')

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
          <p className="text-slate-500 mt-0.5">Performance overview across all platforms</p>
        </div>
        <span className="text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
          Last 12 months
        </span>
      </div>

      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: PLATFORM_COLORS[tab] }}
            />
            {PLATFORM_LABELS[tab]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Subscribers', value: '485.2K', change: '+12.3%', icon: Users,     color: 'violet' },
          { label: 'Monthly Views',     value: '12.8M',  change: '+8.1%',  icon: Eye,       color: 'blue'   },
          { label: 'Avg Watch Time',    value: '8:32',   change: '+5.2%',  icon: Clock,     color: 'amber'  },
          { label: 'Engagement Rate',   value: '4.7%',   change: '+0.8%',  icon: Heart,     color: 'pink'   },
        ].map(m => {
          const colorMap = {
            violet: { bg: 'bg-violet-50', text: 'text-violet-600', icon: 'text-violet-500' },
            blue:   { bg: 'bg-blue-50',   text: 'text-blue-600',   icon: 'text-blue-500'   },
            amber:  { bg: 'bg-amber-50',  text: 'text-amber-600',  icon: 'text-amber-500'  },
            pink:   { bg: 'bg-pink-50',   text: 'text-pink-600',   icon: 'text-pink-500'   },
          }
          const c = colorMap[m.color]
          return (
            <div key={m.label} className="card">
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm text-slate-500">{m.label}</p>
                <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center`}>
                  <m.icon size={16} className={c.icon} />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{m.value}</p>
              <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${c.text}`}>
                <TrendingUp size={12} />
                <span>{m.change} vs last month</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-semibold text-slate-900">Views Over Time</h2>
            <p className="text-xs text-slate-400 mt-0.5">Monthly views in thousands</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={viewsHistory} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
            <defs>
              {[['youtube','#FF0000'],['instagram','#E1306C'],['tiktok','#69C9D0']].map(([k, c]) => (
                <linearGradient key={k} id={`vg-${k}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={c} stopOpacity={0.18} />
                  <stop offset="95%" stopColor={c} stopOpacity={0}    />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<ViewsTooltip />} />
            <Legend formatter={v => <span className="text-xs text-slate-600">{PLATFORM_LABELS[v]}</span>} />
            <Area type="monotone" dataKey="youtube"   stroke="#FF0000" fill="url(#vg-youtube)"   strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="instagram" stroke="#E1306C" fill="url(#vg-instagram)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="tiktok"    stroke="#69C9D0" fill="url(#vg-tiktok)"    strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-slate-900">Subscriber Growth</h2>
              <p className="text-xs text-slate-400 mt-0.5">Total subscribers per platform</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={subscriberHistory} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
              <defs>
                {[['youtube','#FF0000'],['instagram','#E1306C'],['tiktok','#69C9D0']].map(([k, c]) => (
                  <linearGradient key={k} id={`sg-${k}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={c} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={c} stopOpacity={0}    />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: '#94A3B8' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => fmtSubs(v)}
                width={40}
              />
              <Tooltip content={<SubsTooltip />} />
              <Legend formatter={v => <span className="text-xs text-slate-600">{PLATFORM_LABELS[v]}</span>} />
              <Area type="monotone" dataKey="youtube"   stroke="#FF0000" fill="url(#sg-youtube)"   strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="instagram" stroke="#E1306C" fill="url(#sg-instagram)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="tiktok"    stroke="#69C9D0" fill="url(#sg-tiktok)"    strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-slate-900">Engagement Rate by Platform</h2>
              <p className="text-xs text-slate-400 mt-0.5">Monthly engagement percentage</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={engagementHistory} margin={{ top: 5, right: 5, left: -15, bottom: 0 }} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: '#94A3B8' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => `${v}%`}
              />
              <Tooltip content={<EngagementTooltip />} />
              <Legend formatter={v => <span className="text-xs text-slate-600">{PLATFORM_LABELS[v]}</span>} />
              <Bar dataKey="youtube"   fill="#FF0000" radius={[3, 3, 0, 0]} />
              <Bar dataKey="instagram" fill="#E1306C" radius={[3, 3, 0, 0]} />
              <Bar dataKey="tiktok"    fill="#69C9D0" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="font-semibold text-slate-900 mb-5">Age Groups</h2>
          <div className="space-y-4">
            {audienceData.ageGroups.map(g => (
              <div key={g.group}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium text-slate-700">{g.group}</span>
                  <span className="text-slate-500 font-medium">{g.percentage}%</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-2.5 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all duration-500"
                    style={{ width: `${g.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="font-semibold text-slate-900 mb-5">Top Countries</h2>
          <div className="space-y-4">
            {audienceData.topCountries.map(c => {
              const flagEmoji = { US: '🇺🇸', GB: '🇬🇧', CA: '🇨🇦', AU: '🇦🇺', IN: '🇮🇳' }
              return (
                <div key={c.flag}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base leading-none">{flagEmoji[c.flag] ?? c.flag}</span>
                      <span className="font-medium text-slate-700">{c.country}</span>
                    </div>
                    <span className="text-slate-500 font-medium">{c.percentage}%</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                      style={{ width: `${c.percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <h2 className="font-semibold text-slate-900 mb-4">Top Content</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {['#', 'Title', 'Platform', 'Views', 'Likes', 'CTR', 'Duration'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topContent.map((item, idx) => (
                <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-500 w-12">
                    {MEDALS[idx] ?? <span className="text-slate-400">{idx + 1}</span>}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-slate-800 line-clamp-1 max-w-xs block">{item.title}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <PlatformDot platform={item.platform} />
                      <span className="text-slate-600">{PLATFORM_LABELS[item.platform]}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700 whitespace-nowrap">{fmtNum(item.views)}</td>
                  <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">{item.likes.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                    {item.ctr != null ? `${item.ctr}%` : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap font-mono text-xs">{item.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

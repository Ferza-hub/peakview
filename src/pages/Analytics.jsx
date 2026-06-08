import { useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { Eye, TrendingUp, Users, Heart } from 'lucide-react'
import { viewsHistory, engagementHistory, revenueHistory, topContent, platforms, audienceData } from '../data/mockData'

const TABS = ['All Platforms', 'YouTube', 'Instagram', 'TikTok', 'Twitter']
const platformColors = { youtube: '#FF0000', instagram: '#E1306C', tiktok: '#06B6D4', twitter: '#1DA1F2' }

function fmt(n) {
  if (n >= 1000000) return (n/1000000).toFixed(1)+'M'
  if (n >= 1000) return (n/1000).toFixed(0)+'K'
  return n
}

const pieData = [
  { name: 'YouTube AdSense', value: 5150, color: '#FF0000' },
  { name: 'Brand Deals',     value: 1850, color: '#8B5CF6' },
  { name: 'Memberships',     value: 540,  color: '#06B6D4' },
  { name: 'Merchandise',     value: 340,  color: '#EC4899' },
  { name: 'Affiliate',       value: 220,  color: '#F59E0B' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-sm">
      <p className="font-semibold text-slate-800 mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 text-slate-600 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color || p.fill }} />
          <span className="font-medium text-slate-900">{typeof p.value === 'number' && p.value > 100 ? p.value.toLocaleString() : p.value}{p.unit || ''}</span>
        </div>
      ))}
    </div>
  )
}

const RCOLORS = ['#FF0000','#8B5CF6','#06B6D4','#EC4899','#F59E0B']

export default function Analytics() {
  const [activeTab, setActiveTab] = useState('All Platforms')

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
          <p className="text-slate-500 mt-0.5">Detailed performance metrics across all platforms</p>
        </div>
        <select className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400">
          <option>Last 12 months</option>
          <option>Last 6 months</option>
          <option>Last 30 days</option>
        </select>
      </div>

      {/* Platform Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              activeTab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Platform stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {platforms.map(p => (
          <div key={p.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="text-sm font-semibold text-slate-700">{p.name}</span>
            </div>
            <p className="text-xl font-bold text-slate-900">{fmt(p.subscribers)}</p>
            <p className="text-xs text-slate-500 mb-2">subscribers</p>
            <p className="text-sm font-semibold text-slate-700">{fmt(p.views)}</p>
            <p className="text-xs text-slate-500 mb-2">monthly views</p>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+{p.growth}%</span>
          </div>
        ))}
      </div>

      {/* Two charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Views over time */}
        <div className="card">
          <h2 className="font-semibold text-slate-900 mb-1">Views by Platform</h2>
          <p className="text-xs text-slate-400 mb-4">Monthly views in thousands</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={viewsHistory} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <defs>
                {[['youtube','#FF0000'],['instagram','#E1306C'],['tiktok','#06B6D4'],['twitter','#1DA1F2']].map(([k,c]) => (
                  <linearGradient key={k} id={`ag-${k}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={c} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={c} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="youtube"   stroke="#FF0000" fill="url(#ag-youtube)"   strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="instagram" stroke="#E1306C" fill="url(#ag-instagram)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="tiktok"    stroke="#06B6D4" fill="url(#ag-tiktok)"    strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="twitter"   stroke="#1DA1F2" fill="url(#ag-twitter)"   strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Engagement */}
        <div className="card">
          <h2 className="font-semibold text-slate-900 mb-1">Engagement Rate (%)</h2>
          <p className="text-xs text-slate-400 mb-4">Monthly average by platform</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={engagementHistory} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} domain={[0, 9]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="youtube"   fill="#FF0000" radius={[3,3,0,0]} />
              <Bar dataKey="instagram" fill="#E1306C" radius={[3,3,0,0]} />
              <Bar dataKey="tiktok"    fill="#06B6D4" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue pie + audience */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue breakdown */}
        <div className="card">
          <h2 className="font-semibold text-slate-900 mb-4">Revenue Breakdown</h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={2} dataKey="value">
                {pieData.map((entry, i) => <Cell key={i} fill={RCOLORS[i % RCOLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: RCOLORS[i] }} />
                  <span className="text-slate-600 text-xs">{d.name}</span>
                </div>
                <span className="font-medium text-slate-900 text-xs">${d.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Audience insights */}
        <div className="card lg:col-span-2">
          <h2 className="font-semibold text-slate-900 mb-4">Audience Insights</h2>
          <div className="grid grid-cols-2 gap-6">
            {/* Age */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Age Groups</p>
              <div className="space-y-2.5">
                {audienceData.ageGroups.map(g => (
                  <div key={g.group}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-700">{g.group}</span>
                      <span className="font-medium text-slate-900">{g.percentage}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-2 bg-violet-500 rounded-full" style={{ width: `${g.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Gender + Countries */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Gender Split</p>
              <div className="flex gap-1 h-6 rounded-full overflow-hidden mb-3">
                <div className="bg-violet-500" style={{ width: `${audienceData.genderSplit.male}%` }} title={`Male ${audienceData.genderSplit.male}%`} />
                <div className="bg-pink-400"   style={{ width: `${audienceData.genderSplit.female}%` }} title={`Female ${audienceData.genderSplit.female}%`} />
                <div className="bg-slate-300"  style={{ width: `${audienceData.genderSplit.other}%` }} title={`Other ${audienceData.genderSplit.other}%`} />
              </div>
              <div className="flex gap-4 text-xs text-slate-500 mb-4">
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-violet-500" />Male {audienceData.genderSplit.male}%</div>
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-pink-400" />Female {audienceData.genderSplit.female}%</div>
              </div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Top Countries</p>
              <div className="space-y-1.5">
                {audienceData.topCountries.map(c => (
                  <div key={c.country} className="flex items-center gap-2 text-sm">
                    <span className="text-base">{c.flag === 'US' ? '🇺🇸' : c.flag === 'GB' ? '🇬🇧' : c.flag === 'CA' ? '🇨🇦' : c.flag === 'AU' ? '🇦🇺' : '🇮🇳'}</span>
                    <span className="text-slate-600 flex-1">{c.country}</span>
                    <span className="font-medium text-slate-900">{c.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top content table */}
      <div className="card overflow-hidden">
        <h2 className="font-semibold text-slate-900 mb-4">Top 10 Content</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {['#','Title','Platform','Views','Likes','Comments','CTR','Duration'].map(h => (
                  <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide first:pl-0">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topContent.map((item, idx) => (
                <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-3 pr-3 text-slate-400 font-medium">{idx + 1}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: item.color }}>
                        {item.title.charAt(0)}
                      </div>
                      <span className="font-medium text-slate-800 max-w-xs truncate">{item.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: platformColors[item.platform] + '20', color: platformColors[item.platform] }}>
                      {item.platform.charAt(0).toUpperCase() + item.platform.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-900">{fmt(item.views)}</td>
                  <td className="py-3 px-3 text-slate-600">{item.likes.toLocaleString()}</td>
                  <td className="py-3 px-3 text-slate-600">{item.comments.toLocaleString()}</td>
                  <td className="py-3 px-3">{item.ctr ? <span className="font-medium text-violet-600">{item.ctr}%</span> : <span className="text-slate-300">—</span>}</td>
                  <td className="py-3 px-3 text-slate-500">{item.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

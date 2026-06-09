import { useNavigate } from 'react-router-dom'
import { Users, Eye, DollarSign, Heart, ArrowRight, Clock, TrendingUp } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import MetricCard from '../components/MetricCard'
import { overviewMetrics, viewsHistory, scheduledPosts, topContent } from '../data/mockData'

const platformColors = { youtube: '#FF0000', instagram: '#E1306C', tiktok: '#69C9D0', twitter: '#1DA1F2' }
const platformLabels = { youtube: 'YouTube', instagram: 'Instagram', tiktok: 'TikTok', twitter: 'Twitter' }

function PlatformDot({ platform }) {
  return <span className="inline-block w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: platformColors[platform] }} />
}

function StatusChip({ status }) {
  const map = {
    published: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    scheduled:  'bg-blue-50 text-blue-700 border-blue-200',
    draft:      'bg-slate-100 text-slate-600 border-slate-200',
  }
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${map[status] || map.draft}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

function fmtNum(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return n.toString()
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-sm">
      <p className="font-semibold text-slate-800 mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 text-slate-600">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span>{platformLabels[p.dataKey]}:</span>
          <span className="font-medium text-slate-900">{p.value.toLocaleString()}K</span>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const upcoming = scheduledPosts.filter(p => p.status === 'scheduled' || p.status === 'draft').slice(0, 4)
  const top3 = topContent.slice(0, 3)
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{greeting}, Alex</h1>
          <p className="text-slate-500 mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/analytics')} className="btn-secondary text-sm">View Analytics</button>
          <button onClick={() => navigate('/calendar')} className="btn-primary text-sm">+ Schedule Post</button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Subscribers"
          value={fmtNum(overviewMetrics.totalSubscribers)}
          growth={overviewMetrics.subscriberGrowth}
          icon={Users}
          color="violet"
        />
        <MetricCard
          title="Monthly Views"
          value={fmtNum(overviewMetrics.monthlyViews)}
          growth={overviewMetrics.viewsGrowth}
          icon={Eye}
          color="blue"
        />
        <MetricCard
          title="Monthly Revenue"
          value={'$' + overviewMetrics.monthlyRevenue.toLocaleString()}
          growth={overviewMetrics.revenueGrowth}
          icon={DollarSign}
          color="emerald"
        />
        <MetricCard
          title="Avg Engagement"
          value={overviewMetrics.engagementRate}
          suffix="%"
          growth={overviewMetrics.engagementGrowth}
          icon={Heart}
          color="pink"
        />
      </div>

      {/* Chart + Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Views Chart */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-slate-900">Views Overview</h2>
              <p className="text-xs text-slate-400 mt-0.5">Monthly views across all platforms (in thousands)</p>
            </div>
            <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">Last 12 months</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={viewsHistory} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <defs>
                {[['youtube','#FF0000'],['instagram','#E1306C'],['tiktok','#06B6D4']].map(([k,c]) => (
                  <linearGradient key={k} id={`g-${k}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={c} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={c} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={v => <span className="text-xs text-slate-600">{platformLabels[v]}</span>} />
              <Area type="monotone" dataKey="youtube"   stroke="#FF0000" fill="url(#g-youtube)"   strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="instagram" stroke="#E1306C" fill="url(#g-instagram)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="tiktok"    stroke="#06B6D4" fill="url(#g-tiktok)"    strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Upcoming Posts */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Upcoming Posts</h2>
            <button onClick={() => navigate('/calendar')} className="text-xs text-violet-600 font-medium hover:text-violet-700 flex items-center gap-0.5">
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {upcoming.map(post => (
              <div key={post.id} onClick={() => navigate('/calendar')} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                <PlatformDot platform={post.platform} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800 truncate">{post.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <StatusChip status={post.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing + Platform Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top content */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Top Performing Content</h2>
            <button onClick={() => navigate('/analytics')} className="text-xs text-violet-600 font-medium hover:text-violet-700 flex items-center gap-0.5">
              Full analytics <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {top3.map((item, idx) => (
              <div key={item.id} onClick={() => navigate('/analytics')} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
                  style={{ backgroundColor: item.color }}>
                  {idx + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800 truncate">{item.title}</p>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
                    <PlatformDot platform={item.platform} />
                    <span>{fmtNum(item.views)} views</span>
                    <span>{item.likes.toLocaleString()} likes</span>
                    {item.ctr && <span>{item.ctr}% CTR</span>}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
                    <TrendingUp size={12} />
                    <span>Top</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Summary */}
        <div className="card">
          <h2 className="font-semibold text-slate-900 mb-4">Platform Overview</h2>
          <div className="space-y-4">
            {[
              { name: 'YouTube',   subs: '285K', views: '8.5M', color: '#FF0000' },
              { name: 'Instagram', subs: '142K', views: '2.8M', color: '#E1306C' },
              { name: 'TikTok',   subs: '48.2K', views: '1.2M', color: '#06B6D4' },
              { name: 'Twitter',  subs: '10K',   views: '300K', color: '#1DA1F2' },
            ].map(p => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                <span className="text-sm font-medium text-slate-700 w-20">{p.name}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full" style={{
                    backgroundColor: p.color,
                    width: p.name === 'YouTube' ? '100%' : p.name === 'Instagram' ? '66%' : p.name === 'TikTok' ? '30%' : '14%'
                  }} />
                </div>
                <span className="text-xs text-slate-500 w-12 text-right">{p.subs}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

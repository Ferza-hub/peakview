import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react'
import { scheduledPosts } from '../data/mockData'

const PLATFORM_COLORS = {
  youtube:   { dot: 'bg-red-500',    badge: 'bg-red-50 text-red-700 border-red-200' },
  instagram: { dot: 'bg-pink-500',   badge: 'bg-pink-50 text-pink-700 border-pink-200' },
  tiktok:    { dot: 'bg-cyan-500',   badge: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  twitter:   { dot: 'bg-blue-400',   badge: 'bg-blue-50 text-blue-700 border-blue-200' },
}

const STATUS_COLORS = {
  published: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
  draft:     'bg-slate-100 text-slate-600 border-slate-200',
  failed:    'bg-red-50 text-red-700 border-red-200',
}

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function getCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) days.push(d)
  return days
}

export default function Calendar() {
  const [year, setYear] = useState(2026)
  const [month, setMonth] = useState(5) // June = 5
  const [selectedDay, setSelectedDay] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newPost, setNewPost] = useState({ title: '', platform: 'youtube', status: 'draft', type: 'Long-form' })

  const days = getCalendarDays(year, month)

  const postsByDay = {}
  scheduledPosts.forEach(p => {
    const d = new Date(p.date)
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate()
      if (!postsByDay[day]) postsByDay[day] = []
      postsByDay[day].push(p)
    }
  })

  const selectedPosts = selectedDay ? (postsByDay[selectedDay] || []) : []
  const today = new Date()
  const isToday = (d) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear()

  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1) }
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1) }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Content Calendar</h1>
          <p className="text-slate-500 mt-0.5">Plan and track your publishing schedule</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary">
          <Plus size={16} /> Add Post
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4">
        {Object.entries(PLATFORM_COLORS).map(([p, c]) => (
          <div key={p} className="flex items-center gap-1.5 text-sm text-slate-600">
            <span className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </div>
        ))}
        <div className="ml-auto flex gap-2">
          {['published','scheduled','draft'].map(s => (
            <span key={s} className={`text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_COLORS[s]}`}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Calendar */}
        <div className="card lg:col-span-3">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-slate-900">{MONTHS[month]} {year}</h2>
            <div className="flex gap-1">
              <button onClick={prev} className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500">
                <ChevronLeft size={18} />
              </button>
              <button onClick={next} className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(d => (
              <div key={d} className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wide py-2">{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, idx) => {
              if (!day) return <div key={`empty-${idx}`} className="h-24 rounded-xl" />
              const posts = postsByDay[day] || []
              const todayCell = isToday(day)
              const selected = selectedDay === day
              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(selected ? null : day)}
                  className={`h-24 rounded-xl p-1.5 cursor-pointer transition-all border ${
                    selected ? 'border-violet-400 bg-violet-50 shadow-sm' :
                    todayCell ? 'border-violet-300 bg-violet-50/50' :
                    'border-transparent hover:border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full mb-1 ${
                    todayCell ? 'bg-violet-600 text-white' : 'text-slate-700'
                  }`}>{day}</span>
                  <div className="space-y-0.5 overflow-hidden">
                    {posts.slice(0, 3).map(p => (
                      <div key={p.id} className={`flex items-center gap-1 rounded px-1 py-0.5 ${PLATFORM_COLORS[p.platform]?.badge || ''} border text-xs truncate`}>
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${PLATFORM_COLORS[p.platform]?.dot}`} />
                        <span className="truncate text-xs leading-none">{p.title}</span>
                      </div>
                    ))}
                    {posts.length > 3 && (
                      <p className="text-xs text-slate-400 pl-1">+{posts.length - 3} more</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Side Panel */}
        <div className="card">
          <h2 className="font-semibold text-slate-900 mb-4">
            {selectedDay
              ? `June ${selectedDay} Posts`
              : 'All Scheduled'}
          </h2>
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {(selectedDay ? selectedPosts : scheduledPosts).map(post => (
              <div key={post.id} className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all cursor-pointer">
                <div className="flex items-start gap-2">
                  <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${PLATFORM_COLORS[post.platform]?.dot}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800 leading-tight">{post.title}</p>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full border ${STATUS_COLORS[post.status]}`}>
                        {post.status}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Post Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900">Add New Post</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. My Ultimate Desk Setup 2026"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Platform</label>
                  <select
                    value={newPost.platform}
                    onChange={e => setNewPost(p => ({ ...p, platform: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                  >
                    {['youtube','instagram','tiktok','twitter'].map(p => (
                      <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                  <select
                    value={newPost.status}
                    onChange={e => setNewPost(p => ({ ...p, status: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                  >
                    {['draft','scheduled','published'].map(s => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Publish Date</label>
                <input
                  type="date"
                  defaultValue="2026-06-30"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAddModal(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
                <button onClick={() => setShowAddModal(false)} className="btn-primary flex-1 justify-center">Add Post</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

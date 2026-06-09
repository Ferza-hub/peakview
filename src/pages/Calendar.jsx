import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, X, Pencil, Trash2 } from 'lucide-react'
import { scheduledPosts } from '../data/mockData'
import { useToast } from '../components/ui/Toast'

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

const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const POST_TYPES  = ['Long-form','Short','Reel','Carousel','Thread','Story','Podcast']
const PLATFORMS_LIST = ['youtube','instagram','tiktok','twitter']
const STATUSES = ['draft','scheduled','published']

function getCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) days.push(d)
  return days
}

function dateStr(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

const EMPTY_POST = { title: '', platform: 'youtube', status: 'draft', type: 'Long-form', notes: '' }

function PostModal({ post, date, onSave, onDelete, onClose }) {
  const isEdit = !!post
  const [form, setForm] = useState(isEdit ? { ...post } : { ...EMPTY_POST, date })

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSave = () => {
    if (!form.title.trim()) return
    onSave(form)
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-slate-900">{isEdit ? 'Edit Post' : 'New Post'}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><X size={18} /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
            <input
              autoFocus
              type="text"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="e.g. My Ultimate Desk Setup 2026"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Platform</label>
              <div className="relative">
                <span className={`absolute left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full ${PLATFORM_COLORS[form.platform]?.dot}`} />
                <select
                  value={form.platform}
                  onChange={e => set('platform', e.target.value)}
                  className="w-full pl-7 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 appearance-none"
                >
                  {PLATFORMS_LIST.map(p => (
                    <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => set('date', e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Type</label>
              <select
                value={form.type}
                onChange={e => set('type', e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              >
                {POST_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={e => set('status', e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              >
                {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Notes <span className="text-slate-400 font-normal">(optional)</span></label>
            <textarea
              value={form.notes || ''}
              onChange={e => set('notes', e.target.value)}
              rows={3}
              placeholder="Any notes or reminders for this post…"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            {isEdit ? (
              <button
                onClick={() => onDelete(post.id)}
                className="text-sm font-medium text-red-600 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
              >
                Delete post
              </button>
            ) : <span />}
            <div className="flex gap-2">
              <button onClick={onClose} className="btn-secondary">Cancel</button>
              <button onClick={handleSave} className="btn-primary">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Calendar() {
  const toast = useToast()
  const [year, setYear] = useState(2026)
  const [month, setMonth] = useState(5)
  const [posts, setPosts] = useState(scheduledPosts)
  const [selectedDay, setSelectedDay] = useState(null)
  const [modal, setModal] = useState(null)

  const days = getCalendarDays(year, month)

  const postsByDay = {}
  posts.forEach(p => {
    const d = new Date(p.date)
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate()
      if (!postsByDay[day]) postsByDay[day] = []
      postsByDay[day].push(p)
    }
  })

  const allPostsSorted = [...posts].sort((a, b) => new Date(a.date) - new Date(b.date))
  const selectedPosts = selectedDay ? (postsByDay[selectedDay] || []) : allPostsSorted

  const today = new Date()
  const isToday = (d) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear()

  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1) }
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1) }

  const openCreate = (day) => {
    setModal({ mode: 'create', date: dateStr(year, month, day) })
  }

  const openEdit = (e, post) => {
    e.stopPropagation()
    setModal({ mode: 'edit', post })
  }

  const handleSave = (form) => {
    if (modal.mode === 'edit') {
      setPosts(prev => prev.map(p => p.id === form.id ? form : p))
      toast.add('Post updated', 'success')
    } else {
      setPosts(prev => [...prev, { ...form, id: Date.now() }])
      toast.add('Post scheduled', 'success')
    }
    setModal(null)
  }

  const handleDelete = (id) => {
    setPosts(prev => prev.filter(p => p.id !== id))
    setModal(null)
    toast.add('Post deleted', 'error')
  }

  const handleDeleteFromPanel = (e, id) => {
    e.stopPropagation()
    setPosts(prev => prev.filter(p => p.id !== id))
    toast.add('Post deleted', 'error')
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Content Calendar</h1>
          <p className="text-slate-500 mt-0.5">Plan and track your publishing schedule</p>
        </div>
        <button onClick={() => setModal({ mode: 'create', date: dateStr(year, month, today.getDate()) })} className="btn-primary">
          <Plus size={16} /> Add Post
        </button>
      </div>

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
        <div className="card lg:col-span-3">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-slate-900">{MONTHS[month]} {year}</h2>
            <div className="flex gap-1">
              <button onClick={prev} className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500"><ChevronLeft size={18} /></button>
              <button onClick={next} className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500"><ChevronRight size={18} /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(d => (
              <div key={d} className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wide py-2">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, idx) => {
              if (!day) return <div key={`empty-${idx}`} className="h-24 rounded-xl" />
              const dayPosts = postsByDay[day] || []
              const todayCell = isToday(day)
              const selected = selectedDay === day
              return (
                <div
                  key={day}
                  onClick={() => { setSelectedDay(selected ? null : day) }}
                  className={`h-24 rounded-xl p-1.5 cursor-pointer transition-all border group/cell ${
                    selected    ? 'border-violet-400 bg-violet-50 shadow-sm' :
                    todayCell   ? 'border-violet-300 bg-violet-50/50' :
                    'border-transparent hover:border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full ${
                      todayCell ? 'bg-violet-600 text-white' : 'text-slate-700'
                    }`}>{day}</span>
                    <button
                      onClick={e => { e.stopPropagation(); openCreate(day) }}
                      className="w-5 h-5 rounded-md bg-violet-600 text-white flex items-center justify-center opacity-0 group-hover/cell:opacity-100 transition-opacity hover:bg-violet-700 shrink-0"
                    >
                      <Plus size={10} />
                    </button>
                  </div>
                  <div className="space-y-0.5 overflow-hidden">
                    {dayPosts.slice(0, 3).map(p => (
                      <button
                        key={p.id}
                        onClick={e => openEdit(e, p)}
                        className={`w-full flex items-center gap-1 rounded px-1 py-0.5 ${PLATFORM_COLORS[p.platform]?.badge || ''} border text-xs truncate hover:opacity-80 transition-opacity`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${PLATFORM_COLORS[p.platform]?.dot}`} />
                        <span className="truncate text-xs leading-none">{p.title}</span>
                      </button>
                    ))}
                    {dayPosts.length > 3 && (
                      <p className="text-xs text-slate-400 pl-1">+{dayPosts.length - 3} more</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="card flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">
              {selectedDay ? `${MONTHS[month]} ${selectedDay}` : 'All Posts'}
            </h2>
            {selectedDay && (
              <div className="flex gap-1">
                <button
                  onClick={() => openCreate(selectedDay)}
                  className="p-1.5 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors"
                >
                  <Plus size={14} />
                </button>
                <button
                  onClick={() => setSelectedDay(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {selectedDay && selectedPosts.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <p className="text-slate-400 text-sm mb-3">No posts on this day</p>
              <button onClick={() => openCreate(selectedDay)} className="btn-primary text-xs px-3 py-1.5">
                <Plus size={12} /> Add post
              </button>
            </div>
          ) : (
            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
              {selectedPosts.map(post => (
                <div key={post.id} className="group/item p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all">
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
                        {post.type && (
                          <span className="text-xs text-slate-400">{post.type}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity shrink-0">
                      <button
                        onClick={e => openEdit(e, post)}
                        className="p-1 rounded-md text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={e => handleDeleteFromPanel(e, post.id)}
                        className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {modal && (
        <PostModal
          post={modal.post || null}
          date={modal.date || ''}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}

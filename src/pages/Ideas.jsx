import { useState, useRef, useEffect } from 'react'
import { Plus, Sparkles, X, Filter, Pencil, ChevronLeft, ChevronRight } from 'lucide-react'
import { contentIdeas, aiSuggestions } from '../data/mockData'
import { useToast } from '../components/ui/Toast'

const COLUMNS = [
  { id: 'backlog',     label: 'Backlog',        color: 'text-slate-600',   bg: 'bg-slate-100',   border: 'border-slate-200' },
  { id: 'researching', label: 'Researching',    color: 'text-blue-700',    bg: 'bg-blue-50',     border: 'border-blue-200' },
  { id: 'scripting',  label: 'Scripting',       color: 'text-violet-700',  bg: 'bg-violet-50',   border: 'border-violet-200' },
  { id: 'ready',      label: 'Ready to Film',   color: 'text-emerald-700', bg: 'bg-emerald-50',  border: 'border-emerald-200' },
]

const PRIORITY_COLORS = {
  high:   'bg-red-50 text-red-700 border-red-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  low:    'bg-slate-100 text-slate-600 border-slate-200',
}

const PLATFORM_DOTS = {
  youtube:   'bg-red-500',
  instagram: 'bg-pink-500',
  tiktok:    'bg-cyan-500',
  twitter:   'bg-blue-400',
}

const CATEGORIES = ['All', 'Tutorial', 'Review', 'Vlog', 'Educational', 'Challenge', 'Collab']
const PLATFORMS  = ['All', 'YouTube', 'Instagram', 'TikTok']

const EMPTY_IDEA = { title: '', platform: 'youtube', category: 'Tutorial', priority: 'medium', column: 'backlog', tags: [], estimatedViews: '' }

function AutoTextarea({ value, onChange, placeholder, className }) {
  const ref = useRef(null)
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto'
      ref.current.style.height = ref.current.scrollHeight + 'px'
    }
  }, [value])
  return (
    <textarea
      ref={ref}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={1}
      className={className}
      style={{ resize: 'none', overflow: 'hidden' }}
    />
  )
}

function TagInput({ tags, onChange }) {
  const [input, setInput] = useState('')

  const addTag = (raw) => {
    const tag = raw.trim().replace(/^#/, '')
    if (tag && !tags.includes(tag)) {
      onChange([...tags, tag])
    }
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(input)
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      onChange(tags.slice(0, -1))
    }
  }

  const removeTag = (tag) => onChange(tags.filter(t => t !== tag))

  return (
    <div className="flex flex-wrap gap-1.5 p-2 border border-slate-200 rounded-xl min-h-[42px] focus-within:ring-2 focus-within:ring-violet-400 focus-within:border-transparent">
      {tags.map(tag => (
        <span key={tag} className="flex items-center gap-1 text-xs bg-violet-50 text-violet-700 border border-violet-200 px-2 py-0.5 rounded-full">
          #{tag}
          <button type="button" onClick={() => removeTag(tag)} className="text-violet-400 hover:text-violet-700 leading-none">
            <X size={10} />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => input.trim() && addTag(input)}
        placeholder={tags.length === 0 ? 'Add tags (Enter or comma)' : ''}
        className="text-sm outline-none bg-transparent flex-1 min-w-[120px] placeholder:text-slate-400"
      />
    </div>
  )
}

function IdeaDetailModal({ idea, onSave, onDelete, onClose }) {
  const [form, setForm] = useState({ ...idea })

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
        <div className="flex items-start justify-between gap-3 mb-5">
          <AutoTextarea
            value={form.title}
            onChange={e => set('title', e.target.value)}
            placeholder="Idea title…"
            className="flex-1 text-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-400 rounded-lg px-2 py-1 -mx-2 -my-1"
          />
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 shrink-0"><X size={18} /></button>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[130px]">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Platform</label>
              <div className="flex gap-2">
                {Object.entries(PLATFORM_DOTS).map(([p, dot]) => (
                  <button
                    key={p}
                    onClick={() => set('platform', p)}
                    title={p.charAt(0).toUpperCase() + p.slice(1)}
                    className={`w-7 h-7 rounded-full ${dot} border-2 transition-transform ${form.platform === p ? 'border-slate-800 scale-110' : 'border-transparent opacity-50 hover:opacity-80'}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex-1 min-w-[130px]">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={e => set('category', e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              >
                {['Tutorial','Review','Vlog','Educational','Challenge','Collab'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className="flex-1 min-w-[120px]">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Priority</label>
              <select
                value={form.priority}
                onChange={e => set('priority', e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              >
                {['high','medium','low'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Stage</label>
            <div className="flex gap-2 flex-wrap">
              {COLUMNS.map(col => (
                <button
                  key={col.id}
                  onClick={() => set('column', col.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    form.column === col.id
                      ? `${col.bg} ${col.color} ${col.border} shadow-sm`
                      : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {col.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Estimated Views</label>
            <input
              type="text"
              value={form.estimatedViews}
              onChange={e => set('estimatedViews', e.target.value)}
              placeholder="e.g. 500K"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Tags</label>
            <TagInput tags={form.tags} onChange={tags => set('tags', tags)} />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <button
              onClick={() => onDelete(idea.id)}
              className="text-sm font-medium text-red-600 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              Delete idea
            </button>
            <div className="flex gap-2">
              <button onClick={onClose} className="btn-secondary">Cancel</button>
              <button onClick={() => onSave(form)} className="btn-primary">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AddIdeaModal({ initialColumn, onAdd, onClose }) {
  const [form, setForm] = useState({ ...EMPTY_IDEA, column: initialColumn })
  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-slate-900">New Content Idea</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
            <input
              autoFocus
              type="text"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && form.title.trim() && onAdd(form)}
              placeholder="e.g. 10 AI Tools for Video Editing in 2026"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Platform</label>
              <select value={form.platform} onChange={e => set('platform', e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400">
                {['youtube','instagram','tiktok','twitter'].map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400">
                {['Tutorial','Review','Vlog','Educational','Challenge','Collab'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Priority</label>
              <select value={form.priority} onChange={e => set('priority', e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400">
                {['high','medium','low'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Stage</label>
              <select value={form.column} onChange={e => set('column', e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400">
                {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Estimated Views</label>
            <input
              type="text"
              value={form.estimatedViews}
              onChange={e => set('estimatedViews', e.target.value)}
              placeholder="e.g. 500K"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button onClick={() => form.title.trim() && onAdd(form)} className="btn-primary flex-1 justify-center">Add Idea</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Ideas() {
  const toast = useToast()
  const [ideas, setIdeas] = useState(contentIdeas)
  const [showAI, setShowAI] = useState(false)
  const [filterCat, setFilterCat] = useState('All')
  const [filterPlatform, setFilterPlatform] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [addColumn, setAddColumn] = useState('backlog')
  const [detailIdea, setDetailIdea] = useState(null)

  const filtered = ideas.filter(i => {
    if (filterCat !== 'All' && i.category !== filterCat) return false
    if (filterPlatform !== 'All' && i.platform !== filterPlatform.toLowerCase()) return false
    return true
  })

  const colIndex = (id) => COLUMNS.findIndex(c => c.id === id)

  const moveIdea = (e, idea, direction) => {
    e.stopPropagation()
    const idx = colIndex(idea.column)
    const nextIdx = idx + direction
    if (nextIdx < 0 || nextIdx >= COLUMNS.length) return
    const nextCol = COLUMNS[nextIdx]
    setIdeas(prev => prev.map(i => i.id === idea.id ? { ...i, column: nextCol.id } : i))
    toast.add(`Moved to ${nextCol.label}`, 'info')
  }

  const openDetail = (e, idea) => {
    e.stopPropagation()
    setDetailIdea(idea)
  }

  const handleSave = (updated) => {
    setIdeas(prev => prev.map(i => i.id === updated.id ? updated : i))
    setDetailIdea(null)
    toast.add('Idea updated', 'success')
  }

  const handleDelete = (id) => {
    setIdeas(prev => prev.filter(i => i.id !== id))
    setDetailIdea(null)
    toast.add('Idea deleted', 'error')
  }

  const handleAdd = (form) => {
    const col = COLUMNS.find(c => c.id === form.column) || COLUMNS[0]
    setIdeas(prev => [...prev, { ...form, id: Date.now() }])
    setShowAddModal(false)
    toast.add(`Idea added to ${col.label}`, 'success')
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ideas Board</h1>
          <p className="text-slate-500 mt-0.5">Manage and prioritize your content pipeline</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowAI(v => !v)} className="btn-secondary">
            <Sparkles size={16} className="text-violet-500" />
            AI Suggest
          </button>
          <button onClick={() => { setAddColumn('backlog'); setShowAddModal(true) }} className="btn-primary">
            <Plus size={16} /> New Idea
          </button>
        </div>
      </div>

      {showAI && (
        <div className="bg-gradient-to-r from-violet-50 to-pink-50 border border-violet-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-violet-600" />
              <h3 className="font-semibold text-violet-900">AI-Powered Suggestions</h3>
              <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">Trending this week</span>
            </div>
            <button onClick={() => setShowAI(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {aiSuggestions.map((s, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-violet-100 hover:border-violet-300 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm font-semibold text-slate-900 leading-tight">{s.title}</p>
                  <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">{s.estimatedViews}</span>
                </div>
                <p className="text-xs text-slate-500 mb-3">{s.reason}</p>
                <button
                  onClick={() => {
                    setIdeas(prev => [...prev, { id: Date.now() + i, title: s.title, platform: s.platform, category: 'Tutorial', priority: 'high', column: 'backlog', tags: ['ai-suggested'], estimatedViews: s.estimatedViews }])
                    setShowAI(false)
                    toast.add('Added to Backlog', 'success')
                  }}
                  className="text-xs font-medium text-violet-600 hover:text-violet-800 flex items-center gap-1"
                >
                  <Plus size={12} /> Add to Backlog
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-sm text-slate-500">
          <Filter size={14} />
          <span className="font-medium">Filter:</span>
        </div>
        <div className="flex gap-1">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setFilterCat(c)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filterCat === c ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >{c}</button>
          ))}
        </div>
        <div className="flex gap-1">
          {PLATFORMS.map(p => (
            <button
              key={p}
              onClick={() => setFilterPlatform(p)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filterPlatform === p ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >{p}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {COLUMNS.map(col => {
          const colIdeas = filtered.filter(i => i.column === col.id)
          return (
            <div key={col.id} className={`rounded-2xl border-2 ${col.border} p-4`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-sm ${col.color}`}>{col.label}</span>
                  <span className={`text-xs font-medium w-5 h-5 flex items-center justify-center rounded-full ${col.bg} ${col.color}`}>
                    {colIdeas.length}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                {colIdeas.map(idea => {
                  const idx = colIndex(idea.column)
                  return (
                    <div
                      key={idea.id}
                      onClick={e => openDetail(e, idea)}
                      className="group relative bg-white rounded-xl p-3 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 cursor-pointer"
                    >
                      <button
                        onClick={e => openDetail(e, idea)}
                        className="absolute top-2 right-2 p-1 rounded-md bg-white border border-slate-100 text-slate-400 hover:text-violet-600 hover:border-violet-300 opacity-0 group-hover:opacity-100 transition-all shadow-sm z-10"
                      >
                        <Pencil size={11} />
                      </button>

                      <div className="flex items-start justify-between gap-2 mb-2 pr-6">
                        <p className="text-sm font-semibold text-slate-900 leading-tight">{idea.title}</p>
                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full border whitespace-nowrap shrink-0 ${PRIORITY_COLORS[idea.priority]}`}>
                          {idea.priority}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-2.5">
                        <span className={`w-2 h-2 rounded-full ${PLATFORM_DOTS[idea.platform]}`} />
                        <span className="text-xs text-slate-500">{idea.platform.charAt(0).toUpperCase() + idea.platform.slice(1)}</span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500">{idea.category}</span>
                      </div>

                      {idea.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {idea.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md">
                              #{tag}
                            </span>
                          ))}
                          {idea.tags.length > 2 && (
                            <span className="text-xs text-slate-400">+{idea.tags.length - 2}</span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">Est. views</span>
                        <span className="text-xs font-semibold text-violet-600">{idea.estimatedViews}</span>
                      </div>

                      <div className="flex items-center gap-1 mt-2 pt-2 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={e => moveIdea(e, idea, -1)}
                          disabled={idx === 0}
                          className="flex items-center gap-0.5 text-xs text-slate-400 hover:text-slate-700 disabled:opacity-20 disabled:cursor-not-allowed px-1.5 py-0.5 rounded hover:bg-slate-100 transition-colors"
                        >
                          <ChevronLeft size={12} /> Prev
                        </button>
                        <button
                          onClick={e => moveIdea(e, idea, 1)}
                          disabled={idx === COLUMNS.length - 1}
                          className="flex items-center gap-0.5 text-xs text-slate-400 hover:text-slate-700 disabled:opacity-20 disabled:cursor-not-allowed px-1.5 py-0.5 rounded hover:bg-slate-100 transition-colors ml-auto"
                        >
                          Next <ChevronRight size={12} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              <button
                onClick={() => { setAddColumn(col.id); setShowAddModal(true) }}
                className="mt-3 w-full py-2 text-xs font-medium text-slate-400 hover:text-slate-600 hover:bg-white rounded-xl border-2 border-dashed border-slate-200 hover:border-slate-300 transition-all flex items-center justify-center gap-1"
              >
                <Plus size={12} /> Add idea
              </button>
            </div>
          )
        })}
      </div>

      {showAddModal && (
        <AddIdeaModal
          initialColumn={addColumn}
          onAdd={handleAdd}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {detailIdea && (
        <IdeaDetailModal
          idea={detailIdea}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setDetailIdea(null)}
        />
      )}
    </div>
  )
}

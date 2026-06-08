import { useState } from 'react'
import { Plus, Sparkles, X, Filter, Tag } from 'lucide-react'
import { contentIdeas, aiSuggestions } from '../data/mockData'

const COLUMNS = [
  { id: 'backlog',     label: 'Backlog',        color: 'text-slate-600',  bg: 'bg-slate-100',  border: 'border-slate-200' },
  { id: 'researching', label: 'Researching',    color: 'text-blue-700',   bg: 'bg-blue-50',    border: 'border-blue-200' },
  { id: 'scripting',  label: 'Scripting',       color: 'text-violet-700', bg: 'bg-violet-50',  border: 'border-violet-200' },
  { id: 'ready',      label: 'Ready to Film',   color: 'text-emerald-700',bg: 'bg-emerald-50', border: 'border-emerald-200' },
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

export default function Ideas() {
  const [ideas, setIdeas] = useState(contentIdeas)
  const [showAI, setShowAI] = useState(false)
  const [filterCat, setFilterCat] = useState('All')
  const [filterPlatform, setFilterPlatform] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newIdea, setNewIdea] = useState({ title: '', platform: 'youtube', category: 'Tutorial', priority: 'medium', column: 'backlog', tags: [], estimatedViews: '' })

  const filtered = ideas.filter(i => {
    if (filterCat !== 'All' && i.category !== filterCat) return false
    if (filterPlatform !== 'All' && i.platform !== filterPlatform.toLowerCase()) return false
    return true
  })

  const addIdea = () => {
    if (!newIdea.title.trim()) return
    setIdeas(prev => [...prev, { ...newIdea, id: Date.now(), tags: [] }])
    setShowAddModal(false)
    setNewIdea({ title: '', platform: 'youtube', category: 'Tutorial', priority: 'medium', column: 'backlog', tags: [], estimatedViews: '' })
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ideas Board</h1>
          <p className="text-slate-500 mt-0.5">Manage and prioritize your content pipeline</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAI(v => !v)}
            className="btn-secondary"
          >
            <Sparkles size={16} className="text-violet-500" />
            AI Suggest
          </button>
          <button onClick={() => setShowAddModal(true)} className="btn-primary">
            <Plus size={16} /> New Idea
          </button>
        </div>
      </div>

      {/* AI Suggestions */}
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
              <div key={i} className="bg-white rounded-xl p-4 border border-violet-100 hover:border-violet-300 transition-colors cursor-pointer">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm font-semibold text-slate-900 leading-tight">{s.title}</p>
                  <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">{s.estimatedViews}</span>
                </div>
                <p className="text-xs text-slate-500 mb-3">{s.reason}</p>
                <button
                  onClick={() => {
                    setIdeas(prev => [...prev, { id: Date.now() + i, title: s.title, platform: s.platform, category: 'Tutorial', priority: 'high', column: 'backlog', tags: ['ai-suggested'], estimatedViews: s.estimatedViews }])
                    setShowAI(false)
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

      {/* Filters */}
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

      {/* Kanban Board */}
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
                {colIdeas.map(idea => (
                  <div
                    key={idea.id}
                    className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
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
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Est. views</span>
                      <span className="text-xs font-semibold text-violet-600">{idea.estimatedViews}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => { setNewIdea(p => ({ ...p, column: col.id })); setShowAddModal(true) }}
                className="mt-3 w-full py-2 text-xs font-medium text-slate-400 hover:text-slate-600 hover:bg-white rounded-xl border-2 border-dashed border-slate-200 hover:border-slate-300 transition-all flex items-center justify-center gap-1"
              >
                <Plus size={12} /> Add idea
              </button>
            </div>
          )
        })}
      </div>

      {/* Add Idea Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900">New Content Idea</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
                <input
                  autoFocus
                  type="text"
                  value={newIdea.title}
                  onChange={e => setNewIdea(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. 10 AI Tools for Video Editing in 2026"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Platform</label>
                  <select
                    value={newIdea.platform}
                    onChange={e => setNewIdea(p => ({ ...p, platform: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                  >
                    {['youtube','instagram','tiktok','twitter'].map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
                  <select
                    value={newIdea.category}
                    onChange={e => setNewIdea(p => ({ ...p, category: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                  >
                    {['Tutorial','Review','Vlog','Educational','Challenge','Collab'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Priority</label>
                  <select
                    value={newIdea.priority}
                    onChange={e => setNewIdea(p => ({ ...p, priority: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                  >
                    {['high','medium','low'].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Stage</label>
                  <select
                    value={newIdea.column}
                    onChange={e => setNewIdea(p => ({ ...p, column: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                  >
                    {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Estimated Views</label>
                <input
                  type="text"
                  value={newIdea.estimatedViews}
                  onChange={e => setNewIdea(p => ({ ...p, estimatedViews: e.target.value }))}
                  placeholder="e.g. 500K"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAddModal(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
                <button onClick={addIdea} className="btn-primary flex-1 justify-center">Add Idea</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

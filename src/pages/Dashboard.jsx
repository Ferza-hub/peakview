import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Zap, Clock, Users, Play, MoreHorizontal, Youtube, Instagram, Cpu, Video } from 'lucide-react'
import { projects } from '../data/editorData'

const PLATFORM_META = {
  youtube:   { color: '#FF0000', label: 'YouTube' },
  instagram: { color: '#E1306C', label: 'Instagram' },
  tiktok:    { color: '#69C9D0', label: 'TikTok' },
}

const STATUS_COLORS = {
  draft:     'bg-zinc-700 text-zinc-300',
  published: 'bg-emerald-900/60 text-emerald-400',
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [hover, setHover] = useState(null)

  const filtered = projects.filter(p => p.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-100 flex flex-col">
      {/* Top bar */}
      <header className="h-14 border-b border-[#1A1A1A] flex items-center px-6 gap-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center">
            <Zap size={14} className="text-white" fill="white" />
          </div>
          <span className="font-bold text-white">PeakEdit</span>
        </div>
        <nav className="flex gap-1 ml-4">
          {['Projects','Templates','Assets','Brand Kit'].map(n => (
            <button key={n} className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${n === 'Projects' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>{n}</button>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search projects…"
              className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg pl-8 pr-3 py-1.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-violet-500/60 w-52"
            />
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold cursor-pointer">A</div>
        </div>
      </header>

      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        {/* Hero */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Your Projects</h1>
            <p className="text-zinc-500 mt-0.5 text-sm">AI-powered video editing for creators</p>
          </div>
          <button
            onClick={() => navigate('/editor/1')}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            <Plus size={16} /> New Project
          </button>
        </div>

        {/* Feature chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { icon: <Cpu size={12} />, label: 'AI Auto-Caption' },
            { icon: <Video size={12} />, label: 'Multi-Track Editor' },
            { icon: <Zap size={12} />, label: 'Script to Video' },
            { icon: <Users size={12} />, label: 'Team Collaboration' },
          ].map(f => (
            <span key={f.label} className="flex items-center gap-1.5 px-3 py-1 bg-violet-950/60 border border-violet-800/40 text-violet-300 rounded-full text-xs font-medium">
              {f.icon} {f.label}
            </span>
          ))}
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-3 gap-4">
          {/* New project card */}
          <div
            onClick={() => navigate('/editor/1')}
            className="aspect-video rounded-2xl border-2 border-dashed border-[#2A2A2A] hover:border-violet-600/60 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] group-hover:bg-violet-900/40 flex items-center justify-center transition-colors">
              <Plus size={22} className="text-zinc-600 group-hover:text-violet-400" />
            </div>
            <span className="text-sm text-zinc-600 group-hover:text-zinc-400 font-medium">New Project</span>
          </div>

          {filtered.map(p => {
            const pm = PLATFORM_META[p.platform] || PLATFORM_META.youtube
            return (
              <div
                key={p.id}
                className="rounded-2xl overflow-hidden border border-[#1A1A1A] hover:border-[#2A2A2A] cursor-pointer transition-all group"
                onMouseEnter={() => setHover(p.id)}
                onMouseLeave={() => setHover(null)}
                onClick={() => navigate('/editor/1')}
              >
                {/* Thumbnail */}
                <div className="aspect-video relative flex items-center justify-center overflow-hidden" style={{ background: `linear-gradient(135deg, ${p.color}33, #0A0A0A)` }}>
                  <div className="w-16 h-16 rounded-2xl opacity-20" style={{ background: p.color }} />
                  <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${hover === p.id ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                      <Play size={20} className="text-white ml-1" />
                    </div>
                  </div>
                  {/* Collaborator avatars */}
                  {p.collaborators > 0 && (
                    <div className="absolute top-2 right-2 flex -space-x-1.5">
                      {Array.from({ length: Math.min(p.collaborators, 3) }).map((_, i) => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-[#0A0A0A] flex items-center justify-center text-xs font-bold text-white"
                          style={{ background: ['#EC4899','#06B6D4','#D97706'][i] }}>
                          {['S','M','J'][i]}
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Duration */}
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded font-mono">{p.duration}</div>
                </div>

                {/* Info */}
                <div className="bg-[#111111] px-3 py-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm font-medium text-zinc-200 leading-tight truncate">{p.title}</p>
                    <button className="text-zinc-600 hover:text-zinc-400 shrink-0" onClick={e => e.stopPropagation()}>
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-xs text-zinc-500">
                      <Clock size={10} /> {p.lastEdited}
                    </span>
                    <span className="text-xs px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: pm.color + '22', color: pm.color }}>
                      {pm.label}
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${STATUS_COLORS[p.status]}`}>
                      {p.status}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-2.5 h-1 bg-[#2A2A2A] rounded-full overflow-hidden">
                    <div className="h-1 rounded-full transition-all" style={{ width: `${p.progress}%`, backgroundColor: p.color }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

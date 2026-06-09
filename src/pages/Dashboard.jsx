import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus, Search, Zap, Clock, Play, Pause, MoreHorizontal,
  Cpu, Video, Users, Pencil, Trash2, Check, X,
  Music, Film, Wand2, Download
} from 'lucide-react'
import { getProjects, saveProjects, upsertProjectMeta, deleteProjectData, saveProjectData, setLastId } from '../utils/storage'
import { genId } from '../utils/helpers'
import { useToast } from '../context/ToastContext'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { initialTracks, mediaFiles as defaultMedia, templates, stockFootage, stockMusic } from '../data/editorData'

const PM = {
  youtube:   { color: '#FF0000', label: 'YouTube' },
  instagram: { color: '#E1306C', label: 'Instagram' },
  tiktok:    { color: '#69C9D0', label: 'TikTok' },
}
const PALETTE = ['#7C3AED','#EC4899','#06B6D4','#10B981','#F59E0B','#EF4444']
const STATUS_CLS = {
  draft:     'bg-zinc-700/60 text-zinc-300',
  published: 'bg-emerald-900/60 text-emerald-400',
}

// ── Animated canvas thumbnail for project cards ─────────────────────────────
function ProjectThumb({ color, title }) {
  const canvasRef = useRef(null)
  const animRef   = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let t = 0
    const seed = [...title].reduce((a, c) => a + c.charCodeAt(0), 0)

    const render = () => {
      t += 0.018
      const { width: w, height: h } = canvas

      // Animated gradient background
      const grad = ctx.createLinearGradient(
        w * 0.5 + Math.sin(t * 0.4) * w * 0.3, 0,
        w * 0.5 - Math.cos(t * 0.3) * w * 0.3, h
      )
      grad.addColorStop(0, color + '50')
      grad.addColorStop(0.6, '#080808')
      grad.addColorStop(1,   color + '15')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)

      // Floating particles
      for (let i = 0; i < 6; i++) {
        const px = ((seed * (i + 1) * 137.5) % w)
        const py = ((seed * (i + 1) * 97.3)  % h)
        const r  = 1.2 + Math.sin(t * 0.8 + i * 1.1) * 0.6
        ctx.beginPath()
        ctx.arc(
          px + Math.sin(t * 0.6 + i * 0.9) * 10,
          py + Math.cos(t * 0.4 + i * 1.2) * 7,
          r, 0, Math.PI * 2
        )
        ctx.fillStyle = `rgba(255,255,255,${0.08 + Math.sin(t + i) * 0.04})`
        ctx.fill()
      }

      // Light horizontal scan line
      const scanY = ((t * 25) % (h + 2)) - 1
      ctx.fillStyle = 'rgba(255,255,255,0.012)'
      ctx.fillRect(0, scanY, w, 2)

      // Corner viewfinder brackets in the project color
      const bl = 10
      ctx.strokeStyle = color + '99'
      ctx.lineWidth = 1.5
      ;[[0, 0],[w, 0],[0, h],[w, h]].forEach(([x, y]) => {
        const dx = x === 0 ? bl : -bl
        const dy = y === 0 ? bl : -bl
        ctx.beginPath(); ctx.moveTo(x + dx, y); ctx.lineTo(x, y); ctx.lineTo(x, y + dy); ctx.stroke()
      })

      animRef.current = requestAnimationFrame(render)
    }

    render()
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [color, title])

  return <canvas ref={canvasRef} width={320} height={180} className="w-full h-full block" />
}

// ── Animated canvas thumbnail for stock footage items ───────────────────────
function FootageThumb({ color, idx }) {
  const canvasRef = useRef(null)
  const animRef   = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let t = idx * 1.3  // offset so each card looks different

    const render = () => {
      t += 0.025
      const { width: w, height: h } = canvas
      const grad = ctx.createLinearGradient(Math.sin(t*0.5)*w, 0, w - Math.cos(t*0.3)*w*0.5, h)
      grad.addColorStop(0, color + '60')
      grad.addColorStop(1, '#050505')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)

      // Simulated moving subject
      ctx.save()
      ctx.globalAlpha = 0.18
      ctx.fillStyle = '#ccc'
      const bob = Math.sin(t * 0.6) * 2
      ctx.beginPath(); ctx.ellipse(w*0.5, h*0.35 + bob, w*0.08, h*0.15, 0, 0, Math.PI*2); ctx.fill()
      ctx.fillRect(w*0.43, h*0.5 + bob, w*0.14, h*0.28)
      ctx.restore()

      // scan
      const sy = ((t * 50) % (h + 2)) - 1
      ctx.fillStyle = 'rgba(255,255,255,0.02)'
      ctx.fillRect(0, sy, w, 1.5)

      // corner brackets
      const bl = 5
      ctx.strokeStyle = color + 'aa'
      ctx.lineWidth = 1
      ;[[0,0],[w,0],[0,h],[w,h]].forEach(([x,y]) => {
        const dx = x===0?bl:-bl, dy = y===0?bl:-bl
        ctx.beginPath(); ctx.moveTo(x+dx,y); ctx.lineTo(x,y); ctx.lineTo(x,y+dy); ctx.stroke()
      })

      animRef.current = requestAnimationFrame(render)
    }
    render()
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [color, idx])

  return <canvas ref={canvasRef} width={180} height={100} className="w-full h-full block" />
}

// ── Web Audio music preview ──────────────────────────────────────────────────
const GENRE_CHORDS = {
  'Lo-Fi':     [[261.63, 329.63, 392.00], [220.00, 277.18, 329.63]],
  'Epic':      [[87.31,  174.61, 261.63], [73.42,  146.83, 220.00]],
  'Corporate': [[293.66, 369.99, 440.00], [261.63, 329.63, 392.00]],
  'Pop':       [[261.63, 329.63, 523.25], [349.23, 440.00, 523.25]],
  'Ambient':   [[110.00, 165.00, 220.00], [138.59, 207.65, 277.18]],
  'Hip-Hop':   [[87.31,  130.81, 174.61], [73.42,  110.00, 146.83]],
  'Jazz':      [[261.63, 329.63, 392.00, 466.16], [220.00, 277.18, 349.23, 415.30]],
}

// ── Tag color map ────────────────────────────────────────────────────────────
const TAG_COLORS = [
  'bg-violet-900/60 text-violet-300',
  'bg-blue-900/60 text-blue-300',
  'bg-emerald-900/60 text-emerald-300',
  'bg-amber-900/60 text-amber-300',
  'bg-pink-900/60 text-pink-300',
  'bg-cyan-900/60 text-cyan-300',
]

const FOOTAGE_COLORS = ['#7C3AED','#EC4899','#06B6D4','#10B981','#F59E0B','#EF4444']

function seed() {
  const ts = new Date().toISOString()
  return [
    { id: genId(), title:'How I Made $100K as a Creator', platform:'youtube',   color:'#7C3AED', duration:'12:34', status:'draft',     progress:72,  collaborators:2, createdAt:ts, updatedAt:ts },
    { id: genId(), title:'Morning Routine Vlog 2024',    platform:'instagram', color:'#EC4899', duration:'3:21',  status:'published', progress:100, collaborators:0, createdAt:ts, updatedAt:ts },
    { id: genId(), title:'Top 10 Productivity Hacks',   platform:'youtube',   color:'#06B6D4', duration:'8:45',  status:'draft',     progress:45,  collaborators:3, createdAt:ts, updatedAt:ts },
  ]
}

export default function Dashboard() {
  const navigate = useNavigate()
  const toast    = useToast()

  const [projects, setProjects]     = useState([])
  const [search, setSearch]         = useState('')
  const [hover, setHover]           = useState(null)
  const [menu, setMenu]             = useState(null)
  const [renamingId, setRenamingId] = useState(null)
  const [renameVal, setRenameVal]   = useState('')
  const [confirmDel, setConfirmDel] = useState(null)
  const [navTab, setNavTab]         = useState('Projects')
  const [playingTrack, setPlayingTrack] = useState(null)
  const [musicFilter, setMusicFilter]   = useState('All')
  const audioCtxRef = useRef(null)
  const renameRef   = useRef(null)

  useEffect(() => {
    let list = getProjects()
    if (list.length === 0) {
      const demos = seed()
      saveProjects(demos)
      demos.forEach(p => saveProjectData(p.id, { tracks: initialTracks, mediaFiles: defaultMedia, format: '16:9' }))
      list = demos
    }
    setProjects(list)
  }, [])

  useEffect(() => { if (renamingId && renameRef.current) renameRef.current.focus() }, [renamingId])

  useEffect(() => {
    const h = () => setMenu(null)
    document.addEventListener('pointerdown', h)
    return () => document.removeEventListener('pointerdown', h)
  }, [])

  // cleanup audio on unmount
  useEffect(() => () => { if (audioCtxRef.current) audioCtxRef.current.close() }, [])

  const filtered = projects.filter(p => p.title.toLowerCase().includes(search.toLowerCase()))

  const createProject = () => {
    const id = genId()
    const ts = new Date().toISOString()
    const p  = { id, title:'Untitled Project', platform:'youtube', color: PALETTE[projects.length % PALETTE.length], duration:'0:00', status:'draft', progress:0, collaborators:0, createdAt:ts, updatedAt:ts }
    upsertProjectMeta(id, p)
    const emptyTracks = initialTracks.map(t => ({ ...t, clips: [] }))
    saveProjectData(id, { tracks: emptyTracks, mediaFiles: [], format: '16:9' })
    setProjects(prev => [...prev, p])
    toast.add('Project created', 'success')
    setLastId(id)
    navigate(`/editor/${id}`)
  }

  const startRename = (p, e) => { e.stopPropagation(); setMenu(null); setRenamingId(p.id); setRenameVal(p.title) }

  const commitRename = (id) => {
    if (!renameVal.trim()) { setRenamingId(null); return }
    const ts = new Date().toISOString()
    const updated = projects.map(p => p.id === id ? { ...p, title: renameVal.trim(), updatedAt: ts } : p)
    setProjects(updated); saveProjects(updated)
    setRenamingId(null); toast.add('Renamed', 'success')
  }

  const doDelete = () => {
    const id = confirmDel.id
    setProjects(projects.filter(p => p.id !== id))
    saveProjects(projects.filter(p => p.id !== id))
    deleteProjectData(id)
    setConfirmDel(null)
    toast.add('Project deleted', 'error')
  }

  const playMusic = useCallback((trackId, genre) => {
    if (playingTrack === trackId) {
      if (audioCtxRef.current) { audioCtxRef.current.close(); audioCtxRef.current = null }
      setPlayingTrack(null)
      return
    }
    if (audioCtxRef.current) { audioCtxRef.current.close(); audioCtxRef.current = null }
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      audioCtxRef.current = ctx
      const chords  = GENRE_CHORDS[genre] || GENRE_CHORDS['Lo-Fi']
      const master  = ctx.createGain()
      master.gain.setValueAtTime(0.18, ctx.currentTime)
      master.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 4)
      master.connect(ctx.destination)

      chords.forEach((chord, ci) => {
        chord.forEach(freq => {
          const osc  = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = ['Lo-Fi','Ambient','Jazz'].includes(genre) ? 'sine' : 'triangle'
          osc.frequency.setValueAtTime(freq, ctx.currentTime + ci * 1.3)
          gain.gain.setValueAtTime(0.35 / chord.length, ctx.currentTime + ci * 1.3)
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + ci * 1.3 + 1.5)
          osc.connect(gain); gain.connect(master)
          osc.start(ctx.currentTime + ci * 1.3)
          osc.stop(ctx.currentTime  + ci * 1.3 + 1.8)
        })
      })

      setPlayingTrack(trackId)
      setTimeout(() => { setPlayingTrack(null); audioCtxRef.current = null }, 4000)
    } catch {
      toast.add('Audio preview not available', 'warning')
    }
  }, [playingTrack, toast])

  const GENRES = ['All', ...new Set(stockMusic.map(m => m.genre))]
  const filteredMusic = musicFilter === 'All' ? stockMusic : stockMusic.filter(m => m.genre === musicFilter)

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-100 flex flex-col">

      {/* Header */}
      <header className="h-14 border-b border-[#1A1A1A] flex items-center px-6 gap-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center">
            <Zap size={14} className="text-white" fill="white" />
          </div>
          <span className="font-bold text-white tracking-tight">PeakEdit</span>
        </div>

        <nav className="flex gap-0.5 ml-4 overflow-x-auto">
          {['Projects','Templates','Assets','Brand Kit'].map(n => (
            <button key={n} onClick={() => setNavTab(n)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors whitespace-nowrap ${
                navTab === n ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >{n}</button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search projects…"
              className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg pl-8 pr-3 py-1.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-violet-500/60 w-48 transition-colors" />
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold cursor-pointer select-none">A</div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">

          {/* ══ PROJECTS ══════════════════════════════════════════════════ */}
          {navTab === 'Projects' && (
            <>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h1 className="text-2xl font-bold text-white">Your Projects</h1>
                  <p className="text-zinc-500 mt-0.5 text-sm">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
                </div>
                <button onClick={createProject}
                  className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-violet-900/40">
                  <Plus size={15} /> New Project
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  { icon: <Cpu size={12} />,   label: 'AI Auto-Caption' },
                  { icon: <Video size={12} />,  label: 'Multi-Track' },
                  { icon: <Wand2 size={12} />,  label: 'Script to Video' },
                  { icon: <Users size={12} />,  label: 'Collaboration' },
                ].map(f => (
                  <span key={f.label} className="flex items-center gap-1.5 px-3 py-1 bg-violet-950/60 border border-violet-800/40 text-violet-300 rounded-full text-xs font-medium">
                    {f.icon} {f.label}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* New project card */}
                <div onClick={createProject}
                  className="aspect-video rounded-2xl border-2 border-dashed border-[#2A2A2A] hover:border-violet-600/60 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all group min-h-[140px]">
                  <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] group-hover:bg-violet-900/40 flex items-center justify-center transition-colors">
                    <Plus size={22} className="text-zinc-600 group-hover:text-violet-400" />
                  </div>
                  <span className="text-sm text-zinc-600 group-hover:text-zinc-400 font-medium">New Project</span>
                </div>

                {filtered.map(p => {
                  const pm    = PM[p.platform] || PM.youtube
                  const isRen = renamingId === p.id
                  return (
                    <div key={p.id}
                      className="rounded-2xl overflow-hidden border border-[#1A1A1A] hover:border-[#2A2A2A] cursor-pointer transition-all group relative"
                      onMouseEnter={() => setHover(p.id)} onMouseLeave={() => setHover(null)}
                      onClick={() => !isRen && navigate(`/editor/${p.id}`)}>

                      {/* Animated thumbnail */}
                      <div className="aspect-video relative overflow-hidden">
                        <ProjectThumb color={p.color} title={p.title} />

                        {/* Play overlay on hover */}
                        <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-200 ${hover === p.id && !isRen ? 'opacity-100' : 'opacity-0'}`}>
                          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                            <Play size={18} className="text-white ml-1" />
                          </div>
                        </div>

                        {/* Collaborator avatars */}
                        {p.collaborators > 0 && (
                          <div className="absolute top-2 right-2 flex -space-x-1.5">
                            {Array.from({ length: Math.min(p.collaborators, 3) }).map((_, i) => (
                              <div key={i} className="w-6 h-6 rounded-full border-2 border-[#0A0A0A] flex items-center justify-center text-[10px] font-bold text-white"
                                style={{ background: ['#EC4899','#06B6D4','#D97706'][i] }}>
                                {['S','M','J'][i]}
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="absolute bottom-2 right-2 bg-black/75 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                          {p.duration}
                        </div>
                      </div>

                      {/* Card info */}
                      <div className="bg-[#111111] px-3 py-3">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          {isRen ? (
                            <div className="flex items-center gap-1 flex-1" onClick={e => e.stopPropagation()}>
                              <input ref={renameRef} value={renameVal}
                                onChange={e => setRenameVal(e.target.value)}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') commitRename(p.id)
                                  if (e.key === 'Escape') setRenamingId(null)
                                }}
                                className="flex-1 bg-[#1A1A1A] border border-violet-500/60 rounded px-2 py-1 text-sm text-zinc-100 focus:outline-none" />
                              <button onClick={() => commitRename(p.id)} className="text-emerald-400 p-1"><Check size={13} /></button>
                              <button onClick={() => setRenamingId(null)} className="text-zinc-500 p-1"><X size={13} /></button>
                            </div>
                          ) : (
                            <p className="text-sm font-medium text-zinc-200 leading-tight truncate">{p.title}</p>
                          )}
                          {!isRen && (
                            <div className="relative" onClick={e => e.stopPropagation()}>
                              <button
                                className="text-zinc-600 hover:text-zinc-300 shrink-0 p-1.5 rounded hover:bg-white/5 transition-colors"
                                onClick={() => setMenu(menu === p.id ? null : p.id)}>
                                <MoreHorizontal size={15} />
                              </button>
                              {menu === p.id && (
                                <div className="absolute right-0 top-8 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl shadow-2xl z-50 overflow-hidden min-w-[130px]">
                                  <button onClick={e => startRename(p, e)} className="flex items-center gap-2 w-full px-3 py-2.5 text-xs text-zinc-300 hover:bg-[#252525] transition-colors">
                                    <Pencil size={11} /> Rename
                                  </button>
                                  <button onClick={e => { e.stopPropagation(); setMenu(null); setConfirmDel(p) }} className="flex items-center gap-2 w-full px-3 py-2.5 text-xs text-red-400 hover:bg-red-950/40 transition-colors">
                                    <Trash2 size={11} /> Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="flex items-center gap-1 text-[11px] text-zinc-500">
                            <Clock size={10} /> {new Date(p.updatedAt).toLocaleDateString()}
                          </span>
                          <span className="text-[11px] px-1.5 py-0.5 rounded-full font-medium"
                            style={{ backgroundColor: pm.color + '22', color: pm.color }}>
                            {pm.label}
                          </span>
                          <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-medium ${STATUS_CLS[p.status] || STATUS_CLS.draft}`}>
                            {p.status}
                          </span>
                        </div>

                        <div className="mt-2.5 h-1 bg-[#2A2A2A] rounded-full overflow-hidden">
                          <div className="h-1 rounded-full transition-all" style={{ width: `${p.progress}%`, backgroundColor: p.color }} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              {filtered.length === 0 && search && (
                <p className="text-center py-16 text-zinc-600">No projects match "{search}"</p>
              )}
            </>
          )}

          {/* ══ TEMPLATES ════════════════════════════════════════════════ */}
          {navTab === 'Templates' && (
            <>
              <h1 className="text-2xl font-bold text-white mb-1">Templates</h1>
              <p className="text-zinc-500 text-sm mb-6">Start faster with a pre-built project template.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {templates.map(t => (
                  <div key={t.id} onClick={createProject}
                    className="rounded-2xl overflow-hidden border border-[#1A1A1A] hover:border-violet-600/50 cursor-pointer transition-all group">
                    <div className="h-32 relative overflow-hidden"
                      style={{ background: `linear-gradient(135deg, ${t.thumb}40, #080808)` }}>
                      {/* Animated gradient lines */}
                      <div className="absolute inset-0 flex flex-col justify-evenly px-3 opacity-20">
                        {[80, 60, 40].map((w, i) => (
                          <div key={i} className="h-1 rounded-full" style={{ width: `${w}%`, background: t.thumb }} />
                        ))}
                      </div>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="text-xs text-white font-semibold bg-violet-600 px-3 py-1.5 rounded-lg">Use Template</span>
                      </div>
                      <div className="absolute top-2 left-2 text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                        style={{ backgroundColor: t.thumb + '33', color: t.thumb }}>
                        {t.cat}
                      </div>
                    </div>
                    <div className="bg-[#111111] px-3 py-2.5">
                      <p className="text-sm font-medium text-zinc-200">{t.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ══ ASSETS ═══════════════════════════════════════════════════ */}
          {navTab === 'Assets' && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-white">Asset Library</h1>
                  <p className="text-zinc-500 text-sm mt-0.5">Stock footage and music for your projects</p>
                </div>
              </div>

              {/* Stock Footage */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Film size={16} className="text-violet-400" />
                  <h2 className="text-base font-semibold text-zinc-200">Stock Footage</h2>
                  <span className="text-xs text-zinc-600 bg-[#1A1A1A] px-2 py-0.5 rounded-full">{stockFootage.length} clips</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stockFootage.map((f, idx) => {
                    const color = FOOTAGE_COLORS[idx % FOOTAGE_COLORS.length]
                    const tags  = f.tags.split(' ')
                    return (
                      <div key={f.id}
                        className="rounded-2xl overflow-hidden border border-[#1A1A1A] hover:border-[#2A2A2A] transition-all group bg-[#0D0D0D]">
                        {/* Animated thumbnail */}
                        <div className="aspect-video relative overflow-hidden">
                          <FootageThumb color={color} idx={idx} />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              onClick={() => toast.add(`Preview: ${f.name}`, 'info')}
                              className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg transition-colors border border-white/20">
                              <Play size={11} /> Preview
                            </button>
                            <button
                              onClick={() => toast.add(`"${f.name}" added to project`, 'success')}
                              className="flex items-center gap-1.5 bg-violet-600/80 hover:bg-violet-500 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg transition-colors">
                              <Plus size={11} /> Use
                            </button>
                          </div>
                          <div className="absolute bottom-2 right-2 bg-black/75 text-zinc-300 text-[10px] px-1.5 py-0.5 rounded font-mono">
                            {f.duration}
                          </div>
                        </div>
                        <div className="px-3 py-2.5">
                          <p className="text-sm font-medium text-zinc-200 truncate mb-2">{f.name}</p>
                          <div className="flex flex-wrap gap-1">
                            {tags.map((tag, ti) => (
                              <span key={tag} className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${TAG_COLORS[(idx + ti) % TAG_COLORS.length]}`}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Stock Music */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Music size={16} className="text-emerald-400" />
                    <h2 className="text-base font-semibold text-zinc-200">Stock Music</h2>
                    <span className="text-xs text-zinc-600 bg-[#1A1A1A] px-2 py-0.5 rounded-full">{stockMusic.length} tracks</span>
                  </div>
                  <div className="ml-auto flex flex-wrap gap-1">
                    {GENRES.map(g => (
                      <button key={g} onClick={() => setMusicFilter(g)}
                        className={`px-2.5 py-0.5 rounded-full text-[11px] border transition-colors ${
                          musicFilter === g
                            ? 'border-emerald-500 text-emerald-300 bg-emerald-900/30'
                            : 'border-[#2A2A2A] text-zinc-500 hover:text-zinc-300'
                        }`}>
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {filteredMusic.map(m => {
                    const isPlaying = playingTrack === m.id
                    return (
                      <div key={m.id}
                        className={`flex items-center gap-4 p-3.5 rounded-xl border transition-all ${
                          isPlaying
                            ? 'border-emerald-700/60 bg-emerald-950/20'
                            : 'border-[#1A1A1A] bg-[#0D0D0D] hover:border-[#2A2A2A]'
                        }`}>

                        {/* Play button */}
                        <button
                          onClick={() => playMusic(m.id, m.genre)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                            isPlaying
                              ? 'bg-emerald-600 shadow-lg shadow-emerald-900/50 animate-pulse'
                              : 'bg-[#1A1A1A] hover:bg-emerald-800/60 border border-[#2A2A2A]'
                          }`}>
                          {isPlaying
                            ? <Pause size={14} className="text-white" />
                            : <Play  size={13} className="text-emerald-400 ml-0.5" />}
                        </button>

                        {/* Waveform visual (static bars, animated when playing) */}
                        <div className="flex items-center gap-0.5 shrink-0">
                          {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i}
                              className={`w-0.5 rounded-full transition-all ${isPlaying ? 'bg-emerald-400' : 'bg-[#2A2A2A]'}`}
                              style={{
                                height: `${8 + Math.sin(i * 0.8) * 6}px`,
                                animationDelay: `${i * 80}ms`,
                              }}
                            />
                          ))}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-zinc-200 truncate">{m.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] text-zinc-500">{m.artist}</span>
                            <span className="text-[11px] text-zinc-600">{m.duration}</span>
                            <span className="text-[11px] text-zinc-600">{m.bpm} BPM</span>
                          </div>
                        </div>

                        {/* Genre badge */}
                        <span className="text-[11px] px-2 py-0.5 rounded-full border border-[#2A2A2A] text-zinc-500 shrink-0">
                          {m.genre}
                        </span>

                        {/* Add to project */}
                        <button
                          onClick={() => toast.add(`"${m.title}" added to project`, 'success')}
                          className="w-8 h-8 rounded-lg bg-[#1A1A1A] hover:bg-violet-900/40 border border-[#2A2A2A] hover:border-violet-700/50 flex items-center justify-center text-zinc-600 hover:text-violet-400 transition-all shrink-0">
                          <Plus size={13} />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}

          {/* ══ BRAND KIT ════════════════════════════════════════════════ */}
          {navTab === 'Brand Kit' && (
            <>
              <h1 className="text-2xl font-bold text-white mb-1">Brand Kit</h1>
              <p className="text-zinc-500 text-sm mb-6">Your visual identity — colors, fonts, and logo for consistent branding.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="p-5 rounded-2xl bg-[#111111] border border-[#1A1A1A]">
                  <h2 className="text-sm font-semibold text-zinc-300 mb-4">Brand Colors</h2>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {['#7C3AED','#EC4899','#06B6D4','#10B981','#F59E0B','#EF4444'].map(c => (
                      <div key={c} title={`Click to copy ${c}`}
                        onClick={() => { navigator.clipboard?.writeText(c).catch(()=>{}); toast.add(`Copied ${c}`, 'success') }}
                        className="w-10 h-10 rounded-xl border-2 border-[#2A2A2A] cursor-pointer hover:scale-110 hover:border-white/20 transition-all"
                        style={{ background: c }} />
                    ))}
                    <div onClick={() => toast.add('Color picker coming soon', 'info')}
                      className="w-10 h-10 rounded-xl border-2 border-dashed border-[#2A2A2A] flex items-center justify-center cursor-pointer hover:border-zinc-500 transition-colors">
                      <Plus size={14} className="text-zinc-600" />
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-600">Click to copy hex · drag to reorder</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#111111] border border-[#1A1A1A]">
                  <h2 className="text-sm font-semibold text-zinc-300 mb-4">Brand Fonts</h2>
                  <div className="flex flex-col gap-2">
                    {[
                      { name: 'Inter',       role: 'Primary'   },
                      { name: 'Montserrat',  role: 'Heading'   },
                      { name: 'Poppins',     role: 'Subtitle'  },
                    ].map(f => (
                      <div key={f.name}
                        onClick={() => toast.add(`Font "${f.name}" set as ${f.role.toLowerCase()}`, 'success')}
                        className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] cursor-pointer hover:border-violet-500/50 hover:bg-violet-950/20 transition-all">
                        <span className="text-sm text-zinc-200 font-medium" style={{ fontFamily: f.name }}>{f.name}</span>
                        <span className="text-[11px] text-zinc-600">{f.role}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#111111] border border-[#1A1A1A] sm:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-zinc-300">Logo & Watermark</h2>
                    <button onClick={() => toast.add('Brand Kit exported as ZIP', 'success')}
                      className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors">
                      <Download size={12} /> Export Brand Kit
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {['Primary Logo','Icon Only','Watermark'].map(l => (
                      <label key={l}
                        className="border-2 border-dashed border-[#2A2A2A] rounded-xl h-20 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-violet-600/50 transition-colors group">
                        <input type="file" accept="image/*" className="sr-only"
                          onChange={() => toast.add(`${l} uploaded`, 'success')} />
                        <Plus size={16} className="text-zinc-700 group-hover:text-violet-500 transition-colors" />
                        <span className="text-[11px] text-zinc-700 group-hover:text-zinc-500 transition-colors">{l}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </div>

      {confirmDel && (
        <ConfirmDialog
          title="Delete project?"
          message={`"${confirmDel.title}" will be permanently deleted.`}
          onConfirm={doDelete} onCancel={() => setConfirmDel(null)}
        />
      )}
    </div>
  )
}

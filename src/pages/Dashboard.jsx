import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Zap, Clock, Play, MoreHorizontal, Cpu, Video, Users, Pencil, Trash2, Check, X, LayoutTemplate, Package, Palette } from 'lucide-react'
import { getProjects, saveProjects, upsertProjectMeta, deleteProjectData, saveProjectData, setLastId } from '../utils/storage'
import { genId } from '../utils/helpers'
import { useToast } from '../context/ToastContext'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { initialTracks, mediaFiles as defaultMedia, templates, stockFootage, stockMusic } from '../data/editorData'

const PM = { youtube: { color:'#FF0000', label:'YouTube' }, instagram: { color:'#E1306C', label:'Instagram' }, tiktok: { color:'#69C9D0', label:'TikTok' } }
const PALETTE = ['#7C3AED','#EC4899','#06B6D4','#10B981','#F59E0B','#EF4444']
const STATUS_CLS = { draft:'bg-zinc-700/60 text-zinc-300', published:'bg-emerald-900/60 text-emerald-400' }

function seed() {
  const ts = new Date().toISOString()
  return [
    { id: genId(), title:'How I Made $100K as a Creator', platform:'youtube',   color:'#7C3AED', duration:'12:34', status:'draft',     progress:72, collaborators:2, createdAt:ts, updatedAt:ts },
    { id: genId(), title:'Morning Routine Vlog 2024',    platform:'instagram', color:'#EC4899', duration:'3:21',  status:'published', progress:100,collaborators:0, createdAt:ts, updatedAt:ts },
    { id: genId(), title:'Top 10 Productivity Hacks',   platform:'youtube',   color:'#06B6D4', duration:'8:45',  status:'draft',     progress:45, collaborators:3, createdAt:ts, updatedAt:ts },
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
  const renameRef = useRef(null)

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

  const filtered = projects.filter(p => p.title.toLowerCase().includes(search.toLowerCase()))

  const createProject = () => {
    const id = genId()
    const ts = new Date().toISOString()
    const p = { id, title:'Untitled Project', platform:'youtube', color: PALETTE[projects.length % PALETTE.length], duration:'0:00', status:'draft', progress:0, collaborators:0, createdAt:ts, updatedAt:ts }
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
    const updated = projects.filter(p => p.id !== id)
    setProjects(updated); saveProjects(updated); deleteProjectData(id)
    setConfirmDel(null); toast.add('Project deleted', 'error')
  }

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-100 flex flex-col">
      <header className="h-14 border-b border-[#1A1A1A] flex items-center px-6 gap-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center"><Zap size={14} className="text-white" fill="white" /></div>
          <span className="font-bold text-white">PeakEdit</span>
        </div>
        <nav className="flex gap-1 ml-4 overflow-x-auto">
          {['Projects','Templates','Assets','Brand Kit'].map(n => (
            <button key={n} onClick={() => setNavTab(n)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors whitespace-nowrap ${navTab===n ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>{n}</button>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects…"
              className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg pl-8 pr-3 py-1.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-violet-500/60 w-52" />
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold cursor-pointer">A</div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">

          {navTab === 'Projects' && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-white">Your Projects</h1>
                  <p className="text-zinc-500 mt-0.5 text-sm">{projects.length} project{projects.length!==1?'s':''}</p>
                </div>
                <button onClick={createProject} className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
                  <Plus size={16} /> New Project
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {[{icon:<Cpu size={12}/>,label:'AI Auto-Caption'},{icon:<Video size={12}/>,label:'Multi-Track'},{icon:<Zap size={12}/>,label:'Script to Video'},{icon:<Users size={12}/>,label:'Collaboration'}].map(f => (
                  <span key={f.label} className="flex items-center gap-1.5 px-3 py-1 bg-violet-950/60 border border-violet-800/40 text-violet-300 rounded-full text-xs font-medium">{f.icon} {f.label}</span>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div onClick={createProject} className="aspect-video rounded-2xl border-2 border-dashed border-[#2A2A2A] hover:border-violet-600/60 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all group min-h-[140px]">
                  <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] group-hover:bg-violet-900/40 flex items-center justify-center transition-colors">
                    <Plus size={22} className="text-zinc-600 group-hover:text-violet-400" />
                  </div>
                  <span className="text-sm text-zinc-600 group-hover:text-zinc-400 font-medium">New Project</span>
                </div>

                {filtered.map(p => {
                  const pm   = PM[p.platform] || PM.youtube
                  const isRen = renamingId === p.id
                  return (
                    <div key={p.id}
                      className="rounded-2xl overflow-hidden border border-[#1A1A1A] hover:border-[#2A2A2A] cursor-pointer transition-all group relative"
                      onMouseEnter={() => setHover(p.id)} onMouseLeave={() => setHover(null)}
                      onClick={() => !isRen && navigate(`/editor/${p.id}`)}>
                      <div className="aspect-video relative flex items-center justify-center overflow-hidden" style={{ background:`linear-gradient(135deg,${p.color}33,#0A0A0A)` }}>
                        <div className="w-16 h-16 rounded-2xl opacity-20" style={{ background: p.color }} />
                        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${hover===p.id&&!isRen?'opacity-100':'opacity-0'}`}>
                          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center"><Play size={20} className="text-white ml-1" /></div>
                        </div>
                        {p.collaborators > 0 && (
                          <div className="absolute top-2 right-2 flex -space-x-1.5">
                            {Array.from({length:Math.min(p.collaborators,3)}).map((_,i)=>(
                              <div key={i} className="w-6 h-6 rounded-full border-2 border-[#0A0A0A] flex items-center justify-center text-xs font-bold text-white" style={{background:['#EC4899','#06B6D4','#D97706'][i]}}>{['S','M','J'][i]}</div>
                            ))}
                          </div>
                        )}
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded font-mono">{p.duration}</div>
                      </div>

                      <div className="bg-[#111111] px-3 py-3">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          {isRen ? (
                            <div className="flex items-center gap-1 flex-1" onClick={e=>e.stopPropagation()}>
                              <input ref={renameRef} value={renameVal} onChange={e=>setRenameVal(e.target.value)}
                                onKeyDown={e=>{if(e.key==='Enter')commitRename(p.id);if(e.key==='Escape')setRenamingId(null)}}
                                className="flex-1 bg-[#1A1A1A] border border-violet-500/60 rounded px-2 py-1 text-sm text-zinc-100 focus:outline-none" />
                              <button onClick={()=>commitRename(p.id)} className="text-emerald-400 p-1"><Check size={14}/></button>
                              <button onClick={()=>setRenamingId(null)} className="text-zinc-500 p-1"><X size={14}/></button>
                            </div>
                          ) : (
                            <p className="text-sm font-medium text-zinc-200 leading-tight truncate">{p.title}</p>
                          )}
                          {!isRen && (
                            <div className="relative" onClick={e=>e.stopPropagation()}>
                              <button className="text-zinc-600 hover:text-zinc-400 shrink-0 p-2 rounded hover:bg-white/5 transition-colors" onClick={()=>setMenu(menu===p.id?null:p.id)}>
                                <MoreHorizontal size={16}/>
                              </button>
                              {menu===p.id && (
                                <div className="absolute right-0 top-8 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl shadow-2xl z-50 overflow-hidden min-w-[130px]">
                                  <button onClick={e=>startRename(p,e)} className="flex items-center gap-2 w-full px-3 py-2.5 text-xs text-zinc-300 hover:bg-[#252525] transition-colors"><Pencil size={12}/> Rename</button>
                                  <button onClick={e=>{e.stopPropagation();setMenu(null);setConfirmDel(p)}} className="flex items-center gap-2 w-full px-3 py-2.5 text-xs text-red-400 hover:bg-red-950/40 transition-colors"><Trash2 size={12}/> Delete</button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="flex items-center gap-1 text-xs text-zinc-500"><Clock size={10}/> {new Date(p.updatedAt).toLocaleDateString()}</span>
                          <span className="text-xs px-1.5 py-0.5 rounded-full font-medium" style={{backgroundColor:pm.color+'22',color:pm.color}}>{pm.label}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${STATUS_CLS[p.status]||STATUS_CLS.draft}`}>{p.status}</span>
                        </div>
                        <div className="mt-2.5 h-1 bg-[#2A2A2A] rounded-full overflow-hidden">
                          <div className="h-1 rounded-full" style={{width:`${p.progress}%`,backgroundColor:p.color}} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              {filtered.length===0 && search && <p className="text-center py-16 text-zinc-600">No projects match "{search}"</p>}
            </>
          )}

          {navTab === 'Templates' && (
            <>
              <h1 className="text-2xl font-bold text-white mb-2">Templates</h1>
              <p className="text-zinc-500 text-sm mb-6">Start faster with a pre-built project template.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map(t => (
                  <div key={t.id} onClick={createProject}
                    className="rounded-2xl overflow-hidden border border-[#1A1A1A] hover:border-violet-600/50 cursor-pointer transition-all group">
                    <div className="h-28 flex items-center justify-center relative overflow-hidden"
                      style={{ background: `linear-gradient(135deg, ${t.thumb}33, #0A0A0A)` }}>
                      <div className="w-12 h-12 rounded-xl opacity-40" style={{ background: t.thumb + '80' }} />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="text-xs text-white font-medium bg-violet-600 px-3 py-1.5 rounded-lg">Use Template</span>
                      </div>
                    </div>
                    <div className="bg-[#111111] px-3 py-2.5">
                      <p className="text-sm font-medium text-zinc-200">{t.name}</p>
                      <p className="text-xs text-zinc-600 mt-0.5">{t.cat}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {navTab === 'Assets' && (
            <>
              <h1 className="text-2xl font-bold text-white mb-2">Asset Library</h1>
              <p className="text-zinc-500 text-sm mb-6">Stock footage and music ready to use in your projects.</p>
              <h2 className="text-base font-semibold text-zinc-300 mb-3">Stock Footage</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
                {stockFootage.map(f => (
                  <div key={f.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#111111] border border-[#1A1A1A] hover:border-[#2A2A2A] transition-all">
                    <div className="w-10 h-10 rounded-lg bg-violet-900/40 flex items-center justify-center shrink-0">
                      <Video size={16} className="text-violet-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-zinc-200 truncate font-medium">{f.name}</p>
                      <p className="text-xs text-zinc-600">{f.duration} · {f.tags}</p>
                    </div>
                  </div>
                ))}
              </div>
              <h2 className="text-base font-semibold text-zinc-300 mb-3">Stock Music</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {stockMusic.map(m => (
                  <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#111111] border border-[#1A1A1A] hover:border-[#2A2A2A] transition-all">
                    <div className="w-10 h-10 rounded-full bg-emerald-900/40 flex items-center justify-center shrink-0">
                      <Play size={14} className="text-emerald-400 ml-0.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-zinc-200 truncate font-medium">{m.title}</p>
                      <p className="text-xs text-zinc-600">{m.genre} · {m.bpm}bpm · {m.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {navTab === 'Brand Kit' && (
            <>
              <h1 className="text-2xl font-bold text-white mb-2">Brand Kit</h1>
              <p className="text-zinc-500 text-sm mb-6">Save your brand colors, fonts, and logos for quick access.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-[#111111] border border-[#1A1A1A]">
                  <h2 className="text-sm font-semibold text-zinc-300 mb-4">Brand Colors</h2>
                  <div className="flex flex-wrap gap-2">
                    {['#7C3AED','#EC4899','#06B6D4','#10B981','#F59E0B','#EF4444'].map(c => (
                      <div key={c} className="w-10 h-10 rounded-xl border-2 border-[#2A2A2A] cursor-pointer hover:scale-110 transition-transform" style={{ background: c }} title={c} />
                    ))}
                    <div className="w-10 h-10 rounded-xl border-2 border-dashed border-[#2A2A2A] flex items-center justify-center cursor-pointer hover:border-zinc-500 transition-colors">
                      <Plus size={14} className="text-zinc-600" />
                    </div>
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-[#111111] border border-[#1A1A1A]">
                  <h2 className="text-sm font-semibold text-zinc-300 mb-4">Brand Fonts</h2>
                  <div className="flex flex-col gap-2">
                    {['Inter','Montserrat','Poppins'].map(f => (
                      <div key={f} className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A]">
                        <span className="text-sm text-zinc-300" style={{ fontFamily: f }}>{f}</span>
                        <span className="text-xs text-zinc-600">Primary</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-[#111111] border border-[#1A1A1A] sm:col-span-2">
                  <h2 className="text-sm font-semibold text-zinc-300 mb-4">Logo & Watermark</h2>
                  <div className="border-2 border-dashed border-[#2A2A2A] rounded-xl h-24 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-violet-600/50 transition-colors">
                    <Plus size={20} className="text-zinc-600" />
                    <span className="text-xs text-zinc-600">Upload logo or watermark</span>
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
          onConfirm={doDelete} onCancel={()=>setConfirmDel(null)}
        />
      )}
    </div>
  )
}

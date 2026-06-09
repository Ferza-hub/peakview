import { useState } from 'react'
import {
  FolderOpen, LayoutTemplate, Type, Music, Sparkles, Cpu, Package, Users,
  Plus, Search, Play, Check, Pencil, Trash2, X, Mic, Globe, RefreshCw, Zap,
  Film, Image as ImgIcon, FileText, Volume2 as Vol2
} from 'lucide-react'
import {
  stockMusic, stockFootage, templates, transitions, colorPresets,
  textAnimations, fontFamilies, subtitleLanguages, collaborators as DEMO_COLLABS, comments as DEMO_COMMENTS, versionHistory
} from '../../data/editorData'
import AddMediaModal from './AddMediaModal'
import ConfirmDialog from '../ui/ConfirmDialog'

const TABS = [
  { id: 'media',     icon: FolderOpen,     label: 'Media'     },
  { id: 'templates', icon: LayoutTemplate, label: 'Templates' },
  { id: 'text',      icon: Type,           label: 'Text'      },
  { id: 'audio',     icon: Music,          label: 'Audio'     },
  { id: 'effects',   icon: Sparkles,       label: 'Effects'   },
  { id: 'ai',        icon: Cpu,            label: 'AI Tools'  },
  { id: 'stock',     icon: Package,        label: 'Stock'     },
  { id: 'collab',    icon: Users,          label: 'Collab'    },
]

const TYPE_ICON = { video: Film, audio: Vol2, image: ImgIcon, subtitle: FileText }
const MUSIC_GENRES = ['All','Lo-Fi','Epic','Corporate','Pop','Ambient','Hip-Hop','Jazz']

function SLabel({ children }) {
  return <p className="text-[10px] font-semibold tracking-widest text-zinc-600 uppercase mb-2 mt-4 first:mt-0">{children}</p>
}

function AITool({ icon: Icon, title, desc, badge, onRun, state }) {
  const processing = state === 'processing'
  const done = state === 'done'
  return (
    <div className={`p-2.5 rounded-xl border transition-all ${done ? 'border-emerald-700/50 bg-emerald-950/30' : 'border-[#2A2A2A] bg-[#141414] hover:border-[#383838]'}`}>
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${done ? 'bg-emerald-800/60' : 'bg-violet-900/60'}`}>
            {done ? <Check size={13} className="text-emerald-400" /> : <Icon size={13} className="text-violet-400" />}
          </div>
          <p className="text-xs font-semibold text-zinc-200">{title}</p>
        </div>
        {badge && <span className="text-[9px] bg-violet-800/60 text-violet-300 px-1.5 py-0.5 rounded-full">{badge}</span>}
      </div>
      <p className="text-[10px] text-zinc-500 mb-2 leading-relaxed">{desc}</p>
      {processing ? (
        <div className="flex items-center gap-2">
          <div className="h-1 flex-1 bg-[#1A1A1A] rounded-full overflow-hidden">
            <div className="h-full bg-violet-500 rounded-full animate-pulse" style={{ width: '65%' }} />
          </div>
          <span className="text-[10px] text-zinc-500">Processing…</span>
        </div>
      ) : done ? (
        <span className="text-[10px] text-emerald-400 font-medium">✓ Done</span>
      ) : (
        <button onClick={onRun} className="text-[11px] bg-violet-700/70 hover:bg-violet-600/80 text-violet-200 px-2.5 py-1 rounded-lg transition-colors font-medium">Run</button>
      )}
    </div>
  )
}

export default function LeftPanel({
  activeTab, setActiveTab,
  mediaFiles, onAddMedia, onUpdateMedia, onDeleteMedia,
  captions, onAddCaption, onUpdateCaption, onDeleteCaption, onGenerateCaptions,
  comments, collaborators, versionHistory: verHist,
}) {
  const [search, setSearch]           = useState('')
  const [musicGenre, setMusicGenre]   = useState('All')
  const [aiStates, setAiStates]       = useState({})
  const [playingTrack, setPlayingTrack] = useState(null)
  const [showAddMedia, setShowAddMedia] = useState(false)
  const [editMedia, setEditMedia]     = useState(null)
  const [confirmDelMedia, setConfirmDelMedia] = useState(null)
  const [confirmDelCap, setConfirmDelCap] = useState(null)
  const [editCapId, setEditCapId]     = useState(null)
  const [capText, setCapText]         = useState('')
  const [capStart, setCapStart]       = useState('')
  const [capEnd, setCapEnd]           = useState('')
  const [newCap, setNewCap]           = useState(false)
  const [newCapText, setNewCapText]   = useState('')
  const [newCapStart, setNewCapStart] = useState('')
  const [newCapEnd, setNewCapEnd]     = useState('')
  const [generatingCaps, setGeneratingCaps] = useState(false)

  const runAI = (key) => {
    setAiStates(p => ({ ...p, [key]: 'processing' }))
    setTimeout(() => setAiStates(p => ({ ...p, [key]: 'done' })), 2800)
  }

  const filteredMedia = (mediaFiles || []).filter(m => m.name.toLowerCase().includes(search.toLowerCase()))
  const filtMedia = musicGenre === 'All' ? stockMusic : stockMusic.filter(m => m.genre === musicGenre)

  const startEditCap = (cap) => {
    setEditCapId(cap.id)
    setCapText(cap.text || cap.label)
    setCapStart(String(cap.start))
    setCapEnd(String(cap.start + cap.duration))
  }

  const commitEditCap = (id) => {
    const s = parseFloat(capStart) || 0
    const e = parseFloat(capEnd)   || (s + 3)
    onUpdateCaption(id, { text: capText, start: s, duration: Math.max(0.5, e - s), label: capText })
    setEditCapId(null)
  }

  const submitNewCap = () => {
    const s = parseFloat(newCapStart) || 0
    const e = parseFloat(newCapEnd)   || (s + 3)
    if (!newCapText.trim()) return
    onAddCaption({ text: newCapText.trim(), start: s, end: e })
    setNewCap(false); setNewCapText(''); setNewCapStart(''); setNewCapEnd('')
  }

  const doGenerateCaps = () => {
    setGeneratingCaps(true)
    setTimeout(() => { onGenerateCaptions(); setGeneratingCaps(false) }, 2000)
  }

  return (
    <div className="flex h-full border-r border-[#1F1F1F]">
      {/* Icon strip */}
      <div className="w-12 flex flex-col items-center py-2 gap-0.5 border-r border-[#1F1F1F] bg-[#0D0D0D]">
        {TABS.map(({ id, icon: Icon, label }) => (
          <button key={id} onClick={() => setActiveTab(id)} title={label}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${activeTab === id ? 'bg-violet-600 text-white' : 'text-zinc-600 hover:text-zinc-300 hover:bg-[#1A1A1A]'}`}>
            <Icon size={16} />
          </button>
        ))}
      </div>

      {/* Content pane */}
      <div className="w-56 flex flex-col overflow-hidden bg-[#0F0F0F]">
        <div className="px-3 py-2 border-b border-[#1A1A1A] shrink-0">
          <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">{TABS.find(t => t.id === activeTab)?.label}</p>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-3">

          {/* ─── MEDIA ────────────────────────────────────── */}
          {activeTab === 'media' && (
            <>
              <div className="flex gap-1.5 mb-2">
                <div className="relative flex-1">
                  <Search size={10} className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-600" />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…" className="input-dark pl-6 text-[11px]" />
                </div>
                <button onClick={() => setShowAddMedia(true)} className="btn-accent px-2 py-1 text-[11px]"><Plus size={12} /></button>
              </div>

              <p className="text-[10px] text-zinc-600 mb-2">{filteredMedia.length} file{filteredMedia.length !== 1 ? 's' : ''} — drag to timeline</p>

              <div className="flex flex-col gap-1">
                {filteredMedia.map(m => {
                  const Icon = TYPE_ICON[m.type] || Film
                  return (
                    <div key={m.id}
                      draggable
                      onDragStart={e => e.dataTransfer.setData('application/peakedit-media', JSON.stringify(m))}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-[#141414] border border-[#1F1F1F] hover:border-[#2A2A2A] cursor-grab active:cursor-grabbing group transition-all"
                    >
                      <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: m.color + '30' }}>
                        <Icon size={11} style={{ color: m.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-zinc-300 truncate font-medium">{m.name}</p>
                        <p className="text-[9px] text-zinc-600">{m.type} · {m.duration}</p>
                      </div>
                      <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditMedia(m) }} className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors">
                          <Pencil size={10} />
                        </button>
                        <button onClick={() => setConfirmDelMedia(m)} className="p-1 text-zinc-500 hover:text-red-400 transition-colors">
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </div>
                  )
                })}
                {filteredMedia.length === 0 && (
                  <p className="text-[11px] text-zinc-600 text-center py-4">No media files</p>
                )}
              </div>
            </>
          )}

          {/* ─── TEMPLATES ────────────────────────────────── */}
          {activeTab === 'templates' && (
            <>
              <SLabel>Templates</SLabel>
              <div className="grid grid-cols-2 gap-1.5">
                {templates.map(t => (
                  <div key={t.id} className="rounded-lg overflow-hidden border border-[#1F1F1F] hover:border-[#2A2A2A] cursor-pointer transition-all group">
                    <div className="h-12 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${t.thumb}33, #111)` }}>
                      <div className="w-6 h-6 rounded-md" style={{ background: t.thumb + '60' }} />
                    </div>
                    <div className="px-1.5 py-1 bg-[#141414]">
                      <p className="text-[10px] text-zinc-400 truncate">{t.name}</p>
                      <p className="text-[9px] text-zinc-600">{t.cat}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ─── TEXT / CAPTIONS ──────────────────────────── */}
          {activeTab === 'text' && (
            <>
              <SLabel>Auto-Caption AI</SLabel>
              <div className="flex gap-1.5 mb-3">
                <button onClick={doGenerateCaps} disabled={generatingCaps}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all ${generatingCaps ? 'bg-violet-800/50 text-violet-400' : 'bg-violet-600 hover:bg-violet-500 text-white'}`}>
                  {generatingCaps ? <><RefreshCw size={12} className="animate-spin" /> Generating…</> : <><Zap size={12} /> Generate Captions</>}
                </button>
              </div>

              <SLabel>Captions ({captions.length})</SLabel>
              <div className="flex flex-col gap-1 mb-2">
                {captions.map(cap => (
                  <div key={cap.id} className="rounded-lg border border-[#1F1F1F] bg-[#141414] overflow-hidden group">
                    {editCapId === cap.id ? (
                      <div className="p-2 flex flex-col gap-1.5">
                        <input value={capText} onChange={e => setCapText(e.target.value)}
                          className="input-dark text-[11px]" placeholder="Caption text" />
                        <div className="flex gap-1">
                          <input value={capStart} onChange={e => setCapStart(e.target.value)}
                            className="input-dark text-[11px] w-16" placeholder="In (s)" />
                          <input value={capEnd} onChange={e => setCapEnd(e.target.value)}
                            className="input-dark text-[11px] w-16" placeholder="Out (s)" />
                        </div>
                        <div className="flex gap-1 justify-end">
                          <button onClick={() => setEditCapId(null)} className="btn-ghost px-2 py-1 text-[10px]">Cancel</button>
                          <button onClick={() => commitEditCap(cap.id)} className="btn-accent px-2 py-1 text-[10px]">Save</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-1.5 p-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] text-zinc-300 leading-snug">{cap.text || cap.label}</p>
                          <p className="text-[9px] text-zinc-600 mt-0.5">{cap.start.toFixed(1)}s – {(cap.start + cap.duration).toFixed(1)}s</p>
                        </div>
                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => startEditCap(cap)} className="p-1 text-zinc-500 hover:text-zinc-300"><Pencil size={10} /></button>
                          <button onClick={() => setConfirmDelCap(cap)} className="p-1 text-zinc-500 hover:text-red-400"><Trash2 size={10} /></button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Add new caption */}
              {newCap ? (
                <div className="rounded-xl border border-violet-500/40 bg-violet-950/20 p-2.5 flex flex-col gap-2">
                  <input value={newCapText} onChange={e => setNewCapText(e.target.value)}
                    placeholder="Caption text" className="input-dark text-[11px]" autoFocus />
                  <div className="flex gap-1">
                    <input value={newCapStart} onChange={e => setNewCapStart(e.target.value)} placeholder="In (s)" className="input-dark text-[11px] w-16" />
                    <input value={newCapEnd}   onChange={e => setNewCapEnd(e.target.value)}   placeholder="Out (s)" className="input-dark text-[11px] w-16" />
                  </div>
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => setNewCap(false)} className="btn-ghost px-2 py-1 text-[10px]">Cancel</button>
                    <button onClick={submitNewCap} className="btn-accent px-2 py-1 text-[10px]">Add</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setNewCap(true)} className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-dashed border-[#2A2A2A] text-xs text-zinc-600 hover:text-zinc-400 hover:border-zinc-500 transition-all">
                  <Plus size={12} /> Add Caption
                </button>
              )}

              <SLabel>Font</SLabel>
              <select className="input-dark mb-2">
                {fontFamilies.map(f => <option key={f}>{f}</option>)}
              </select>

              <SLabel>Text Animation</SLabel>
              <div className="flex flex-wrap gap-1">
                {textAnimations.map(a => (
                  <button key={a} className="px-2 py-0.5 rounded-full text-[10px] border border-[#2A2A2A] text-zinc-500 hover:text-zinc-300 hover:border-zinc-500 transition-all">{a}</button>
                ))}
              </div>
            </>
          )}

          {/* ─── AUDIO ────────────────────────────────────── */}
          {activeTab === 'audio' && (
            <>
              <SLabel>Music Library</SLabel>
              <div className="flex flex-wrap gap-1 mb-2">
                {MUSIC_GENRES.map(g => (
                  <button key={g} onClick={() => setMusicGenre(g)}
                    className={`px-2 py-0.5 rounded-full text-[10px] border transition-all ${musicGenre===g ? 'border-violet-500 text-violet-300 bg-violet-900/30' : 'border-[#2A2A2A] text-zinc-600 hover:text-zinc-400'}`}>
                    {g}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-1">
                {filtMedia.map(m => (
                  <div key={m.id}
                    draggable
                    onDragStart={e => e.dataTransfer.setData('application/peakedit-media', JSON.stringify({ id: m.id, name: m.title, type: 'audio', duration: m.duration, color: '#10B981' }))}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-[#141414] border border-[#1F1F1F] hover:border-[#2A2A2A] cursor-grab group transition-all">
                    <button onClick={() => setPlayingTrack(playingTrack===m.id ? null : m.id)}
                      className="w-6 h-6 rounded-full bg-violet-900/60 flex items-center justify-center shrink-0 hover:bg-violet-600 transition-colors">
                      <Play size={9} className="text-violet-300 ml-0.5" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-zinc-300 truncate font-medium">{m.title}</p>
                      <p className="text-[9px] text-zinc-600">{m.genre} · {m.bpm}bpm · {m.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ─── EFFECTS ──────────────────────────────────── */}
          {activeTab === 'effects' && (
            <>
              <SLabel>Transitions</SLabel>
              <div className="grid grid-cols-3 gap-1.5 mb-3">
                {transitions.map(t => (
                  <button key={t.id} className="flex flex-col items-center gap-1 p-2 rounded-lg bg-[#141414] border border-[#1F1F1F] hover:border-violet-500/50 text-xs text-zinc-500 hover:text-violet-300 transition-all">
                    <span className="text-base">{t.icon}</span>
                    <span className="text-[9px]">{t.name}</span>
                  </button>
                ))}
              </div>
              <SLabel>Color Presets</SLabel>
              <div className="grid grid-cols-2 gap-1.5">
                {colorPresets.map(p => (
                  <button key={p.id} className="rounded-lg overflow-hidden border border-[#1F1F1F] hover:border-[#2A2A2A] transition-all">
                    <div className="h-8 flex" >
                      {p.colors.map((c,i) => <div key={i} className="flex-1" style={{ background: c }} />)}
                    </div>
                    <div className="px-1.5 py-1 bg-[#141414]">
                      <p className="text-[10px] text-zinc-400">{p.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ─── AI TOOLS ─────────────────────────────────── */}
          {activeTab === 'ai' && (
            <div className="flex flex-col gap-2">
              {[
                { key:'silence',  icon: Cpu,     title: 'Auto-Cut Silence',  desc: 'Remove silent gaps from footage',  badge: 'Smart' },
                { key:'broll',    icon: Film,     title: 'B-Roll Suggestions',desc: 'AI suggests relevant B-roll clips', badge: 'Beta'  },
                { key:'script',   icon: FileText, title: 'Script to Video',   desc: 'Generate clips from your script'              },
                { key:'bg',       icon: Sparkles, title: 'Background Remove', desc: 'Remove background from any clip',  badge: 'Pro'   },
                { key:'reframe',  icon: Zap,      title: 'Auto-Reframe',      desc: 'Reframe for any aspect ratio'                  },
                { key:'highlight',icon: Cpu,      title: 'Highlight Clipper', desc: 'Extract best moments automatically', badge: 'Smart' },
              ].map(({ key, icon, title, desc, badge }) => (
                <AITool key={key} icon={icon} title={title} desc={desc} badge={badge}
                  state={aiStates[key]} onRun={() => runAI(key)} />
              ))}
            </div>
          )}

          {/* ─── STOCK ────────────────────────────────────── */}
          {activeTab === 'stock' && (
            <>
              <SLabel>Stock Footage</SLabel>
              <div className="flex flex-col gap-1 mb-3">
                {stockFootage.map(f => (
                  <div key={f.id}
                    draggable
                    onDragStart={e => e.dataTransfer.setData('application/peakedit-media', JSON.stringify({ id: f.id, name: f.name, type: 'video', duration: f.duration, color: '#7C3AED' }))}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-[#141414] border border-[#1F1F1F] hover:border-[#2A2A2A] cursor-grab transition-all">
                    <div className="w-6 h-6 rounded-md bg-violet-900/40 flex items-center justify-center shrink-0"><Film size={10} className="text-violet-400" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-zinc-300 truncate">{f.name}</p>
                      <p className="text-[9px] text-zinc-600">{f.duration} · {f.tags}</p>
                    </div>
                  </div>
                ))}
              </div>
              <SLabel>Stock Music</SLabel>
              <div className="flex flex-col gap-1">
                {stockMusic.slice(0,4).map(m => (
                  <div key={m.id}
                    draggable
                    onDragStart={e => e.dataTransfer.setData('application/peakedit-media', JSON.stringify({ id: m.id, name: m.title, type: 'audio', duration: m.duration, color: '#10B981' }))}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-[#141414] border border-[#1F1F1F] hover:border-[#2A2A2A] cursor-grab transition-all">
                    <div className="w-6 h-6 rounded-full bg-emerald-900/40 flex items-center justify-center shrink-0"><Play size={9} className="text-emerald-400 ml-0.5" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-zinc-300 truncate">{m.title}</p>
                      <p className="text-[9px] text-zinc-600">{m.genre} · {m.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ─── COLLAB ───────────────────────────────────── */}
          {activeTab === 'collab' && (
            <>
              <SLabel>Team ({(collaborators||[]).length})</SLabel>
              <div className="flex flex-col gap-1.5 mb-3">
                {(collaborators||[]).map(c => (
                  <div key={c.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-[#141414] border border-[#1F1F1F]">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: c.color }}>
                      {c.name[0]}
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] text-zinc-300">{c.name}</p>
                      <div className="flex items-center gap-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${c.online ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
                        <p className="text-[9px] text-zinc-600">{c.online ? 'Online' : 'Offline'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <SLabel>Comments ({(comments||[]).length})</SLabel>
              <div className="flex flex-col gap-1.5 mb-3">
                {(comments||[]).map(c => (
                  <div key={c.id} className="px-2 py-1.5 rounded-lg bg-[#141414] border border-[#1F1F1F]">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0" style={{ background: c.color }}>{c.user[0]}</div>
                      <span className="text-[10px] font-medium text-zinc-300">{c.user}</span>
                      <span className="text-[9px] text-zinc-600 ml-auto">{c.time}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-snug">{c.text}</p>
                  </div>
                ))}
              </div>
              <SLabel>Version History</SLabel>
              <div className="flex flex-col gap-1">
                {(verHist||[]).map(v => (
                  <div key={v.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-[#141414] border border-[#1F1F1F] cursor-pointer hover:border-[#2A2A2A] transition-all">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-zinc-300 truncate">{v.label}</p>
                      <p className="text-[9px] text-zinc-600">{v.time} · {v.author}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {(showAddMedia || editMedia) && (
        <AddMediaModal
          editItem={editMedia}
          onAdd={editMedia ? (item) => onUpdateMedia(item.id, item) : onAddMedia}
          onClose={() => { setShowAddMedia(false); setEditMedia(null) }}
        />
      )}
      {confirmDelMedia && (
        <ConfirmDialog
          title="Delete media?"
          message={`"${confirmDelMedia.name}" will be removed from the library and any timeline clips.`}
          onConfirm={() => { onDeleteMedia(confirmDelMedia.id); setConfirmDelMedia(null) }}
          onCancel={() => setConfirmDelMedia(null)}
        />
      )}
      {confirmDelCap && (
        <ConfirmDialog
          title="Delete caption?"
          message={`This caption will be removed from the subtitle track.`}
          onConfirm={() => { onDeleteCaption(confirmDelCap.id); setConfirmDelCap(null) }}
          onCancel={() => setConfirmDelCap(null)}
        />
      )}
    </div>
  )
}

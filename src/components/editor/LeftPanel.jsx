import { useState } from 'react'
import {
  FolderOpen, LayoutTemplate, Type, Music, Sparkles, Wand2, Package,
  Users, Upload, Search, Play, Plus, Check, ChevronRight,
  Mic, Volume2, Scissors, Cpu, Film, Image, Globe, RefreshCw, Zap, Clock
} from 'lucide-react'
import { mediaFiles, stockMusic, stockFootage, templates, transitions, colorPresets, textAnimations, fontFamilies, subtitleLanguages } from '../../data/editorData'

const TABS = [
  { id: 'media',     icon: FolderOpen,     label: 'Media' },
  { id: 'templates', icon: LayoutTemplate, label: 'Templates' },
  { id: 'text',      icon: Type,           label: 'Text' },
  { id: 'audio',     icon: Music,          label: 'Audio' },
  { id: 'effects',   icon: Sparkles,       label: 'Effects' },
  { id: 'ai',        icon: Cpu,            label: 'AI Tools' },
  { id: 'stock',     icon: Package,        label: 'Stock' },
  { id: 'collab',    icon: Users,          label: 'Collab' },
]

const MUSIC_GENRES = ['All', 'Lo-Fi', 'Epic', 'Corporate', 'Pop', 'Ambient', 'Hip-Hop', 'Jazz']
const TEMPLATE_CATS = ['All', 'Intro', 'Outro', 'Lower Third', 'CTA', 'Full']
const STOCK_CATS = ['Footage', 'Photos', 'Music', 'SFX']

function SectionLabel({ children }) {
  return <p className="text-[10px] font-semibold tracking-widest text-zinc-600 uppercase mb-2 mt-4 first:mt-0">{children}</p>
}

function AIToolButton({ icon: Icon, title, desc, badge, onRun, processing, done }) {
  return (
    <div className={`p-3 rounded-xl border transition-all cursor-pointer ${done ? 'border-emerald-700/50 bg-emerald-950/30' : 'border-[#2A2A2A] bg-[#141414] hover:border-[#383838]'}`}
      onClick={!processing && !done ? onRun : undefined}>
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${done ? 'bg-emerald-800/60' : 'bg-violet-900/60'}`}>
            {done ? <Check size={14} className="text-emerald-400" /> : <Icon size={14} className="text-violet-400" />}
          </div>
          <p className="text-xs font-semibold text-zinc-200">{title}</p>
        </div>
        {badge && <span className="text-[9px] bg-violet-800/60 text-violet-300 px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap">{badge}</span>}
      </div>
      <p className="text-[10px] text-zinc-500 leading-relaxed mb-2">{desc}</p>
      {processing ? (
        <div className="flex items-center gap-2">
          <div className="h-1 flex-1 bg-[#1A1A1A] rounded-full overflow-hidden">
            <div className="h-full bg-violet-500 rounded-full animate-pulse" style={{ width: '65%' }} />
          </div>
          <span className="text-[10px] text-zinc-500">Processing…</span>
        </div>
      ) : done ? (
        <span className="text-[10px] text-emerald-400 font-medium">✓ Completed</span>
      ) : (
        <button className="text-[11px] bg-violet-700/70 hover:bg-violet-600/80 text-violet-200 px-2.5 py-1 rounded-lg transition-colors font-medium">
          Run
        </button>
      )}
    </div>
  )
}

export default function LeftPanel({ activeTab, setActiveTab, comments, collaborators, versionHistory }) {
  const [search, setSearch] = useState('')
  const [musicGenre, setMusicGenre] = useState('All')
  const [templateCat, setTemplateCat] = useState('All')
  const [stockCat, setStockCat] = useState('Footage')
  const [aiStates, setAiStates] = useState({})
  const [captionLang, setCaptionLang] = useState('English')
  const [translatLang, setTranslatLang] = useState('Indonesian')
  const [captionDone, setCaptionDone] = useState(false)
  const [selectedFont, setSelectedFont] = useState('Inter')
  const [textAnim, setTextAnim] = useState('Fade In')
  const [playingTrack, setPlayingTrack] = useState(null)

  const runAI = (key) => {
    setAiStates(p => ({ ...p, [key]: 'processing' }))
    setTimeout(() => setAiStates(p => ({ ...p, [key]: 'done' })), 2800)
  }

  const runCaption = () => {
    setCaptionDone(false)
    setAiStates(p => ({ ...p, caption: 'processing' }))
    setTimeout(() => { setAiStates(p => ({ ...p, caption: 'done' })); setCaptionDone(true) }, 3000)
  }

  const filteredMusic = stockMusic.filter(m => musicGenre === 'All' || m.genre === musicGenre)

  return (
    <div className="flex h-full border-r border-[#1F1F1F]">
      {/* Icon strip */}
      <div className="w-12 flex flex-col items-center py-2 gap-0.5 border-r border-[#1F1F1F] bg-[#0D0D0D]">
        {TABS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            title={label}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              activeTab === id
                ? 'bg-violet-600 text-white'
                : 'text-zinc-600 hover:text-zinc-300 hover:bg-[#1A1A1A]'
            }`}
          >
            <Icon size={16} />
          </button>
        ))}
      </div>

      {/* Panel content */}
      <div className="w-[220px] flex flex-col bg-[#111111]">
        <div className="px-3 py-2.5 border-b border-[#1F1F1F] shrink-0">
          <p className="text-xs font-bold text-zinc-200">{TABS.find(t => t.id === activeTab)?.label}</p>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3">

          {/* ─── MEDIA ─── */}
          {activeTab === 'media' && (
            <div className="space-y-2">
              <button className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-[#2A2A2A] hover:border-violet-600/60 rounded-xl text-xs text-zinc-500 hover:text-violet-400 transition-all">
                <Upload size={13} /> Upload Media
              </button>
              <div className="relative">
                <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-600" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…" className="input-dark pl-7 text-[11px]" />
              </div>
              <div className="space-y-1">
                {mediaFiles.filter(f => !search || f.name.toLowerCase().includes(search.toLowerCase())).map(f => (
                  <div key={f.id} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#1A1A1A] cursor-pointer group transition-colors">
                    <div className="w-10 h-7 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: f.color + '30' }}>
                      {f.type === 'video' ? <Film size={12} style={{ color: f.color }} /> : f.type === 'audio' ? <Music size={12} style={{ color: f.color }} /> : <Image size={12} style={{ color: f.color }} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium text-zinc-300 truncate">{f.name}</p>
                      <p className="text-[9px] text-zinc-600">{f.duration || '—'} · {f.size}</p>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-violet-400 transition-all"><Plus size={12} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── TEMPLATES ─── */}
          {activeTab === 'templates' && (
            <div>
              <div className="flex flex-wrap gap-1 mb-3">
                {TEMPLATE_CATS.map(c => (
                  <button key={c} onClick={() => setTemplateCat(c)}
                    className={`text-[10px] px-2 py-0.5 rounded-full transition-colors ${templateCat === c ? 'bg-violet-600 text-white' : 'bg-[#1A1A1A] text-zinc-500 hover:text-zinc-300'}`}>{c}</button>
                ))}
              </div>
              <div className="space-y-2">
                {templates
                  .filter(t => templateCat === 'All' || t.category === templateCat.toLowerCase().replace(' ', '-'))
                  .map(t => (
                    <div key={t.id} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#1A1A1A] cursor-pointer group transition-colors border border-transparent hover:border-[#2A2A2A]">
                      <div className="w-14 h-8 rounded-md flex items-center justify-center shrink-0 text-xs font-bold text-white" style={{ background: `linear-gradient(135deg, ${t.color}66, ${t.color}22)` }}>
                        {t.duration}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-medium text-zinc-300 leading-tight">{t.name}</p>
                        <p className="text-[9px] text-zinc-600 capitalize">{t.category}</p>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-violet-400 transition-all"><Plus size={12} /></button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ─── TEXT & CAPTIONS ─── */}
          {activeTab === 'text' && (
            <div className="space-y-4">
              <SectionLabel>Auto-Caption</SectionLabel>
              <div className={`p-3 rounded-xl border ${captionDone ? 'border-emerald-700/50 bg-emerald-950/30' : 'border-[#2A2A2A] bg-[#141414]'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Mic size={13} className="text-violet-400" />
                  <span className="text-xs font-semibold text-zinc-200">Speech-to-Text</span>
                  <span className="ml-auto text-[9px] bg-violet-800/60 text-violet-300 px-1.5 py-0.5 rounded-full">AI</span>
                </div>
                <p className="text-[10px] text-zinc-500 mb-2">Auto-generate captions from your audio in seconds.</p>
                <div className="mb-2">
                  <label className="field-label">Language</label>
                  <select value={captionLang} onChange={e => setCaptionLang(e.target.value)} className="input-dark text-[11px]">
                    {subtitleLanguages.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                {aiStates.caption === 'processing' ? (
                  <div className="flex items-center gap-2">
                    <div className="h-1 flex-1 bg-[#1A1A1A] rounded-full overflow-hidden">
                      <div className="h-full bg-violet-500 rounded-full animate-pulse" style={{ width: '70%' }} />
                    </div>
                    <span className="text-[10px] text-zinc-500">Transcribing…</span>
                  </div>
                ) : captionDone ? (
                  <p className="text-[10px] text-emerald-400">✓ 22 captions generated</p>
                ) : (
                  <button onClick={runCaption} className="w-full btn-accent justify-center text-[11px] py-1.5">Generate Captions</button>
                )}
              </div>

              <SectionLabel>Translate</SectionLabel>
              <div className="p-3 rounded-xl border border-[#2A2A2A] bg-[#141414]">
                <div className="flex items-center gap-2 mb-2">
                  <Globe size={13} className="text-blue-400" />
                  <span className="text-xs font-semibold text-zinc-200">Auto-Translate</span>
                </div>
                <select value={translatLang} onChange={e => setTranslatLang(e.target.value)} className="input-dark text-[11px] mb-2">
                  {subtitleLanguages.filter(l => l !== 'English').map(l => <option key={l}>{l}</option>)}
                </select>
                <button onClick={() => runAI('translate')} className="w-full btn-surface justify-center text-[11px] py-1.5">
                  {aiStates.translate === 'processing' ? 'Translating…' : aiStates.translate === 'done' ? '✓ Translated' : 'Translate Subtitles'}
                </button>
              </div>

              <SectionLabel>Text Style</SectionLabel>
              <div className="space-y-2.5">
                <div>
                  <label className="field-label">Font</label>
                  <select value={selectedFont} onChange={e => setSelectedFont(e.target.value)} className="input-dark text-[11px]">
                    {fontFamilies.map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="field-label">Size</label>
                    <input type="number" defaultValue={32} className="input-dark text-[11px]" />
                  </div>
                  <div>
                    <label className="field-label">Color</label>
                    <input type="color" defaultValue="#FFFFFF" className="w-full h-8 rounded-md border border-[#2A2A2A] cursor-pointer bg-transparent" />
                  </div>
                </div>
                <div>
                  <label className="field-label">Animation</label>
                  <select value={textAnim} onChange={e => setTextAnim(e.target.value)} className="input-dark text-[11px]">
                    {textAnimations.map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
              </div>

              <SectionLabel>Presets</SectionLabel>
              {['Lower Third', 'Subtitle', 'Title Card', 'Chapter Marker'].map(p => (
                <div key={p} className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-[#1A1A1A] cursor-pointer transition-colors">
                  <span className="text-[11px] text-zinc-400">{p}</span>
                  <Plus size={12} className="text-zinc-600 hover:text-violet-400" />
                </div>
              ))}
            </div>
          )}

          {/* ─── AUDIO ─── */}
          {activeTab === 'audio' && (
            <div className="space-y-3">
              <SectionLabel>Record Voice Over</SectionLabel>
              <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-[#2A2A2A] hover:border-red-600/60 text-xs text-zinc-500 hover:text-red-400 transition-all group">
                <div className="w-5 h-5 rounded-full bg-red-600/20 group-hover:bg-red-600/40 flex items-center justify-center transition-colors">
                  <Mic size={11} className="text-red-500" />
                </div>
                Record Voice Over
              </button>

              <SectionLabel>Audio Tools</SectionLabel>
              <div className="space-y-2">
                {[
                  { icon: Wand2, label: 'Noise Reduction', desc: 'Remove background noise', toggle: true },
                  { icon: Zap, label: 'Beat Sync', desc: 'Auto-sync cuts to music beat', toggle: false },
                  { icon: Volume2, label: 'Auto Levels', desc: 'Normalize audio levels', toggle: true },
                ].map(t => (
                  <div key={t.label} className="flex items-center justify-between p-2.5 rounded-lg bg-[#141414] border border-[#2A2A2A]">
                    <div className="flex items-center gap-2">
                      <t.icon size={13} className="text-violet-400" />
                      <div>
                        <p className="text-[11px] font-medium text-zinc-300">{t.label}</p>
                        <p className="text-[9px] text-zinc-600">{t.desc}</p>
                      </div>
                    </div>
                    {t.toggle ? (
                      <div className="w-8 h-4 bg-violet-600 rounded-full relative cursor-pointer">
                        <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5" />
                      </div>
                    ) : (
                      <button onClick={() => runAI('beatsync')} className="text-[10px] bg-violet-700/60 hover:bg-violet-600/80 text-violet-200 px-2 py-0.5 rounded transition-colors">
                        {aiStates.beatsync === 'done' ? '✓ Done' : 'Run'}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <SectionLabel>Music Library</SectionLabel>
              <div className="flex flex-wrap gap-1 mb-2">
                {MUSIC_GENRES.slice(0, 5).map(g => (
                  <button key={g} onClick={() => setMusicGenre(g)}
                    className={`text-[10px] px-2 py-0.5 rounded-full transition-colors ${musicGenre === g ? 'bg-emerald-700 text-white' : 'bg-[#1A1A1A] text-zinc-500 hover:text-zinc-300'}`}>{g}</button>
                ))}
              </div>
              <div className="space-y-1.5">
                {filteredMusic.map(m => (
                  <div key={m.id} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${playingTrack === m.id ? 'bg-emerald-900/30 border border-emerald-700/40' : 'hover:bg-[#1A1A1A]'}`}>
                    <button onClick={() => setPlayingTrack(playingTrack === m.id ? null : m.id)}
                      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors"
                      style={{ backgroundColor: m.color + '40' }}>
                      {playingTrack === m.id ? <Volume2 size={11} style={{ color: m.color }} /> : <Play size={11} style={{ color: m.color }} className="ml-0.5" />}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium text-zinc-300 truncate">{m.title}</p>
                      <p className="text-[9px] text-zinc-600">{m.bpm} BPM · {m.duration}</p>
                    </div>
                    <button className="text-zinc-600 hover:text-violet-400 transition-colors"><Plus size={12} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── EFFECTS ─── */}
          {activeTab === 'effects' && (
            <div className="space-y-4">
              <SectionLabel>Transitions</SectionLabel>
              <div className="grid grid-cols-3 gap-1.5">
                {transitions.map(t => (
                  <div key={t.id} className="aspect-square rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-violet-500/60 border border-[#2A2A2A] bg-[#141414] transition-all text-center group">
                    <span className="text-base">{t.icon}</span>
                    <span className="text-[9px] text-zinc-500 group-hover:text-zinc-300 transition-colors leading-tight">{t.name}</span>
                  </div>
                ))}
              </div>

              <SectionLabel>Color Presets</SectionLabel>
              <div className="grid grid-cols-2 gap-2">
                {colorPresets.map(c => (
                  <div key={c.id} className="cursor-pointer rounded-xl overflow-hidden border border-[#2A2A2A] hover:border-violet-500/60 transition-all group">
                    <div className="h-12 flex" style={{ background: `linear-gradient(to right, ${c.preview[0]}, ${c.preview[1]})` }} />
                    <div className="px-2 py-1.5 bg-[#141414]">
                      <p className="text-[10px] font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">{c.name}</p>
                    </div>
                  </div>
                ))}
              </div>

              <SectionLabel>Filters & Overlays</SectionLabel>
              <div className="space-y-1.5">
                {['Film Grain', 'Vignette', 'Light Leak', 'Lens Flare', 'Chromatic Aberration'].map(f => (
                  <div key={f} className="flex items-center justify-between py-2 px-2.5 rounded-lg bg-[#141414] hover:bg-[#1A1A1A] cursor-pointer transition-colors border border-[#2A2A2A]">
                    <span className="text-[11px] text-zinc-400">{f}</span>
                    <Plus size={12} className="text-zinc-600 hover:text-violet-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── AI TOOLS ─── */}
          {activeTab === 'ai' && (
            <div className="space-y-2.5">
              <div className="p-2.5 rounded-xl bg-violet-950/40 border border-violet-800/30 mb-3">
                <p className="text-[10px] text-violet-300 font-medium">AI-powered tools to supercharge your editing workflow.</p>
              </div>
              <AIToolButton icon={Scissors}   title="Auto-Cut Silence"      desc="Automatically detect and remove silent pauses from your footage." badge="Popular" onRun={() => runAI('autocut')}      processing={aiStates.autocut==='processing'}      done={aiStates.autocut==='done'} />
              <AIToolButton icon={Film}       title="AI B-Roll Suggestions" desc="Analyzes your script and suggests relevant B-roll footage."         badge="New"     onRun={() => runAI('broll')}        processing={aiStates.broll==='processing'}        done={aiStates.broll==='done'} />
              <AIToolButton icon={Type}       title="Script to Video"       desc="Generate a full video timeline from your script text."              badge="Beta"    onRun={() => runAI('s2v')}          processing={aiStates.s2v==='processing'}          done={aiStates.s2v==='done'} />
              <AIToolButton icon={Image}      title="Background Removal"    desc="Remove background from any clip — no green screen needed."         badge="AI"      onRun={() => runAI('bgremove')}    processing={aiStates.bgremove==='processing'}    done={aiStates.bgremove==='done'} />
              <AIToolButton icon={RefreshCw}  title="Auto-Reframe"          desc="Intelligently reframe your video for 9:16, 1:1, 16:9 formats."                     onRun={() => runAI('reframe')}     processing={aiStates.reframe==='processing'}     done={aiStates.reframe==='done'} />
              <AIToolButton icon={Zap}        title="Highlight Clipper"     desc="AI finds the best moments from long footage and creates a clip."                    onRun={() => runAI('highlight')}   processing={aiStates.highlight==='processing'}   done={aiStates.highlight==='done'} />
            </div>
          )}

          {/* ─── STOCK ─── */}
          {activeTab === 'stock' && (
            <div className="space-y-3">
              <div className="flex bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-0.5 gap-0.5">
                {STOCK_CATS.map(c => (
                  <button key={c} onClick={() => setStockCat(c)}
                    className={`flex-1 text-[10px] py-1 rounded-lg transition-colors font-medium ${stockCat === c ? 'bg-[#2A2A2A] text-zinc-200' : 'text-zinc-600 hover:text-zinc-400'}`}>{c}</button>
                ))}
              </div>
              <div className="relative">
                <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-600" />
                <input placeholder="Search stock…" className="input-dark pl-7 text-[11px]" />
              </div>
              {stockCat === 'Footage' && (
                <div className="grid grid-cols-2 gap-1.5">
                  {stockFootage.map(f => (
                    <div key={f.id} className="rounded-xl overflow-hidden cursor-pointer group border border-[#2A2A2A] hover:border-violet-500/50 transition-all">
                      <div className="h-14 relative flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${f.color}44, #0A0A0A)` }}>
                        <Film size={18} style={{ color: f.color }} className="opacity-60" />
                        <div className="absolute bottom-1 right-1 bg-black/60 text-zinc-400 text-[9px] px-1 rounded font-mono">{f.duration}</div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Plus size={16} className="text-white" />
                        </div>
                      </div>
                      <div className="px-1.5 py-1 bg-[#141414]">
                        <p className="text-[9px] text-zinc-400 truncate">{f.title}</p>
                        <p className="text-[8px] text-zinc-600">{f.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {stockCat === 'Music' && (
                <div className="space-y-1.5">
                  {stockMusic.map(m => (
                    <div key={m.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#1A1A1A] cursor-pointer transition-colors">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: m.color + '30' }}>
                        <Music size={11} style={{ color: m.color }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-medium text-zinc-300 truncate">{m.title}</p>
                        <p className="text-[9px] text-zinc-600">{m.genre} · {m.duration}</p>
                      </div>
                      <span className="text-[8px] bg-emerald-900/60 text-emerald-400 px-1.5 py-0.5 rounded-full">Free</span>
                    </div>
                  ))}
                </div>
              )}
              {(stockCat === 'Photos' || stockCat === 'SFX') && (
                <div className="text-center py-8 text-zinc-600 text-xs">
                  <Package size={24} className="mx-auto mb-2 opacity-30" />
                  Browse {stockCat} library
                </div>
              )}
            </div>
          )}

          {/* ─── COLLAB ─── */}
          {activeTab === 'collab' && (
            <div className="space-y-4">
              <SectionLabel>Team</SectionLabel>
              {collaborators.map(c => (
                <div key={c.id} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#1A1A1A] transition-colors">
                  <div className="relative">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ backgroundColor: c.color }}>{c.name[0]}</div>
                    {c.online && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#111]" />}
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-zinc-300">{c.name}</p>
                    <p className="text-[9px] text-zinc-600">{c.role} · {c.online ? 'Online now' : 'Offline'}</p>
                  </div>
                </div>
              ))}
              <button className="w-full btn-surface justify-center text-[11px]"><Plus size={12} /> Invite Member</button>

              <SectionLabel>Comments</SectionLabel>
              {comments.map(c => (
                <div key={c.id} className={`p-2.5 rounded-xl border transition-colors ${c.resolved ? 'border-[#1A1A1A] opacity-50' : 'border-[#2A2A2A] bg-[#141414]'}`}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="w-5 h-5 rounded-full text-white text-[9px] font-bold flex items-center justify-center" style={{ backgroundColor: c.userColor }}>{c.user[0]}</div>
                    <span className="text-[10px] font-medium text-zinc-400">{c.user}</span>
                    <span className="text-[9px] text-zinc-600 ml-auto">{c.ago}</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-relaxed">{c.text}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[9px] text-zinc-600 font-mono">@{c.time}s</span>
                    {c.resolved && <span className="text-[9px] text-emerald-500">✓ Resolved</span>}
                  </div>
                </div>
              ))}

              <SectionLabel>Version History</SectionLabel>
              {versionHistory.map(v => (
                <div key={v.id} className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-[#1A1A1A] cursor-pointer transition-colors">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0 mt-0.5" style={{ backgroundColor: v.color }}>{v.user[0]}</div>
                  <div>
                    <p className="text-[11px] text-zinc-300">{v.label}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Clock size={9} className="text-zinc-600" />
                      <span className="text-[9px] text-zinc-600">{v.ago} · {v.user}</span>
                    </div>
                  </div>
                  <button className="ml-auto text-[9px] text-zinc-600 hover:text-violet-400 mt-0.5 transition-colors">Restore</button>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

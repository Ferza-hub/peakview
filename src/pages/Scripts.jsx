import { useState, useMemo } from 'react'
import { Plus, Copy, ChevronDown, FileText, Clock, Type, Trash2, Check } from 'lucide-react'
import { scripts as initialScripts } from '../data/mockData'

const PLATFORM_COLORS = {
  youtube:   'bg-red-50 text-red-700 border-red-200',
  instagram: 'bg-pink-50 text-pink-700 border-pink-200',
  tiktok:    'bg-cyan-50 text-cyan-700 border-cyan-200',
}

const SECTION_COLORS = {
  hook:  'border-l-violet-500 bg-violet-50/30',
  intro: 'border-l-blue-500 bg-blue-50/30',
  main:  'border-l-emerald-500 bg-emerald-50/30',
  outro: 'border-l-amber-500 bg-amber-50/30',
  cta:   'border-l-pink-500 bg-pink-50/30',
}

function countWords(text) {
  return text.trim() ? text.trim().split(/\s+/).length : 0
}

function wordsToTime(words) {
  const mins = words / 130
  if (mins < 1) return `~${Math.round(mins * 60)}s`
  return `~${mins.toFixed(1)}m`
}

export default function Scripts() {
  const [scripts, setScripts] = useState(initialScripts)
  const [activeId, setActiveId] = useState(scripts[0]?.id)
  const [copiedSection, setCopiedSection] = useState(null)
  const [collapsedSections, setCollapsedSections] = useState({})

  const activeScript = scripts.find(s => s.id === activeId)

  const totalWords = useMemo(() => {
    if (!activeScript) return 0
    return activeScript.sections.reduce((sum, s) => sum + countWords(s.content), 0)
  }, [activeScript])

  const updateSection = (sectionId, content) => {
    setScripts(prev => prev.map(s =>
      s.id === activeId
        ? { ...s, sections: s.sections.map(sec => sec.id === sectionId ? { ...sec, content } : sec) }
        : s
    ))
  }

  const copySection = (sectionId, content) => {
    navigator.clipboard.writeText(content).catch(() => {})
    setCopiedSection(sectionId)
    setTimeout(() => setCopiedSection(null), 2000)
  }

  const copyAll = () => {
    if (!activeScript) return
    const text = activeScript.sections.map(s => `[${s.label.toUpperCase()} — ${s.timeRange}]\n${s.content}`).join('\n\n---\n\n')
    navigator.clipboard.writeText(text).catch(() => {})
  }

  const toggleSection = (id) => setCollapsedSections(p => ({ ...p, [id]: !p[id] }))

  const newScript = () => {
    const id = Date.now()
    const s = {
      id,
      title: 'Untitled Script',
      platform: 'youtube',
      updatedAt: new Date().toISOString().split('T')[0],
      sections: [
        { id: 'hook',  label: 'Hook',         timeRange: '0:00 – 0:15',  content: '' },
        { id: 'intro', label: 'Intro',        timeRange: '0:15 – 1:00',  content: '' },
        { id: 'main',  label: 'Main Content', timeRange: '1:00 – 14:00', content: '' },
        { id: 'outro', label: 'Outro',        timeRange: '14:00 – 15:00',content: '' },
        { id: 'cta',   label: 'CTA',          timeRange: '15:00 – 15:30',content: '' },
      ],
    }
    setScripts(prev => [s, ...prev])
    setActiveId(id)
  }

  return (
    <div className="flex h-[calc(100vh-0px)] overflow-hidden bg-slate-50">
      {/* Script List Sidebar */}
      <div className="w-64 bg-white border-r border-slate-100 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-900 mb-3">Scripts</h2>
          <button onClick={newScript} className="btn-primary w-full justify-center text-sm">
            <Plus size={15} /> New Script
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {scripts.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveId(s.id)}
              className={`w-full text-left px-3 py-3 rounded-xl transition-all ${
                s.id === activeId ? 'bg-violet-50 border border-violet-200' : 'hover:bg-slate-50 border border-transparent'
              }`}
            >
              <div className="flex items-start gap-2">
                <FileText size={15} className={s.id === activeId ? 'text-violet-600 mt-0.5 shrink-0' : 'text-slate-400 mt-0.5 shrink-0'} />
                <div className="min-w-0">
                  <p className={`text-sm font-medium truncate ${s.id === activeId ? 'text-violet-900' : 'text-slate-700'}`}>{s.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{new Date(s.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      {activeScript ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Editor Toolbar */}
          <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={activeScript.title}
                onChange={e => setScripts(prev => prev.map(s => s.id === activeId ? { ...s, title: e.target.value } : s))}
                className="text-lg font-bold text-slate-900 bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-80"
              />
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${PLATFORM_COLORS[activeScript.platform] || ''}`}>
                {activeScript.platform.charAt(0).toUpperCase() + activeScript.platform.slice(1)}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Type size={14} />
                  <span>{totalWords.toLocaleString()} words</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={14} />
                  <span>{wordsToTime(totalWords)}</span>
                </div>
              </div>
              <button onClick={copyAll} className="btn-secondary text-sm">
                <Copy size={14} /> Copy All
              </button>
            </div>
          </div>

          {/* Sections */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {activeScript.sections.map(section => {
              const words = countWords(section.content)
              const isCollapsed = collapsedSections[section.id]
              return (
                <div key={section.id} className={`rounded-2xl border-l-4 border border-slate-100 bg-white overflow-hidden ${SECTION_COLORS[section.id] || ''}`}>
                  <div
                    className="flex items-center justify-between px-5 py-3 cursor-pointer hover:bg-black/5 transition-colors select-none"
                    onClick={() => toggleSection(section.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-slate-900">{section.label}</span>
                      <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{section.timeRange}</span>
                      {words > 0 && <span className="text-xs text-slate-400">{words} words · {wordsToTime(words)}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={e => { e.stopPropagation(); copySection(section.id, section.content) }}
                        className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors text-slate-400 hover:text-slate-600"
                        title="Copy section"
                      >
                        {copiedSection === section.id ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      </button>
                      <ChevronDown size={16} className={`text-slate-400 transition-transform ${isCollapsed ? '-rotate-90' : ''}`} />
                    </div>
                  </div>
                  {!isCollapsed && (
                    <div className="px-5 pb-4">
                      <textarea
                        value={section.content}
                        onChange={e => updateSection(section.id, e.target.value)}
                        placeholder={`Write your ${section.label.toLowerCase()} here…`}
                        rows={section.id === 'main' ? 18 : 4}
                        className="w-full text-sm text-slate-800 bg-transparent resize-none focus:outline-none leading-relaxed placeholder-slate-300 font-mono"
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-400">
          <div className="text-center">
            <FileText size={48} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">Select a script or create a new one</p>
          </div>
        </div>
      )}
    </div>
  )
}

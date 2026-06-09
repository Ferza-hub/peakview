import { useState, useMemo, useEffect, useRef } from 'react'
import { Plus, Copy, ChevronDown, FileText, Clock, Type, Trash2, X } from 'lucide-react'
import { scripts as initialScripts } from '../data/mockData'
import { useToast } from '../components/ui/Toast'

const SCRIPT_TEMPLATES = [
  {
    id: 'tutorial',
    name: 'Tutorial / How-To',
    desc: 'Step-by-step guide format. Best for YouTube.',
    color: '#7C3AED',
    icon: '📋',
    sections: [
      { id: 'hook',  label: 'Hook',         timeRange: '0:00 – 0:20',  content: 'Start with the result: "After doing X, I discovered Y — and it changed everything. Here\'s exactly how to do it in under 10 minutes."' },
      { id: 'intro', label: 'Intro',        timeRange: '0:20 – 1:00',  content: 'Welcome back! Quick context on why this matters and who it\'s for. Subscribe pitch.' },
      { id: 'main',  label: 'Main Content', timeRange: '1:00 – 12:00', content: 'Step 1: [Title]\nExplain + show.\n\nStep 2: [Title]\nExplain + show.\n\nStep 3: [Title]\nExplain + show.\n\nPro tip: [Bonus insight]' },
      { id: 'outro', label: 'Outro',        timeRange: '12:00 – 13:00', content: 'Recap the steps. What to do next.' },
      { id: 'cta',   label: 'CTA',          timeRange: '13:00 – 13:30', content: 'Like if this helped. Subscribe for [cadence]. Next video: [Link card].' },
    ],
  },
  {
    id: 'review',
    name: 'Product Review',
    desc: 'Structured review with pros/cons. High CTR format.',
    color: '#2563EB',
    icon: '⭐',
    sections: [
      { id: 'hook',  label: 'Hook',         timeRange: '0:00 – 0:20',  content: 'Bold verdict upfront: "I\'ve been using [Product] for 30 days. Here\'s my honest take — and whether it\'s worth your money."' },
      { id: 'intro', label: 'Intro',        timeRange: '0:20 – 1:00',  content: 'Who this review is for. Your experience level. No sponsorship disclosure (or sponsored — be transparent).' },
      { id: 'main',  label: 'Main Content', timeRange: '1:00 – 14:00', content: 'Overview: What is it?\n\nFirst impressions: Unboxing/setup experience\n\nKey features tested:\n- Feature 1: [Result]\n- Feature 2: [Result]\n- Feature 3: [Result]\n\nPros:\n✓ \n✓ \n✓ \n\nCons:\n✗ \n✗ \n\nPrice: Worth it for [audience] at $X/mo?' },
      { id: 'outro', label: 'Verdict',      timeRange: '14:00 – 15:00', content: 'Final score: X/10. Who should buy it. Who should skip.' },
      { id: 'cta',   label: 'CTA',          timeRange: '15:00 – 15:30', content: 'Affiliate link in description. Comment your questions. Similar video: [Link].' },
    ],
  },
  {
    id: 'vlog',
    name: 'Vlog / Day in My Life',
    desc: 'Authentic lifestyle format. Great for Instagram crosspost.',
    color: '#EC4899',
    icon: '🎬',
    sections: [
      { id: 'hook',  label: 'Hook',         timeRange: '0:00 – 0:15',  content: 'Jump straight into the most interesting moment of the day. No "hey guys" opener.' },
      { id: 'main',  label: 'Day Story',    timeRange: '0:15 – 12:00', content: 'Morning:\n\nAfternoon:\n\nEvening:\n\nHonest reflection: What actually happened vs what I planned.' },
      { id: 'outro', label: 'Wrap-up',      timeRange: '12:00 – 13:00', content: 'One genuine takeaway from today. Keep it real.' },
      { id: 'cta',   label: 'CTA',          timeRange: '13:00 – 13:30', content: 'Subscribe to see the next one. Comment what you want to see.' },
    ],
  },
  {
    id: 'listicle',
    name: 'Top-N List',
    desc: '"Top 10 tools" format. Very high watch-time retention.',
    color: '#D97706',
    icon: '📊',
    sections: [
      { id: 'hook',  label: 'Hook',         timeRange: '0:00 – 0:20',  content: 'Tease #1 right away: "Number one on this list saved me $3,000 last year. Here are the 10 [topic] you need to know."' },
      { id: 'intro', label: 'Intro',        timeRange: '0:20 – 1:00',  content: 'Quick context. Why you\'re qualified to make this list. How you ranked them.' },
      { id: 'main',  label: 'The List',     timeRange: '1:00 – 14:00', content: '#10: [Item]\nWhy it made the list.\n\n#9: [Item]\n\n#8: [Item]\n\n#7: [Item]\n\n#6: [Item]\n\n#5: [Item]\n\n#4: [Item]\n\n#3: [Item]\n\n#2: [Item]\n\n#1: [Item]\nBest of the best. Explain why thoroughly.' },
      { id: 'outro', label: 'Outro',        timeRange: '14:00 – 15:00', content: 'What didn\'t make the cut. Honorable mentions. Your personal pick.' },
      { id: 'cta',   label: 'CTA',          timeRange: '15:00 – 15:30', content: 'Comment your #1. Like and subscribe. Next video: [Related list].' },
    ],
  },
  {
    id: 'educational',
    name: 'Educational / Explainer',
    desc: 'Deep-dive format. Long-form, high authority.',
    color: '#059669',
    icon: '🎓',
    sections: [
      { id: 'hook',  label: 'Hook',         timeRange: '0:00 – 0:25',  content: 'State the surprising truth or counterintuitive fact. "Most people think X, but the data shows Y."' },
      { id: 'intro', label: 'Intro',        timeRange: '0:25 – 1:30',  content: 'Set up the big question. Why does it matter to the viewer personally?' },
      { id: 'main',  label: 'Deep Dive',    timeRange: '1:30 – 18:00', content: 'Part 1: The Background\n\nPart 2: The Core Concept\n\nPart 3: How It Works (with examples)\n\nPart 4: Common Misconceptions\n\nPart 5: What This Means For You' },
      { id: 'outro', label: 'Conclusion',   timeRange: '18:00 – 19:00', content: 'Summarize the key insight in one sentence. What to do with this knowledge.' },
      { id: 'cta',   label: 'CTA',          timeRange: '19:00 – 19:30', content: 'Resources in description. Subscribe for weekly deep-dives.' },
    ],
  },
  {
    id: 'blank',
    name: 'Blank Script',
    desc: 'Start from scratch with your own structure.',
    color: '#64748B',
    icon: '📄',
    sections: [
      { id: 'hook',  label: 'Hook',         timeRange: '0:00 – 0:20',  content: '' },
      { id: 'intro', label: 'Intro',        timeRange: '0:20 – 1:00',  content: '' },
      { id: 'main',  label: 'Main Content', timeRange: '1:00 – 14:00', content: '' },
      { id: 'outro', label: 'Outro',        timeRange: '14:00 – 15:00', content: '' },
      { id: 'cta',   label: 'CTA',          timeRange: '15:00 – 15:30', content: '' },
    ],
  },
]

const PLATFORM_OPTIONS = ['youtube', 'instagram', 'tiktok', 'twitter']

const PLATFORM_COLORS = {
  youtube:   'bg-red-50 text-red-700 border-red-200',
  instagram: 'bg-pink-50 text-pink-700 border-pink-200',
  tiktok:    'bg-cyan-50 text-cyan-700 border-cyan-200',
  twitter:   'bg-sky-50 text-sky-700 border-sky-200',
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

function TemplatePicker({ onSelect, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Choose a Template</h2>
            <p className="text-sm text-slate-500 mt-0.5">Pick a format to get started faster</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {SCRIPT_TEMPLATES.map(tpl => (
            <button
              key={tpl.id}
              onClick={() => onSelect(tpl)}
              className="group text-left p-4 rounded-xl border-2 border-slate-100 hover:border-violet-400 hover:shadow-sm transition-all duration-150 hover:scale-[1.02]"
              style={{ borderLeftColor: tpl.color, borderLeftWidth: 4 }}
            >
              <div className="text-2xl mb-2">{tpl.icon}</div>
              <p className="font-semibold text-slate-900 text-sm leading-snug">{tpl.name}</p>
              <p className="text-xs text-slate-500 mt-1 leading-snug">{tpl.desc}</p>
              <p className="text-xs font-medium mt-2.5" style={{ color: tpl.color }}>
                {tpl.sections.length} sections
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function PlatformDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border transition-colors ${PLATFORM_COLORS[value] || ''}`}
      >
        {value.charAt(0).toUpperCase() + value.slice(1)}
        <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full mt-1.5 left-0 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-20 min-w-[130px]">
          {PLATFORM_OPTIONS.map(p => (
            <button
              key={p}
              onClick={() => { onChange(p); setOpen(false) }}
              className={`w-full text-left px-3 py-1.5 text-sm transition-colors ${
                p === value ? 'bg-violet-50 text-violet-700 font-medium' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function SaveIndicator({ saving }) {
  const [showSaved, setShowSaved] = useState(false)
  const prevSaving = useRef(false)

  useEffect(() => {
    if (prevSaving.current && !saving) {
      setShowSaved(true)
      const t = setTimeout(() => setShowSaved(false), 2500)
      return () => clearTimeout(t)
    }
    prevSaving.current = saving
  }, [saving])

  if (saving) {
    return (
      <span className="flex items-center gap-1.5 text-xs text-slate-400">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        Saving…
      </span>
    )
  }

  if (showSaved) {
    return (
      <span className="flex items-center gap-1.5 text-xs text-emerald-600">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Saved
      </span>
    )
  }

  return (
    <span className="flex items-center gap-1.5 text-xs text-slate-300">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
      Saved
    </span>
  )
}

export default function Scripts() {
  const toast = useToast()
  const [scripts, setScripts] = useState(initialScripts)
  const [activeId, setActiveId] = useState(scripts[0]?.id)
  const [collapsedSections, setCollapsedSections] = useState({})
  const [showTemplatePicker, setShowTemplatePicker] = useState(false)
  const [renamingId, setRenamingId] = useState(null)
  const [renameValue, setRenameValue] = useState('')
  const [saving, setSaving] = useState(false)
  const saveTimer = useRef(null)
  const renameInputRef = useRef(null)

  const activeScript = scripts.find(s => s.id === activeId)

  const totalWords = useMemo(() => {
    if (!activeScript) return 0
    return activeScript.sections.reduce((sum, s) => sum + countWords(s.content), 0)
  }, [activeScript])

  useEffect(() => {
    if (renameInputRef.current && renamingId !== null) {
      renameInputRef.current.focus()
      renameInputRef.current.select()
    }
  }, [renamingId])

  const triggerAutosave = () => {
    clearTimeout(saveTimer.current)
    setSaving(true)
    saveTimer.current = setTimeout(() => setSaving(false), 1200)
  }

  const updateSection = (sectionId, content) => {
    setScripts(prev => prev.map(s =>
      s.id === activeId
        ? { ...s, sections: s.sections.map(sec => sec.id === sectionId ? { ...sec, content } : sec) }
        : s
    ))
    triggerAutosave()
  }

  const copySection = (content) => {
    navigator.clipboard.writeText(content).catch(() => {})
    toast.add('Copied to clipboard', 'success')
  }

  const copyAll = () => {
    if (!activeScript) return
    const text = activeScript.sections.map(s => `[${s.label.toUpperCase()} — ${s.timeRange}]\n${s.content}`).join('\n\n---\n\n')
    navigator.clipboard.writeText(text).catch(() => {})
    toast.add('Copied to clipboard', 'success')
  }

  const toggleSection = (id) => setCollapsedSections(p => ({ ...p, [id]: !p[id] }))

  const createFromTemplate = (tpl) => {
    const id = Date.now()
    const s = {
      id,
      title: tpl.id === 'blank' ? 'Untitled Script' : `New ${tpl.name}`,
      platform: 'youtube',
      updatedAt: new Date().toISOString().split('T')[0],
      sections: tpl.sections.map(sec => ({ ...sec })),
    }
    setScripts(prev => [s, ...prev])
    setActiveId(id)
    setShowTemplatePicker(false)
    toast.add('Script created from template', 'success')
  }

  const deleteScript = (id) => {
    if (!window.confirm('Delete this script? This cannot be undone.')) return
    setScripts(prev => prev.filter(s => s.id !== id))
    if (activeId === id) {
      const remaining = scripts.filter(s => s.id !== id)
      setActiveId(remaining[0]?.id ?? null)
    }
    toast.add('Script deleted', 'error')
  }

  const duplicateScript = () => {
    if (!activeScript) return
    const id = Date.now()
    const copy = {
      ...activeScript,
      id,
      title: `${activeScript.title} (copy)`,
      updatedAt: new Date().toISOString().split('T')[0],
      sections: activeScript.sections.map(s => ({ ...s })),
    }
    setScripts(prev => {
      const idx = prev.findIndex(s => s.id === activeId)
      const next = [...prev]
      next.splice(idx + 1, 0, copy)
      return next
    })
    setActiveId(id)
    toast.add('Script duplicated', 'success')
  }

  const updatePlatform = (platform) => {
    setScripts(prev => prev.map(s => s.id === activeId ? { ...s, platform } : s))
    triggerAutosave()
  }

  const updateTitle = (value) => {
    setScripts(prev => prev.map(s => s.id === activeId ? { ...s, title: value } : s))
    triggerAutosave()
  }

  const startRename = (s, e) => {
    e.stopPropagation()
    setRenamingId(s.id)
    setRenameValue(s.title)
  }

  const commitRename = () => {
    if (renameValue.trim()) {
      setScripts(prev => prev.map(s => s.id === renamingId ? { ...s, title: renameValue.trim() } : s))
    }
    setRenamingId(null)
  }

  const handleRenameKey = (e) => {
    if (e.key === 'Enter') commitRename()
    if (e.key === 'Escape') setRenamingId(null)
  }

  return (
    <div className="flex h-[calc(100vh-0px)] overflow-hidden bg-slate-50">
      {showTemplatePicker && (
        <TemplatePicker
          onSelect={createFromTemplate}
          onClose={() => setShowTemplatePicker(false)}
        />
      )}

      <div className="w-64 bg-white border-r border-slate-100 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-900 mb-3">Scripts</h2>
          <button
            onClick={() => setShowTemplatePicker(true)}
            className="btn-primary w-full justify-center text-sm"
          >
            <Plus size={15} /> New Script
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {scripts.map(s => (
            <div
              key={s.id}
              className={`group relative w-full text-left px-3 py-3 rounded-xl transition-all cursor-pointer ${
                s.id === activeId ? 'bg-violet-50 border border-violet-200' : 'hover:bg-slate-50 border border-transparent'
              }`}
              onClick={() => { if (renamingId !== s.id) setActiveId(s.id) }}
            >
              <div className="flex items-start gap-2 pr-6">
                <FileText size={15} className={`${s.id === activeId ? 'text-violet-600' : 'text-slate-400'} mt-0.5 shrink-0`} />
                <div className="min-w-0 flex-1">
                  {renamingId === s.id ? (
                    <input
                      ref={renameInputRef}
                      value={renameValue}
                      onChange={e => setRenameValue(e.target.value)}
                      onBlur={commitRename}
                      onKeyDown={handleRenameKey}
                      onClick={e => e.stopPropagation()}
                      className="w-full text-sm font-medium text-violet-900 bg-white border border-violet-300 rounded-md px-1.5 py-0.5 focus:outline-none focus:ring-2 focus:ring-violet-300"
                    />
                  ) : (
                    <p
                      className={`text-sm font-medium truncate ${s.id === activeId ? 'text-violet-900' : 'text-slate-700'}`}
                      onDoubleClick={e => startRename(s, e)}
                      title="Double-click to rename"
                    >
                      {s.title}
                    </p>
                  )}
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(s.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <button
                onClick={e => { e.stopPropagation(); deleteScript(s.id) }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                title="Delete script"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {activeScript ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={activeScript.title}
                onChange={e => updateTitle(e.target.value)}
                className="text-lg font-bold text-slate-900 bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-72"
              />
              <PlatformDropdown value={activeScript.platform} onChange={updatePlatform} />
            </div>
            <div className="flex items-center gap-4">
              <SaveIndicator saving={saving} />
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
              <div className="flex items-center gap-2">
                <button onClick={copyAll} className="btn-secondary text-sm">
                  <Copy size={14} /> Copy All
                </button>
                <button
                  onClick={duplicateScript}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Duplicate script"
                >
                  <Copy size={15} />
                </button>
                <button
                  onClick={() => deleteScript(activeId)}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete script"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {activeScript.sections.map(section => {
              const words = countWords(section.content)
              const isCollapsed = collapsedSections[section.id]
              return (
                <div
                  key={section.id}
                  className={`rounded-2xl border-l-4 border border-slate-100 bg-white overflow-hidden ${SECTION_COLORS[section.id] || ''}`}
                >
                  <div
                    className="flex items-center justify-between px-5 py-3 cursor-pointer hover:bg-black/5 transition-colors select-none"
                    onClick={() => toggleSection(section.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-slate-900">{section.label}</span>
                      <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{section.timeRange}</span>
                      {words > 0 && (
                        <span className="text-xs text-slate-400">{words} words · {wordsToTime(words)}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={e => { e.stopPropagation(); copySection(section.content) }}
                        className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors text-slate-400 hover:text-slate-600"
                        title="Copy section"
                      >
                        <Copy size={14} />
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

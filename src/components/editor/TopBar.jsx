import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, ChevronLeft, Undo2, Redo2, Save, Download, Share2, Users, Clock, Monitor, Smartphone, Square, Check, Loader2 } from 'lucide-react'

const FORMAT_ICONS = { '16:9': Monitor, '9:16': Smartphone, '1:1': Square }

export default function TopBar({ projectName, setProjectName, canUndo, canRedo, onUndo, onRedo, format, setFormat, onExport, onPublish, collaborators, onShowCollab, saveStatus, onSave }) {
  const navigate = useNavigate()

  const saveLabel = saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? 'Saved' : 'Save'
  const SaveIcon  = saveStatus === 'saving' ? Loader2 : saveStatus === 'saved' ? Check : Save

  return (
    <div className="h-12 bg-[#111111] border-b border-[#1F1F1F] flex items-center px-3 gap-2 shrink-0 z-50">
      <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 transition-colors mr-1">
        <ChevronLeft size={16} />
        <div className="w-6 h-6 bg-violet-600 rounded-md flex items-center justify-center">
          <Zap size={11} className="text-white" fill="white" />
        </div>
      </button>

      <input
        value={projectName}
        onChange={e => setProjectName(e.target.value)}
        className="bg-transparent text-sm font-medium text-zinc-200 focus:outline-none focus:bg-[#1A1A1A] px-1.5 py-0.5 rounded w-56 transition-all border border-transparent focus:border-violet-500/40"
      />

      <div className="w-px h-5 bg-[#2A2A2A] mx-1" />

      <button onClick={onUndo} disabled={!canUndo} title="Undo (Ctrl+Z)" className={`btn-ghost p-1.5 ${!canUndo ? 'opacity-30' : ''}`}><Undo2 size={15} /></button>
      <button onClick={onRedo} disabled={!canRedo} title="Redo (Ctrl+Y)" className={`btn-ghost p-1.5 ${!canRedo ? 'opacity-30' : ''}`}><Redo2 size={15} /></button>

      <div className="w-px h-5 bg-[#2A2A2A] mx-1" />

      <div className="flex bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg overflow-hidden">
        {Object.entries(FORMAT_ICONS).map(([fmt, Icon]) => (
          <button key={fmt} onClick={() => setFormat(fmt)} title={fmt}
            className={`px-2.5 py-1 flex items-center gap-1 text-xs transition-colors ${fmt === format ? 'bg-violet-600 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>
            <Icon size={12} /><span className="hidden sm:inline">{fmt}</span>
          </button>
        ))}
      </div>

      <div className="w-px h-5 bg-[#2A2A2A] mx-1" />

      <div className={`flex items-center gap-1.5 text-xs ${saveStatus === 'unsaved' ? 'text-amber-400' : 'text-zinc-500'}`}>
        <Clock size={11} />
        <span>{saveStatus === 'unsaved' ? 'Unsaved' : saveStatus === 'saving' ? 'Saving…' : 'Auto-saved'}</span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button onClick={onShowCollab} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#1A1A1A] transition-colors">
          <div className="flex -space-x-1.5">
            {(collaborators || []).filter(c => c.online).map(c => (
              <div key={c.id} title={c.name} className="w-6 h-6 rounded-full border-2 border-[#111] flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: c.color }}>
                {c.name[0]}
              </div>
            ))}
          </div>
          <span className="text-xs text-zinc-400">{(collaborators || []).filter(c => c.online).length} online</span>
        </button>

        <button onClick={onSave} className={`btn-surface ${saveStatus === 'saved' ? 'text-emerald-400 border-emerald-600/40' : ''}`}>
          <SaveIcon size={13} className={saveStatus === 'saving' ? 'animate-spin' : ''} />
          {saveLabel}
        </button>

        <button onClick={onExport} className="btn-surface"><Download size={13} /> Export</button>
        <button onClick={onPublish} className="btn-accent"><Share2 size={13} /> Publish</button>
      </div>
    </div>
  )
}

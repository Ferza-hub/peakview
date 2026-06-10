import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, ChevronLeft, Undo2, Redo2, Save, Download, Share2, Cloud, Clock, Monitor, Smartphone, Square, Check, Loader2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const FORMAT_ICONS = { '16:9': Monitor, '9:16': Smartphone, '1:1': Square }

export default function TopBar({ projectName, setProjectName, canUndo, canRedo, onUndo, onRedo, format, setFormat, onExport, onPublish, saveStatus, onSave }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!showUserMenu) return
    const close = (e) => { if (!menuRef.current?.contains(e.target)) setShowUserMenu(false) }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [showUserMenu])

  const saveLabel = saveStatus === 'saving' ? 'Syncing…' : saveStatus === 'saved' ? 'Synced' : 'Save'
  const SaveIcon  = saveStatus === 'saving' ? Loader2 : saveStatus === 'saved' ? Check : Save

  return (
    <div className="h-12 bg-[#111111] border-b border-[#1F1F1F] flex items-center px-3 gap-2 shrink-0 z-50">
      <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 transition-colors mr-1 p-1 -ml-1">
        <ChevronLeft size={16} />
        <div className="w-6 h-6 bg-violet-600 rounded-md flex items-center justify-center">
          <Zap size={11} className="text-white" fill="white" />
        </div>
      </button>

      <input
        value={projectName}
        onChange={e => setProjectName(e.target.value)}
        className="bg-transparent text-sm font-medium text-zinc-200 focus:outline-none focus:bg-[#1A1A1A] px-1.5 py-1 rounded w-40 sm:w-56 transition-all border border-transparent focus:border-violet-500/40"
      />

      <div className="w-px h-5 bg-[#2A2A2A] mx-1 hidden sm:block" />

      <button onClick={onUndo} disabled={!canUndo} title="Undo" className={`p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/10 transition-all ${!canUndo ? 'opacity-30' : ''}`}><Undo2 size={15} /></button>
      <button onClick={onRedo} disabled={!canRedo} title="Redo" className={`p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/10 transition-all ${!canRedo ? 'opacity-30' : ''}`}><Redo2 size={15} /></button>

      <div className="w-px h-5 bg-[#2A2A2A] mx-1 hidden sm:block" />

      <div className="flex bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg overflow-hidden">
        {Object.entries(FORMAT_ICONS).map(([fmt, Icon]) => (
          <button key={fmt} onClick={() => setFormat(fmt)} title={fmt}
            className={`px-2.5 py-2 flex items-center gap-1 text-xs transition-colors ${fmt === format ? 'bg-violet-600 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>
            <Icon size={12} /><span className="hidden sm:inline">{fmt}</span>
          </button>
        ))}
      </div>

      <div className="w-px h-5 bg-[#2A2A2A] mx-1 hidden md:block" />

      <div className={`hidden md:flex items-center gap-1.5 text-xs ${saveStatus === 'unsaved' ? 'text-amber-400' : saveStatus === 'saving' ? 'text-violet-400' : 'text-emerald-500'}`}>
        {saveStatus === 'saving'
          ? <><span className="w-2.5 h-2.5 border border-violet-400 border-t-transparent rounded-full animate-spin" /> <span>Syncing…</span></>
          : saveStatus === 'saved'
          ? <><Cloud size={11} /> <span>Synced</span></>
          : <><Clock size={11} /> <span>Unsaved</span></>
        }
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <button onClick={onSave} className={`btn-surface hidden sm:inline-flex ${saveStatus === 'saved' ? 'text-emerald-400 border-emerald-600/40' : ''}`}>
          <SaveIcon size={13} className={saveStatus === 'saving' ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">{saveLabel}</span>
        </button>

        <button onClick={onExport} className="btn-surface"><Download size={13} /><span className="hidden sm:inline"> Export</span></button>
        <button onClick={onPublish} className="btn-accent"><Share2 size={13} /><span className="hidden sm:inline"> Publish</span></button>

        <div className="relative ml-1" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu(p => !p)}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold select-none"
            title={user?.email}>
            {user?.avatar || 'U'}
          </button>
          {showUserMenu && (
            <div className="absolute right-0 top-11 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl shadow-2xl z-50 overflow-hidden min-w-[160px]">
              <div className="px-3 py-2.5 border-b border-[#252525]">
                <p className="text-xs font-semibold text-zinc-200 truncate">{user?.name}</p>
                <p className="text-[10px] text-zinc-500 truncate">{user?.email}</p>
              </div>
              <button onClick={logout} className="flex items-center gap-2 w-full px-3 py-3 text-xs text-red-400 hover:bg-red-950/40 transition-colors">
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect, useCallback } from 'react'
import { X, Share2, CheckCircle2, Copy, Check, ExternalLink } from 'lucide-react'

const PLATFORMS = [
  { id: 'youtube',   label: 'YouTube',   color: '#FF0000', icon: '▶', urlBase: 'https://youtu.be/' },
  { id: 'instagram', label: 'Instagram', color: '#E1306C', icon: '📸', urlBase: 'https://instagram.com/p/' },
  { id: 'tiktok',    label: 'TikTok',    color: '#69C9D0', icon: '🎵', urlBase: 'https://tiktok.com/@user/video/' },
]

function genId() {
  return Math.random().toString(36).substr(2, 11)
}

export default function PublishModal({ onClose }) {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const [platform, setPlatform]     = useState('youtube')
  const [title, setTitle]           = useState('')
  const [desc, setDesc]             = useState('')
  const [publishing, setPublishing] = useState(false)
  const [progress, setProgress]     = useState(0)
  const [done, setDone]             = useState(false)
  const [liveUrl, setLiveUrl]       = useState('')
  const [copied, setCopied]         = useState(false)

  const publish = () => {
    if (!title.trim()) return
    setPublishing(true)
    setProgress(0)
    let p = 0
    const iv = setInterval(() => {
      p += Math.random() * 12 + 4
      if (p >= 100) {
        clearInterval(iv)
        setProgress(100)
        setPublishing(false)
        const pl = PLATFORMS.find(x => x.id === platform)
        setLiveUrl(pl.urlBase + genId())
        setDone(true)
      } else {
        setProgress(Math.min(p, 99))
      }
    }, 150)
  }

  const copyUrl = useCallback(() => {
    navigator.clipboard?.writeText(liveUrl).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [liveUrl])

  const pl = PLATFORMS.find(x => x.id === platform)

  return (
    <div className="fixed inset-0 z-[8000] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#161616] border border-[#2A2A2A] rounded-2xl shadow-2xl w-96 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#222]">
          <div className="flex items-center gap-2">
            <Share2 size={15} className="text-violet-400" />
            <p className="font-semibold text-zinc-100 text-sm">Publish</p>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300"><X size={16} /></button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {done ? (
            <div className="flex flex-col items-center gap-4 py-2">
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: pl.color + '22', border: `2px solid ${pl.color}44` }}>
                <CheckCircle2 size={28} style={{ color: pl.color }} />
              </div>
              <div className="text-center">
                <p className="font-semibold text-zinc-100 mb-1">Published to {pl.label}!</p>
                <p className="text-xs text-zinc-500">Your video is now live and publicly accessible.</p>
              </div>
              <div className="w-full bg-[#111] border border-[#252525] rounded-xl p-3">
                <p className="text-[10px] text-zinc-500 mb-1.5 font-medium uppercase tracking-wider">Live URL</p>
                <div className="flex items-center gap-2">
                  <p className="flex-1 text-xs text-violet-300 font-mono truncate">{liveUrl}</p>
                  <button onClick={copyUrl}
                    className="w-7 h-7 rounded-lg bg-[#1A1A1A] hover:bg-violet-900/40 border border-[#2A2A2A] flex items-center justify-center shrink-0 transition-colors"
                    title="Copy URL">
                    {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} className="text-zinc-500 hover:text-violet-400" />}
                  </button>
                  <a href={liveUrl} target="_blank" rel="noopener noreferrer"
                    className="w-7 h-7 rounded-lg bg-[#1A1A1A] hover:bg-violet-900/40 border border-[#2A2A2A] flex items-center justify-center shrink-0 transition-colors">
                    <ExternalLink size={12} className="text-zinc-500 hover:text-violet-400" />
                  </a>
                </div>
              </div>
              <button onClick={onClose} className="btn-accent w-full justify-center">Done</button>
            </div>
          ) : (
            <>
              <div>
                <label className="field-label">Platform</label>
                <div className="flex gap-2">
                  {PLATFORMS.map(p => (
                    <button key={p.id} onClick={() => setPlatform(p.id)}
                      className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all border flex flex-col items-center gap-1 ${platform===p.id ? 'border-violet-500 text-white bg-violet-900/40' : 'border-[#2A2A2A] text-zinc-500 hover:text-zinc-300'}`}>
                      <span>{p.icon}</span>{p.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="field-label">Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Video title…" className="input-dark" />
              </div>
              <div>
                <label className="field-label">Description</label>
                <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} placeholder="Video description…" className="input-dark resize-none" />
              </div>
              {publishing && (
                <div>
                  <div className="flex justify-between text-xs text-zinc-400 mb-1.5">
                    <span>Uploading to {pl.label}…</span><span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 bg-[#2A2A2A] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-200" style={{ width: `${progress}%`, backgroundColor: pl.color }} />
                  </div>
                  <p className="text-[10px] text-zinc-600 mt-1.5">
                    {progress < 40 ? 'Uploading video…' : progress < 75 ? 'Processing…' : 'Publishing…'}
                  </p>
                </div>
              )}
              <div className="flex gap-2 justify-end">
                <button onClick={onClose} className="btn-ghost">Cancel</button>
                <button onClick={publish} disabled={!title.trim() || publishing} className="btn-accent">
                  <Share2 size={13} /> {publishing ? 'Publishing…' : 'Publish'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

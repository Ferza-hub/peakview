import { useState } from 'react'
import { X, Share2, Youtube, Instagram, CheckCircle2 } from 'lucide-react'

const PLATFORMS = [
  { id: 'youtube', label: 'YouTube', color: '#FF0000', icon: '▶' },
  { id: 'instagram', label: 'Instagram', color: '#E1306C', icon: '📸' },
  { id: 'tiktok', label: 'TikTok', color: '#69C9D0', icon: '🎵' },
]

export default function PublishModal({ onClose }) {
  const [platform, setPlatform] = useState('youtube')
  const [title, setTitle]       = useState('')
  const [desc, setDesc]         = useState('')
  const [publishing, setPublishing] = useState(false)
  const [done, setDone]         = useState(false)

  const publish = () => {
    if (!title.trim()) return
    setPublishing(true)
    setTimeout(() => { setPublishing(false); setDone(true) }, 2000)
  }

  return (
    <div className="fixed inset-0 z-[8000] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#161616] border border-[#2A2A2A] rounded-2xl shadow-2xl w-96 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#222]">
          <div className="flex items-center gap-2"><Share2 size={15} className="text-violet-400" /><p className="font-semibold text-zinc-100 text-sm">Publish</p></div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300"><X size={16} /></button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {done ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <CheckCircle2 size={40} className="text-emerald-400" />
              <p className="font-semibold text-zinc-100">Published!</p>
              <p className="text-xs text-zinc-500">Your video is live on {PLATFORMS.find(p => p.id === platform)?.label}.</p>
              <button onClick={onClose} className="btn-accent mt-2">Done</button>
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

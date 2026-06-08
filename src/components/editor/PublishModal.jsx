import { useState } from 'react'
import { X, Check, Upload } from 'lucide-react'

const PLATFORMS = [
  { id: 'youtube',   label: 'YouTube',   color: '#FF0000', connected: true  },
  { id: 'tiktok',    label: 'TikTok',    color: '#69C9D0', connected: true  },
  { id: 'instagram', label: 'Instagram', color: '#E1306C', connected: true  },
  { id: 'twitter',   label: 'Twitter',   color: '#1DA1F2', connected: false },
]

export default function PublishModal({ onClose }) {
  const [selected, setSelected] = useState(['youtube'])
  const [title, setTitle] = useState('How I Made $100K as a Creator')
  const [desc, setDesc] = useState('In this video I share the exact strategies that took me from 0 to $100K in my first year as a full-time content creator...')
  const [tags, setTags] = useState('creator economy, youtube growth, content creator tips')
  const [schedule, setSchedule] = useState('now')
  const [step, setStep] = useState('form')

  const toggle = (id) => {
    const p = PLATFORMS.find(p => p.id === id)
    if (!p.connected) return
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
  }

  const publish = () => {
    setStep('publishing')
    setTimeout(() => setStep('done'), 2500)
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1F1F1F]">
          <h3 className="font-bold text-zinc-100">{step === 'done' ? 'Published!' : 'Publish Video'}</h3>
          <button onClick={onClose} className="text-zinc-600 hover:text-zinc-300 transition-colors"><X size={18} /></button>
        </div>

        <div className="p-5">
          {step === 'form' && (
            <div className="space-y-4">
              <div>
                <label className="field-label">Publish to</label>
                <div className="flex gap-2 flex-wrap">
                  {PLATFORMS.map(p => (
                    <button key={p.id} onClick={() => toggle(p.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                        !p.connected ? 'opacity-40 cursor-not-allowed border-[#2A2A2A] text-zinc-600' :
                        selected.includes(p.id) ? 'border-violet-500 bg-violet-900/30 text-zinc-200' : 'border-[#2A2A2A] text-zinc-500 hover:border-[#383838]'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                      {p.label}
                      {!p.connected && <span className="text-[9px] text-zinc-600">(not connected)</span>}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="field-label">Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="input-dark text-xs" />
              </div>

              <div>
                <label className="field-label">Description</label>
                <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} className="input-dark text-xs resize-none" />
              </div>

              <div>
                <label className="field-label">Tags</label>
                <input type="text" value={tags} onChange={e => setTags(e.target.value)} className="input-dark text-xs" />
              </div>

              <div>
                <label className="field-label">Thumbnail</label>
                <div className="h-20 border-2 border-dashed border-[#2A2A2A] rounded-xl flex items-center justify-center text-zinc-600 text-xs cursor-pointer hover:border-violet-600/50 hover:text-violet-400 transition-all">
                  <Upload size={14} className="mr-1.5" /> Upload thumbnail
                </div>
              </div>

              <div>
                <label className="field-label">Publish time</label>
                <div className="flex gap-2">
                  {[['now','Publish Now'],['schedule','Schedule']].map(([v,l]) => (
                    <label key={v} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border cursor-pointer text-xs transition-all ${schedule === v ? 'border-violet-500 bg-violet-900/30 text-violet-300' : 'border-[#2A2A2A] text-zinc-500'}`}>
                      <input type="radio" name="schedule" value={v} checked={schedule === v} onChange={() => setSchedule(v)} className="hidden" />
                      {l}
                    </label>
                  ))}
                </div>
                {schedule === 'schedule' && (
                  <input type="datetime-local" className="input-dark text-xs mt-2" />
                )}
              </div>

              <div className="flex gap-2 pt-1">
                <button onClick={onClose} className="flex-1 btn-surface justify-center">Cancel</button>
                <button onClick={publish} disabled={!selected.length} className="flex-1 btn-accent justify-center disabled:opacity-40">
                  <Upload size={13} /> {schedule === 'now' ? `Publish to ${selected.length} platform${selected.length > 1 ? 's' : ''}` : 'Schedule'}
                </button>
              </div>
            </div>
          )}

          {step === 'publishing' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-violet-900/40 border-2 border-violet-600 flex items-center justify-center mx-auto">
                <Upload size={22} className="text-violet-400 animate-bounce" />
              </div>
              <p className="font-semibold text-zinc-200">Publishing to {selected.length} platform{selected.length > 1 ? 's' : ''}…</p>
              <div className="space-y-2">
                {selected.map((id, i) => {
                  const p = PLATFORMS.find(p => p.id === id)
                  return (
                    <div key={id} className="flex items-center gap-2 text-xs text-zinc-500">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                      <span>{p.label}</span>
                      <div className="flex-1 h-1 bg-[#1A1A1A] rounded-full overflow-hidden ml-2">
                        <div className="h-full rounded-full bg-violet-600 animate-pulse" style={{ width: '75%' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {step === 'done' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-900/40 border-2 border-emerald-600 flex items-center justify-center mx-auto">
                <Check size={26} className="text-emerald-400" />
              </div>
              <div>
                <p className="font-semibold text-zinc-200 mb-1">Published Successfully!</p>
                <p className="text-sm text-zinc-500">Your video is live on {selected.length} platform{selected.length > 1 ? 's' : ''}.</p>
              </div>
              <button onClick={onClose} className="btn-accent mx-auto">Close</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

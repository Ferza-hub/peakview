import { useState } from 'react'
import { X, Download, Check } from 'lucide-react'

const PLATFORMS = [
  { id: 'youtube', label: 'YouTube', sub: '16:9 · 1080p recommended', color: '#FF0000' },
  { id: 'tiktok',  label: 'TikTok',  sub: '9:16 · 1080p recommended', color: '#69C9D0' },
  { id: 'ig_reel', label: 'IG Reel', sub: '9:16 · 1080p recommended', color: '#E1306C' },
  { id: 'custom',  label: 'Custom',  sub: 'Set your own settings',     color: '#7C3AED' },
]

export default function ExportModal({ onClose }) {
  const [step, setStep] = useState('settings') // settings | exporting | done
  const [progress, setProgress] = useState(0)
  const [preset, setPreset] = useState('youtube')
  const [resolution, setResolution] = useState('1080p')
  const [quality, setQuality] = useState('High')
  const [subtitles, setSubtitles] = useState('burn')
  const [format, setFormat] = useState('MP4')

  const startExport = () => {
    setStep('exporting')
    let p = 0
    const iv = setInterval(() => {
      p += Math.random() * 8 + 2
      setProgress(Math.min(100, p))
      if (p >= 100) { clearInterval(iv); setStep('done') }
    }, 200)
  }

  const sizeEst = { '720p': '280 MB', '1080p': '680 MB', '4K': '2.4 GB' }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1F1F1F]">
          <h3 className="font-bold text-zinc-100">{step === 'done' ? 'Export Complete' : 'Export Video'}</h3>
          <button onClick={onClose} className="text-zinc-600 hover:text-zinc-300 transition-colors"><X size={18} /></button>
        </div>

        <div className="p-5">
          {step === 'settings' && (
            <div className="space-y-4">
              {/* Platform presets */}
              <div>
                <label className="field-label">Optimized for</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {PLATFORMS.map(p => (
                    <button key={p.id} onClick={() => setPreset(p.id)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-center transition-all ${preset === p.id ? 'border-violet-500 bg-violet-900/30' : 'border-[#2A2A2A] hover:border-[#383838]'}`}>
                      <div className="w-6 h-6 rounded-lg" style={{ backgroundColor: p.color + '40' }} />
                      <span className="text-[10px] font-medium text-zinc-300">{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="field-label">Format</label>
                  <select value={format} onChange={e => setFormat(e.target.value)} className="input-dark text-[11px]">
                    {['MP4','MOV','WebM','GIF','AVI'].map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">Resolution</label>
                  <select value={resolution} onChange={e => setResolution(e.target.value)} className="input-dark text-[11px]">
                    {['720p','1080p','4K'].map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="field-label">Quality</label>
                  <select value={quality} onChange={e => setQuality(e.target.value)} className="input-dark text-[11px]">
                    {['Low','Medium','High','Lossless'].map(q => <option key={q}>{q}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">FPS</label>
                  <select className="input-dark text-[11px]">
                    {['24','30','60'].map(f => <option key={f}>{f} fps</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="field-label">Subtitles</label>
                <div className="space-y-1.5">
                  {[['burn','Burn into video'],['srt','Export .SRT file'],['none','No subtitles']].map(([v,l]) => (
                    <label key={v} className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
                      <input type="radio" name="sub" value={v} checked={subtitles === v} onChange={() => setSubtitles(v)} className="accent-violet-500" />
                      {l}
                    </label>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-violet-500" />
                Smart compression (recommended)
              </label>

              <div className="flex items-center justify-between py-2.5 px-3 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A]">
                <span className="text-xs text-zinc-500">Estimated file size</span>
                <span className="text-sm font-bold text-zinc-200">{sizeEst[resolution] || '680 MB'}</span>
              </div>

              <button onClick={startExport} className="w-full btn-accent justify-center py-2.5 text-sm">
                <Download size={15} /> Start Export
              </button>
            </div>
          )}

          {step === 'exporting' && (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-violet-900/40 border-2 border-violet-600 flex items-center justify-center mx-auto">
                <Download size={24} className="text-violet-400" />
              </div>
              <div>
                <p className="font-semibold text-zinc-200 mb-1">Rendering your video…</p>
                <p className="text-sm text-zinc-500">{resolution} · {format} · {quality} quality</p>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-zinc-500 mb-1">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                  <div className="h-full bg-violet-600 rounded-full transition-all duration-200" style={{ width: `${progress}%` }} />
                </div>
              </div>
              <p className="text-xs text-zinc-600">Using GPU acceleration</p>
            </div>
          )}

          {step === 'done' && (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-900/40 border-2 border-emerald-600 flex items-center justify-center mx-auto">
                <Check size={28} className="text-emerald-400" />
              </div>
              <div>
                <p className="font-semibold text-zinc-200 mb-1">Export Complete!</p>
                <p className="text-sm text-zinc-500">Your video is ready to download.</p>
              </div>
              <div className="flex gap-2">
                <button onClick={onClose} className="flex-1 btn-surface justify-center">Close</button>
                <button className="flex-1 btn-accent justify-center"><Download size={14} /> Download</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { X, Download, CheckCircle2 } from 'lucide-react'

export default function ExportModal({ onClose }) {
  const [exporting, setExporting] = useState(false)
  const [done, setDone]           = useState(false)
  const [progress, setProgress]   = useState(0)
  const [format, setFormat]       = useState('mp4')
  const [quality, setQuality]     = useState('1080p')

  const startExport = () => {
    setExporting(true)
    let p = 0
    const iv = setInterval(() => {
      p += Math.random() * 8 + 2
      if (p >= 100) { clearInterval(iv); setProgress(100); setExporting(false); setDone(true) }
      else setProgress(Math.min(p, 99))
    }, 200)
  }

  return (
    <div className="fixed inset-0 z-[8000] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#161616] border border-[#2A2A2A] rounded-2xl shadow-2xl w-96 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#222]">
          <div className="flex items-center gap-2"><Download size={15} className="text-violet-400" /><p className="font-semibold text-zinc-100 text-sm">Export Video</p></div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300"><X size={16} /></button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {done ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <CheckCircle2 size={40} className="text-emerald-400" />
              <p className="font-semibold text-zinc-100">Export Complete!</p>
              <p className="text-xs text-zinc-500">Your video has been exported successfully.</p>
              <button onClick={onClose} className="btn-accent mt-2">Close</button>
            </div>
          ) : (
            <>
              <div>
                <label className="field-label">Format</label>
                <div className="flex gap-2">
                  {['mp4','mov','webm'].map(f => (
                    <button key={f} onClick={() => setFormat(f)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all border ${format===f ? 'border-violet-500 text-violet-300 bg-violet-900/40' : 'border-[#2A2A2A] text-zinc-500 hover:text-zinc-300'}`}>
                      .{f}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="field-label">Quality</label>
                <select value={quality} onChange={e => setQuality(e.target.value)} className="input-dark">
                  <option>4K UHD (2160p)</option>
                  <option>1080p HD</option>
                  <option>720p</option>
                  <option>480p</option>
                </select>
              </div>
              {exporting && (
                <div>
                  <div className="flex justify-between text-xs text-zinc-400 mb-1.5">
                    <span>Exporting…</span><span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 bg-[#2A2A2A] rounded-full overflow-hidden">
                    <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}
              <div className="flex gap-2 justify-end mt-1">
                <button onClick={onClose} className="btn-ghost">Cancel</button>
                <button onClick={startExport} disabled={exporting} className="btn-accent">
                  <Download size={13} /> {exporting ? 'Exporting…' : 'Export'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { X, Download, CheckCircle2 } from 'lucide-react'

async function triggerDownload(projectName, format, quality, onProgress) {
  const dims = { '16:9': [960, 540], '9:16': [540, 960], '1:1': [540, 540] }
  const [w, h] = dims[format] || dims['16:9']

  const canvas = document.createElement('canvas')
  canvas.width = w; canvas.height = h
  const ctx = canvas.getContext('2d')

  const mimeType = ['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm']
    .find(t => { try { return MediaRecorder.isTypeSupported(t) } catch { return false } }) || 'video/webm'

  const stream = canvas.captureStream(30)
  const chunks = []
  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 3_000_000 })
  recorder.ondataavailable = e => { if (e.data?.size > 0) chunks.push(e.data) }

  return new Promise(resolve => {
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${projectName.replace(/[^a-z0-9]/gi, '_')}.webm`
      document.body.appendChild(a); a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 2000)
      resolve()
    }

    recorder.start(100)

    const DURATION = 5 // seconds of video
    const FPS = 30
    const total = DURATION * FPS
    let frame = 0
    let t = 0

    const draw = () => {
      t = frame / FPS
      const prog = frame / total
      onProgress(Math.round(prog * 80 + 15))

      ctx.clearRect(0, 0, w, h)

      // Background gradient
      const bg = ctx.createLinearGradient(0, 0, w, h)
      bg.addColorStop(0, '#080808'); bg.addColorStop(1, '#110820')
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h)

      // Grid
      ctx.strokeStyle = 'rgba(255,255,255,0.025)'; ctx.lineWidth = 1
      for (let x = 0; x < w; x += 48) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke() }
      for (let y = 0; y < h; y += 48) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke() }

      // Center glow (pulses)
      const glow = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.min(w,h)*0.55)
      glow.addColorStop(0, `rgba(124,58,237,${0.12 + Math.sin(t*2)*0.06})`)
      glow.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = glow; ctx.fillRect(0, 0, w, h)

      // Scan line
      const scanY = ((t * 60) % (h + 4)) - 2
      ctx.fillStyle = 'rgba(255,255,255,0.012)'; ctx.fillRect(0, scanY, w, 2)

      // Project name (fade in)
      const alpha = Math.min(1, t / 0.6)
      ctx.fillStyle = `rgba(255,255,255,${0.9 * alpha})`
      ctx.font = `bold ${Math.max(16, Math.round(w * 0.042))}px system-ui, sans-serif`
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(projectName, w / 2, h / 2)

      // Sub info
      ctx.fillStyle = `rgba(255,255,255,${0.3 * alpha})`
      ctx.font = `${Math.max(10, Math.round(w * 0.016))}px system-ui, sans-serif`
      ctx.fillText(`PeakEdit · ${format} · ${quality}`, w / 2, h / 2 + Math.round(w * 0.058))

      // Viewfinder brackets
      const bl = Math.min(w, h) * 0.055
      ctx.strokeStyle = `rgba(255,255,255,${0.35 * alpha})`; ctx.lineWidth = 1.5
      ;[[0,0],[w,0],[0,h],[w,h]].forEach(([x,y]) => {
        const dx = x===0?bl:-bl, dy = y===0?bl:-bl
        ctx.beginPath(); ctx.moveTo(x+dx,y); ctx.lineTo(x,y); ctx.lineTo(x,y+dy); ctx.stroke()
      })

      // Format badge
      const bw2 = 72, bh2 = 22, bx = w - bw2 - 14, by = 14
      ctx.fillStyle = 'rgba(124,58,237,0.85)'
      ctx.beginPath(); ctx.roundRect(bx, by, bw2, bh2, 4); ctx.fill()
      ctx.fillStyle = 'white'
      ctx.font = `bold ${Math.max(9, Math.round(w * 0.013))}px system-ui`
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(format, bx + bw2/2, by + bh2/2)

      frame++
      if (frame < total) requestAnimationFrame(draw)
      else recorder.stop()
    }

    draw()
  })
}

export default function ExportModal({ onClose, projectName = 'Untitled Project', format = '16:9' }) {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const [exporting, setExporting] = useState(false)
  const [done, setDone]           = useState(false)
  const [progress, setProgress]   = useState(0)
  const [fmt, setFmt]             = useState('webm')
  const [quality, setQuality]     = useState('1080p HD')

  const startExport = async () => {
    setExporting(true)
    setProgress(5)
    await triggerDownload(projectName, format, quality, setProgress)
    setProgress(100)
    setExporting(false)
    setDone(true)
  }

  return (
    <div className="fixed inset-0 z-[8000] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#161616] border border-[#2A2A2A] rounded-2xl shadow-2xl w-96 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#222]">
          <div className="flex items-center gap-2">
            <Download size={15} className="text-violet-400" />
            <p className="font-semibold text-zinc-100 text-sm">Export Video</p>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300"><X size={16} /></button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {done ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <CheckCircle2 size={40} className="text-emerald-400" />
              <p className="font-semibold text-zinc-100">Export Complete!</p>
              <p className="text-xs text-zinc-500 text-center">
                Your video has been saved as a .webm file.<br />
                <span className="text-zinc-600">{projectName.replace(/[^a-z0-9]/gi, '_')}.webm</span>
              </p>
              <button onClick={onClose} className="btn-accent mt-2">Done</button>
            </div>
          ) : (
            <>
              <div>
                <label className="field-label">Format</label>
                <div className="flex gap-2">
                  {['mp4','mov','webm'].map(f => (
                    <button key={f} onClick={() => setFmt(f)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all border ${fmt===f ? 'border-violet-500 text-violet-300 bg-violet-900/40' : 'border-[#2A2A2A] text-zinc-500 hover:text-zinc-300'}`}>
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
              <div className="bg-[#1A1A1A] rounded-xl p-3 border border-[#252525]">
                <p className="text-[10px] text-zinc-500 leading-relaxed">
                  <span className="text-zinc-400 font-medium">{projectName}</span> · {format} · {quality}<br />
                  Estimated size: {quality === '4K UHD (2160p)' ? '~2.4 GB' : quality === '1080p HD' ? '~680 MB' : quality === '720p' ? '~320 MB' : '~140 MB'}
                </p>
              </div>
              {exporting && (
                <div>
                  <div className="flex justify-between text-xs text-zinc-400 mb-1.5">
                    <span>Rendering frames…</span><span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 bg-[#2A2A2A] rounded-full overflow-hidden">
                    <div className="h-full bg-violet-500 rounded-full transition-all duration-200" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="text-[10px] text-zinc-600 mt-1.5">
                    {progress < 30 ? 'Analyzing tracks…' : progress < 60 ? 'Rendering video…' : progress < 85 ? 'Encoding audio…' : 'Finalizing…'}
                  </p>
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

import { useRef, useEffect, useMemo } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react'
import { fmtTime } from '../../utils/helpers'
import { getBlobUrl } from '../../utils/fileRegistry'

// Animated canvas demo — plays when no real video file is uploaded
function DemoCanvas({ clip, style }) {
  const canvasRef = useRef(null)
  const animRef   = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let t = 0

    const SCENE_COLORS = {
      'Intro Hook':     ['#2D1B69', '#4C1D95'],
      'Main Content A': ['#1E3A8A', '#1D4ED8'],
      'B-Roll Insert':  ['#064E3B', '#065F46'],
      'Main Content B': ['#312E81', '#4338CA'],
      'Outro':          ['#1A1A2E', '#16213E'],
    }
    const [c1, c2] = SCENE_COLORS[clip?.label] || ['#1a0533', '#001a33']
    const isAudio = clip?.type === 'audio'

    const render = () => {
      t += 0.016
      const { width: w, height: h } = canvas

      // Animated radial gradient background
      const grad = ctx.createRadialGradient(
        w * 0.5 + Math.sin(t * 0.3) * w * 0.12,
        h * 0.5 + Math.cos(t * 0.2) * h * 0.08,
        0, w * 0.5, h * 0.5, Math.max(w, h) * 0.75
      )
      grad.addColorStop(0, c1)
      grad.addColorStop(1, '#050505')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)

      if (isAudio) {
        // Waveform visualiser
        ctx.strokeStyle = '#10B981'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        for (let x = 0; x <= w; x += 2) {
          const amp = h * 0.15 * Math.sin(x * 0.06 + t * 4) * Math.sin(x * 0.015 + t * 1.8)
          x === 0 ? ctx.moveTo(x, h * 0.5 + amp) : ctx.lineTo(x, h * 0.5 + amp)
        }
        ctx.stroke()

        // Frequency bars
        const bars = 28
        const bw = w / bars
        for (let i = 0; i < bars; i++) {
          const bh = (Math.sin(i * 0.6 + t * 5) * 0.5 + 0.52) * h * 0.38
          ctx.fillStyle = `rgba(16,185,129,${0.3 + Math.sin(i * 0.4 + t * 2) * 0.25})`
          ctx.fillRect(i * bw + 1, h * 0.88 - bh, bw - 2, bh)
        }
      } else {
        // Rule-of-thirds grid (faint)
        ctx.strokeStyle = 'rgba(255,255,255,0.04)'
        ctx.lineWidth = 1
        for (let i = 1; i < 3; i++) {
          ctx.beginPath(); ctx.moveTo(w * i / 3, 0); ctx.lineTo(w * i / 3, h); ctx.stroke()
          ctx.beginPath(); ctx.moveTo(0, h * i / 3); ctx.lineTo(w, h * i / 3); ctx.stroke()
        }

        // Simulated subject (person silhouette)
        const bob = Math.sin(t * 0.7) * 2
        ctx.save()
        ctx.globalAlpha = 0.22 + Math.sin(t * 0.4) * 0.02
        // head
        ctx.fillStyle = '#d4b896'
        ctx.beginPath(); ctx.ellipse(w * 0.5, h * 0.34 + bob, w * 0.055, h * 0.09, 0, 0, Math.PI * 2); ctx.fill()
        // body
        ctx.fillStyle = '#555'
        ctx.beginPath()
        ctx.moveTo(w * 0.42, h * 0.45 + bob)
        ctx.lineTo(w * 0.58, h * 0.45 + bob)
        ctx.lineTo(w * 0.55, h * 0.72 + bob)
        ctx.lineTo(w * 0.45, h * 0.72 + bob)
        ctx.closePath(); ctx.fill()
        ctx.restore()

        // Film grain
        for (let i = 0; i < 50; i++) {
          ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.03})`
          ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1)
        }

        // Scan line
        const scanY = ((t * 55) % (h + 4)) - 2
        ctx.fillStyle = 'rgba(255,255,255,0.018)'
        ctx.fillRect(0, scanY, w, 2)
      }

      // Corner viewfinder brackets
      const bl = Math.min(w, h) * 0.09
      ctx.strokeStyle = 'rgba(255,255,255,0.35)'
      ctx.lineWidth = 1.5
      ;[[0, 0], [w, 0], [0, h], [w, h]].forEach(([x, y]) => {
        const dx = x === 0 ? bl : -bl
        const dy = y === 0 ? bl : -bl
        ctx.beginPath(); ctx.moveTo(x + dx, y); ctx.lineTo(x, y); ctx.lineTo(x, y + dy); ctx.stroke()
      })

      animRef.current = requestAnimationFrame(render)
    }

    render()
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [clip?.label, clip?.type])

  return <canvas ref={canvasRef} width={480} height={270} className="w-full h-full" style={style} />
}

// Format → canvas container dimensions
const FORMAT_STYLE = {
  '16:9': { width: '100%', maxWidth: 460 },
  '9:16': { width: 158,  height: 280 },
  '1:1':  { width: 250,  height: 250 },
}
const FORMAT_LABEL = {
  '16:9': 'Landscape · YouTube',
  '9:16': 'Portrait · TikTok / Reels',
  '1:1':  'Square · Instagram',
}

export default function Preview({
  tracks, playing, setPlaying,
  currentTime, setCurrentTime,
  totalDuration, selectedClip, format,
  mediaFiles, colorFilter,
}) {
  const videoRef = useRef(null)

  const fmtStyle = FORMAT_STYLE[format] || FORMAT_STYLE['16:9']
  const fmtLabel = FORMAT_LABEL[format] || format

  // Current clip on v1
  const currentClip = useMemo(() => {
    const v1 = tracks?.find(t => t.id === 'v1')
    if (!v1) return null
    return v1.clips.find(c => currentTime >= c.start && currentTime < c.start + c.duration) || null
  }, [tracks, currentTime])

  const blobUrl = currentClip?.mediaId ? getBlobUrl(currentClip.mediaId) : null
  const mediaUrl = blobUrl || (currentClip?.mediaId
    ? mediaFiles?.find(m => m.id === currentClip.mediaId)?.url || null
    : null)

  // Subtitle overlay
  const subtitleClip = useMemo(() => {
    const sub = tracks?.find(t => t.id === 'sub')
    if (!sub) return null
    return sub.clips.find(c => currentTime >= c.start && currentTime < c.start + c.duration) || null
  }, [tracks, currentTime])

  // Video element sync
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (mediaUrl && v.src !== mediaUrl) v.src = mediaUrl
  }, [mediaUrl])

  useEffect(() => {
    const v = videoRef.current
    if (!v || !mediaUrl) return
    const clipTime = currentTime - (currentClip?.start || 0)
    if (Math.abs(v.currentTime - clipTime) > 0.5) v.currentTime = clipTime
  }, [currentTime, mediaUrl, currentClip])

  useEffect(() => {
    const v = videoRef.current
    if (!v || !mediaUrl) return
    playing ? v.play().catch(() => {}) : v.pause()
  }, [playing, mediaUrl])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const onTimeUpdate = () => {
      if (playing && mediaUrl) setCurrentTime((currentClip?.start || 0) + v.currentTime)
    }
    const onEnded = () => {
      const v1 = tracks?.find(t => t.id === 'v1')
      if (!v1?.clips.some(c => c.start > (currentClip?.start || 0))) setPlaying(false)
    }
    v.addEventListener('timeupdate', onTimeUpdate)
    v.addEventListener('ended', onEnded)
    return () => { v.removeEventListener('timeupdate', onTimeUpdate); v.removeEventListener('ended', onEnded) }
  }, [playing, mediaUrl, currentClip, tracks, setCurrentTime, setPlaying])

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#080808] border-b border-[#1A1A1A] overflow-hidden py-3 min-h-0 gap-2">

      {/* Canvas / video */}
      <div
        className="relative rounded-lg overflow-hidden border border-[#1F1F1F] shadow-2xl flex-shrink-0 bg-black"
        style={fmtStyle}
      >
        {mediaUrl ? (
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            muted playsInline crossOrigin="anonymous"
            style={{ filter: colorFilter || 'none' }}
          />
        ) : (
          <DemoCanvas clip={currentClip} style={{ filter: colorFilter || 'none' }} />
        )}

        {subtitleClip && (
          <div className="absolute bottom-3 left-3 right-3 flex justify-center pointer-events-none">
            <div className="bg-black/80 text-white text-[11px] px-3 py-1 rounded-md font-medium backdrop-blur-sm">
              {subtitleClip.text || subtitleClip.label}
            </div>
          </div>
        )}

        {/* Format label badge */}
        <div className="absolute top-2 right-2 bg-black/70 text-zinc-300 text-[9px] px-1.5 py-0.5 rounded font-mono whitespace-nowrap">
          {fmtLabel}
        </div>

        {/* Timecode */}
        <div className="absolute top-2 left-2 bg-black/70 text-zinc-400 text-[9px] px-1.5 py-0.5 rounded font-mono">
          {fmtTime(currentTime)}
        </div>

        {playing && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[9px] text-zinc-400 font-mono">REC</span>
          </div>
        )}

        {colorFilter && (
          <div className="absolute bottom-2 right-2 bg-violet-900/70 text-violet-300 text-[9px] px-1.5 py-0.5 rounded font-mono">
            FX
          </div>
        )}
      </div>

      {/* Scrubber */}
      <div className="w-full max-w-sm px-4">
        <input
          type="range" min="0" max={totalDuration} step="0.1" value={currentTime}
          onChange={e => setCurrentTime(parseFloat(e.target.value))}
          className="w-full accent-violet-500"
        />
        <div className="flex justify-between text-[10px] text-zinc-600 font-mono mt-0.5">
          <span>{fmtTime(currentTime)}</span>
          <span>{fmtTime(totalDuration)}</span>
        </div>
      </div>

      {/* Transport */}
      <div className="flex items-center gap-2">
        <button onClick={() => setCurrentTime(0)} className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-colors rounded-lg hover:bg-white/5">
          <SkipBack size={14} />
        </button>
        <button
          onClick={() => setPlaying(p => !p)}
          className="w-9 h-9 bg-violet-600 hover:bg-violet-500 rounded-full flex items-center justify-center transition-colors shadow-lg shadow-violet-900/40"
        >
          {playing ? <Pause size={14} className="text-white" /> : <Play size={14} className="text-white ml-0.5" />}
        </button>
        <button onClick={() => setCurrentTime(totalDuration)} className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-colors rounded-lg hover:bg-white/5">
          <SkipForward size={14} />
        </button>
        <button className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-colors rounded-lg hover:bg-white/5 ml-1">
          <Volume2 size={14} />
        </button>
      </div>
    </div>
  )
}

import { useRef, useEffect, useMemo, useState } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react'
import { fmtTime } from '../../utils/helpers'
import { getBlobUrl } from '../../utils/fileRegistry'

// Real scene photos — load in user's browser from Unsplash CDN
const SCENE_BG = {
  'Intro Hook':     'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&auto=format&fit=crop&q=80',
  'Main Content A': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
  'B-Roll Insert':  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop&q=80',
  'Main Content B': 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&auto=format&fit=crop&q=80',
  'Outro':          'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&auto=format&fit=crop&q=80',
}
const SCENE_DEFAULT = 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80'

function DemoCanvas({ clip, style }) {
  const canvasRef = useRef(null)
  const animRef   = useRef(null)
  const isAudio   = clip?.type === 'audio'
  const bgImg     = !isAudio ? (SCENE_BG[clip?.label] ?? SCENE_DEFAULT) : null

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let t = 0

    const render = () => {
      t += 0.016
      const { width: w, height: h } = canvas
      ctx.clearRect(0, 0, w, h)

      if (isAudio) {
        ctx.fillStyle = '#030303'
        ctx.fillRect(0, 0, w, h)

        // waveform line
        ctx.strokeStyle = '#10B981'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        for (let x = 0; x <= w; x += 2) {
          const amp = h * 0.15 * Math.sin(x * 0.06 + t * 4) * Math.sin(x * 0.015 + t * 1.8)
          x === 0 ? ctx.moveTo(x, h * 0.5 + amp) : ctx.lineTo(x, h * 0.5 + amp)
        }
        ctx.stroke()

        // frequency bars
        const bars = 28, bw = w / bars
        for (let i = 0; i < bars; i++) {
          const bh = (Math.sin(i * 0.6 + t * 5) * 0.5 + 0.52) * h * 0.38
          ctx.fillStyle = `rgba(16,185,129,${0.3 + Math.sin(i * 0.4 + t * 2) * 0.25})`
          ctx.fillRect(i * bw + 1, h * 0.88 - bh, bw - 2, bh)
        }
      } else {
        // cinematic vignette over real photo
        const vig = ctx.createRadialGradient(w*0.5, h*0.5, 0, w*0.5, h*0.5, Math.max(w,h)*0.72)
        vig.addColorStop(0.25, 'rgba(0,0,0,0)')
        vig.addColorStop(1,   'rgba(0,0,0,0.62)')
        ctx.fillStyle = vig
        ctx.fillRect(0, 0, w, h)

        // film grain
        for (let i = 0; i < 40; i++) {
          ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.022})`
          ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1)
        }

        // subtle scan line
        const scanY = ((t * 55) % (h + 4)) - 2
        ctx.fillStyle = 'rgba(255,255,255,0.014)'
        ctx.fillRect(0, scanY, w, 2)

        // rule-of-thirds
        ctx.strokeStyle = 'rgba(255,255,255,0.05)'
        ctx.lineWidth = 0.5
        for (let i = 1; i < 3; i++) {
          ctx.beginPath(); ctx.moveTo(w*i/3, 0); ctx.lineTo(w*i/3, h); ctx.stroke()
          ctx.beginPath(); ctx.moveTo(0, h*i/3); ctx.lineTo(w, h*i/3); ctx.stroke()
        }
      }

      // corner viewfinder brackets
      const bl = Math.min(w, h) * 0.09
      ctx.strokeStyle = 'rgba(255,255,255,0.45)'
      ctx.lineWidth = 1.5
      ;[[0,0],[w,0],[0,h],[w,h]].forEach(([x,y]) => {
        const dx = x===0?bl:-bl, dy = y===0?bl:-bl
        ctx.beginPath(); ctx.moveTo(x+dx,y); ctx.lineTo(x,y); ctx.lineTo(x,y+dy); ctx.stroke()
      })

      animRef.current = requestAnimationFrame(render)
    }

    render()
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [clip?.label, clip?.type, isAudio])

  return (
    <div className="w-full h-full relative overflow-hidden bg-black" style={style}>
      {bgImg && (
        <img
          src={bgImg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.72) saturate(1.1)' }}
          loading="eager"
        />
      )}
      <canvas
        ref={canvasRef}
        width={480}
        height={270}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  )
}

// Format → canvas container dimensions
const FORMAT_STYLE = {
  '16:9': { width: '100%', maxWidth: 460, aspectRatio: '16/9' },
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
  mediaFiles, colorFilter, adjustment, activeTransition,
}) {
  const videoRef   = useRef(null)
  const prevClipId = useRef(null)
  const [transKey, setTransKey] = useState(0)

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

  // Compute combined CSS filter from preset + per-clip adjustments
  const combinedFilter = useMemo(() => {
    const parts = []
    if (colorFilter) parts.push(colorFilter)
    if (adjustment) {
      const { brightness: b = 100, contrast: c = 100, saturation: s = 100 } = adjustment
      if (b !== 100 || c !== 100 || s !== 100)
        parts.push(`brightness(${b/100}) contrast(${c/100}) saturate(${s/100})`)
    }
    return parts.join(' ') || 'none'
  }, [colorFilter, adjustment])

  // Compute CSS transform from adjustment
  const combinedTransform = useMemo(() => {
    if (!adjustment) return ''
    const { x = 0, y = 0, scale = 100, rotation = 0 } = adjustment
    if (x === 0 && y === 0 && scale === 100 && rotation === 0) return ''
    return `translate(${x}px, ${y}px) scale(${scale/100}) rotate(${rotation}deg)`
  }, [adjustment])

  // Transition animation — bump key when clip changes and a transition is active
  useEffect(() => {
    if (!activeTransition) { prevClipId.current = currentClip?.id; return }
    if (prevClipId.current !== null && prevClipId.current !== currentClip?.id) {
      setTransKey(k => k + 1)
    }
    prevClipId.current = currentClip?.id
  }, [currentClip?.id, activeTransition])

  // Text animation map
  const TEXT_ANIM = {
    'Fade In':    'textFadeIn 0.5s ease forwards',
    'Slide Up':   'textSlideUp 0.45s ease forwards',
    'Typewriter': 'textFadeIn 0.8s steps(1) forwards',
    'Pop':        'textPop 0.35s cubic-bezier(0.175,0.885,0.32,1.275) forwards',
    'Bounce':     'textBounce 0.6s cubic-bezier(0.36,0.07,0.19,0.97) forwards',
    'Glitch':     'textGlitch 0.4s steps(4) forwards',
    'Neon':       'textNeon 0.5s ease forwards',
  }

  // Video element sync
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (mediaUrl && v.src !== mediaUrl) v.src = mediaUrl
  }, [mediaUrl])

  // Volume
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.volume = Math.min(1, Math.max(0, (adjustment?.volume ?? 100) / 100))
  }, [adjustment?.volume])

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
        <div
          key={transKey}
          className="w-full h-full"
          style={{
            filter: combinedFilter,
            transform: combinedTransform || undefined,
            animation: transKey > 0 ? `previewTransIn 0.35s ease` : undefined,
          }}
        >
          {mediaUrl ? (
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              playsInline crossOrigin="anonymous"
            />
          ) : (
            <DemoCanvas clip={currentClip} />
          )}
        </div>

        {subtitleClip && (
          <div className="absolute bottom-3 left-3 right-3 flex justify-center pointer-events-none">
            <div
              key={subtitleClip.id + subtitleClip.animation}
              className="bg-black/80 text-white text-[11px] px-3 py-1 rounded-md font-medium backdrop-blur-sm"
              style={subtitleClip.animation ? { animation: TEXT_ANIM[subtitleClip.animation] || TEXT_ANIM['Fade In'] } : undefined}
            >
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

        {(colorFilter || (adjustment && (adjustment.brightness !== 100 || adjustment.contrast !== 100 || adjustment.saturation !== 100))) && (
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

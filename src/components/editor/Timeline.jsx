import { useState, useRef } from 'react'
import { Volume2, VolumeX, Lock, Unlock, Plus, ZoomIn, ZoomOut, Scissors } from 'lucide-react'

const PX_PER_SEC = 14
const RULER_INTERVAL = 5

const TYPE_HEIGHT = { video: 40, audio: 32, subtitle: 28, fx: 24 }

function fmtTime(s) {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2,'0')}`
}

const TRACK_ICONS = { video: '🎬', audio: '🎵', subtitle: '💬', fx: '✨' }

export default function Timeline({ tracks, setTracks, currentTime, setCurrentTime, totalDuration, selectedClip, onSelectClip, zoom, setZoom }) {
  const scrollRef = useRef(null)
  const pps = PX_PER_SEC * zoom
  const totalWidth = totalDuration * pps

  const toggleMute = (trackId) => {
    setTracks(prev => prev.map(t => t.id === trackId ? { ...t, muted: !t.muted } : t))
  }
  const toggleLock = (trackId) => {
    setTracks(prev => prev.map(t => t.id === trackId ? { ...t, locked: !t.locked } : t))
  }

  const handleRulerClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const t = Math.max(0, Math.min(totalDuration, (e.clientX - rect.left) / pps))
    setCurrentTime(t)
  }

  // Generate ruler ticks
  const ticks = []
  for (let s = 0; s <= totalDuration; s += RULER_INTERVAL) {
    ticks.push(s)
  }

  return (
    <div className="flex flex-col bg-[#0D0D0D] border-t border-[#1F1F1F] overflow-hidden" style={{ height: 240 }}>
      {/* Timeline toolbar */}
      <div className="h-8 flex items-center gap-2 px-3 border-b border-[#1F1F1F] shrink-0">
        <button className="btn-ghost p-1 text-[10px]" title="Split clip"><Scissors size={13} /></button>
        <div className="w-px h-4 bg-[#2A2A2A]" />
        <button onClick={() => setZoom(z => Math.max(0.4, z - 0.2))} className="btn-ghost p-1"><ZoomOut size={13} /></button>
        <span className="text-[11px] text-zinc-500 w-10 text-center">{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom(z => Math.min(3, z + 0.2))} className="btn-ghost p-1"><ZoomIn size={13} /></button>
        <div className="w-px h-4 bg-[#2A2A2A]" />
        <span className="text-[11px] text-zinc-500 font-mono">{fmtTime(currentTime)} / {fmtTime(totalDuration)}</span>
        <button className="ml-auto flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors">
          <Plus size={12} /> Add Track
        </button>
      </div>

      {/* Main timeline area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Track headers */}
        <div className="w-[88px] shrink-0 border-r border-[#1F1F1F] overflow-hidden">
          {/* Header spacer (for ruler row) */}
          <div className="h-6 border-b border-[#1F1F1F]" />
          {tracks.map(track => (
            <div
              key={track.id}
              className="flex items-center gap-1 px-2 border-b border-[#1A1A1A] bg-[#111111]"
              style={{ height: (track.height || TYPE_HEIGHT[track.type] || 36) + 'px' }}
            >
              <span className="text-[9px] text-zinc-500 w-3">{TRACK_ICONS[track.type]}</span>
              <span className="text-[10px] font-medium text-zinc-400 flex-1 truncate">{track.label}</span>
              <button onClick={() => toggleMute(track.id)} className="text-zinc-600 hover:text-zinc-400 p-0.5 transition-colors">
                {track.muted ? <VolumeX size={10} /> : <Volume2 size={10} />}
              </button>
              <button onClick={() => toggleLock(track.id)} className="text-zinc-600 hover:text-zinc-400 p-0.5 transition-colors">
                {track.locked ? <Lock size={10} /> : <Unlock size={10} />}
              </button>
            </div>
          ))}
        </div>

        {/* Scrollable clip area */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden relative" ref={scrollRef}>
          <div style={{ width: totalWidth + 40, position: 'relative' }}>
            {/* Ruler */}
            <div
              className="h-6 border-b border-[#1F1F1F] bg-[#0D0D0D] sticky top-0 z-20 cursor-pointer select-none flex items-end"
              onClick={handleRulerClick}
              style={{ width: totalWidth + 40 }}
            >
              {ticks.map(t => (
                <div key={t} className="absolute bottom-0 flex flex-col items-start" style={{ left: t * pps }}>
                  <span className="text-[9px] text-zinc-600 font-mono ml-0.5 mb-0.5">{fmtTime(t)}</span>
                  <div className="w-px h-2 bg-[#2A2A2A]" />
                </div>
              ))}
              {/* Minor ticks every 1s */}
              {Array.from({ length: totalDuration }).map((_, i) => (
                i % RULER_INTERVAL !== 0 && (
                  <div key={`m-${i}`} className="absolute bottom-0 w-px h-1 bg-[#1F1F1F]" style={{ left: i * pps }} />
                )
              ))}
            </div>

            {/* Playhead */}
            <div
              className="absolute top-0 bottom-0 z-30 pointer-events-none"
              style={{ left: currentTime * pps }}
            >
              <div className="w-4 h-4 bg-cyan-400 rounded-sm" style={{ marginLeft: -8, clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
              <div className="w-0.5 bg-cyan-400 h-full absolute left-1/2 -translate-x-1/2 opacity-80" />
            </div>

            {/* Track rows */}
            {tracks.map(track => (
              <div
                key={track.id}
                className="relative border-b border-[#151515]"
                style={{ height: (track.height || TYPE_HEIGHT[track.type] || 36) + 'px' }}
              >
                {/* Track background */}
                <div className={`absolute inset-0 ${track.muted ? 'opacity-30' : ''}`}>
                  {/* Guide lines every 5s */}
                  {ticks.map(t => (
                    <div key={t} className="absolute inset-y-0 w-px bg-[#161616]" style={{ left: t * pps }} />
                  ))}
                </div>

                {/* Clips */}
                {track.clips.map(clip => {
                  const left = clip.start * pps
                  const width = Math.max(clip.duration * pps, 16)
                  const isSelected = selectedClip?.id === clip.id

                  return (
                    <div
                      key={clip.id}
                      onClick={() => !track.locked && onSelectClip(clip, track)}
                      className={`absolute top-1 bottom-1 rounded cursor-pointer transition-all select-none overflow-hidden group ${
                        track.locked ? 'cursor-not-allowed' : 'hover:brightness-110'
                      } ${isSelected ? 'ring-1 ring-white/60 z-10' : ''}`}
                      style={{
                        left,
                        width,
                        backgroundColor: clip.color + '35',
                        borderLeft: `2.5px solid ${clip.color}`,
                        opacity: track.muted ? 0.35 : 1,
                      }}
                    >
                      {/* Waveform for audio */}
                      {track.type === 'audio' && (
                        <div className="absolute inset-0 flex items-center gap-px px-2 overflow-hidden opacity-50">
                          {Array.from({ length: Math.max(4, Math.floor(width / 4)) }).map((_, i) => (
                            <div key={i} className="w-px rounded-full flex-shrink-0"
                              style={{ height: `${Math.random() * 60 + 20}%`, backgroundColor: clip.color }} />
                          ))}
                        </div>
                      )}
                      <span className="absolute top-0.5 left-1.5 right-1 text-[9px] text-white/80 truncate font-medium leading-4 z-10">
                        {clip.label}
                      </span>
                      {/* Resize handles */}
                      {isSelected && (
                        <>
                          <div className="absolute left-0 inset-y-0 w-1.5 cursor-w-resize bg-white/20 hover:bg-white/40 transition-colors" />
                          <div className="absolute right-0 inset-y-0 w-1.5 cursor-e-resize bg-white/20 hover:bg-white/40 transition-colors" />
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

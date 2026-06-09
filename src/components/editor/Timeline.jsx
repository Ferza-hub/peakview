import { useState, useRef, useEffect, useCallback } from 'react'
import { Volume2, VolumeX, Lock, Unlock, ZoomIn, ZoomOut, Scissors, X } from 'lucide-react'
import { genId, clamp, fmtTimeShort, parseDur } from '../../utils/helpers'

const PX_PER_SEC = 14
const RULER_STEP = 5
const TYPE_H = { video: 44, audio: 36, subtitle: 28, fx: 22 }
const ICONS   = { video: '🎬', audio: '🎵', subtitle: '💬', fx: '✨' }

export default function Timeline({
  tracks, currentTime, setCurrentTime, totalDuration,
  selectedClip, onSelectClip, zoom, setZoom,
  onTracksChange, onAddClip, onDeleteClip, onSplitClip,
}) {
  const pps = PX_PER_SEC * zoom
  const scrollRef = useRef(null)
  const dragRef   = useRef(null)
  const [local, setLocal] = useState(tracks)

  useEffect(() => { setLocal(tracks) }, [tracks])

  const ticks = Array.from({ length: Math.floor(totalDuration / RULER_STEP) + 1 }, (_, i) => i * RULER_STEP)

  const toggleMute = useCallback((id) => {
    const next = local.map(t => t.id === id ? { ...t, muted: !t.muted } : t)
    onTracksChange(next)
  }, [local, onTracksChange])

  const toggleLock = useCallback((id) => {
    const next = local.map(t => t.id === id ? { ...t, locked: !t.locked } : t)
    onTracksChange(next)
  }, [local, onTracksChange])

  const handleRulerClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setCurrentTime(clamp((e.clientX - rect.left) / pps, 0, totalDuration))
  }

  // ─── Mouse drag (move / resize) ─────────────────────────────────────────
  const startDrag = (e, trackId, clip, mode) => {
    e.preventDefault(); e.stopPropagation()
    const track = local.find(t => t.id === trackId)
    if (!track || track.locked) return
    onSelectClip(clip, track)
    dragRef.current = { mode, clipId: clip.id, trackId, startX: e.clientX, origStart: clip.start, origDur: clip.duration }
    document.addEventListener('mousemove', onDragMove)
    document.addEventListener('mouseup', onDragUp)
  }

  const onDragMove = useCallback((e) => {
    const d = dragRef.current; if (!d) return
    const dt = (e.clientX - d.startX) / pps
    setLocal(prev => prev.map(track => {
      if (track.id !== d.trackId) return track
      return { ...track, clips: track.clips.map(c => {
        if (c.id !== d.clipId) return c
        if (d.mode === 'move') {
          const s = clamp(d.origStart + dt, 0, totalDuration - c.duration)
          return { ...c, start: Math.round(s * 10) / 10 }
        }
        if (d.mode === 'right') {
          const dur = clamp(d.origDur + dt, 0.5, totalDuration - d.origStart)
          return { ...c, duration: Math.round(dur * 10) / 10 }
        }
        if (d.mode === 'left') {
          const s  = clamp(d.origStart + dt, 0, d.origStart + d.origDur - 0.5)
          const dur = d.origDur - (s - d.origStart)
          return { ...c, start: Math.round(s * 10) / 10, duration: Math.round(dur * 10) / 10 }
        }
        return c
      })}
    }))
  }, [pps, totalDuration])

  const onDragUp = useCallback(() => {
    document.removeEventListener('mousemove', onDragMove)
    document.removeEventListener('mouseup', onDragUp)
    setLocal(cur => { onTracksChange(cur); return cur })
    dragRef.current = null
  }, [onDragMove, onTracksChange])

  // ─── Drop from media library ─────────────────────────────────────────────
  const onDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy' }

  const onDrop = (e, trackId) => {
    e.preventDefault()
    const raw = e.dataTransfer.getData('application/peakedit-media')
    if (!raw) return
    const media = JSON.parse(raw)
    const track = local.find(t => t.id === trackId)
    if (!track || track.locked) return
    const rect = e.currentTarget.getBoundingClientRect()
    const start = clamp(Math.round(((e.clientX - rect.left) / pps) * 10) / 10, 0, totalDuration)
    onAddClip(trackId, {
      id: genId(), label: media.name, start,
      duration: parseDur(media.duration),
      color: media.color || '#7C3AED',
      type: media.type, mediaId: media.id,
    })
  }

  return (
    <div className="flex flex-col bg-[#0D0D0D] border-t border-[#1F1F1F] overflow-hidden" style={{ height: 248 }}>
      {/* Toolbar */}
      <div className="h-8 flex items-center gap-2 px-3 border-b border-[#1F1F1F] shrink-0">
        <button title="Split at playhead" onClick={() => selectedClip && onSplitClip(selectedClip._trackId, selectedClip.id)} className="btn-ghost p-1">
          <Scissors size={13} />
        </button>
        <div className="w-px h-4 bg-[#2A2A2A]" />
        <button onClick={() => setZoom(z => Math.max(0.4, Math.round((z-0.2)*10)/10))} className="btn-ghost p-1"><ZoomOut size={13} /></button>
        <span className="text-[11px] text-zinc-500 w-10 text-center">{Math.round(zoom*100)}%</span>
        <button onClick={() => setZoom(z => Math.min(3,   Math.round((z+0.2)*10)/10))} className="btn-ghost p-1"><ZoomIn  size={13} /></button>
        <div className="w-px h-4 bg-[#2A2A2A]" />
        <span className="text-[11px] text-zinc-500 font-mono">{fmtTimeShort(currentTime)} / {fmtTimeShort(totalDuration)}</span>
        <span className="text-[10px] text-zinc-700 ml-2">Space · ←→5s · Del · Ctrl+Z/S</span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Track headers */}
        <div className="w-[88px] shrink-0 border-r border-[#1F1F1F]">
          <div className="h-6 border-b border-[#1F1F1F] bg-[#0D0D0D]" />
          {local.map(track => (
            <div key={track.id} className="flex items-center gap-1 px-2 bg-[#111] border-b border-[#1A1A1A]"
              style={{ height: (track.height || TYPE_H[track.type] || 36) }}>
              <span className="text-[9px] w-3">{ICONS[track.type]}</span>
              <span className="text-[10px] font-medium text-zinc-400 flex-1 truncate">{track.label}</span>
              <button onClick={() => toggleMute(track.id)} className="text-zinc-600 hover:text-zinc-400 p-0.5 transition-colors">
                {track.muted ? <VolumeX size={10}/> : <Volume2 size={10}/>}
              </button>
              <button onClick={() => toggleLock(track.id)} className="text-zinc-600 hover:text-zinc-400 p-0.5 transition-colors">
                {track.locked ? <Lock size={10}/> : <Unlock size={10}/>}
              </button>
            </div>
          ))}
        </div>

        {/* Scrollable clips area */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden relative" ref={scrollRef}>
          <div style={{ width: totalDuration * pps + 48, position: 'relative' }}>
            {/* Ruler */}
            <div className="h-6 border-b border-[#1F1F1F] bg-[#0D0D0D] sticky top-0 z-20 cursor-pointer select-none"
              style={{ width: totalDuration * pps + 48 }} onClick={handleRulerClick}>
              {ticks.map(t => (
                <div key={t} className="absolute bottom-0 flex flex-col items-start" style={{ left: t * pps }}>
                  <span className="text-[9px] text-zinc-600 font-mono ml-0.5 mb-0.5">{fmtTimeShort(t)}</span>
                  <div className="w-px h-2 bg-[#2A2A2A]" />
                </div>
              ))}
              {Array.from({ length: totalDuration }, (_, i) => i).filter(i => i % RULER_STEP !== 0).map(i => (
                <div key={i} className="absolute bottom-0 w-px h-1 bg-[#1F1F1F]" style={{ left: i * pps }} />
              ))}
            </div>

            {/* Playhead */}
            <div className="absolute top-0 bottom-0 z-30 pointer-events-none" style={{ left: currentTime * pps }}>
              <div className="w-4 h-4 bg-cyan-400" style={{ marginLeft: -8, clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
              <div className="w-0.5 bg-cyan-400/80 h-full absolute left-1/2 -translate-x-1/2" />
            </div>

            {/* Track rows */}
            {local.map(track => (
              <div key={track.id} className="relative border-b border-[#151515]"
                style={{ height: track.height || TYPE_H[track.type] || 36 }}
                onDragOver={onDragOver} onDrop={e => onDrop(e, track.id)}>
                {/* Guide lines */}
                {ticks.map(t => (
                  <div key={t} className="absolute inset-y-0 w-px bg-[#161616]" style={{ left: t * pps }} />
                ))}

                {/* Clips */}
                {track.clips.map(clip => {
                  const left  = clip.start * pps
                  const width = Math.max(clip.duration * pps, 12)
                  const isSel = selectedClip?.id === clip.id

                  return (
                    <div key={clip.id}
                      className={`absolute top-1 bottom-1 rounded overflow-hidden select-none group
                        ${track.locked ? 'cursor-not-allowed opacity-60' : 'cursor-grab active:cursor-grabbing hover:brightness-110'}
                        ${isSel ? 'ring-1 ring-white/60 z-10' : 'z-0'}`}
                      style={{ left, width, backgroundColor: clip.color+'30', borderLeft: `2.5px solid ${clip.color}`, opacity: track.muted ? 0.3 : 1 }}
                      onClick={e => { e.stopPropagation(); !track.locked && onSelectClip(clip, track) }}
                      onMouseDown={e => !track.locked && startDrag(e, track.id, clip, 'move')}
                    >
                      {/* Waveform simulation for audio */}
                      {track.type === 'audio' && (
                        <div className="absolute inset-0 flex items-center gap-px px-1.5 overflow-hidden opacity-35 pointer-events-none">
                          {Array.from({ length: Math.max(3, Math.floor(width / 4)) }).map((_, i) => (
                            <div key={i} className="w-px rounded-full shrink-0"
                              style={{ height: `${25 + ((i * 13 + clip.id.charCodeAt(clip.id.length-1)) % 60)}%`, backgroundColor: clip.color }} />
                          ))}
                        </div>
                      )}

                      <span className="absolute top-0.5 left-1.5 right-5 text-[9px] text-white/80 truncate font-medium leading-4 z-10 pointer-events-none">
                        {clip.label}
                      </span>

                      {/* Delete × */}
                      {isSel && !track.locked && (
                        <button
                          className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-red-600/90 hover:bg-red-500 flex items-center justify-center z-20 transition-colors"
                          onMouseDown={e => e.stopPropagation()}
                          onClick={e => { e.stopPropagation(); onDeleteClip(track.id, clip.id, clip.label) }}>
                          <X size={8} className="text-white" />
                        </button>
                      )}

                      {/* Resize handles */}
                      {isSel && !track.locked && (
                        <>
                          <div className="absolute left-0 inset-y-0 w-2 cursor-w-resize bg-white/20 hover:bg-white/40 z-20 transition-colors"
                            onMouseDown={e => startDrag(e, track.id, clip, 'left')} />
                          <div className="absolute right-0 inset-y-0 w-2 cursor-e-resize bg-white/20 hover:bg-white/40 z-20 transition-colors"
                            onMouseDown={e => startDrag(e, track.id, clip, 'right')} />
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

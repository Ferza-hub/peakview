import { useState, useRef } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize2, RotateCcw } from 'lucide-react'

const ASPECT = { '16:9': 'aspect-video', '9:16': 'aspect-[9/16]', '1:1': 'aspect-square' }
const MAX_W   = { '16:9': 'max-w-full', '9:16': 'max-w-[200px]', '1:1': 'max-w-[280px]' }

function fmtTime(s) {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2,'0')}`
}

export default function Preview({ playing, setPlaying, currentTime, setCurrentTime, totalDuration, selectedClip, format }) {
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(80)

  const progress = (currentTime / totalDuration) * 100

  const handleScrub = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    setCurrentTime(ratio * totalDuration)
  }

  const previewColor = selectedClip?.color || '#7C3AED'

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#080808] gap-3 py-4 overflow-hidden min-h-0">
      {/* Video canvas */}
      <div className={`${MAX_W[format]} w-full flex-shrink`}>
        <div className={`${ASPECT[format]} relative rounded-lg overflow-hidden border border-[#2A2A2A] shadow-2xl`}
          style={{ background: `linear-gradient(135deg, ${previewColor}18 0%, #0A0A0A 60%, #0A0A0A 100%)` }}>

          {/* Simulated video content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center select-none">
              <div className="w-16 h-16 rounded-2xl mb-2 mx-auto opacity-20" style={{ backgroundColor: previewColor }} />
              {selectedClip && (
                <p className="text-xs text-zinc-600 font-mono max-w-[80%] mx-auto truncate">{selectedClip.label}</p>
              )}
            </div>
          </div>

          {/* Subtitle preview */}
          {selectedClip?.type === 'subtitle' && (
            <div className="absolute bottom-6 inset-x-4 flex justify-center">
              <div className="bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg font-medium max-w-full text-center">
                {selectedClip.label}
              </div>
            </div>
          )}

          {/* Lower third preview */}
          {selectedClip?.type === 'overlay' && selectedClip.label.includes('Lower') && (
            <div className="absolute bottom-8 left-6 right-6">
              <div className="bg-violet-700 px-4 py-2 rounded-md inline-block">
                <p className="text-white text-sm font-bold">{selectedClip.label.replace('Lower Third — ', '')}</p>
                <p className="text-violet-200 text-xs">Content Creator</p>
              </div>
            </div>
          )}

          {/* Play overlay */}
          {!playing && (
            <div className="absolute inset-0 flex items-center justify-center cursor-pointer" onClick={() => setPlaying(true)}>
              <div className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all">
                <Play size={20} className="text-white ml-1" />
              </div>
            </div>
          )}

          {/* Format overlay */}
          <div className="absolute top-2 left-2 bg-black/50 text-zinc-400 text-[10px] px-1.5 py-0.5 rounded font-mono">
            {format}
          </div>
        </div>
      </div>

      {/* Scrub bar */}
      <div className="w-full max-w-2xl px-4 space-y-2">
        <div
          className="h-1.5 bg-[#1A1A1A] rounded-full cursor-pointer relative group"
          onClick={handleScrub}
        >
          <div className="h-full rounded-full bg-violet-600 transition-all" style={{ width: `${progress}%` }} />
          <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }} />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentTime(0)} className="text-zinc-500 hover:text-zinc-300 transition-colors"><SkipBack size={15} /></button>
          <button
            onClick={() => setPlaying(p => !p)}
            className="w-8 h-8 rounded-full bg-violet-600 hover:bg-violet-500 flex items-center justify-center text-white transition-colors"
          >
            {playing ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
          </button>
          <button onClick={() => setCurrentTime(t => Math.min(t + 5, totalDuration))} className="text-zinc-500 hover:text-zinc-300 transition-colors"><SkipForward size={15} /></button>

          <span className="text-xs font-mono text-zinc-400 ml-1">
            {fmtTime(currentTime)} / {fmtTime(totalDuration)}
          </span>

          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => setMuted(m => !m)} className="text-zinc-500 hover:text-zinc-300 transition-colors">
              {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
            <input
              type="range" min={0} max={100} value={muted ? 0 : volume}
              onChange={e => setVolume(+e.target.value)}
              className="w-16"
            />
            <select className="bg-[#1A1A1A] border border-[#2A2A2A] text-zinc-400 text-xs rounded px-1.5 py-0.5 focus:outline-none ml-1">
              {['0.5x','0.75x','1x','1.25x','1.5x','2x'].map(s => <option key={s} value={s} selected={s === '1x'}>{s}</option>)}
            </select>
            <button className="text-zinc-500 hover:text-zinc-300 transition-colors ml-1"><Maximize2 size={14} /></button>
          </div>
        </div>
      </div>
    </div>
  )
}

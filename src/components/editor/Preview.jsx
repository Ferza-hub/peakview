import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react'
import { fmtTime } from '../../utils/helpers'

export default function Preview({ playing, setPlaying, currentTime, setCurrentTime, totalDuration, selectedClip, format }) {
  const ASPECT = { '16:9': 'aspect-video', '9:16': 'aspect-[9/16]', '1:1': 'aspect-square' }[format] || 'aspect-video'
  const pct = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#080808] border-b border-[#1A1A1A] overflow-hidden py-3 min-h-0">
      {/* Canvas */}
      <div className={`${ASPECT} max-h-full bg-black rounded-lg overflow-hidden relative border border-[#1F1F1F] shadow-2xl`}
        style={{ maxWidth: format === '9:16' ? '120px' : format === '1:1' ? '180px' : '320px' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center opacity-20">
            <div className="w-8 h-8 rounded-lg bg-violet-600 mx-auto mb-1 flex items-center justify-center">
              <Play size={14} className="text-white ml-0.5" />
            </div>
            <p className="text-xs text-zinc-500">Preview</p>
          </div>
        </div>
        {selectedClip && (
          <div className="absolute bottom-2 left-2 right-2 bg-black/70 rounded px-2 py-1">
            <p className="text-[9px] text-zinc-300 truncate">{selectedClip.label}</p>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-black/60 text-zinc-300 text-[9px] px-1.5 py-0.5 rounded font-mono">{format}</div>
      </div>

      {/* Scrubber */}
      <div className="w-full max-w-sm mt-2 px-4">
        <input type="range" min="0" max={totalDuration} step="0.1" value={currentTime}
          onChange={e => setCurrentTime(parseFloat(e.target.value))}
          className="w-full" />
        <div className="flex justify-between text-[10px] text-zinc-600 font-mono mt-0.5">
          <span>{fmtTime(currentTime)}</span>
          <span>{fmtTime(totalDuration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1 mt-1">
        <button onClick={() => setCurrentTime(0)} className="btn-ghost p-1.5"><SkipBack size={14} /></button>
        <button onClick={() => setPlaying(p => !p)} className="w-8 h-8 bg-violet-600 hover:bg-violet-500 rounded-full flex items-center justify-center transition-colors">
          {playing ? <Pause size={14} className="text-white" /> : <Play size={14} className="text-white ml-0.5" />}
        </button>
        <button onClick={() => setCurrentTime(totalDuration)} className="btn-ghost p-1.5"><SkipForward size={14} /></button>
        <button className="btn-ghost p-1.5 ml-1"><Volume2 size={14} /></button>
      </div>
    </div>
  )
}

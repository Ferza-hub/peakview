import { useState, useEffect, useCallback } from 'react'
import { Palette, Move, Volume2 } from 'lucide-react'

export default function RightPanel({ selectedClip, format, setFormat, onAdjust }) {
  const [transform, setTransform] = useState({ X: 0, Y: 0, Scale: 100, Rotation: 0 })
  const [color, setColor]         = useState({ Brightness: 100, Contrast: 100, Saturation: 100 })
  const [volume, setVolume]       = useState(100)

  const emit = useCallback((c, tr, v) => {
    onAdjust?.({
      brightness: c.Brightness, contrast: c.Contrast, saturation: c.Saturation,
      x: tr.X, y: tr.Y, scale: tr.Scale, rotation: tr.Rotation, volume: v,
    })
  }, [onAdjust])

  // reset when clip selection changes
  useEffect(() => {
    const c  = { Brightness: 100, Contrast: 100, Saturation: 100 }
    const tr = { X: 0, Y: 0, Scale: 100, Rotation: 0 }
    const v  = 100
    setTransform(tr); setColor(c); setVolume(v)
    emit(c, tr, v)
  }, [selectedClip?.id])

  const handleColor = (k, v) => {
    const next = { ...color, [k]: v }
    setColor(next)
    emit(next, transform, volume)
  }

  const handleTransform = (k, v) => {
    const next = { ...transform, [k]: v }
    setTransform(next)
    emit(color, next, volume)
  }

  const handleVolume = (v) => {
    setVolume(v)
    emit(color, transform, v)
  }

  return (
    <div className="w-52 shrink-0 bg-[#111111] border-l border-[#1F1F1F] flex flex-col overflow-y-auto">
      <div className="px-3 py-2.5 border-b border-[#1F1F1F]">
        <p className="panel-label">Inspector</p>
        {selectedClip ? (
          <p className="text-xs text-zinc-300 font-medium truncate">{selectedClip.label}</p>
        ) : (
          <p className="text-xs text-zinc-600">Select a clip</p>
        )}
      </div>

      {selectedClip ? (
        <div className="p-3 flex flex-col gap-4">
          <section>
            <p className="panel-label flex items-center gap-1.5"><Move size={10} /> Transform</p>
            {[
              { k: 'X',        suffix: 'px', min: -500, max: 500 },
              { k: 'Y',        suffix: 'px', min: -500, max: 500 },
              { k: 'Scale',    suffix: '%',  min: 10,   max: 300 },
              { k: 'Rotation', suffix: '°',  min: -180, max: 180 },
            ].map(({ k, suffix, min, max }) => (
              <div key={k} className="mb-2">
                <div className="flex justify-between mb-1">
                  <span className="field-label mb-0">{k}</span>
                  <span className="text-[10px] text-zinc-400">{transform[k]}{suffix}</span>
                </div>
                <input
                  type="range" min={min} max={max} value={transform[k]}
                  onChange={e => handleTransform(k, Number(e.target.value))}
                  className="w-full accent-violet-500"
                />
              </div>
            ))}
          </section>

          <section>
            <p className="panel-label flex items-center gap-1.5"><Palette size={10} /> Color</p>
            {['Brightness','Contrast','Saturation'].map(l => (
              <div key={l} className="mb-2">
                <div className="flex justify-between mb-1">
                  <span className="field-label mb-0">{l}</span>
                  <span className="text-[10px] text-zinc-400">{color[l]}%</span>
                </div>
                <input
                  type="range" min={0} max={200} value={color[l]}
                  onChange={e => handleColor(l, Number(e.target.value))}
                  className="w-full accent-violet-500"
                />
              </div>
            ))}
          </section>

          {(selectedClip.type === 'audio' || selectedClip.type === 'video') && (
            <section>
              <p className="panel-label flex items-center gap-1.5"><Volume2 size={10} /> Audio</p>
              <div className="mb-2">
                <div className="flex justify-between mb-1">
                  <span className="field-label mb-0">Volume</span>
                  <span className="text-[10px] text-zinc-400">{volume}%</span>
                </div>
                <input
                  type="range" min={0} max={150} value={volume}
                  onChange={e => handleVolume(Number(e.target.value))}
                  className="w-full accent-violet-500"
                />
              </div>
            </section>
          )}
        </div>
      ) : (
        <div className="p-3 flex flex-col gap-3">
          <section>
            <p className="panel-label">Canvas</p>
            <div className="flex flex-col gap-1.5">
              {['16:9','9:16','1:1'].map(f => (
                <button key={f} onClick={() => setFormat(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs text-left transition-all ${f === format ? 'bg-violet-900/50 text-violet-300 border border-violet-700/50' : 'text-zinc-500 hover:text-zinc-300 hover:bg-[#1A1A1A]'}`}>
                  {f} {f==='16:9'?'— Landscape':f==='9:16'?'— Portrait':'— Square'}
                </button>
              ))}
            </div>
          </section>
          <section>
            <p className="panel-label">Export Quality</p>
            <select className="input-dark">
              <option>1080p HD</option>
              <option>4K UHD</option>
              <option>720p</option>
              <option>480p</option>
            </select>
          </section>
        </div>
      )}
    </div>
  )
}

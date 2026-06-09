import { Sliders, Palette, Move, Type, Volume2 } from 'lucide-react'

export default function RightPanel({ selectedClip, format, setFormat }) {
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
            {[['X','0px'],['Y','0px'],['Scale','100%'],['Rotation','0°']].map(([l,v]) => (
              <div key={l} className="flex items-center gap-2 mb-1.5">
                <span className="field-label w-14 mb-0">{l}</span>
                <input defaultValue={v} className="input-dark flex-1" />
              </div>
            ))}
          </section>
          <section>
            <p className="panel-label flex items-center gap-1.5"><Palette size={10} /> Color</p>
            {[['Brightness','100%'],['Contrast','100%'],['Saturation','100%']].map(([l,v]) => (
              <div key={l} className="mb-2">
                <div className="flex justify-between mb-1"><span className="field-label mb-0">{l}</span><span className="text-[10px] text-zinc-400">{v}</span></div>
                <input type="range" defaultValue={100} min={0} max={200} className="w-full" />
              </div>
            ))}
          </section>
          {(selectedClip.type === 'audio' || selectedClip.type === 'video') && (
            <section>
              <p className="panel-label flex items-center gap-1.5"><Volume2 size={10} /> Audio</p>
              <div className="mb-2">
                <div className="flex justify-between mb-1"><span className="field-label mb-0">Volume</span><span className="text-[10px] text-zinc-400">100%</span></div>
                <input type="range" defaultValue={100} min={0} max={150} className="w-full" />
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

import { useState } from 'react'
import { Monitor, Smartphone, Square, ChevronDown } from 'lucide-react'

function Slider({ label, value, onChange, min = 0, max = 100, unit = '' }) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <label className="text-[10px] text-zinc-500">{label}</label>
        <span className="text-[10px] text-zinc-400 font-mono">{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={e => onChange(+e.target.value)} className="w-full" />
    </div>
  )
}

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-[#1F1F1F]">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-[#161616] transition-colors">
        <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">{title}</span>
        <ChevronDown size={13} className={`text-zinc-600 transition-transform ${open ? '' : '-rotate-90'}`} />
      </button>
      {open && <div className="px-3 pb-3 space-y-3">{children}</div>}
    </div>
  )
}

export default function RightPanel({ selectedClip, format, setFormat }) {
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 100, rotation: 0, opacity: 100 })
  const [color, setColor]         = useState({ brightness: 0, contrast: 0, saturation: 0, temperature: 0, tint: 0 })
  const [audio, setAudio]         = useState({ volume: 80, fadeIn: 0, fadeOut: 0 })
  const [speed, setSpeed]         = useState(100)

  const isVideo    = !selectedClip || selectedClip.type === 'video' || selectedClip.type === 'overlay'
  const isAudio    = selectedClip?.type === 'audio'
  const isSubtitle = selectedClip?.type === 'subtitle'
  const isAny      = !!selectedClip

  return (
    <div className="w-[220px] bg-[#111111] border-l border-[#1F1F1F] flex flex-col overflow-y-auto shrink-0">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-[#1F1F1F] shrink-0">
        <p className="text-xs font-bold text-zinc-200">
          {selectedClip ? selectedClip.label.substring(0, 22) : 'Inspector'}
        </p>
        {selectedClip && (
          <p className="text-[10px] text-zinc-600 mt-0.5 capitalize">{selectedClip.type} clip</p>
        )}
      </div>

      {/* No clip selected → Sequence Properties */}
      {!selectedClip && (
        <Section title="Sequence">
          <div>
            <label className="field-label">Format</label>
            <div className="flex gap-1">
              {[['16:9', Monitor], ['9:16', Smartphone], ['1:1', Square]].map(([f, Icon]) => (
                <button key={f} onClick={() => setFormat(f)}
                  className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-lg border text-[9px] transition-all ${format === f ? 'border-violet-500 bg-violet-900/40 text-violet-300' : 'border-[#2A2A2A] text-zinc-600 hover:border-[#383838]'}`}>
                  <Icon size={14} />
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="field-label">Resolution</label>
            <select className="input-dark text-[11px]">
              <option>1080p (1920×1080)</option>
              <option>4K (3840×2160)</option>
              <option>720p (1280×720)</option>
            </select>
          </div>
          <div>
            <label className="field-label">Frame Rate</label>
            <select className="input-dark text-[11px]">
              <option>30 fps</option>
              <option>24 fps</option>
              <option>60 fps</option>
              <option>25 fps</option>
            </select>
          </div>
          <div>
            <label className="field-label">Duration</label>
            <input type="text" defaultValue="00:01:05:00" className="input-dark text-[11px] font-mono" />
          </div>
        </Section>
      )}

      {/* VIDEO clip inspector */}
      {isVideo && isAny && (
        <>
          <Section title="Transform">
            <div className="grid grid-cols-2 gap-2">
              {[['X', transform.x, 'x', -500, 500], ['Y', transform.y, 'y', -500, 500]].map(([l, v, k, mn, mx]) => (
                <div key={k}>
                  <label className="field-label">{l}</label>
                  <input type="number" value={v} onChange={e => setTransform(p => ({ ...p, [k]: +e.target.value }))} className="input-dark text-[11px]" />
                </div>
              ))}
            </div>
            <Slider label="Scale" value={transform.scale} onChange={v => setTransform(p => ({ ...p, scale: v }))} min={10} max={300} unit="%" />
            <Slider label="Rotation" value={transform.rotation} onChange={v => setTransform(p => ({ ...p, rotation: v }))} min={-180} max={180} unit="°" />
            <Slider label="Opacity" value={transform.opacity} onChange={v => setTransform(p => ({ ...p, opacity: v }))} unit="%" />
          </Section>

          <Section title="Color">
            <Slider label="Brightness" value={color.brightness} onChange={v => setColor(p => ({ ...p, brightness: v }))} min={-100} max={100} />
            <Slider label="Contrast"   value={color.contrast}   onChange={v => setColor(p => ({ ...p, contrast: v }))}   min={-100} max={100} />
            <Slider label="Saturation" value={color.saturation} onChange={v => setColor(p => ({ ...p, saturation: v }))} min={-100} max={100} />
            <Slider label="Temperature"value={color.temperature}onChange={v => setColor(p => ({ ...p, temperature: v }))}min={-100} max={100} />
            <Slider label="Tint"       value={color.tint}       onChange={v => setColor(p => ({ ...p, tint: v }))}       min={-100} max={100} />
          </Section>

          <Section title="Speed">
            <Slider label="Playback Speed" value={speed} onChange={setSpeed} min={10} max={400} unit="%" />
            <label className="flex items-center gap-2 text-[11px] text-zinc-400 cursor-pointer mt-1">
              <input type="checkbox" className="accent-violet-500" /> Reverse
            </label>
          </Section>

          <Section title="Audio">
            <Slider label="Volume" value={audio.volume} onChange={v => setAudio(p => ({ ...p, volume: v }))} unit="%" />
            <Slider label="Fade In"  value={audio.fadeIn}  onChange={v => setAudio(p => ({ ...p, fadeIn: v }))}  min={0} max={30} unit="f" />
            <Slider label="Fade Out" value={audio.fadeOut} onChange={v => setAudio(p => ({ ...p, fadeOut: v }))} min={0} max={30} unit="f" />
            <label className="flex items-center gap-2 text-[11px] text-zinc-400 cursor-pointer">
              <input type="checkbox" className="accent-violet-500" /> Mute
            </label>
          </Section>
        </>
      )}

      {/* AUDIO clip inspector */}
      {isAudio && (
        <>
          <Section title="Audio">
            <Slider label="Volume"    value={audio.volume}  onChange={v => setAudio(p => ({ ...p, volume: v }))}  unit="%" />
            <Slider label="Fade In"   value={audio.fadeIn}  onChange={v => setAudio(p => ({ ...p, fadeIn: v }))}  min={0} max={30} unit="f" />
            <Slider label="Fade Out"  value={audio.fadeOut} onChange={v => setAudio(p => ({ ...p, fadeOut: v }))} min={0} max={30} unit="f" />
            <div>
              <label className="field-label">Pan</label>
              <input type="range" min={-100} max={100} defaultValue={0} className="w-full" />
            </div>
          </Section>
          <Section title="EQ">
            {[['Bass','80 Hz'],['Mid','1 kHz'],['Treble','10 kHz']].map(([b, freq]) => (
              <div key={b}>
                <div className="flex justify-between mb-1">
                  <label className="text-[10px] text-zinc-500">{b}</label>
                  <span className="text-[9px] text-zinc-600">{freq}</span>
                </div>
                <input type="range" min={-20} max={20} defaultValue={0} className="w-full" />
              </div>
            ))}
          </Section>
          <Section title="Effects">
            {['Noise Reduction','Reverb','Echo','Compression'].map(fx => (
              <label key={fx} className="flex items-center justify-between text-[11px] text-zinc-400 cursor-pointer py-1">
                {fx}
                <input type="checkbox" className="accent-violet-500" />
              </label>
            ))}
          </Section>
        </>
      )}

      {/* SUBTITLE clip inspector */}
      {isSubtitle && (
        <>
          <Section title="Text Content">
            <textarea defaultValue={selectedClip.label} rows={3} className="input-dark text-[11px] resize-none" />
          </Section>
          <Section title="Style">
            <div>
              <label className="field-label">Font</label>
              <select className="input-dark text-[11px]">
                {['Inter','Poppins','Bebas Neue','Oswald','Montserrat'].map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="field-label">Size</label>
                <input type="number" defaultValue={32} className="input-dark text-[11px]" />
              </div>
              <div>
                <label className="field-label">Color</label>
                <input type="color" defaultValue="#FFFFFF" className="w-full h-8 rounded-md border border-[#2A2A2A] cursor-pointer bg-transparent" />
              </div>
            </div>
            <div>
              <label className="field-label">Background</label>
              <input type="color" defaultValue="#000000" className="w-full h-7 rounded-md border border-[#2A2A2A] cursor-pointer bg-transparent" />
            </div>
            <Slider label="Background Opacity" value={80} onChange={() => {}} unit="%" />
            <div>
              <label className="field-label">Animation</label>
              <select className="input-dark text-[11px]">
                {['None','Fade In','Slide Up','Pop','Typewriter'].map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
          </Section>
          <Section title="Export Subtitles">
            <div className="space-y-1.5">
              {['Burn into video','Export as .SRT','Export as .VTT','Export as .ASS'].map(opt => (
                <label key={opt} className="flex items-center gap-2 text-[11px] text-zinc-400 cursor-pointer py-0.5">
                  <input type="radio" name="subexport" className="accent-violet-500" defaultChecked={opt.includes('Burn')} />
                  {opt}
                </label>
              ))}
            </div>
          </Section>
        </>
      )}
    </div>
  )
}

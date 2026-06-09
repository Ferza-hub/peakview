import { useState } from 'react'
import { Upload, X } from 'lucide-react'
import { genId } from '../../utils/helpers'

const TYPES = ['video','audio','image','subtitle']
const TYPE_COLORS = { video:'#7C3AED', audio:'#10B981', image:'#EC4899', subtitle:'#F59E0B' }

export default function AddMediaModal({ onAdd, onClose, editItem }) {
  const [name, setName]         = useState(editItem?.name || '')
  const [type, setType]         = useState(editItem?.type || 'video')
  const [duration, setDuration] = useState(editItem?.duration || '')
  const [addToTrack, setAddToTrack] = useState(false)

  const valid = name.trim() && duration.trim()

  const submit = (e) => {
    e.preventDefault()
    if (!valid) return
    onAdd({ id: editItem?.id || genId(), name: name.trim(), type, duration: duration.trim(), color: TYPE_COLORS[type], addToTrack })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[8500] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#161616] border border-[#2A2A2A] rounded-2xl shadow-2xl w-80 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#222]">
          <div className="flex items-center gap-2"><Upload size={15} className="text-violet-400" /><p className="font-semibold text-zinc-100 text-sm">{editItem ? 'Edit Media' : 'Add Media'}</p></div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300"><X size={16} /></button>
        </div>
        <form onSubmit={submit} className="p-5 flex flex-col gap-4">
          <div>
            <label className="field-label">Name</label>
            <input className="input-dark" value={name} onChange={e => setName(e.target.value)} placeholder="Clip name" autoFocus />
          </div>
          <div>
            <label className="field-label">Type</label>
            <div className="flex gap-1.5 flex-wrap">
              {TYPES.map(t => (
                <button key={t} type="button" onClick={() => setType(t)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${type===t ? 'border-violet-500 text-violet-300 bg-violet-900/40' : 'border-[#2A2A2A] text-zinc-500 hover:text-zinc-300'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="field-label">Duration (e.g. 0:15)</label>
            <input className="input-dark" value={duration} onChange={e => setDuration(e.target.value)} placeholder="0:15" />
          </div>
          {!editItem && (
            <label className="flex items-center gap-2.5 cursor-pointer select-none" onClick={() => setAddToTrack(v => !v)}>
              <div className={`w-8 rounded-full relative transition-colors shrink-0`} style={{ height:18, backgroundColor: addToTrack ? '#7C3AED' : '#2A2A2A' }}>
                <div className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full shadow transition-transform`} style={{ transform: addToTrack ? 'translateX(18px)' : 'translateX(2px)' }} />
              </div>
              <span className="text-xs text-zinc-400">Add directly to timeline</span>
            </label>
          )}
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={!valid} className={`btn-accent ${!valid ? 'opacity-40 cursor-not-allowed' : ''}`}>
              {editItem ? 'Save' : 'Add Media'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

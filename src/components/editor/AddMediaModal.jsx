import { useState, useRef, useCallback } from 'react'
import { Upload, X, FileVideo, FileAudio, Image as ImageIcon, FileText, Loader2 } from 'lucide-react'
import { genId } from '../../utils/helpers'
import { registerFile } from '../../utils/fileRegistry'

const TYPES = ['video', 'audio', 'image', 'subtitle']
const TYPE_COLORS = { video: '#7C3AED', audio: '#10B981', image: '#EC4899', subtitle: '#F59E0B' }
const TYPE_ICONS = { video: FileVideo, audio: FileAudio, image: ImageIcon, subtitle: FileText }

function detectType(file) {
  const mime = file.type || ''
  if (mime.startsWith('video/')) return 'video'
  if (mime.startsWith('audio/')) return 'audio'
  if (mime.startsWith('image/')) return 'image'
  const ext = file.name.split('.').pop().toLowerCase()
  if (ext === 'srt' || ext === 'vtt' || ext === 'ass') return 'subtitle'
  if (['mp4','mov','avi','mkv','webm'].includes(ext)) return 'video'
  if (['mp3','wav','ogg','aac','flac','m4a'].includes(ext)) return 'audio'
  if (['jpg','jpeg','png','gif','webp','avif'].includes(ext)) return 'image'
  return 'video'
}

function stripExtension(filename) {
  return filename.replace(/\.[^/.]+$/, '')
}

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDurationSec(secs) {
  if (!isFinite(secs) || isNaN(secs)) return ''
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function AddMediaModal({ onAdd, onClose, editItem }) {
  const [name, setName]             = useState(editItem?.name || '')
  const [type, setType]             = useState(editItem?.type || 'video')
  const [duration, setDuration]     = useState(editItem?.duration || '')
  const [addToTrack, setAddToTrack] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [extracting, setExtracting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const fileInputRef = useRef(null)

  const valid = name.trim() && (duration.trim() || type === 'image' || type === 'subtitle')

  const processFile = useCallback(async (file) => {
    setSelectedFile(file)
    const detectedType = detectType(file)
    setType(detectedType)
    setName(stripExtension(file.name))

    if (detectedType === 'video' || detectedType === 'audio') {
      setExtracting(true)
      try {
        const url = URL.createObjectURL(file)
        await new Promise((resolve) => {
          const el = detectedType === 'video'
            ? document.createElement('video')
            : document.createElement('audio')
          el.muted = true
          el.onloadedmetadata = () => {
            setDuration(formatDurationSec(el.duration))
            URL.revokeObjectURL(url)
            el.src = ''
            resolve()
          }
          el.onerror = () => {
            URL.revokeObjectURL(url)
            resolve()
          }
          el.src = url
        })
      } catch {
        // ignore
      } finally {
        setExtracting(false)
      }
    } else {
      setDuration('0:05')
    }
  }, [])

  const onFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const onDropZoneClick = () => {
    fileInputRef.current?.click()
  }

  const onDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const onDragLeave = () => setIsDragging(false)

  const onDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  const submit = (e) => {
    e.preventDefault()
    if (!valid) return

    const id = editItem?.id || genId()
    const durStr = duration.trim() || '0:05'

    if (selectedFile) {
      registerFile(id, selectedFile)
    }

    onAdd({
      id,
      name: name.trim(),
      type,
      duration: durStr,
      color: TYPE_COLORS[type],
      addToTrack,
      file: selectedFile || null,
    })
    onClose()
  }

  const TypeIcon = TYPE_ICONS[type] || FileVideo

  return (
    <div className="fixed inset-0 z-[8500] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#161616] border border-[#2A2A2A] rounded-2xl shadow-2xl w-80 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#222]">
          <div className="flex items-center gap-2">
            <Upload size={15} className="text-violet-400" />
            <p className="font-semibold text-zinc-100 text-sm">{editItem ? 'Edit Media' : 'Add Media'}</p>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={submit} className="p-5 flex flex-col gap-4">
          {/* Drop zone */}
          {!editItem && (
            <div
              onClick={onDropZoneClick}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={`relative border-2 border-dashed rounded-xl px-4 py-5 flex flex-col items-center justify-center cursor-pointer transition-all
                ${isDragging
                  ? 'border-violet-400 bg-violet-950/30'
                  : selectedFile
                  ? 'border-emerald-600/50 bg-emerald-950/20'
                  : 'border-[#2A2A2A] hover:border-violet-600/50 hover:bg-violet-950/10'
                }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*,audio/*,image/*,.srt,.vtt,.ass"
                className="hidden"
                onChange={onFileChange}
              />

              {extracting ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 size={22} className="text-violet-400 animate-spin" />
                  <p className="text-xs text-zinc-400">Extracting metadata…</p>
                </div>
              ) : selectedFile ? (
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: TYPE_COLORS[type] + '25' }}>
                    <TypeIcon size={16} style={{ color: TYPE_COLORS[type] }} />
                  </div>
                  <p className="text-xs text-zinc-200 font-medium text-center truncate max-w-full px-2">{selectedFile.name}</p>
                  <p className="text-[10px] text-zinc-500">{formatFileSize(selectedFile.size)}</p>
                  <p className="text-[10px] text-emerald-400">Click to change file</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5">
                  <Upload size={22} className="text-zinc-600" />
                  <p className="text-xs text-zinc-400 text-center">
                    Drop a file here or <span className="text-violet-400">click to browse</span>
                  </p>
                  <p className="text-[10px] text-zinc-600">video, audio, image, .srt</p>
                </div>
              )}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="field-label">Name</label>
            <input
              className="input-dark"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Clip name"
              autoFocus={!!editItem}
            />
          </div>

          {/* Type */}
          <div>
            <label className="field-label">Type</label>
            <div className="flex gap-1.5 flex-wrap">
              {TYPES.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${
                    type === t
                      ? 'border-violet-500 text-violet-300 bg-violet-900/40'
                      : 'border-[#2A2A2A] text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="field-label">Duration (e.g. 0:15)</label>
            <div className="relative">
              <input
                className="input-dark"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                placeholder="0:15"
              />
              {extracting && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <Loader2 size={12} className="text-violet-400 animate-spin" />
                </div>
              )}
            </div>
          </div>

          {/* Add to track toggle */}
          {!editItem && (
            <label
              className="flex items-center gap-2.5 cursor-pointer select-none"
              onClick={() => setAddToTrack(v => !v)}
            >
              <div
                className="w-8 rounded-full relative transition-colors shrink-0"
                style={{ height: 18, backgroundColor: addToTrack ? '#7C3AED' : '#2A2A2A' }}
              >
                <div
                  className="absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full shadow transition-transform"
                  style={{ transform: addToTrack ? 'translateX(18px)' : 'translateX(2px)' }}
                />
              </div>
              <span className="text-xs text-zinc-400">Add directly to timeline</span>
            </label>
          )}

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onClose} className="btn-ghost">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!valid || extracting}
              className={`btn-accent ${(!valid || extracting) ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              {editItem ? 'Save' : 'Add Media'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

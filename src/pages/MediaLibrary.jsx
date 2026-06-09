import { useState, useRef, useEffect } from 'react'
import {
  Upload, Search, Grid, List, Video, Image, FileImage, Film, Package,
  MoreHorizontal, Eye, Download, Edit2, Trash2, X, CheckCircle, Play,
} from 'lucide-react'
import { mediaAssets } from '../data/mockData'
import { useToast } from '../components/ui/Toast'

const TYPE_FILTERS = ['All', 'Thumbnail', 'Video', 'Photo', 'Graphic', 'B-Roll']

const TYPE_META = {
  thumbnail: { label: 'Thumbnail', icon: FileImage, color: 'bg-violet-100 text-violet-700' },
  video:     { label: 'Video',     icon: Video,     color: 'bg-blue-100 text-blue-700' },
  photo:     { label: 'Photo',     icon: Image,     color: 'bg-emerald-100 text-emerald-700' },
  graphic:   { label: 'Graphic',   icon: Package,   color: 'bg-amber-100 text-amber-700' },
  broll:     { label: 'B-Roll',    icon: Film,      color: 'bg-pink-100 text-pink-700' },
}

const VIDEO_TYPES = ['video', 'broll']

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function detectType(filename) {
  const ext = filename.split('.').pop().toLowerCase()
  if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext)) return 'video'
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'photo'
  if (['zip', 'rar', '7z'].includes(ext)) return 'graphic'
  return 'graphic'
}

function MenuDot({ asset, onPreview, onRename, onDelete }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={e => { e.stopPropagation(); setOpen(v => !v) }}
        className="p-1.5 rounded-lg bg-white/90 shadow text-slate-500 hover:text-slate-800 hover:bg-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label="Options"
      >
        <MoreHorizontal size={15} />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-30"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={() => { setOpen(false); onPreview(asset) }}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Eye size={14} className="text-slate-400" /> Preview
          </button>
          <button
            onClick={() => { setOpen(false); onRename(asset) }}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Edit2 size={14} className="text-slate-400" /> Rename
          </button>
          <button
            onClick={() => { setOpen(false); onDelete(asset.id) }}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      )}
    </div>
  )
}

function InlineRename({ initialName, onConfirm, onCancel }) {
  const [value, setValue] = useState(initialName)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [])

  function submit(e) {
    e.preventDefault()
    const trimmed = value.trim()
    if (trimmed && trimmed !== initialName) onConfirm(trimmed)
    else onCancel()
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
      <input
        ref={inputRef}
        value={value}
        onChange={e => setValue(e.target.value)}
        onBlur={submit}
        onKeyDown={e => e.key === 'Escape' && onCancel()}
        className="text-xs font-medium text-slate-800 border border-violet-400 rounded px-1.5 py-0.5 w-full focus:outline-none focus:ring-1 focus:ring-violet-400"
      />
    </form>
  )
}

function PreviewModal({ asset, onClose, onRename, onDelete, onDownload }) {
  const meta = TYPE_META[asset.type] || TYPE_META.graphic
  const Icon = meta.icon
  const isVideo = VIDEO_TYPES.includes(asset.type)
  const [renaming, setRenaming] = useState(false)

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col sm:flex-row"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex-1 sm:w-0 sm:basis-2/3 min-h-48 relative flex items-center justify-center"
          style={{ backgroundColor: isVideo ? '#0f0f0f' : asset.color + '18' }}
        >
          {isVideo ? (
            <div className="flex flex-col items-center gap-4 py-10 px-6 text-center">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center ring-2 ring-white/20">
                <Play size={28} className="text-white ml-1" />
              </div>
              <div className="space-y-1">
                <p className="text-white/90 text-sm font-semibold truncate max-w-xs">{asset.name}</p>
                <p className="text-white/50 text-xs">{asset.ext} · {asset.size}</p>
              </div>
              <span className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs font-medium">
                <Film size={11} /> Video preview unavailable
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-10 px-6">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-inner"
                style={{ backgroundColor: asset.color + '28' }}
              >
                <Icon size={36} style={{ color: asset.color }} />
              </div>
              <p className="text-slate-500 text-xs font-medium">{asset.ext} file</p>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${meta.color}`}>{meta.label}</span>
          </div>
        </div>

        <div className="sm:basis-1/3 bg-slate-50 p-5 flex flex-col gap-4 border-t sm:border-t-0 sm:border-l border-slate-100">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              {renaming ? (
                <InlineRename
                  initialName={asset.name}
                  onConfirm={name => { onRename(asset.id, name); setRenaming(false) }}
                  onCancel={() => setRenaming(false)}
                />
              ) : (
                <p className="text-sm font-semibold text-slate-900 break-words leading-snug">{asset.name}</p>
              )}
            </div>
            <button
              onClick={() => setRenaming(v => !v)}
              className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
              aria-label="Rename"
            >
              <Edit2 size={14} />
            </button>
          </div>

          <dl className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <dt className="text-slate-500 font-medium">Type</dt>
              <dd><span className={`px-2 py-0.5 rounded-full font-medium ${meta.color}`}>{meta.label}</span></dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-slate-500 font-medium">Size</dt>
              <dd className="text-slate-700 font-medium">{asset.size}</dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-slate-500 font-medium">Date</dt>
              <dd className="text-slate-700 font-medium">{formatDate(asset.date)}</dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-slate-500 font-medium">Format</dt>
              <dd className="text-slate-700 font-mono font-medium">{asset.ext}</dd>
            </div>
          </dl>

          <div className="mt-auto space-y-2 pt-2">
            <button onClick={() => onDownload(asset)} className="btn-primary w-full justify-center">
              <Download size={14} /> Download
            </button>
            <button
              onClick={() => setRenaming(true)}
              className="btn-secondary w-full justify-center"
            >
              <Edit2 size={14} /> Rename
            </button>
            <button
              onClick={() => onDelete(asset.id)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function UploadModal({ onClose, onUpload }) {
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState(null)
  const inputRef = useRef(null)

  function handleFile(f) {
    if (f) setFile(f)
  }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  function onDragOver(e) { e.preventDefault(); setDragging(true) }
  function onDragLeave() { setDragging(false) }

  function handleInputChange(e) {
    handleFile(e.target.files[0])
  }

  function submit() {
    if (!file) return
    const ext = file.name.split('.').pop().toUpperCase()
    const newAsset = {
      id: Date.now(),
      name: file.name,
      type: detectType(file.name),
      size: '— MB',
      date: new Date().toISOString().slice(0, 10),
      color: '#7C3AED',
      ext,
    }
    onUpload(newAsset)
  }

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-900">Upload Asset</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => inputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              dragging ? 'border-violet-400 bg-violet-50' : 'border-slate-200 hover:border-violet-300 hover:bg-slate-50'
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={handleInputChange}
            />
            <div className="flex flex-col items-center gap-2">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${dragging ? 'bg-violet-100' : 'bg-slate-100'}`}>
                <Upload size={22} className={dragging ? 'text-violet-500' : 'text-slate-400'} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">
                  Drop files here or <span className="text-violet-600">Browse</span>
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Any file type supported</p>
              </div>
            </div>
          </div>

          {file && (
            <div className="flex items-center gap-3 px-4 py-3 bg-violet-50 rounded-xl border border-violet-100">
              <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                <CheckCircle size={16} className="text-violet-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-800 truncate">{file.name}</p>
                <p className="text-xs text-slate-500 mt-0.5 capitalize">{detectType(file.name)} · — MB</p>
              </div>
              <button
                onClick={() => setFile(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X size={13} />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 px-6 pb-5">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button
            onClick={submit}
            disabled={!file}
            className={`btn-primary ${!file ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <Upload size={14} /> Upload
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MediaLibrary() {
  const toast = useToast()
  const [assets, setAssets] = useState(mediaAssets)
  const [filterType, setFilterType] = useState('All')
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [sort, setSort] = useState('date')
  const [previewAsset, setPreviewAsset] = useState(null)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [renameTarget, setRenameTarget] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const filtered = assets
    .filter(a => {
      if (filterType !== 'All' && a.type !== filterType.toLowerCase()) return false
      if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      if (sort === 'date') return new Date(b.date) - new Date(a.date)
      if (sort === 'name') return a.name.localeCompare(b.name)
      if (sort === 'type') return a.type.localeCompare(b.type)
      return 0
    })

  const totalSize = '34.2 GB'
  const usedPercent = 68

  function handleDelete(id) {
    setAssets(prev => prev.filter(a => a.id !== id))
    setPreviewAsset(null)
    setConfirmDelete(null)
    toast.add('Asset deleted', 'error')
  }

  function handleRename(id, name) {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, name } : a))
    if (previewAsset?.id === id) setPreviewAsset(p => ({ ...p, name }))
    setRenameTarget(null)
    toast.add('Asset renamed', 'success')
  }

  function handleUpload(newAsset) {
    setAssets(prev => [newAsset, ...prev])
    setUploadOpen(false)
    toast.add('Asset uploaded', 'success')
  }

  function handleDownload(asset) {
    toast.add(`Downloading ${asset.name}`, 'info')
  }

  function openPreview(asset) {
    setPreviewAsset(asset)
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Media Library</h1>
          <p className="text-slate-500 mt-0.5">{assets.length} assets · {totalSize} used</p>
        </div>
        <button className="btn-primary" onClick={() => setUploadOpen(true)}>
          <Upload size={16} /> Upload
        </button>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="font-medium text-slate-700">Storage Used</span>
          <span className="text-slate-500">{totalSize} / 50 GB</span>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-2.5 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all"
            style={{ width: `${usedPercent}%` }}
          />
        </div>
        <div className="flex flex-wrap gap-3 mt-3">
          {Object.entries(TYPE_META).map(([key, meta]) => (
            <div key={key} className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${meta.color}`}>{meta.label}</span>
              <span>{assets.filter(a => a.type === key).length}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search assets…"
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
          />
        </div>

        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto shrink-0 max-w-full">
          {TYPE_FILTERS.map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                filterType === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
        >
          <option value="date">Sort: Date</option>
          <option value="name">Sort: Name</option>
          <option value="type">Sort: Type</option>
        </select>

        <div className="flex gap-1 border border-slate-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-slate-900 text-white' : 'bg-white text-slate-400 hover:text-slate-600'}`}
          ><Grid size={16} /></button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-slate-900 text-white' : 'bg-white text-slate-400 hover:text-slate-600'}`}
          ><List size={16} /></button>
        </div>
      </div>

      {viewMode === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {filtered.map(asset => {
            const meta = TYPE_META[asset.type] || TYPE_META.graphic
            const Icon = meta.icon
            const isRenaming = renameTarget?.id === asset.id

            return (
              <div
                key={asset.id}
                onClick={() => openPreview(asset)}
                className="group bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 cursor-pointer relative"
              >
                <div
                  className="h-28 flex items-center justify-center relative"
                  style={{ backgroundColor: asset.color + '20' }}
                >
                  <Icon size={28} style={{ color: asset.color }} />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <MenuDot
                      asset={asset}
                      onPreview={openPreview}
                      onRename={a => setRenameTarget({ id: a.id, name: a.name })}
                      onDelete={id => handleDelete(id)}
                    />
                  </div>
                  <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs bg-black/60 text-white px-1.5 py-0.5 rounded font-mono">{asset.ext}</span>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${meta.color}`}>{meta.label}</span>
                  </div>
                </div>
                <div className="p-2.5" onClick={e => isRenaming && e.stopPropagation()}>
                  {isRenaming ? (
                    <InlineRename
                      initialName={asset.name}
                      onConfirm={name => handleRename(asset.id, name)}
                      onCancel={() => setRenameTarget(null)}
                    />
                  ) : (
                    <p className="text-xs font-medium text-slate-800 truncate">{asset.name}</p>
                  )}
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-slate-400">{asset.size}</span>
                    <span className="text-xs text-slate-400">{formatDate(asset.date)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {viewMode === 'list' && (
        <div className="card overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {['Name', 'Type', 'Size', 'Date', ''].map((h, i) => (
                  <th key={i} className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(asset => {
                const meta = TYPE_META[asset.type] || TYPE_META.graphic
                const Icon = meta.icon
                const isRenaming = renameTarget?.id === asset.id

                return (
                  <tr
                    key={asset.id}
                    onClick={() => !isRenaming && openPreview(asset)}
                    className="border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 min-h-[44px]">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: asset.color + '20' }}
                        >
                          <Icon size={16} style={{ color: asset.color }} />
                        </div>
                        {isRenaming ? (
                          <div className="flex-1 max-w-xs" onClick={e => e.stopPropagation()}>
                            <InlineRename
                              initialName={asset.name}
                              onConfirm={name => handleRename(asset.id, name)}
                              onCancel={() => setRenameTarget(null)}
                            />
                          </div>
                        ) : (
                          <span className="font-medium text-slate-800 truncate max-w-xs">{asset.name}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${meta.color}`}>{meta.label}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{asset.size}</td>
                    <td className="py-3 px-4 text-slate-500">{formatDate(asset.date)}</td>
                    <td className="py-3 px-4">
                      <div
                        className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end"
                        onClick={e => e.stopPropagation()}
                      >
                        <button
                          onClick={() => openPreview(asset)}
                          className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                          aria-label="Preview"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => setRenameTarget({ id: asset.id, name: asset.name })}
                          className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                          aria-label="Rename"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(asset.id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                          aria-label="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <Image size={40} className="mb-3 opacity-40" />
          <p className="font-medium">No assets found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      )}

      {previewAsset && (
        <PreviewModal
          asset={previewAsset}
          onClose={() => setPreviewAsset(null)}
          onRename={(id, name) => { handleRename(id, name); setPreviewAsset(p => p?.id === id ? { ...p, name } : p) }}
          onDelete={id => { handleDelete(id); setPreviewAsset(null) }}
          onDownload={handleDownload}
        />
      )}

      {uploadOpen && (
        <UploadModal
          onClose={() => setUploadOpen(false)}
          onUpload={handleUpload}
        />
      )}
    </div>
  )
}

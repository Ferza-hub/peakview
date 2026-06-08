import { useState } from 'react'
import { Upload, Search, Grid, List, Filter, Video, Image, FileImage, Film, Package } from 'lucide-react'
import { mediaAssets } from '../data/mockData'

const TYPE_FILTERS = ['All', 'Thumbnail', 'Video', 'Photo', 'Graphic', 'B-Roll']

const TYPE_META = {
  thumbnail: { label: 'Thumbnail', icon: FileImage, color: 'bg-violet-100 text-violet-700' },
  video:     { label: 'Video',     icon: Video,      color: 'bg-blue-100 text-blue-700' },
  photo:     { label: 'Photo',     icon: Image,      color: 'bg-emerald-100 text-emerald-700' },
  graphic:   { label: 'Graphic',   icon: Package,    color: 'bg-amber-100 text-amber-700' },
  broll:     { label: 'B-Roll',    icon: Film,       color: 'bg-pink-100 text-pink-700' },
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function MediaLibrary() {
  const [filterType, setFilterType] = useState('All')
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [sort, setSort] = useState('date')

  const filtered = mediaAssets
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

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Media Library</h1>
          <p className="text-slate-500 mt-0.5">{mediaAssets.length} assets · {totalSize} used</p>
        </div>
        <button className="btn-primary">
          <Upload size={16} /> Upload
        </button>
      </div>

      {/* Storage bar */}
      <div className="card">
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="font-medium text-slate-700">Storage Used</span>
          <span className="text-slate-500">{totalSize} / 50 GB</span>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-2.5 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all" style={{ width: `${usedPercent}%` }} />
        </div>
        <div className="flex gap-4 mt-3">
          {Object.entries(TYPE_META).map(([key, meta]) => (
            <div key={key} className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${meta.color}`}>{meta.label}</span>
              <span>{mediaAssets.filter(a => a.type === key).length}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar */}
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

        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
          {TYPE_FILTERS.map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
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

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {filtered.map(asset => {
            const meta = TYPE_META[asset.type] || TYPE_META.graphic
            const Icon = meta.icon
            return (
              <div key={asset.id} className="group bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 cursor-pointer">
                <div
                  className="h-28 flex items-center justify-center relative"
                  style={{ backgroundColor: asset.color + '20' }}
                >
                  <Icon size={28} style={{ color: asset.color }} />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs bg-black/60 text-white px-1.5 py-0.5 rounded font-mono">{asset.ext}</span>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${meta.color}`}>{meta.label}</span>
                  </div>
                </div>
                <div className="p-2.5">
                  <p className="text-xs font-medium text-slate-800 truncate">{asset.name}</p>
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

      {/* List View */}
      {viewMode === 'list' && (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {['Name','Type','Size','Date'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(asset => {
                const meta = TYPE_META[asset.type] || TYPE_META.graphic
                const Icon = meta.icon
                return (
                  <tr key={asset.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: asset.color + '20' }}>
                          <Icon size={16} style={{ color: asset.color }} />
                        </div>
                        <span className="font-medium text-slate-800 truncate max-w-xs">{asset.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${meta.color}`}>{meta.label}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{asset.size}</td>
                    <td className="py-3 px-4 text-slate-500">{formatDate(asset.date)}</td>
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
    </div>
  )
}

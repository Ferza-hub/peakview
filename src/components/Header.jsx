import { Bell, Search, Plus } from 'lucide-react'

export default function Header({ title, subtitle }) {
  return (
    <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between shrink-0">
      <div>
        <h1 className="text-xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search…"
            className="pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 w-52 transition-all"
          />
        </div>
        <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full"></span>
        </button>
        <button className="btn-primary">
          <Plus size={16} />
          <span className="hidden sm:inline">New Content</span>
        </button>
      </div>
    </header>
  )
}

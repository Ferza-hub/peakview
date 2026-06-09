import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

export default function ConfirmDialog({ title, message, confirmLabel = 'Delete', danger = true, onConfirm, onCancel }) {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onCancel(); if (e.key === 'Enter') onConfirm() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onConfirm, onCancel])

  return (
    <div className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#161616] border border-[#2A2A2A] rounded-2xl shadow-2xl p-6 w-80 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          {danger && (
            <div className="w-9 h-9 rounded-xl bg-red-950/60 border border-red-800/40 flex items-center justify-center shrink-0">
              <AlertTriangle size={16} className="text-red-400" />
            </div>
          )}
          <div>
            <p className="font-semibold text-zinc-100 mb-1">{title}</p>
            <p className="text-sm text-zinc-400 leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="btn-ghost">Cancel</button>
          <button onClick={onConfirm} autoFocus
            className={`btn ${danger ? 'bg-red-700 hover:bg-red-600 text-white' : 'btn-accent'}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

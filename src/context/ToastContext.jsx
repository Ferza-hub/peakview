import { createContext, useContext, useState, useCallback } from 'react'
import { genId } from '../utils/helpers'

const Ctx = createContext(null)
export const useToast = () => useContext(Ctx)

const STYLES = {
  success: 'border-emerald-600/50 bg-emerald-950/90 text-emerald-300',
  error:   'border-red-600/50    bg-red-950/90    text-red-300',
  info:    'border-violet-600/50 bg-violet-950/90 text-violet-300',
  warning: 'border-amber-600/50  bg-amber-950/90  text-amber-300',
}

function Toast({ t, onClose }) {
  return (
    <div className={`flex items-center gap-2.5 min-w-[220px] max-w-xs px-3.5 py-2.5 rounded-xl border shadow-2xl text-xs font-medium ${STYLES[t.type]}`}>
      <span className="flex-1 leading-snug">{t.msg}</span>
      <button onClick={() => onClose(t.id)} className="opacity-50 hover:opacity-100 transition-opacity shrink-0 text-sm leading-none">✕</button>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const add = useCallback((msg, type = 'info') => {
    const id = genId()
    setToasts(prev => [...prev.slice(-4), { id, msg, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }, [])

  const remove = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), [])

  return (
    <Ctx.Provider value={{ add }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto">
            <Toast t={t} onClose={remove} />
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}

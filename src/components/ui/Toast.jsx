import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'

const ToastContext = createContext(null)

const TOAST_CONFIG = {
  success: {
    icon: CheckCircle,
    border: 'border-l-emerald-500',
    iconColor: 'text-emerald-500',
    bg: 'bg-white',
  },
  error: {
    icon: XCircle,
    border: 'border-l-red-500',
    iconColor: 'text-red-500',
    bg: 'bg-white',
  },
  info: {
    icon: Info,
    border: 'border-l-violet-500',
    iconColor: 'text-violet-500',
    bg: 'bg-white',
  },
  warning: {
    icon: AlertTriangle,
    border: 'border-l-amber-500',
    iconColor: 'text-amber-500',
    bg: 'bg-white',
  },
}

function ToastItem({ toast, onRemove }) {
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const timerRef = useRef(null)

  const dismiss = useCallback(() => {
    setLeaving(true)
    setTimeout(() => onRemove(toast.id), 300)
  }, [toast.id, onRemove])

  useEffect(() => {
    const enterFrame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true))
    })
    timerRef.current = setTimeout(dismiss, 4000)
    return () => {
      cancelAnimationFrame(enterFrame)
      clearTimeout(timerRef.current)
    }
  }, [dismiss])

  const config = TOAST_CONFIG[toast.type] || TOAST_CONFIG.info
  const Icon = config.icon

  return (
    <div
      style={{
        transform: visible && !leaving ? 'translateX(0)' : 'translateX(calc(100% + 1.5rem))',
        opacity: visible && !leaving ? 1 : 0,
        transition: 'transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 300ms ease',
      }}
      className={`flex items-start gap-3 w-80 ${config.bg} rounded-xl shadow-lg border border-slate-100 border-l-4 ${config.border} px-4 py-3.5 pointer-events-auto`}
    >
      <Icon size={18} className={`shrink-0 mt-0.5 ${config.iconColor}`} />
      <p className="flex-1 text-sm font-medium text-slate-800 leading-snug">{toast.message}</p>
      <button
        onClick={dismiss}
        className="shrink-0 p-0.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const add = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random()
    setToasts(prev => {
      const next = [{ id, message, type }, ...prev]
      return next.slice(0, 4)
    })
  }, [])

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ add }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col-reverse gap-2.5 pointer-events-none">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onRemove={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}

import { useState, useEffect, createContext, useContext, useCallback } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)
  const [visible, setVisible] = useState(false)

  const showToast = useCallback((message) => {
    setToast(message)
    setVisible(true)
    const timer = setTimeout(() => setVisible(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 pointer-events-none ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
        }`}
      >
        <div className="bg-white/15 backdrop-blur-xl border border-white/25 text-white text-sm font-semibold px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 whitespace-nowrap">
          <span className="w-5 h-5 rounded-full bg-green-400/80 flex items-center justify-center text-xs flex-shrink-0">✓</span>
          {toast}
        </div>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be inside ToastProvider')
  return ctx
}

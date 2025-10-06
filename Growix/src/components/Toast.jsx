import { createContext, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

export function useToast(){return useContext(ToastContext)}

export default function ToastProvider({ children }){
  const [toasts, setToasts] = useState([])
  const show = (msg, type='info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((t)=>[...t, { id, msg, type }])
    setTimeout(()=> setToasts((t)=> t.filter(x=>x.id!==id)), 3000)
  }
  const value = useMemo(()=>({ show }),[])
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 grid gap-2 z-50">
        {toasts.map(t => (
          <div key={t.id} className={`px-4 py-2 rounded-xl shadow-cozy ${t.type==='error'?'bg-red-500 text-white':'bg-dusk text-white'}`}>{t.msg}</div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}



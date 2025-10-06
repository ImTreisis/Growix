import { useState } from 'react'
import { useAuth } from '../state/AuthContext.jsx'

function IconPin(props){return (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"/>
  </svg>
)}
function IconCalendar(props){return (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M7 2h2v2h6V2h2v2h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3V2Zm14 18V9H3v11h18Z"/>
  </svg>
)}
function IconUser(props){return (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-5 0-9 2.5-9 5.5V22h18v-2.5C21 16.5 17 14 12 14Z"/>
  </svg>
)}

export default function SeminarCard({ item }){
  const { api, user } = useAuth()
  const [saved, setSaved] = useState(false)

  const dateStr = new Date(item.date).toLocaleString()
  const styleLabel = item.style?.charAt(0).toUpperCase() + item.style?.slice(1)
  const levelLabel = item.level?.charAt(0).toUpperCase() + item.level?.slice(1)

  const saveToggle = async ()=>{
    if(!user) return
    const r = await api.post(`/seminars/${item._id}/save`)
    setSaved(r.data.saved)
  }

  return (
    <article className="cozy-card overflow-hidden">
      <div className="aspect-[16/9] bg-black/5">
        <img
          src={item.imageUrl || 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1600&auto=format&fit=crop'}
          alt={item.title}
          className="w-full h-full object-cover opacity-90"
        />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 text-cocoa/80 text-sm">
          <IconPin className="opacity-70" />
          <span>{item.venue || item.createdBy?.username || 'Studio'}</span>
        </div>
        <h3 className="mt-2 text-xl font-semibold text-dusk">{item.title}</h3>
        <div className="mt-2 flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-warm2 text-cocoa text-sm">{styleLabel}</span>
          <span className="px-3 py-1 rounded-full bg-warm3 text-dusk text-sm">{levelLabel}</span>
        </div>
        <div className="mt-4 grid gap-2 text-sm text-cocoa">
          <div className="flex items-center gap-2"><IconCalendar className="opacity-70" /><span>{dateStr}</span></div>
          <div className="flex items-center gap-2"><IconUser className="opacity-70" /><span>{item.createdBy?.username || 'Organizer'}</span></div>
        </div>
        <div className="mt-5 flex items-center gap-3">
          <button onClick={saveToggle} className={`px-4 py-2 rounded-xl ${saved? 'bg-warm2' : 'bg-warm3'} text-dusk`}>{saved? 'Saved' : 'Save Seminar'}</button>
          <button className="px-4 py-2 rounded-xl border border-warm3 text-cocoa">View Details</button>
        </div>
      </div>
    </article>
  )
}




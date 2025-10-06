import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'
import { useToast } from '../components/Toast.jsx'

export default function Detail(){
  const { id } = useParams()
  const { api, user } = useAuth()
  const { show } = useToast()
  const [item, setItem] = useState(null)
  const [likes, setLikes] = useState(0)
  const [saving, setSaving] = useState(false)

  useEffect(()=>{ api.get(`/seminars/${id}`).then(r=>{ setItem(r.data.seminar); setLikes(r.data.seminar.likes?.length||0)}) }, [id])

  if(!item) return null
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="cozy-card overflow-hidden">
        <img src={item.imageUrl || 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1600&auto=format&fit=crop'} alt={item.title} className="w-full h-[360px] object-cover"/>
      </div>
      <div className="cozy-card p-6">
        <h1 className="text-2xl font-semibold text-dusk">{item.title}</h1>
        <p className="text-cocoa/80">{new Date(item.date).toLocaleString()} • {item.style} • {item.level}</p>
        <p className="mt-3 text-cocoa">{item.description}</p>
        <div className="mt-5 flex items-center gap-3">
          <button onClick={async()=>{ const r = await api.post(`/seminars/${id}/like`); setLikes(r.data.likes)}} className="px-4 py-2 rounded-xl bg-warm3">Like ({likes})</button>
          {user && <button disabled={saving} onClick={async()=>{ setSaving(true); await api.post(`/seminars/${id}/save`).catch(()=>{}); setSaving(false); show('Saved to profile')} } className="px-4 py-2 rounded-xl border">Save</button>}
        </div>
      </div>
    </div>
  )
}



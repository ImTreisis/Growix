import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'
import { useToast } from '../components/Toast.jsx'

export default function Detail(){
  const { id } = useParams()
  const { api, user } = useAuth()
  const { show } = useToast()
  const [item, setItem] = useState(null)
  const [savedCount, setSavedCount] = useState(0)
  const [saving, setSaving] = useState(false)

  useEffect(()=>{ api.get(`/seminars/${id}`).then(r=>{ setItem(r.data.seminar); setSavedCount(r.data.savedCount||0)}) }, [api, id])

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
        {item.link && (
          <p className="mt-3"><a href={item.link} target="_blank" rel="noreferrer" className="text-dusk underline">Open link</a></p>
        )}
        <div className="mt-5 flex items-center gap-3">
          <span className="px-4 py-2 rounded-xl bg-warm2 text-dusk">Saved ({savedCount})</span>
          {user && String(user._id)===String(item.createdBy?._id||item.createdBy) && (
            <Link to={`/detail/${item._id}/edit`} className="px-4 py-2 rounded-xl border">Edit</Link>
          )}
        </div>
      </div>
    </div>
  )
}



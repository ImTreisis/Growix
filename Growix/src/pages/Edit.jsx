import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'
import { useToast } from '../components/Toast.jsx'

export default function Edit(){
  const { id } = useParams()
  const { api, user } = useAuth()
  const { show } = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ title:'', description:'', date:'', style:'salsa', level:'beginner', venue:'', link:'', imageUrl:'' })
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    api.get(`/seminars/${id}`).then(r=>{
      const s = r.data.seminar
      if(String(s.createdBy?._id||s.createdBy)!==String(user?._id)){
        navigate('/workshops', { replace:true })
        return
      }
      setForm({ title:s.title, description:s.description||'', date: new Date(s.date).toISOString().slice(0,16), style:s.style, level:s.level, venue:s.venue||'', link:s.link||'', imageUrl:s.imageUrl||'' })
      setLoading(false)
    })
  }, [api, id, user, navigate])

  const submit = async (e)=>{
    e.preventDefault()
    try{
      await api.put(`/seminars/${id}`, { ...form, date: form.date })
      show('Seminar updated')
      navigate(`/detail/${id}`)
    }catch(_){ show('Update failed', 'error') }
  }

  if(loading) return null
  return (
    <form onSubmit={submit} className="cozy-card p-6 grid gap-3 max-w-xl">
      <h2 className="text-xl font-semibold text-dusk">Edit workshop</h2>
      <input required value={form.title} onChange={(e)=>setForm({...form, title:e.target.value})} placeholder="Title" className="px-3 py-2 rounded-xl border" />
      <textarea value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} placeholder="Description" className="px-3 py-2 rounded-xl border" />
      <input required type="datetime-local" value={form.date} onChange={(e)=>setForm({...form, date:e.target.value})} className="px-3 py-2 rounded-xl border" />
      <input value={form.venue} onChange={(e)=>setForm({...form, venue:e.target.value})} placeholder="Venue (optional)" className="px-3 py-2 rounded-xl border" />
      <div className="grid grid-cols-2 gap-3">
        <select value={form.style} onChange={(e)=>setForm({...form, style:e.target.value})} className="px-3 py-2 rounded-xl border">
          <option value="salsa">Salsa</option>
          <option value="tango">Tango</option>
          <option value="bachata">Bachata</option>
          <option value="kizomba">Kizomba</option>
          <option value="other">Other</option>
        </select>
        <select value={form.level} onChange={(e)=>setForm({...form, level:e.target.value})} className="px-3 py-2 rounded-xl border">
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>
      <input value={form.link} onChange={(e)=>setForm({...form, link:e.target.value})} placeholder="Link (optional) e.g. Zoom" className="px-3 py-2 rounded-xl border" />
      <button className="px-4 py-2 bg-dusk text-white rounded-xl">Save changes</button>
    </form>
  )
}



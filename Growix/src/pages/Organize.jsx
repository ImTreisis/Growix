import { useEffect, useState } from 'react'
import { useAuth } from '../state/AuthContext.jsx'
import { useToast } from '../components/Toast.jsx'

export default function Organize() {
  const { api } = useAuth()
  const { show } = useToast()
  const [form, setForm] = useState({ title:'', description:'', date:'', style:'salsa', level:'beginner', venue:'', image: null })
  const [message, setMessage] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    try {
      if (form.image) {
        const fd = new FormData()
        Object.entries(form).forEach(([k,v])=>{ if(k==='image'){ fd.append('image', v) } else { fd.append(k, v) } })
        const r = await api.post('/seminars/with-image', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        setMessage(`Created: ${r.data.seminar.title}`)
      } else {
        const r = await api.post('/seminars', form)
        setMessage(`Created: ${r.data.seminar.title}`)
      }
      setForm({ title:'', description:'', date:'', style:'salsa', level:'beginner', venue:'', image:null })
      show('Seminar created')
    } catch (e) {
      show('Failed to create seminar', 'error')
    }
  }

  return (
    <form onSubmit={submit} className="cozy-card p-6 grid gap-3 max-w-xl">
      <h2 className="text-xl font-semibold text-dusk">Organize a seminar</h2>
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
      <div className="grid gap-2">
        <input type="file" accept="image/*" onChange={(e)=>setForm({...form, image: e.target.files?.[0]||null})} className="px-3 py-2 rounded-xl border" />
        <button className="px-4 py-2 bg-dusk text-white rounded-xl">Create</button>
      </div>
      {message && <p className="text-cocoa">{message}</p>}
    </form>
  )
}



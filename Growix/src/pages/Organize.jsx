import { useEffect, useState } from 'react'
import { useAuth } from '../state/AuthContext.jsx'

export default function Organize() {
  const { api } = useAuth()
  const [form, setForm] = useState({ title:'', description:'', date:'', style:'salsa', level:'beginner' })
  const [message, setMessage] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    const r = await api.post('/seminars', form)
    setMessage(`Created: ${r.data.seminar.title}`)
    setForm({ title:'', description:'', date:'', style:'salsa', level:'beginner' })
  }

  return (
    <form onSubmit={submit} className="cozy-card p-6 grid gap-3 max-w-xl">
      <h2 className="text-xl font-semibold text-dusk">Organize a seminar</h2>
      <input required value={form.title} onChange={(e)=>setForm({...form, title:e.target.value})} placeholder="Title" className="px-3 py-2 rounded-xl border" />
      <textarea value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} placeholder="Description" className="px-3 py-2 rounded-xl border" />
      <input required type="datetime-local" value={form.date} onChange={(e)=>setForm({...form, date:e.target.value})} className="px-3 py-2 rounded-xl border" />
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
      <button className="px-4 py-2 bg-dusk text-white rounded-xl">Create</button>
      {message && <p className="text-cocoa">{message}</p>}
    </form>
  )
}



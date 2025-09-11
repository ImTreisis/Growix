import { useRef, useState } from 'react'
import { useAuth } from '../state/AuthContext.jsx'

export default function Profile() {
  const { api, user, setUser } = useAuth()
  const [form, setForm] = useState({ firstName: user?.firstName||'', lastName: user?.lastName||'', bio: user?.bio||'', username: user?.username||'' })
  const fileRef = useRef(null)

  const save = async (e) => {
    e.preventDefault()
    const r = await api.put('/users/me', form)
    setUser(r.data.user)
  }

  const upload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const fd = new FormData()
    fd.append('photo', file)
    const r = await api.post('/users/me/photo', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    setUser(r.data.user)
  }

  if (!user) return null
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <aside className="cozy-card p-4 flex flex-col items-center gap-3">
        <img src={user.photoUrl || 'https://placehold.co/200x200?text=Photo'} alt="profile" className="w-32 h-32 rounded-full object-cover" />
        <button onClick={()=>fileRef.current?.click()} className="px-3 py-2 rounded-xl bg-warm3/70">Upload Photo</button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={upload} />
      </aside>
      <form onSubmit={save} className="md:col-span-2 cozy-card p-6 grid gap-3">
        <h2 className="text-xl font-semibold text-dusk">Profile</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <input value={form.firstName} onChange={(e)=>setForm({...form, firstName:e.target.value})} placeholder="First name" className="px-3 py-2 rounded-xl border" />
          <input value={form.lastName} onChange={(e)=>setForm({...form, lastName:e.target.value})} placeholder="Last name" className="px-3 py-2 rounded-xl border" />
        </div>
        <input value={form.username} onChange={(e)=>setForm({...form, username:e.target.value})} placeholder="Username" className="px-3 py-2 rounded-xl border" />
        <textarea value={form.bio} onChange={(e)=>setForm({...form, bio:e.target.value})} placeholder="Short bio" className="px-3 py-2 rounded-xl border" />
        <button className="px-4 py-2 bg-dusk text-white rounded-xl">Save</button>
      </form>
    </div>
  )
}



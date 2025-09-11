import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'

export default function Auth() {
  const { api, setToken, setUser } = useAuth()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ emailOrUsername:'', email:'', username:'', password:'', firstName:'', lastName:'' })
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    let r
    if (mode === 'login') {
      r = await api.post('/auth/login', { emailOrUsername: form.emailOrUsername, password: form.password })
    } else {
      r = await api.post('/auth/register', { email: form.email, username: form.username, password: form.password, firstName: form.firstName, lastName: form.lastName })
    }
    setToken(r.data.token)
    setUser(r.data.user)
    navigate('/')
  }

  return (
    <div className="max-w-md mx-auto cozy-card p-6 grid gap-3">
      <div className="flex gap-3">
        <button onClick={()=>setMode('login')} className={`px-3 py-2 rounded-xl ${mode==='login'?'bg-warm3/70':''}`}>Login</button>
        <button onClick={()=>setMode('register')} className={`px-3 py-2 rounded-xl ${mode==='register'?'bg-warm3/70':''}`}>Register</button>
      </div>
      <form onSubmit={submit} className="grid gap-3">
        {mode==='login' ? (
          <>
            <input required placeholder="Email or Username" value={form.emailOrUsername} onChange={(e)=>setForm({...form, emailOrUsername:e.target.value})} className="px-3 py-2 rounded-xl border" />
            <input required type="password" placeholder="Password" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} className="px-3 py-2 rounded-xl border" />
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="First name" value={form.firstName} onChange={(e)=>setForm({...form, firstName:e.target.value})} className="px-3 py-2 rounded-xl border" />
              <input placeholder="Last name" value={form.lastName} onChange={(e)=>setForm({...form, lastName:e.target.value})} className="px-3 py-2 rounded-xl border" />
            </div>
            <input required placeholder="Email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} className="px-3 py-2 rounded-xl border" />
            <input required placeholder="Username" value={form.username} onChange={(e)=>setForm({...form, username:e.target.value})} className="px-3 py-2 rounded-xl border" />
            <input required type="password" placeholder="Password" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} className="px-3 py-2 rounded-xl border" />
          </>
        )}
        <button className="px-4 py-2 bg-dusk text-white rounded-xl">{mode==='login' ? 'Login' : 'Create account'}</button>
      </form>
    </div>
  )
}



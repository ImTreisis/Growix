import { useEffect, useState } from 'react'
import { useAuth } from '../state/AuthContext.jsx'

export default function Saved() {
  const { api } = useAuth()
  const [user, setUser] = useState(null)

  useEffect(() => {
    api.get('/users/me').then((r)=> setUser(r.data.user))
  }, [])

  if (!user) return null
  return (
    <div className="grid gap-4">
      {user.savedSeminars?.map((s) => (
        <article key={s._id} className="cozy-card p-4">
          <h3 className="text-lg font-semibold text-dusk">{s.title}</h3>
          <p className="text-sm text-cocoa/80">{new Date(s.date).toLocaleString()} • {s.style} • {s.level}</p>
        </article>
      ))}
      {user.savedSeminars?.length === 0 && <p className="text-cocoa">No saved seminars yet.</p>}
    </div>
  )
}



import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'
import SeminarCard from '../components/SeminarCard.jsx'

export default function Browse() {
  const { api, user } = useAuth()
  const [params, setParams] = useSearchParams()
  const [items, setItems] = useState([])
  const navigate = useNavigate()

  const query = useMemo(() => ({
    q: params.get('q') || undefined,
    style: params.get('style') || undefined,
    level: params.get('level') || undefined,
    date: params.get('date') || undefined,
  }), [params])

  const tab = useMemo(() => params.get('tab') || '', [params])
  const userId = user?._id ? String(user._id) : ''

  useEffect(() => {
    if ((tab === 'liked' || tab === 'organized') && !user) {
      navigate('/auth', { replace: true })
      return
    }
    if (tab === 'liked' && user) {
      api.get('/seminars').then((r)=>{
        // show saved seminars as "Liked"
        const savedIds = new Set((user.savedSeminars||[]).map(s=> String(s?._id||s)))
        const likedList = r.data.seminars.filter(s=> savedIds.has(String(s._id)))
        setItems(likedList)
      })
    } else if (tab === 'organized' && user) {
      api.get('/seminars').then((r)=>{
        const all = r.data.seminars
        const mine = all.filter(s=> String(s.createdBy?._id ?? s.createdBy) === String(user._id))
        setItems(mine)
      })
    } else {
      api.get('/seminars', { params: query }).then((r)=> setItems(r.data.seminars))
    }
  }, [api, query, tab, userId, user, navigate])

  return (
    <div>
      <div className="mb-6 grid md:grid-cols-3 gap-6">
        <div>
          <p className="text-sm text-cocoa/80 mb-1">Location</p>
          <select defaultValue={params.get('loc')||''} onChange={(e)=>{e.target.value?params.set('loc', e.target.value):params.delete('loc'); setParams(params)}} className="w-full px-3 py-2 rounded-xl border">
            <option value="">All Locations</option>
            <option value="studio">Downtown Dance Studio</option>
          </select>
        </div>
        <div>
          <p className="text-sm text-cocoa/80 mb-1">Dance Style</p>
          <select defaultValue={params.get('style')||''} onChange={(e)=>{e.target.value?params.set('style', e.target.value):params.delete('style'); setParams(params)}} className="w-full px-3 py-2 rounded-xl border">
            <option value="">All Styles</option>
            <option value="contemporary">Contemporary</option>
            <option value="salsa">Salsa</option>
            <option value="tango">Tango</option>
            <option value="bachata">Bachata</option>
          </select>
        </div>
        <div>
          <p className="text-sm text-cocoa/80 mb-1">Skill Level</p>
          <select defaultValue={params.get('level')||''} onChange={(e)=>{e.target.value?params.set('level', e.target.value):params.delete('level'); setParams(params)}} className="w-full px-3 py-2 rounded-xl border">
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((s)=> (
          <a key={s._id} href={`/detail/${s._id}`}><SeminarCard item={s} /></a>
        ))}
      </div>
    </div>
  )
}



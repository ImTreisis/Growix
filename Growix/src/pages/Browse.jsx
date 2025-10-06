import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'
import SeminarCard from '../components/SeminarCard.jsx'

export default function Browse() {
  const { api, user } = useAuth()
  const [params, setParams] = useSearchParams()
  const [items, setItems] = useState([])

  const query = useMemo(() => ({
    q: params.get('q') || undefined,
    style: params.get('style') || undefined,
    level: params.get('level') || undefined,
    date: params.get('date') || undefined,
  }), [params])

  useEffect(() => {
    api.get('/seminars', { params: query }).then((r)=> setItems(r.data.seminars))
  }, [JSON.stringify(query)])

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



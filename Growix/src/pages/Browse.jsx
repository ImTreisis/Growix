import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <aside className="md:col-span-1 cozy-card p-4">
        <div className="grid gap-3">
          <input defaultValue={params.get('q')||''} onBlur={(e)=>{params.set('q', e.target.value); setParams(params)}} placeholder="Search" className="px-3 py-2 rounded-xl border"/>
          <select defaultValue={params.get('style')||''} onChange={(e)=>{e.target.value?params.set('style', e.target.value):params.delete('style'); setParams(params)}} className="px-3 py-2 rounded-xl border">
            <option value="">All styles</option>
            <option value="salsa">Salsa</option>
            <option value="tango">Tango</option>
            <option value="bachata">Bachata</option>
            <option value="kizomba">Kizomba</option>
            <option value="other">Other</option>
          </select>
          <select defaultValue={params.get('level')||''} onChange={(e)=>{e.target.value?params.set('level', e.target.value):params.delete('level'); setParams(params)}} className="px-3 py-2 rounded-xl border">
            <option value="">All levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <input type="date" defaultValue={params.get('date')||''} onChange={(e)=>{e.target.value?params.set('date', e.target.value):params.delete('date'); setParams(params)}} className="px-3 py-2 rounded-xl border" />
        </div>
      </aside>
      <section className="md:col-span-2 grid gap-4">
        {items.map(s => (
          <article key={s._id} className="cozy-card p-4 flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-dusk">{s.title}</h3>
              <p className="text-sm text-cocoa/80">{new Date(s.date).toLocaleString()} • {s.style} • {s.level}</p>
              <p className="mt-2 text-sm text-cocoa">{s.description}</p>
            </div>
            <div className="flex gap-2 items-center">
              <Link to={`/organize?id=${s._id}`} className="px-3 py-2 rounded-xl bg-warm3/70">Details</Link>
              {user && <SaveButton id={s._id} />}
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}

function SaveButton({ id }) {
  const { api } = useAuth()
  const [saved, setSaved] = useState(false)
  return (
    <button onClick={async()=>{const r = await api.post(`/seminars/${id}/save`); setSaved(r.data.saved)}} className={`px-3 py-2 rounded-xl ${saved? 'bg-warm2' : 'bg-warm3/70'}`}>{saved? 'Saved' : 'Save'}</button>
  )
}



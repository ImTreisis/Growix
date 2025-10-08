import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'
import SeminarCard from '../components/SeminarCard.jsx'

export default function Browse() {
  const { api, user } = useAuth()
  const [params, setParams] = useSearchParams()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const query = useMemo(() => ({
    q: params.get('q') || undefined,
    style: params.get('style') || undefined,
    level: params.get('level') || undefined,
    date: params.get('date') || undefined,
  }), [params])

  const tab = useMemo(() => params.get('tab') || '', [params])

  useEffect(() => {
    if ((tab === 'liked' || tab === 'organized') && !user) {
      navigate('/auth', { replace: true })
      return
    }
    
    const loadSeminars = async () => {
      setLoading(true)
      try {
        if (tab === 'liked' && user) {
          // For now, fetch all and filter client-side since we don't have a server endpoint for saved seminars
          const r = await api.get('/seminars', { params: { limit: 100, offset: 0 } })
          const savedIds = new Set((user.savedSeminars||[]).map(s=> String(s?._id||s)))
          const likedList = r.data.seminars.filter(s=> savedIds.has(String(s._id)))
          setItems(likedList)
        } else if (tab === 'organized' && user) {
          // For now, fetch all and filter client-side since we don't have a server endpoint for user's seminars
          const r = await api.get('/seminars', { params: { limit: 100, offset: 0 } })
          const all = r.data.seminars
          const mine = all.filter(s=> String(s.createdBy?._id ?? s.createdBy) === String(user._id))
          setItems(mine)
        } else {
          const r = await api.get('/seminars', { params: { ...query, limit: 20, offset: 0 } })
          setItems(r.data.seminars)
        }
      } catch (err) {
        console.error('Failed to load seminars:', err)
        setItems([])
      } finally {
        setLoading(false)
      }
    }

    loadSeminars()
  }, [api, query, tab, user, navigate])

  const EmptyState = ({ message, action }) => (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">🎭</div>
      <h3 className="text-xl font-semibold text-dusk mb-2">No workshops found</h3>
      <p className="text-cocoa/80 mb-4">{message}</p>
      {action}
    </div>
  )

  const LoadingSkeleton = () => (
    <div className="text-center py-8">
      <div className="text-2xl mb-2">⏳</div>
      <p className="text-cocoa/80">Loading workshops...</p>
    </div>
  )

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

      {loading && items.length === 0 ? (
        <LoadingSkeleton />
      ) : items.length === 0 ? (
        <EmptyState 
          message={
            tab === 'liked' ? "You haven't saved any workshops yet. Start exploring!" :
            tab === 'organized' ? "You haven't created any workshops yet. Share your passion!" :
            "No workshops match your current filters. Try adjusting your search."
          }
          action={
            tab === 'organized' ? (
              <a href="/create" className="px-4 py-2 bg-dusk text-white rounded-xl">Create Workshop</a>
            ) : (
              <button onClick={() => { params.delete('q'); params.delete('style'); params.delete('level'); setParams(params) }} className="px-4 py-2 bg-warm3 rounded-xl">Clear Filters</button>
            )
          }
        />
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-3">
            {items.map((s)=> (
              <a key={s._id} href={`/detail/${s._id}`}><SeminarCard item={s} /></a>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
import { useState } from 'react'
import { useAuth } from '../state/AuthContext.jsx'

function formatLocalDateTime(value){
  if(!value) return ''
  try{
    let base = typeof value === 'string' ? value.trim() : String(value)
    if(!base) return ''
    if(base.includes('.')) base = base.split('.')[0]
    if(base.endsWith('Z')) base = base.slice(0, -1)
    if(base.length > 16) base = base.slice(0, 16)
    if(!base.includes('T')) return base
    const [datePart, timePart = ''] = base.split('T')
    const [year, month, day] = datePart.split('-').map(Number)
    const [hourStr = '00', minuteStr = '00'] = timePart.split(':')
    if([year, month, day].some((n)=>Number.isNaN(n))) return base
    const hour = Number.parseInt(hourStr, 10)
    const minute = Number.parseInt(minuteStr, 10)
    const dateObj = new Date(Date.UTC(year, (month||1)-1, day || 1, Number.isNaN(hour)?0:hour, Number.isNaN(minute)?0:minute))
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC'
    }).format(dateObj)
  }catch(err){
    console.warn('Failed to format seminar date', err)
    return value
  }
}

function formatSeminarDate(localDateTime, fallbackDate){
  const label = formatLocalDateTime(localDateTime)
  if(label) return label
  return formatLocalDateTime(fallbackDate)
}

function IconPin(props){return (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"/>
  </svg>
)}
function IconCalendar(props){return (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M7 2h2v2h6V2h2v2h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3V2Zm14 18V9H3v11h18Z"/>
  </svg>
)}


function IconHeart(props){return (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M12 21s-6.716-4.716-9.172-7.172A5.657 5.657 0 1 1 11.314 5.34L12 6.025l.686-.686a5.657 5.657 0 1 1 8 8C18.716 16.284 12 21 12 21Z"/>
  </svg>
)}

export default function SeminarCard({ item }){
  const { api, user, setUser } = useAuth()
  const [saved, setSaved] = useState(() => Boolean(user?.savedSeminars?.some(s=> String(s?._id||s)===String(item._id))))
  const [isSaving, setIsSaving] = useState(false)

  const dateStr = formatSeminarDate(item.localDateTime, item.date)
  const isWorkshop = item.type === 'workshop' || (!item.type && item.style && item.level)
  const styleLabel = item.style?.charAt(0).toUpperCase() + item.style?.slice(1)
  const levelLabel = item.level?.charAt(0).toUpperCase() + item.level?.slice(1)

  const saveToggle = async ()=>{
    if(!user){ window.location.href = '/auth'; return }
    if(isSaving) return; // Prevent spam clicking
    
    setIsSaving(true);
    try {
      const r = await api.post(`/seminars/${item._id}/save`)
      setSaved(r.data.saved)
      // sync saved list in user context for consistency across views
      const me = await api.get('/users/me')
      setUser(me.data.user)
    } catch (err) {
      console.error('Failed to save seminar:', err)
    } finally {
      // Add 500ms debounce delay
      setTimeout(() => setIsSaving(false), 500);
    }
  }

  return (
    <article className="cozy-card overflow-hidden">
      <div className="relative aspect-[16/9] bg-black/5">
        <a href={`/detail/${item._id}`} className="absolute inset-0 z-[1]" aria-label={`Open ${item.title}`}></a>
        <img
          src={item.imageUrl || 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1600&auto=format&fit=crop'}
          alt={item.title}
          className="w-full h-full object-cover opacity-90"
        />
        {user && (
          <button 
            onClick={(e)=>{ e.stopPropagation(); e.preventDefault(); saveToggle() }} 
            disabled={isSaving}
            className={`absolute top-2 right-2 z-10 p-2 rounded-full ${isSaving ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${saved? 'text-white bg-pink-300 bg-opacity-75' : 'bg-white/90 text-cocoa'} shadow-subtle border border-gray-200`} 
            aria-label={isSaving ? "Saving..." : "Save"}
          >
            <IconHeart />
          </button>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 text-cocoa/80 text-sm">
          <IconPin className="opacity-70" />
          <span>{item.venue || item.createdBy?.username || 'Studio'}</span>
        </div>
        <h3 className="mt-2 text-xl font-semibold text-dusk">{item.title}</h3>
        {item.description && (
          <p className="mt-2 text-sm text-cocoa/80 line-clamp-2">{item.description}</p>
        )}
        {isWorkshop && (
          <div className="mt-2 flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-[#676767] text-sm bg-opacity-55 bg-orange-400" >{styleLabel}</span>
            <span className="px-3 py-1 rounded-full text-[#676767] text-sm bg-opacity-55 bg-orange-600" >{levelLabel}</span>
          </div>
        )}
        <div className="mt-4 grid gap-2 text-sm text-cocoa">
          <div className="flex items-center gap-2"><IconCalendar className="opacity-70" /><span>{dateStr}</span></div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <img 
                src={item.createdBy?.photoUrl || 'https://placehold.co/24x24?text=U'} 
                alt={item.createdBy?.firstName || 'Organizer'} 
                className="w-6 h-6 rounded-full object-cover"
              />
              <a 
                href={`/profile/${item.createdBy?._id}`} 
                className="text-cocoa hover:text-[#df1f66] transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {item.createdBy?.firstName && item.createdBy?.lastName 
                  ? `${item.createdBy.firstName} ${item.createdBy.lastName}`
                  : item.createdBy?.username || 'Organizer'
                }
              </a>
            </div>
          </div>
        </div>
        <div className="mt-5 flex items-center gap-3">
          <a href={`/detail/${item._id}`} className="px-4 py-2 rounded-xl border border-warm3 text-cocoa">View Details</a>
          {item.price && (
            <span className="px-3 py-1 rounded-full text-pink-500 font-semibold bg-pink-100">€{item.price}</span>
          )}
        </div>
      </div>
    </article>
  )
}




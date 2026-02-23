import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'
import { useToast } from '../components/Toast.jsx'

function RegistrationsModal({ seminarId, onClose }) {
  const { api } = useAuth()
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    api.get(`/registrations/seminar/${seminarId}`)
      .then(r => setRegistrations(r.data.registrations || []))
      .catch(() => setRegistrations([]))
      .finally(() => setLoading(false))
  }, [api, seminarId])
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-semibold mb-4">Registered attendees</h2>
        {loading ? (
          <p className="text-cocoa/70">Loading...</p>
        ) : registrations.length === 0 ? (
          <p className="text-cocoa/70">No registrations yet.</p>
        ) : (
          <ul className="overflow-y-auto flex-1 space-y-2">
            {registrations.map(r => (
              <li key={r._id} className="flex flex-col gap-0.5 py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{r.firstName} {r.lastName}</span>
                  {r.user?.email && <span className="text-sm text-cocoa/70">({r.user.email})</span>}
                </div>
                {r.amountCents > 0 && (
                  <span className="text-xs text-cocoa/60">
                    Paid €{(r.amountCents / 100).toFixed(2)}
                    {r.platformFeeCents > 0 && ` (platform fee €${(r.platformFeeCents / 100).toFixed(2)})`}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
        <button onClick={onClose} className="mt-4 px-4 py-2 rounded-xl border">Close</button>
      </div>
    </div>
  )
}

const formatSeminarDate = (localDateTime, fallbackDate) => {
  const formatLocal = (value) => {
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
      console.warn('Failed to format detail date', err)
      return value
    }
  }
  return formatLocal(localDateTime) || formatLocal(fallbackDate)
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
  <svg viewBox="0 0 24 24" width="20" height="20" fill="white" aria-hidden="true" {...props}>
    <path d="M12 21s-6.716-4.716-9.172-7.172A5.657 5.657 0 1 1 11.314 5.34L12 6.025l.686-.686a5.657 5.657 0 1 1 8 8C18.716 16.284 12 21 12 21Z"/>
  </svg>
)}

// Converts URLs inside text into clickable links
function linkify(text) {
  if (!text) return "";
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener" class="text-blue-600 underline">${url}</a>`;
  });
}


export default function Detail(){
  const { id } = useParams()
  const { api, user, setUser } = useAuth()
  const { show } = useToast()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [savedCount, setSavedCount] = useState(0)
  const [isSaved, setIsSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showRegistrations, setShowRegistrations] = useState(false)

  useEffect(() => {
    const fetchSeminar = async () => {
      try {
        const response = await api.get(`/seminars/${id}`);
        const seminar = response.data.seminar;
        setItem(seminar);
        setSavedCount(response.data.savedCount || 0);
        setIsSaved(seminar?.savedBy?.includes(user?._id) || false);
      } catch (error) {
        console.error('Error fetching seminar:', error);
      }
    };

    fetchSeminar();
  }, [api, id, user?._id]);

  const handleSave = async () => {
    if (!user) {
      window.location.href = '/auth';
      return;
    }
    
    // Prevent spam clicking
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      const response = await api.post(`/seminars/${id}/save`);
      setIsSaved(response.data.saved);
      setSavedCount(response.data.savedCount);
      show(response.data.message);
      
      // Sync saved list in user context for consistency across views
      const me = await api.get('/users/me');
      setUser(me.data.user);
    } catch (err) {
      console.error('Failed to save seminar:', err);
      show('Failed to update saved workshops', 'error');
    } finally {
      // Add 500ms debounce delay
      setTimeout(() => setIsSaving(false), 500);
    }
  }

  if(!item) return null

  const dateStr = formatSeminarDate(item.localDateTime, item.date)
  const endDateStr = formatSeminarDate(item.endLocalDateTime, item.endDate)
  const displayStyles = Array.isArray(item.styles) && item.styles.length
    ? item.styles
    : (item.style ? [item.style] : [])
  const isWorkshop = item.type === 'workshop' || (!item.type && (displayStyles.length || item.level))
  const styleLabels = displayStyles.map(s => s?.charAt(0).toUpperCase() + s?.slice(1))
  const levelLabel = item.level?.charAt(0).toUpperCase() + item.level?.slice(1)

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="cozy-card overflow-hidden h-fit">
        <img src={item.imageUrl || 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1600&auto=format&fit=crop'} alt={item.title} className="w-full h-[360px] object-cover"/>
      </div>
      <div className="cozy-card p-6 h-fit">
        <h1 className="text-2xl font-semibold text-dusk mb-4">{item.title}</h1>
        
        {/* Style, Level, Price, and Saved count in a line */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          {isWorkshop && styleLabels.length > 0 && (
            styleLabels.map((label)=>(
              <span key={label} className="px-3 py-1 rounded-full text-[#676767] text-sm bg-opacity-55 bg-orange-400">{label}</span>
            ))
          )}
          {isWorkshop && levelLabel && (
            <span className="px-3 py-1 rounded-full text-[#676767] text-sm bg-opacity-55 bg-orange-600">{levelLabel}</span>
          )}
           <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-white ${isSaved ? 'bg-pink-500' : 'bg-pink-300'} bg-opacity-100`}>
             <button 
               onClick={handleSave}
               disabled={isSaving}
               className={`flex items-center gap-1 transition-transform ${isSaving ? 'cursor-not-allowed opacity-50' : 'hover:scale-105 cursor-pointer'}`}
               title={isSaving ? "Saving..." : (isSaved ? "Remove from saved" : "Save workshop")}
             >
               <IconHeart />
               <span className="text-sm font-bold">{savedCount}</span>
             </button>
           </div>
          {item.price && (
            <span className="px-3 py-1 rounded-full text-pink-500 font-semibold bg-pink-100">€{item.price}</span>
          )}
        </div>

        {/* Location with pin icon */}
        <div className="flex items-center gap-2 text-cocoa/80 text-sm mb-3">
          <IconPin className="opacity-70" />
          <span>{item.venue || 'Studio'}</span>
        </div>

        {/* Date and time with calendar icon */}
        <div className="flex flex-col gap-2 text-cocoa/80 text-sm mb-4">
          <div className="flex items-center gap-2">
            <IconCalendar className="opacity-70" />
            <span><strong>{item.type === 'event' ? 'Starts:' : 'Date:'}</strong> {dateStr}</span>
          </div>
          {item.type === 'event' && endDateStr && (
            <div className="flex items-center gap-2">
              <IconCalendar className="opacity-70" />
              <span><strong>Ends:</strong> {endDateStr}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {item.description && (
          <div
          className="text-black font-poppins text-base leading-relaxed prose whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: linkify(item.description) }}
        />
        
        )}

        {/* Action buttons */}
        <div className="mt-6 flex items-center gap-3 flex-wrap">
          {user && String(user._id)===String(item.createdBy?._id||item.createdBy) && (
            <>
              <Link to={`/detail/${item._id}/edit`} className="px-4 py-2 rounded-xl border">Edit</Link>
              {isWorkshop && (
                <button
                  onClick={() => setShowRegistrations(true)}
                  className="px-4 py-2 rounded-xl border border-pink-300 text-pink-600"
                >
                  View registrations
                </button>
              )}
              <button
                onClick={async()=>{
                  if(!confirm('Delete this workshop? This cannot be undone.')) return
                  try { await api.delete(`/seminars/${item._id}`); show('Workshop deleted'); navigate('/workshops') } catch { show('Delete failed', 'error') }
                }}
                className="px-4 py-2 rounded-xl border border-red-600 text-red-700"
              >Delete</button>
            </>
          )}
        </div>
      </div>
      {showRegistrations && (
        <RegistrationsModal seminarId={item._id} onClose={() => setShowRegistrations(false)} />
      )}
    </div>
  )
}



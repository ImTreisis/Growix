import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'
import { useToast } from '../components/Toast.jsx'

const formatSeminarDate = (date, timeZone) => {
  if(!date) return ''
  const tz = typeof timeZone === 'string' && timeZone.trim() ? timeZone : 'UTC'
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: tz
    }).format(new Date(date))
  } catch (err) {
    console.warn('Failed to format detail date', err)
    return new Date(date).toLocaleString()
  }
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

export default function Detail(){
  const { id } = useParams()
  const { api, user, setUser } = useAuth()
  const { show } = useToast()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [savedCount, setSavedCount] = useState(0)
  const [isSaved, setIsSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

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

  const dateStr = formatSeminarDate(item.date, item.timeZone)
  const styleLabel = item.style?.charAt(0).toUpperCase() + item.style?.slice(1)
  const levelLabel = item.level?.charAt(0).toUpperCase() + item.level?.slice(1)

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="cozy-card overflow-hidden h-fit">
        <img src={item.imageUrl || 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1600&auto=format&fit=crop'} alt={item.title} className="w-full h-[360px] object-cover"/>
      </div>
      <div className="cozy-card p-6 h-fit">
        <h1 className="text-2xl font-semibold text-dusk mb-4">{item.title}</h1>
        
        {/* Style, Level, and Saved count in a line */}
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 rounded-full text-[#676767] text-sm bg-opacity-55 bg-orange-400">{styleLabel}</span>
          <span className="px-3 py-1 rounded-full text-[#676767] text-sm bg-opacity-55 bg-orange-600">{levelLabel}</span>
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
        </div>

        {/* Location with pin icon */}
        <div className="flex items-center gap-2 text-cocoa/80 text-sm mb-3">
          <IconPin className="opacity-70" />
          <span>{item.venue || 'Studio'}</span>
        </div>

        {/* Date and time with calendar icon */}
        <div className="flex items-center gap-2 text-cocoa/80 text-sm mb-4">
          <IconCalendar className="opacity-70" />
          <span>{dateStr}</span>
        </div>

        {/* Description */}
        {item.description && (
          <div className="mt-4">
            <p className="text-black font-poppins text-base leading-relaxed whitespace-pre-wrap">{item.description}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-6 flex items-center gap-3">
          {user && String(user._id)===String(item.createdBy?._id||item.createdBy) && (
            <>
              <Link to={`/detail/${item._id}/edit`} className="px-4 py-2 rounded-xl border">Edit</Link>
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
    </div>
  )
}



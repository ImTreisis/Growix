import { useState } from 'react'
import { useAuth } from '../state/AuthContext.jsx'
import { useToast } from '../components/Toast.jsx'

const getDefaultTimeZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  } catch {
    return 'UTC'
  }
}

export default function OrganizeEvent() {
  const { api } = useAuth()
  const { show } = useToast()
  const [form, setForm] = useState(() => ({
    title:'', 
    description:'', 
    date:'', 
    endDate:'',
    venue:'', 
    image: null,
    timeZone: getDefaultTimeZone()
  }))
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    
    // Prevent duplicate submissions
    if (isSubmitting) return
    
    setIsSubmitting(true)
    try {
      const localDateTime = form.date
      const endLocalDateTime = form.endDate
      if(!localDateTime){
        show('Please choose a start date and time', 'error')
        setIsSubmitting(false)
        return
      }
      if(!endLocalDateTime){
        show('Please choose an end date and time', 'error')
        setIsSubmitting(false)
        return
      }
      const parsedDate = new Date(localDateTime)
      const parsedEndDate = new Date(endLocalDateTime)
      if (Number.isNaN(parsedDate.getTime())) {
        show('Invalid start date/time', 'error')
        setIsSubmitting(false)
        return
      }
      if (Number.isNaN(parsedEndDate.getTime())) {
        show('Invalid end date/time', 'error')
        setIsSubmitting(false)
        return
      }
      if (parsedEndDate < parsedDate) {
        show('End date must be after start date', 'error')
        setIsSubmitting(false)
        return
      }
      const submitData = { ...form, type: 'event' }
      submitData.date = parsedDate.toISOString()
      submitData.endDate = parsedEndDate.toISOString()
      submitData.localDateTime = localDateTime
      submitData.endLocalDateTime = endLocalDateTime
      
      if (form.image) {
        const fd = new FormData()
        Object.entries(submitData).forEach(([k,v])=>{ 
          if(k !== 'image') { 
            fd.append(k, v) 
          } 
        })
        fd.append('image', form.image)
        const r = await api.post('/seminars/with-image', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        setMessage(`Created: ${r.data.seminar.title}`)
      } else {
        const r = await api.post('/seminars', submitData)
        setMessage(`Created: ${r.data.seminar.title}`)
      }
      setForm({ 
        title:'', 
        description:'', 
        date:'', 
        endDate:'',
        venue:'', 
        image:null,
        timeZone: getDefaultTimeZone()
      })
      show('Event created')
    } catch (err) {
      console.error('Failed to create event:', err)
      // Show specific error message from backend
      const errorMessage = err.response?.data?.message || 'Failed to create event'
      show(errorMessage, 'error')
    } finally {
      // Add 500ms delay before allowing another submission
      setTimeout(() => setIsSubmitting(false), 500)
    }
  }

  return (
    <>
      <div className="w-full bg-pink-300 py-4 mb-6 rounded-full">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-black font-poppins text-center ">Event</h1>
        </div>
      </div>
      <div className="flex justify-center">
        <form onSubmit={submit} className="cozy-card p-6 grid gap-4 max-w-xl w-full shadow-subtle">
          <input type="file" accept="image/*" onChange={(e)=>setForm({...form, image: e.target.files?.[0]||null})} className="w-full px-3 py-2 rounded-xl border" />
        
        <input required value={form.title} onChange={(e)=>setForm({...form, title:e.target.value})} placeholder="Title" className="w-full px-3 py-2 rounded-xl border" />
        
        <input required value={form.venue} onChange={(e)=>setForm({...form, venue:e.target.value})} placeholder="Location" className="w-full px-3 py-2 rounded-xl border" />
        
        <label className="text-sm text-cocoa/80">Start Date & Time</label>
        <input required type="datetime-local" value={form.date} onChange={(e)=>setForm({...form, date:e.target.value})} placeholder="Start Date & Time" className="w-full px-3 py-2 rounded-xl border" />
        
        <label className="text-sm text-cocoa/80">End Date & Time</label>
        <input required type="datetime-local" value={form.endDate} onChange={(e)=>setForm({...form, endDate:e.target.value})} placeholder="End Date & Time" className="w-full px-3 py-2 rounded-xl border" />
        
        <textarea value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} placeholder="Description (optional)" className="w-full px-3 py-2 rounded-xl border" rows="3" />
        
        <button 
          disabled={isSubmitting} 
          className={`w-full px-4 py-3 bg-dusk text-white rounded-xl font-medium transition-opacity ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Creating...' : 'Create Event'}
        </button>
        {message && <p className="text-cocoa text-center">{message}</p>}
        </form>
      </div>
    </>
  )
}


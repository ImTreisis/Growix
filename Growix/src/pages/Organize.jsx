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

export default function Organize() {
  const { api } = useAuth()
  const { show } = useToast()
    const [form, setForm] = useState(() => ({
    title:'', 
    description:'', 
    date:'', 
    style:'hip-hop', 
    level:'beginner', 
    venue:'', 
    price:'',
    customStyle:'', 
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
      if(!localDateTime){
        show('Please choose a date and time', 'error')
        setIsSubmitting(false)
        return
      }
      const parsedDate = new Date(localDateTime)
      if (Number.isNaN(parsedDate.getTime())) {
        show('Invalid date/time', 'error')
        setIsSubmitting(false)
        return
      }
      const submitData = { ...form, type: 'workshop' }
      submitData.date = parsedDate.toISOString()
      submitData.localDateTime = localDateTime
      if (form.style === 'custom' && form.customStyle) {
        submitData.style = form.customStyle
      }
      delete submitData.customStyle
      
      if (form.image) {
        const fd = new FormData()
        Object.entries(submitData).forEach(([k,v])=>{ if(k==='image'){ fd.append('image', v) } else { fd.append(k, v) } })
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
        style:'hip-hop', 
        level:'beginner', 
        venue:'', 
        price:'',
        customStyle:'', 
        image:null,
        timeZone: getDefaultTimeZone()
      })
      show('Seminar created')
    } catch (err) {
      console.error('Failed to create seminar:', err)
      // Show specific error message from backend
      const errorMessage = err.response?.data?.message || 'Failed to create seminar'
      show(errorMessage, 'error')
    } finally {
      // Add 500ms delay before allowing another submission
      setTimeout(() => setIsSubmitting(false), 500)
    }
  }

  return (
    <>
      <div className="w-full bg-orange-400 py-4 mb-6">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-black font-poppins text-center">Workshops & Open Classes</h1>
        </div>
      </div>
      <div className="flex justify-center">
        <form onSubmit={submit} className="cozy-card p-6 grid gap-4 max-w-xl w-full shadow-subtle">
          <input type="file" accept="image/*" onChange={(e)=>setForm({...form, image: e.target.files?.[0]||null})} className="w-full px-3 py-2 rounded-xl border" />
          
          <input required value={form.title} onChange={(e)=>setForm({...form, title:e.target.value})} placeholder="Title" className="w-full px-3 py-2 rounded-xl border" />
          
          <input required value={form.venue} onChange={(e)=>setForm({...form, venue:e.target.value})} placeholder="Location" className="w-full px-3 py-2 rounded-xl border" />
          
          <input value={form.price} onChange={(e)=>setForm({...form, price:e.target.value})} placeholder="Price (optional)" className="w-full px-3 py-2 rounded-xl border" />
        
        <input required type="datetime-local" value={form.date} onChange={(e)=>setForm({...form, date:e.target.value})} className="w-full px-3 py-2 rounded-xl border" />
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <select value={form.style} onChange={(e)=>setForm({...form, style:e.target.value})} className="w-full px-3 py-2 rounded-xl border">
              <option value="hip-hop">Hip-Hop</option>
              <option value="breaking">Breaking</option>
              <option value="popping">Popping</option>
              <option value="locking">Locking</option>
              <option value="house">House</option>
              <option value="waacking">Waacking</option>
              <option value="vogue">Vogue</option>
              <option value="dancehall">Dancehall</option>
              <option value="afro">Afro</option>
              <option value="commercial">Commercial</option>
              <option value="twerk">Twerk</option>
              <option value="contemporary">Contemporary</option>
              <option value="jazz">Jazz</option>
              <option value="modern">Modern</option>
              <option value="ballet">Ballet</option>
              <option value="salsa">Salsa</option>
              <option value="bachata">Bachata</option>
              <option value="high-heels">High Heels</option>
              <option value="freestyle">Freestyle</option>
              <option value="custom">Custom Style</option>
            </select>
            {form.style === 'custom' && (
              <input 
                value={form.customStyle} 
                onChange={(e)=>setForm({...form, customStyle:e.target.value})} 
                placeholder="Enter your dance style" 
                className="w-full mt-2 px-3 py-2 rounded-xl border" 
              />
            )}
          </div>
          <select value={form.level} onChange={(e)=>setForm({...form, level:e.target.value})} className="w-full px-3 py-2 rounded-xl border">
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        
        <textarea value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} placeholder="Description (optional)" className="w-full px-3 py-2 rounded-xl border" rows="3" />
        
        <button 
          disabled={isSubmitting} 
          className={`w-full px-4 py-3 bg-dusk text-white rounded-xl font-medium transition-opacity ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Creating...' : 'Create Workshop'}
        </button>
        {message && <p className="text-cocoa text-center">{message}</p>}
        </form>
      </div>
    </>
  )
}



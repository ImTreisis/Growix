import { useState } from 'react'
import { useAuth } from '../state/AuthContext.jsx'
import { useToast } from '../components/Toast.jsx'

const STYLE_OPTIONS = [
  'afro','bachata','ballet','balboa','breaking','charleston','commercial','contemporary','dancehall','freestyle','high-heels','hip-hop','house','jazz','lindy-hop','locking','modern','popping','salsa','shag','solo-jazz','twerk','vogue','waacking'
]

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
    styles: [], 
    level:'beginner', 
    venue:'', 
    price:'',
    customStyle:'', 
    image: null,
    timeZone: getDefaultTimeZone()
  }))
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [styleOpen, setStyleOpen] = useState(false)
  const dynamicStyles = form.styles.filter(s=>!STYLE_OPTIONS.includes(s))
  const renderedOptions = [...STYLE_OPTIONS, ...dynamicStyles]

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
      if (!form.styles.length) {
        show('Please choose at least one style', 'error')
        setIsSubmitting(false)
        return
      }
      const submitData = { ...form, type: 'workshop' }
      submitData.date = parsedDate.toISOString()
      submitData.localDateTime = localDateTime
      submitData.styles = form.styles
      if (form.customStyle && !submitData.styles.includes(form.customStyle.trim())) {
        submitData.styles = [...submitData.styles, form.customStyle.trim()]
      }
      delete submitData.customStyle
      
      if (form.image) {
        const fd = new FormData()
        Object.entries(submitData).forEach(([k,v])=>{ 
          if(k==='image'){ 
            fd.append('image', v) 
          } else if (Array.isArray(v)) {
            v.forEach(val => fd.append(k, val))
          } else { 
            fd.append(k, v) 
          } 
        })
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
        styles:[], 
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
      <div className="w-full bg-orange-300 bg-opacity-75 py-4 mb-6 rounded-full">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-black font-poppins text-center">Workshops & Open Classes</h1>
        </div>
      </div>
      <div className="flex justify-center">
        <form onSubmit={submit} className="cozy-card p-6 grid gap-4 max-w-xl w-full shadow-subtle">
          <input type="file" accept="image/*" onChange={(e)=>setForm({...form, image: e.target.files?.[0]||null})} className="w-full px-3 py-2 rounded-xl border" />
          
          <input required value={form.title} onChange={(e)=>setForm({...form, title:e.target.value})} placeholder="Title" className="w-full px-3 py-2 rounded-xl border" />
          
          <input required value={form.venue} onChange={(e)=>setForm({...form, venue:e.target.value})} placeholder="Location" className="w-full px-3 py-2 rounded-xl border" />
          
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cocoa pointer-events-none">€</span>
            <input value={form.price} onChange={(e)=>setForm({...form, price:e.target.value.replace(/€/g, '').trim()})} placeholder="Price (optional)" className="w-full pl-8 pr-3 py-2 rounded-xl border" />
          </div>
        
        <input required type="datetime-local" value={form.date} onChange={(e)=>setForm({...form, date:e.target.value})} className="w-full px-3 py-2 rounded-xl border" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <p className="text-sm text-cocoa/80 mb-2">Select up to 3 styles</p>
            <button
              type="button"
              onClick={()=>setStyleOpen(v=>!v)}
              className="w-full px-3 py-2 rounded-xl border text-left flex items-center justify-between"
            >
              <span>{form.styles.length ? `${form.styles.length} selected` : 'Choose styles'}</span>
              <span className="text-cocoa/60">{styleOpen ? '▲' : '▼'}</span>
            </button>
              {styleOpen && (
                <div className="absolute z-20 mt-2 w-full max-height-64 max-h-64 overflow-y-auto bg-white border rounded-xl shadow-subtle p-3 space-y-1">
                  {renderedOptions.map((styleVal)=> {
                    const checked = form.styles.includes(styleVal)
                    return (
                      <label key={styleVal} className="flex items-center gap-2 text-sm py-1">
                        <input 
                          type="checkbox" 
                          checked={checked} 
                          onChange={(e)=>{
                            const isChecked = e.target.checked
                            if (isChecked && form.styles.length >= 3) {
                              show('You can pick up to 3 styles', 'error')
                              return
                            }
                            const next = isChecked 
                              ? [...form.styles, styleVal] 
                              : form.styles.filter(s=>s!==styleVal)
                            setForm({...form, styles: next})
                          }}
                        />
                        <span className="capitalize">{styleVal.replace('-', ' ')}</span>
                      </label>
                    )
                  })}
                  <div className="pt-2 border-t mt-2">
                    <p className="text-sm text-cocoa/70 mb-2">Add custom style</p>
                    <div className="flex gap-2">
                      <input 
                        value={form.customStyle} 
                        onChange={(e)=>setForm({...form, customStyle:e.target.value})} 
                        placeholder="Custom style"
                        className="flex-1 px-3 py-2 rounded-xl border" 
                      />
                      <button
                        type="button"
                        className="px-3 py-2 rounded-xl border bg-white hover:bg-gray-50"
                        onClick={()=>{
                          const custom = form.customStyle.trim()
                          if(!custom) return
                          if (form.styles.includes(custom)) return
                          if (form.styles.length >= 3) {
                            show('You can pick up to 3 styles', 'error')
                            return
                          }
                          setForm({...form, styles: [...form.styles, custom], customStyle: ''})
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}
          </div>
          <div>
            <p className="text-sm text-cocoa/80 mb-2">Skill Level</p>
            <select value={form.level} onChange={(e)=>setForm({...form, level:e.target.value})} className="w-full px-3 py-2 rounded-xl border">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="open">Open</option>
            </select>
          </div>
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



import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'
import { useToast } from '../components/Toast.jsx'

const STYLE_OPTIONS = [
  'afro','bachata','ballet','balboa','breaking','charleston','commercial','contemporary','dancehall','freestyle','high-heels','hip-hop','house','jazz','lindy-hop','locking','modern','popping','salsa','shag','solo-jazz','twerk','vogue','waacking'
]

export default function Edit(){
  const { id } = useParams()
  const { api, user } = useAuth()
  const { show } = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ title:'', description:'', date:'', styles:[], level:'beginner', venue:'', price:'', customStyle:'', imageUrl:'', endDate:'', type:'workshop' })
  const [loading, setLoading] = useState(true)
  const [styleOpen, setStyleOpen] = useState(false)
  const dynamicStyles = form.styles.filter(s=>!STYLE_OPTIONS.includes(s))
  const renderedOptions = [...STYLE_OPTIONS, ...dynamicStyles]

  useEffect(()=>{
    api.get(`/seminars/${id}`).then(r=>{
      const s = r.data.seminar
      if(String(s.createdBy?._id||s.createdBy)!==String(user?._id)){
        navigate(s.type === 'event' ? '/events' : '/workshops', { replace:true })
        return
      }
      const resolvedStyles = Array.isArray(s.styles) && s.styles.length ? s.styles : (s.style ? [s.style] : [])
      const isCustomStyle = resolvedStyles.some(val => !STYLE_OPTIONS.includes(val))
      const dateInput = s.localDateTime || new Date(s.date).toISOString().slice(0,16)
      const endDateInput = s.endLocalDateTime || (s.endDate ? new Date(s.endDate).toISOString().slice(0,16) : '')
      setForm({
        title:s.title,
        description:s.description||'',
        date: dateInput,
        styles: resolvedStyles,
        level:s.level||'beginner',
        venue:s.venue||'',
        price:s.price||'',
        customStyle: isCustomStyle ? resolvedStyles.find(val => !STYLE_OPTIONS.includes(val)) || '' : '',
        imageUrl:s.imageUrl||'',
        endDate: endDateInput,
        type: s.type || 'workshop'
      })
      setLoading(false)
    })
  }, [api, id, user, navigate])

  const submit = async (e)=>{
    e.preventDefault()
    try{
      if(!form.date){
        show('Please choose a date and time', 'error')
        return
      }
      const parsedDate = new Date(form.date)
      if(Number.isNaN(parsedDate.getTime())){
        show('Invalid date/time', 'error')
        return
      }
      
      if(form.type === 'event'){
        if(!form.endDate){
          show('Please choose an end date and time', 'error')
          return
        }
        const parsedEndDate = new Date(form.endDate)
        if(Number.isNaN(parsedEndDate.getTime())){
          show('Invalid end date/time', 'error')
          return
        }
        if(parsedEndDate < parsedDate){
          show('End date must be after start date', 'error')
          return
        }
      }
      
      if (form.type === 'workshop' && (!form.styles || form.styles.length === 0)) {
        show('Please choose at least one style', 'error')
        return
      }

      const submitData = { ...form }
      if (form.type === 'workshop') {
        let stylesToSend = Array.isArray(form.styles) ? form.styles : []
        if (form.customStyle) {
          const customTrim = form.customStyle.trim()
          if (customTrim && !stylesToSend.includes(customTrim)) stylesToSend = [...stylesToSend, customTrim]
        }
        submitData.styles = stylesToSend.slice(0,3)
      }
      delete submitData.customStyle
      
      const updateData = {
        ...submitData,
        date: parsedDate.toISOString(),
        localDateTime: form.date
      }
      
      if(form.type === 'event'){
        updateData.endDate = new Date(form.endDate).toISOString()
        updateData.endLocalDateTime = form.endDate
      }
      
      await api.put(`/seminars/${id}`, updateData)
      show(form.type === 'event' ? 'Event updated' : 'Workshop updated')
      navigate(`/detail/${id}`)
    }catch{ show('Update failed', 'error') }
  }

  if(loading) return null
  const isEvent = form.type === 'event'
  return (
    <div className="flex justify-center">
      <form onSubmit={submit} className="cozy-card p-6 grid gap-4 max-w-xl w-full shadow-subtle">
        <h2 className="text-2xl font-semibold text-dusk text-center font-poppins">{isEvent ? 'Edit event' : 'Edit workshop'}</h2>
        
        <input required value={form.title} onChange={(e)=>setForm({...form, title:e.target.value})} placeholder="Title" className={`w-full px-3 py-2 rounded-full border-0 focus:ring-2 ${isEvent ? ' focus:ring-pink-300/20' : ' focus:ring-orange-300/20'}`} />
        
          <input required value={form.venue} onChange={(e)=>setForm({...form, venue:e.target.value})} placeholder="Location" className="w-full px-3 py-2 rounded-xl border" />
          
          {!isEvent && (
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cocoa pointer-events-none">€</span>
              <input value={form.price} onChange={(e)=>setForm({...form, price:e.target.value.replace(/€/g, '').trim()})} placeholder="Price (optional)" className="w-full pl-8 pr-3 py-2 rounded-xl border" />
            </div>
          )}
          
          <input required type="datetime-local" value={form.date} onChange={(e)=>setForm({...form, date:e.target.value})} placeholder="Start Date & Time" className="w-full px-3 py-2 rounded-xl border" />
        
        {isEvent ? (
          <input required type="datetime-local" value={form.endDate} onChange={(e)=>setForm({...form, endDate:e.target.value})} placeholder="End Date & Time" className="w-full px-3 py-2 rounded-xl border" />
        ) : (
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
                <div className="absolute z-20 mt-2 w-full max-h-64 overflow-y-auto bg-white border rounded-xl shadow-subtle p-3 space-y-1">
                  {renderedOptions.map((styleVal)=>{
                    const checked = form.styles.includes(styleVal)
                    return (
                      <label key={styleVal} className={`flex items-center gap-2 text-sm py-1`}>
                        <input 
                          type="checkbox"
                          checked={checked}
                          onChange={(e)=>{
                            const isChecked = e.target.checked
                            if (isChecked && form.styles.length >= 3) {
                              show('You can pick up to 3 styles', 'error')
                              return
                            }
                            const next = isChecked ? [...form.styles, styleVal] : form.styles.filter(s=>s!==styleVal)
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
        )}
        
        <textarea value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} placeholder="Description (optional)" className="w-full px-3 py-2 rounded-xl border" rows="3" />
        
        <button className="w-full px-4 py-3 bg-dusk text-white rounded-xl font-medium">Save Changes</button>
      </form>
    </div>
  )
}



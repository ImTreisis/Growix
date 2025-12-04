import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'
import { useToast } from '../components/Toast.jsx'

export default function Edit(){
  const { id } = useParams()
  const { api, user } = useAuth()
  const { show } = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ title:'', description:'', date:'', style:'hip-hop', level:'beginner', venue:'', price:'', customStyle:'', imageUrl:'', endDate:'', type:'workshop' })
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    api.get(`/seminars/${id}`).then(r=>{
      const s = r.data.seminar
      if(String(s.createdBy?._id||s.createdBy)!==String(user?._id)){
        navigate(s.type === 'event' ? '/events' : '/workshops', { replace:true })
        return
      }
      const isCustomStyle = !['afro', 'bachata', 'ballet', 'balboa', 'breaking', 'charleston', 'commercial', 'contemporary', 'dancehall', 'freestyle', 'high-heels', 'hip-hop', 'house', 'jazz', 'lindy-hop', 'locking', 'modern', 'popping', 'salsa', 'shag', 'solo-jazz', 'twerk', 'vogue', 'waacking'].includes(s.style)
      const dateInput = s.localDateTime || new Date(s.date).toISOString().slice(0,16)
      const endDateInput = s.endLocalDateTime || (s.endDate ? new Date(s.endDate).toISOString().slice(0,16) : '')
      setForm({
        title:s.title,
        description:s.description||'',
        date: dateInput,
        style: isCustomStyle ? 'custom' : s.style,
        level:s.level||'beginner',
        venue:s.venue||'',
        price:s.price||'',
        customStyle: isCustomStyle ? s.style : '',
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
      
      const submitData = { ...form }
      if (form.type === 'workshop' && form.style === 'custom' && form.customStyle) {
        submitData.style = form.customStyle
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <select value={form.style} onChange={(e)=>setForm({...form, style:e.target.value})} className="w-full px-3 py-2 rounded-xl border">
                <option value="afro">Afro</option>
                <option value="bachata">Bachata</option>
                <option value="ballet">Ballet</option>
                <option value="balboa">Balboa</option>
                <option value="breaking">Breaking</option>
                <option value="charleston">Charleston</option>
                <option value="commercial">Commercial</option>
                <option value="contemporary">Contemporary</option>
                <option value="dancehall">Dancehall</option>
                <option value="freestyle">Freestyle</option>
                <option value="high-heels">High Heels</option>
                <option value="hip-hop">Hip-Hop</option>
                <option value="house">House</option>
                <option value="jazz">Jazz</option>
                <option value="lindy-hop">Lindy Hop</option>
                <option value="locking">Locking</option>
                <option value="modern">Modern</option>
                <option value="popping">Popping</option>
                <option value="salsa">Salsa</option>
                <option value="shag">Shag</option>
                <option value="solo-jazz">Solo Jazz / Vintage Jazz</option>
                <option value="twerk">Twerk</option>
                <option value="vogue">Vogue</option>
                <option value="waacking">Waacking</option>
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
              <option value="open">Open</option>
            </select>
          </div>
        )}
        
        <textarea value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} placeholder="Description (optional)" className="w-full px-3 py-2 rounded-xl border" rows="3" />
        
        <button className="w-full px-4 py-3 bg-dusk text-white rounded-xl font-medium">Save Changes</button>
      </form>
    </div>
  )
}



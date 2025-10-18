import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'
import { useToast } from '../components/Toast.jsx'

export default function Edit(){
  const { id } = useParams()
  const { api, user } = useAuth()
  const { show } = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ title:'', description:'', date:'', style:'hip-hop', level:'beginner', venue:'', customStyle:'', imageUrl:'' })
  const [loading, setLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(()=>{
    api.get(`/seminars/${id}`).then(r=>{
      const s = r.data.seminar
      if(String(s.createdBy?._id||s.createdBy)!==String(user?._id)){
        navigate('/workshops', { replace:true })
        return
      }
      const isCustomStyle = !['hip-hop', 'breaking', 'popping', 'locking', 'house', 'waacking', 'vogue', 'dancehall', 'afro', 'commercial', 'twerk', 'contemporary', 'jazz', 'modern', 'ballet', 'salsa', 'bachata', 'high-heels', 'freestyle'].includes(s.style)
      setForm({
        title:s.title,
        description:s.description||'',
        date: new Date(s.date).toISOString().slice(0,16),
        style: isCustomStyle ? 'custom' : s.style,
        level:s.level,
        venue:s.venue||'',
        customStyle: isCustomStyle ? s.style : '',
        imageUrl:s.imageUrl||''
      })
      setLoading(false)
    })
  }, [api, id, user, navigate])

  const submit = async (e)=>{
    e.preventDefault()
    
    // Prevent spam clicking
    if (isUpdating) return;
    
    setIsUpdating(true);
    try{
      const submitData = { ...form }
      if (form.style === 'custom' && form.customStyle) {
        submitData.style = form.customStyle
      }
      delete submitData.customStyle
      
      await api.put(`/seminars/${id}`, { ...submitData, date: form.date })
      show('Seminar updated')
      navigate(`/detail/${id}`)
    }catch(err){ 
      console.error('Update failed:', err);
      show('Update failed', 'error') 
    } finally {
      // Add 500ms debounce delay
      setTimeout(() => setIsUpdating(false), 500);
    }
  }

  if(loading) return null
  return (
    <div className="flex justify-center">
      <form onSubmit={submit} className="cozy-card p-6 grid gap-4 max-w-xl w-full shadow-subtle">
        <h2 className="text-2xl font-semibold text-dusk text-center font-poppins">Edit workshop</h2>
        
        <input required value={form.title} onChange={(e)=>setForm({...form, title:e.target.value})} placeholder="Title" className="w-full px-3 py-2 rounded-xl border" />
        
        <input required value={form.venue} onChange={(e)=>setForm({...form, venue:e.target.value})} placeholder="Location" className="w-full px-3 py-2 rounded-xl border" />
        
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
          disabled={isUpdating}
          className={`w-full px-4 py-3 rounded-xl font-medium transition-colors ${isUpdating ? 'bg-gray-400 cursor-not-allowed' : 'bg-dusk text-white hover:bg-dusk/90'}`}
        >
          {isUpdating ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}



import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Logo from '../components/Logo.jsx'
import SeminarCard from '../components/SeminarCard.jsx'

export default function Home() {
  const navigate = useNavigate()
  return (
    <div className="py-10">
      <section className="rounded-xl p-10 text-dusk shadow-cozy relative overflow-hidden">
        {/* Background image for the entire hero section */}
        <div 
          className="absolute inset-0 rounded-xl bg-cover bg-center bg-no-repeat"
          style={{backgroundImage: 'url(/search-logo.png)'}}
        ></div>
        
        {/* Content with higher z-index to appear above background */}
        <div className="relative z-10">
          <div className="mb-4">
            <Logo size={48} />
          </div>
          <motion.h1 initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{duration:0.6}}
            className="text-4xl md:text-5xl font-poppins font-bold mb-4">
            Your next step starts here - Trust the process, every step is progress!
          </motion.h1>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              onKeyDown={(e)=>{if(e.key==='Enter') navigate(`/workshops?q=${encodeURIComponent(e.currentTarget.value)}`)}} 
              placeholder="Search seminars..." 
              className="flex-1 px-4 py-3 rounded-xl bg-white/90 border border-gray-200 shadow-subtle" 
            />
            <button onClick={()=>navigate('/workshops')} className="px-6 py-3 rounded-xl bg-dusk text-white shadow-cozy">Browse</button>
          </div>
        </div>
      </section>
      <section className="mt-8">
        {/* Show latest seminars on the homepage */}
        <BrowseInline />
      </section>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useAuth } from '../state/AuthContext.jsx'
function BrowseInline(){
  const { api } = useAuth()
  const [items, setItems] = useState([])
  useEffect(()=>{ api.get('/seminars', { params: { limit: 20, offset: 0 } }).then(r=> setItems(r.data.seminars)) }, [])
  if(!items.length) return null
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {items.map((s)=> (
        <a key={s._id} href={`/detail/${s._id}`}><SeminarCard item={s} /></a>
      ))}
    </div>
  )
}



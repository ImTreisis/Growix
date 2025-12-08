import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Logo from '../components/Logo.jsx'
import SeminarCard from '../components/SeminarCard.jsx'
import { useAuth } from '../state/AuthContext.jsx'

const MotionH1 = motion.h1

export default function Home() {
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
          <MotionH1 initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{duration:0.6}}
            className="text-4xl md:text-5xl font-poppins font-bold mb-4">
            Your next step starts here - Trust the process, every step is progress!
          </MotionH1>
          {/* Search and browse controls removed per request */}
        </div>
      </section>
      <section className="mt-8">
        {/* Show latest seminars on the homepage */}
        <BrowseInline />
      </section>
    </div>
  )
}

function BrowseInline(){
  const { api } = useAuth()
  const [items, setItems] = useState([])
  useEffect(()=>{ api.get('/seminars', { params: { limit: 20, offset: 0 } }).then(r=> setItems(r.data.seminars)) }, [api])
  if(!items.length) return null
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {items.map((s)=> (
        <a key={s._id} href={`/detail/${s._id}`}><SeminarCard item={s} /></a>
      ))}
    </div>
  )
}



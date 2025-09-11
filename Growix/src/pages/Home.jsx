import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Logo from '../components/Logo.jsx'

export default function Home() {
  const navigate = useNavigate()
  return (
    <div className="py-10">
      <section className="rounded-xl p-10 gradient-bg text-dusk shadow-cozy">
        <div className="mb-4">
          <Logo size={48} />
        </div>
        <motion.h1 initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{duration:0.6}}
          className="text-4xl md:text-5xl font-semibold mb-4">
          Find your next cozy dance seminar
        </motion.h1>
        <p className="text-cocoa/80 max-w-2xl mb-6">Warm lights, soft grooves, and welcoming vibes. Browse by style, level, and date.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input onKeyDown={(e)=>{if(e.key==='Enter') navigate(`/browse?q=${encodeURIComponent(e.currentTarget.value)}`)}} placeholder="Search seminars..." className="flex-1 px-4 py-3 rounded-xl" />
          <button onClick={()=>navigate('/browse')} className="px-6 py-3 rounded-xl bg-dusk text-white shadow-cozy">Browse</button>
        </div>
      </section>
    </div>
  )
}



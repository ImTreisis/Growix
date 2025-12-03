import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'
import Logo from './Logo.jsx'

export default function Navbar() {
  const { user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [workshopsOpen, setWorkshopsOpen] = useState(false)
  const [eventsOpen, setEventsOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  return (
    <header className="bg-white/95 backdrop-blur sticky top-0 z-40 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Logo />
        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-dusk font-poppins">
          <div className="relative group">
            <NavLink 
              to="/events" 
              className={({isActive})=>`transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66] ${isActive ? 'text-[#df1f66] font-bold' : ''}`}
            >
              Events
            </NavLink>
            <div className="pointer-events-none invisible opacity-0 group-hover:visible group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity absolute left-0 top-full bg-white rounded-xl shadow-cozy border p-2 min-w-[180px]">
              <NavLink to="/events" className="block px-3 py-2 rounded-lg hover:bg-warm2/60 transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66]">All Events</NavLink>
              <NavLink to="/events?tab=liked" className="block px-3 py-2 rounded-lg hover:bg-warm2/60 transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66]">Liked</NavLink>
              <NavLink to="/events?tab=organized" className="block px-3 py-2 rounded-lg hover:bg-warm2/60 transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66]">Organized</NavLink>
            </div>
          </div>
          <div className="relative group">
            <NavLink 
              to="/workshops" 
              className={({isActive})=>`transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66] ${isActive ? 'text-[#df1f66] font-bold' : ''}`}
            >
              Workshops
            </NavLink>
            <div className="pointer-events-none invisible opacity-0 group-hover:visible group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity absolute left-0 top-full bg-white rounded-xl shadow-cozy border p-2 min-w-[180px]">
              <NavLink to="/workshops" className="block px-3 py-2 rounded-lg hover:bg-warm2/60 transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66]">All Workshops</NavLink>
              <NavLink to="/workshops?tab=liked" className="block px-3 py-2 rounded-lg hover:bg-warm2/60 transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66]">Liked</NavLink>
              <NavLink to="/workshops?tab=organized" className="block px-3 py-2 rounded-lg hover:bg-warm2/60 transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66]">Organized</NavLink>
            </div>
          </div>
          <div className="relative group">
            <button 
              className="transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66]"
            >
              Create
            </button>
            <div className="pointer-events-none invisible opacity-0 group-hover:visible group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity absolute left-0 top-full bg-white rounded-xl shadow-cozy border p-2 min-w-[180px]">
              <NavLink to="/create" className="block px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 hover:font-bold" style={{color: '#ff8c00', backgroundColor: 'rgba(253, 186, 116, 0.75)'}}>Workshop</NavLink>
              <NavLink to="/create-event" className="block px-3 py-2 rounded-lg hover:bg-pink-100 transition-all duration-200 hover:scale-105 hover:font-bold" style={{color: '#ff69b4'}}>Event</NavLink>
            </div>
          </div>
          {user ? (
            <div className="flex items-center gap-4">
              <NavLink 
                to="/profile" 
                className={({isActive})=>`transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66] ${isActive ? 'text-[#df1f66] font-bold' : ''}`}
              >
                Profile
              </NavLink>
              <NavLink 
                to="/about" 
                className={({isActive})=>`transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66] ${isActive ? 'text-[#df1f66] font-bold' : ''}`}
              >
                About Us
              </NavLink>
              <button 
                onClick={()=>window.dispatchEvent(new CustomEvent('growix:logout'))} 
                className="px-3 py-2 rounded-xl text-white font-bold transition-all duration-200 hover:scale-105 bg-[#df1f66] hover:bg-red-300" 
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <NavLink 
                to="/about" 
                className={({isActive})=>`transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66] ${isActive ? 'text-[#df1f66] font-bold' : ''}`}
              >
                About Us
              </NavLink>
              <NavLink 
                to="/auth" 
                className="px-3 py-2 rounded-xl text-white font-bold transition-all duration-200 hover:scale-105 bg-[#df1f66] hover:bg-red-300"
              >
                Sign in
              </NavLink>
            </>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button aria-label="Menu" className="md:hidden px-3 py-2 rounded-xl border transition-all duration-200 hover:scale-105" onClick={()=>setMenuOpen(v=>!v)}>
          ☰
        </button>
      </div>
      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="md:hidden border-t bg-white/95 backdrop-blur shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-3 grid gap-2 text-dusk font-poppins">
            <button 
              className="text-left px-3 py-2 rounded-lg bg-warm2/50 transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66]" 
              onClick={()=>setEventsOpen(v=>!v)}
            >
              Events
            </button>
            {eventsOpen && (
              <div className="ml-3 grid gap-1">
                <NavLink 
                  to="/events" 
                  onClick={()=>setMenuOpen(false)} 
                  className="px-3 py-2 rounded-lg hover:bg-warm2/60 transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66]"
                >
                  All Events
                </NavLink>
                <NavLink 
                  to="/events?tab=liked" 
                  onClick={()=>setMenuOpen(false)} 
                  className="px-3 py-2 rounded-lg hover:bg-warm2/60 transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66]"
                >
                  Liked
                </NavLink>
                <NavLink 
                  to="/events?tab=organized" 
                  onClick={()=>setMenuOpen(false)} 
                  className="px-3 py-2 rounded-lg hover:bg-warm2/60 transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66]"
                >
                  Organized
                </NavLink>
              </div>
            )}
            <button 
              className="text-left px-3 py-2 rounded-lg bg-warm2/50 transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66]" 
              onClick={()=>setWorkshopsOpen(v=>!v)}
            >
              Workshops
            </button>
            {workshopsOpen && (
              <div className="ml-3 grid gap-1">
                <NavLink 
                  to="/workshops" 
                  onClick={()=>setMenuOpen(false)} 
                  className="px-3 py-2 rounded-lg hover:bg-warm2/60 transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66]"
                >
                  All Workshops
                </NavLink>
                <NavLink 
                  to="/workshops?tab=liked" 
                  onClick={()=>setMenuOpen(false)} 
                  className="px-3 py-2 rounded-lg hover:bg-warm2/60 transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66]"
                >
                  Liked
                </NavLink>
                <NavLink 
                  to="/workshops?tab=organized" 
                  onClick={()=>setMenuOpen(false)} 
                  className="px-3 py-2 rounded-lg hover:bg-warm2/60 transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66]"
                >
                  Organized
                </NavLink>
              </div>
            )}
            <button 
              className="text-left px-3 py-2 rounded-lg bg-warm2/50 transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66]" 
              onClick={()=>setCreateOpen(v=>!v)}
            >
              Create
            </button>
            {createOpen && (
              <div className="ml-3 grid gap-1">
                <NavLink 
                  to="/create" 
                  onClick={()=>setMenuOpen(false)} 
                  className="px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 hover:font-bold"
                  style={{color: '#ff8c00', backgroundColor: 'rgba(253, 186, 116, 0.75)'}}
                >
                  Workshop
                </NavLink>
                <NavLink 
                  to="/create-event" 
                  onClick={()=>setMenuOpen(false)} 
                  className="px-3 py-2 rounded-lg hover:bg-pink-100 transition-all duration-200 hover:scale-105 hover:font-bold"
                  style={{color: '#ff69b4'}}
                >
                  Event
                </NavLink>
              </div>
            )}
            {user ? (
              <>
                <NavLink 
                  to="/profile" 
                  onClick={()=>setMenuOpen(false)} 
                  className="px-3 py-2 rounded-lg hover:bg-warm2/60 transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66]"
                >
                  Profile
                </NavLink>
                <NavLink 
                  to="/about" 
                  onClick={()=>setMenuOpen(false)} 
                  className="px-3 py-2 rounded-lg hover:bg-warm2/60 transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66]"
                >
                  About Us
                </NavLink>
                <button 
                  onClick={()=>{ setMenuOpen(false); window.dispatchEvent(new CustomEvent('growix:logout')) }} 
                  className="px-3 py-2 rounded-lg text-white font-bold transition-all duration-200 hover:scale-105" 
                  style={{backgroundColor: '#df1f66'}}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink 
                  to="/about" 
                  onClick={()=>setMenuOpen(false)} 
                  className="px-3 py-2 rounded-lg hover:bg-warm2/60 transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66]"
                >
                  About Us
                </NavLink>
                <NavLink 
                  to="/auth" 
                  onClick={()=>setMenuOpen(false)} 
                  className="px-3 py-2 rounded-lg hover:bg-warm2/60 transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66]"
                >
                  Sign in
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}



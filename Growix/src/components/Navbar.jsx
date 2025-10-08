import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'
import Logo from './Logo.jsx'

export default function Navbar() {
  const { user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [workshopsOpen, setWorkshopsOpen] = useState(false)
  return (
    <header className="bg-warm2/60 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Logo />
        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-dusk">
          <div className="relative group pt-2">
            <NavLink to="/workshops" className={({isActive})=>isActive? 'underline' : ''}>Workshops</NavLink>
            <div className="pointer-events-none invisible opacity-0 group-hover:visible group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity absolute left-0 top-full bg-white rounded-xl shadow-cozy border p-2 min-w-[180px]">
              <NavLink to="/workshops" className="block px-3 py-2 rounded-lg hover:bg-warm2/60">All Workshops</NavLink>
              <NavLink to="/workshops?tab=liked" className="block px-3 py-2 rounded-lg hover:bg-warm2/60">Liked</NavLink>
              <NavLink to="/workshops?tab=organized" className="block px-3 py-2 rounded-lg hover:bg-warm2/60">Organized</NavLink>
            </div>
          </div>
          <NavLink to="/create" className={({isActive})=>isActive? 'underline' : ''}>Create</NavLink>
          {user ? (
            <div className="flex items-center gap-4">
              <NavLink to="/profile" className={({isActive})=>isActive? 'underline' : ''}>Profile</NavLink>
              <NavLink to="/about" className={({isActive})=>isActive? 'underline' : ''}>About Us</NavLink>
              <button onClick={()=>window.dispatchEvent(new CustomEvent('growix:logout'))} className="px-3 py-2 rounded-xl bg-warm3">Logout</button>
            </div>
          ) : (
            <>
              <NavLink to="/about" className={({isActive})=>isActive? 'underline' : ''}>About Us</NavLink>
              <NavLink to="/auth" className={({isActive})=>isActive? 'underline' : ''}>Sign in</NavLink>
            </>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button aria-label="Menu" className="md:hidden px-3 py-2 rounded-xl border" onClick={()=>setMenuOpen(v=>!v)}>
          ☰
        </button>
      </div>
      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="md:hidden border-t bg-white/90 backdrop-blur">
          <div className="max-w-6xl mx-auto px-4 py-3 grid gap-2 text-dusk">
            <button className="text-left px-3 py-2 rounded-lg bg-warm2/50" onClick={()=>setWorkshopsOpen(v=>!v)}>
              Workshops
            </button>
            {workshopsOpen && (
              <div className="ml-3 grid gap-1">
                <NavLink to="/workshops" onClick={()=>setMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-warm2/60">All Workshops</NavLink>
                <NavLink to="/workshops?tab=liked" onClick={()=>setMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-warm2/60">Liked</NavLink>
                <NavLink to="/workshops?tab=organized" onClick={()=>setMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-warm2/60">Organized</NavLink>
              </div>
            )}
            <NavLink to="/create" onClick={()=>setMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-warm2/60">Create</NavLink>
            {user ? (
              <>
                <NavLink to="/profile" onClick={()=>setMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-warm2/60">Profile</NavLink>
                <NavLink to="/about" onClick={()=>setMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-warm2/60">About Us</NavLink>
                <button onClick={()=>{ setMenuOpen(false); window.dispatchEvent(new CustomEvent('growix:logout')) }} className="px-3 py-2 rounded-lg bg-warm3">Logout</button>
              </>
            ) : (
              <>
                <NavLink to="/about" onClick={()=>setMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-warm2/60">About Us</NavLink>
                <NavLink to="/auth" onClick={()=>setMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-warm2/60">Sign in</NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}



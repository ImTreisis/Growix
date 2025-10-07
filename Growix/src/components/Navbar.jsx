import { NavLink } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'
import Logo from './Logo.jsx'

export default function Navbar() {
  const { user } = useAuth()
  return (
    <header className="bg-warm2/60 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-6 text-dusk">
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
              <button onClick={()=>window.dispatchEvent(new CustomEvent('growix:logout'))} className="px-3 py-1 rounded-xl bg-warm3">Logout</button>
            </div>
          ) : (
            <>
              <NavLink to="/about" className={({isActive})=>isActive? 'underline' : ''}>About Us</NavLink>
              <NavLink to="/auth" className={({isActive})=>isActive? 'underline' : ''}>Sign in</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}



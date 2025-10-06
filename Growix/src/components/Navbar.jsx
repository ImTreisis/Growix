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
          <NavLink to="/browse" className={({isActive})=>isActive? 'underline' : ''}>Browse</NavLink>
          <NavLink to="/organize" className={({isActive})=>isActive? 'underline' : ''}>Organize</NavLink>
          <NavLink to="/saved" className={({isActive})=>isActive? 'underline' : ''}>Saved</NavLink>
          {user ? (
            <div className="flex items-center gap-4">
              <NavLink to="/profile" className={({isActive})=>isActive? 'underline' : ''}>Profile</NavLink>
              <button onClick={()=>window.dispatchEvent(new CustomEvent('growix:logout'))} className="px-3 py-1 rounded-xl bg-warm3">Logout</button>
            </div>
          ) : (
            <NavLink to="/auth" className={({isActive})=>isActive? 'underline' : ''}>Sign in</NavLink>
          )}
        </nav>
      </div>
    </header>
  )
}



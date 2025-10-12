import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'
import React, { useRef } from "react";
import Logo from './Logo.jsx'

export default function Navbar() {
  const { user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [workshopsOpen, setWorkshopsOpen] = useState(false)

    const audioRef = useRef(new Audio("/playPop.mp3"));
  
    const playClickSound = () => {
      audioRef.current.currentTime = 0; // restart sound if already playing
      audioRef.current.play();
    };
  return (
    <header className="bg-white/95 backdrop-blur sticky top-0 z-40 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Logo />
        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-dusk font-poppins">
          <div className="relative group">
            <NavLink 
              to="/workshops" 
              className={({isActive})=>`transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66] ${isActive ? 'text-[#df1f66] font-bold' : ''}`}
              onClick={playClickSound}
            >
              Workshops
            </NavLink>
            <div className="pointer-events-none invisible opacity-0 group-hover:visible group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity absolute left-0 top-full bg-white rounded-xl shadow-cozy border p-2 min-w-[180px]">
              <NavLink to="/workshops" className="block px-3 py-2 rounded-lg hover:bg-warm2/60 transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66]" onClick={playClickSound}>All Workshops</NavLink>
              <NavLink to="/workshops?tab=liked" className="block px-3 py-2 rounded-lg hover:bg-warm2/60 transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66]" onClick={playClickSound}>Liked</NavLink>
              <NavLink to="/workshops?tab=organized" className="block px-3 py-2 rounded-lg hover:bg-warm2/60 transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66]" onClick={playClickSound}>Organized</NavLink>
            </div>
          </div>
          <NavLink 
            to="/create" 
            className={({isActive})=>`transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66] ${isActive ? 'text-[#df1f66] font-bold' : ''}`}
            onClick={playClickSound}
          >
            Create
          </NavLink>
          {user ? (
            <div className="flex items-center gap-4">
              <NavLink 
                to="/profile" 
                className={({isActive})=>`transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66] ${isActive ? 'text-[#df1f66] font-bold' : ''}`}
                onClick={playClickSound}
              >
                Profile
              </NavLink>
              <NavLink 
                to="/about" 
                className={({isActive})=>`transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66] ${isActive ? 'text-[#df1f66] font-bold' : ''}`}
                onClick={playClickSound}
              >
                About Us
              </NavLink>
              <button 
                onClick={()=>{playClickSound(); window.dispatchEvent(new CustomEvent('growix:logout'))}} 
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
                onClick={playClickSound}
              >
                About Us
              </NavLink>
              <NavLink 
                to="/auth" 
                className={({isActive})=>`transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66] ${isActive ? 'text-[#df1f66] font-bold' : ''}`}
                onClick={playClickSound}
              >
                Sign in
              </NavLink>
            </>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button aria-label="Menu" className="md:hidden px-3 py-2 rounded-xl border transition-all duration-200 hover:scale-105" onClick={()=>{playClickSound(); setMenuOpen(v=>!v)}}>
          ☰
        </button>
      </div>
      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="md:hidden border-t bg-white/95 backdrop-blur shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-3 grid gap-2 text-dusk font-poppins">
            <button 
              className="text-left px-3 py-2 rounded-lg bg-warm2/50 transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66]" 
              onClick={()=>{playClickSound(); setWorkshopsOpen(v=>!v)}}
            >
              Workshops
            </button>
            {workshopsOpen && (
              <div className="ml-3 grid gap-1">
                <NavLink 
                  to="/workshops" 
                  onClick={()=>{playClickSound(); setMenuOpen(false)}} 
                  className="px-3 py-2 rounded-lg hover:bg-warm2/60 transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66]"
                >
                  All Workshops
                </NavLink>
                <NavLink 
                  to="/workshops?tab=liked" 
                  onClick={()=>{playClickSound(); setMenuOpen(false)}} 
                  className="px-3 py-2 rounded-lg hover:bg-warm2/60 transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66]"
                >
                  Liked
                </NavLink>
                <NavLink 
                  to="/workshops?tab=organized" 
                  onClick={()=>{playClickSound(); setMenuOpen(false)}} 
                  className="px-3 py-2 rounded-lg hover:bg-warm2/60 transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66]"
                >
                  Organized
                </NavLink>
              </div>
            )}
            <NavLink 
              to="/create" 
              onClick={()=>{playClickSound(); setMenuOpen(false)}} 
              className="px-3 py-2 rounded-lg hover:bg-warm2/60 transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66]"
            >
              Create
            </NavLink>
            {user ? (
              <>
                <NavLink 
                  to="/profile" 
                  onClick={()=>{playClickSound(); setMenuOpen(false)}} 
                  className="px-3 py-2 rounded-lg hover:bg-warm2/60 transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66]"
                >
                  Profile
                </NavLink>
                <NavLink 
                  to="/about" 
                  onClick={()=>{playClickSound(); setMenuOpen(false)}} 
                  className="px-3 py-2 rounded-lg hover:bg-warm2/60 transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66]"
                >
                  About Us
                </NavLink>
                <button 
                  onClick={()=>{ playClickSound(); setMenuOpen(false); window.dispatchEvent(new CustomEvent('growix:logout')) }} 
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
                  onClick={()=>{playClickSound(); setMenuOpen(false)}} 
                  className="px-3 py-2 rounded-lg hover:bg-warm2/60 transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66]"
                >
                  About Us
                </NavLink>
                <NavLink 
                  to="/auth" 
                  onClick={()=>{playClickSound(); setMenuOpen(false)}} 
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



import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'

export default function Footer() {
  const { user } = useAuth()
  
  return (
    <footer className="mt-12 border-t border-warm3/40 bg-warm1/30">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Main footer content */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8">
          {/* Footer Logo - Top Left */}
          <div className="flex items-center gap-2">
            <img src="/footer-logo.png" alt="Growix footer logo" width={250} height={250} className="rounded-md" />
          </div>

          {/* Navigation Menu & Contact - Top Right */}
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Navigation Menu */}
            <div className="flex flex-col items-start">
              <h3 className="text-dusk font-semibold mb-4 font-poppins">Menu</h3>
              <nav className="flex flex-col gap-2 text-sm">
                <NavLink 
                  to="/workshops" 
                  className={({isActive})=>`transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66] ${isActive ? 'text-[#df1f66] font-bold' : 'text-cocoa hover:text-dusk'}`}
                >
                  Workshops
                </NavLink>
                <NavLink 
                  to="/create" 
                  className={({isActive})=>`transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66] ${isActive ? 'text-[#df1f66] font-bold' : 'text-cocoa hover:text-dusk'}`}
                >
                  Create
                </NavLink>
                {user ? (
                  <>
                    <NavLink 
                      to="/profile" 
                      className={({isActive})=>`transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66] ${isActive ? 'text-[#df1f66] font-bold' : 'text-cocoa hover:text-dusk'}`}
                    >
                      Profile
                    </NavLink>
                    <NavLink 
                      to="/about" 
                      className={({isActive})=>`transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66] ${isActive ? 'text-[#df1f66] font-bold' : 'text-cocoa hover:text-dusk'}`}
                    >
                      About Us
                    </NavLink>
                  </>
                ) : (
                  <>
                    <NavLink 
                      to="/about" 
                      className={({isActive})=>`transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66] ${isActive ? 'text-[#df1f66] font-bold' : 'text-cocoa hover:text-dusk'}`}
                    >
                      About Us
                    </NavLink>
                    <NavLink 
                      to="/auth" 
                      className={({isActive})=>`transition-all duration-200 hover:scale-105 hover:font-bold hover:text-[#df1f66] ${isActive ? 'text-[#df1f66] font-bold' : 'text-cocoa hover:text-dusk'}`}
                    >
                      Sign In
                    </NavLink>
                  </>
                )}
              </nav>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col items-start">
              <h3 className="text-dusk font-semibold mb-4 font-poppins">Contact</h3>
              <a 
                href="mailto:info@growix.lt" 
                className="text-cocoa hover:text-dusk transition-colors text-sm"
              >
                info@growix.lt
              </a>
            </div>
          </div>
        </div>

        {/* Social Media & Copyright - Bottom */}
        <div className="border-t border-warm3/40 pt-8">
          <div className="flex flex-col items-center gap-6">
            {/* Social Media Icons */}
            <div className="flex items-center gap-4">
              <a 
                href="https://www.instagram.com/growix.lt/?utm_source=ig_web_button_share_sheet" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 rounded-lg hover:bg-warm2/60 transition-colors"
                aria-label="Follow us on Instagram"
              >
                <img src="/instagram-logo.png" alt="Instagram" width={64} height={64} className="opacity-80 hover:opacity-100 transition-opacity" />
              </a>
              
            </div>

            {/* Copyright */}
            <p className="text-cocoa text-sm text-center mb-4">
              Copyright © 2025 Growix | Powered By Growix
            </p>
            
            {/* Privacy Policy & Terms of Service */}
            <div className="flex items-center justify-center gap-6">
              <Link 
                to="/privacy-policy" 
                className="text-cocoa/60 hover:text-[#df1f66] hover:scale-105 transition-all duration-200 text-sm"
              >
                Privacy Policy
              </Link>
              <span className="text-cocoa/40">|</span>
              <Link 
                to="/terms-of-service" 
                className="text-cocoa/60 hover:text-[#df1f66] hover:scale-105 transition-all duration-200 text-sm"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}



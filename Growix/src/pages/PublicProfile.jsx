import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'

export default function PublicProfile() {
  const { api } = useAuth()
  const { userId } = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/users/${userId}`)
        setUser(response.data.user)
      } catch (error) {
        console.error('Failed to fetch user:', error)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchUser()
    }
  }, [userId, api])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-cocoa">Loading profile...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-cocoa">User not found</div>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Profile Photo Section */}
      <aside className="cozy-card p-4 flex flex-col items-center gap-3 shadow-subtle">
        <img 
          src={user.photoUrl || 'https://placehold.co/200x200?text=Photo'} 
          alt="profile" 
          className="w-32 h-32 rounded-full object-cover border-4 border-warm3/30" 
        />
        
        {/* Username Display */}
        <div className="text-center">
          <p className="text-cocoa font-poppins font-bold">@{user.username}</p>
        </div>
      </aside>

      {/* Profile Information Section */}
      <div className="md:col-span-2 cozy-card p-6 shadow-subtle">
        <div className="space-y-6">
          {/* Name - Always Visible */}
          <h1 className="text-3xl font-bold text-dusk font-poppins">
            {user.firstName} {user.lastName}
          </h1>
          
          {/* Bio Section with Black Outline Box - Separate Box */}
          {user.bio && (
            <div className="p-4 border-2 border-black rounded-xl">
              <h3 className="text-lg font-semibold text-dusk font-poppins mb-2">Bio</h3>
              <p className="text-cocoa text-lg leading-relaxed">{user.bio}</p>
            </div>
          )}

          {/* Social Media Links - Centered Below Bio */}
          {(user.instagram || user.tiktok || user.linkedin || user.facebook) && (
            <div className="flex justify-center items-center gap-3">
              {user.instagram && (
                <a 
                  href={user.instagram.startsWith('http') ? user.instagram : `https://instagram.com/${user.instagram}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-1 rounded-lg hover:bg-warm2/60 transition-colors"
                  aria-label="Follow on Instagram"
                >
                  <img src="/instagram-logo.png" alt="Instagram" width={64} height={64} className="opacity-80 hover:opacity-100 transition-opacity" />
                </a>
              )}
              {user.tiktok && (
                <a 
                  href={user.tiktok.startsWith('http') ? user.tiktok : `https://tiktok.com/@${user.tiktok}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-1 rounded-lg hover:bg-warm2/60 transition-colors"
                  aria-label="Follow on TikTok"
                >
                  <img src="/tiktok-logo.png" alt="TikTok" width={64} height={64} className="opacity-80 hover:opacity-100 transition-opacity" />
                </a>
              )}
              {user.linkedin && (
                <a 
                  href={user.linkedin.startsWith('http') ? user.linkedin : `https://linkedin.com/in/${user.linkedin}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-1 rounded-lg hover:bg-warm2/60 transition-colors"
                  aria-label="Connect on LinkedIn"
                >
                  <img src="/linkedin-logo.png" alt="LinkedIn" width={46} height={46} className="opacity-80 hover:opacity-100 transition-opacity" />
                </a>
              )}
              {user.facebook && (
                <a 
                  href={user.facebook.startsWith('http') ? user.facebook : `https://facebook.com/${user.facebook}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-1 rounded-lg hover:bg-warm2/60 transition-colors"
                  aria-label="Follow on Facebook"
                >
                  <img src="/facebook-logo.png" alt="Facebook" width={64} height={64} className="opacity-80 hover:opacity-100 transition-opacity" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

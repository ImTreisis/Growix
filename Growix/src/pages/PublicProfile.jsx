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
          <p className="text-cocoa font-medium">@{user.username}</p>
        </div>
      </aside>

      {/* Profile Information Section */}
      <div className="md:col-span-2 cozy-card p-6 shadow-subtle">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-dusk font-poppins">
              {user.firstName} {user.lastName}
            </h1>
            
            {/* Bio Section with Black Outline Box */}
            {user.bio && (
              <div className="mt-4 p-4 border-2 border-black rounded-xl">
                <p className="text-cocoa text-lg leading-relaxed">{user.bio}</p>
              </div>
            )}

            {/* Social Media Links with Black Outline Box */}
            {(user.instagram || user.tiktok || user.linkedin) && (
              <div className="mt-6 p-4 border-2 border-black rounded-xl">
                <h3 className="text-lg font-semibold text-dusk font-poppins mb-3">Social Media</h3>
                <div className="space-y-2">
                  {user.instagram && (
                    <div className="flex items-center gap-2">
                      <span className="text-cocoa font-medium">Instagram:</span>
                      <a href={user.instagram.startsWith('http') ? user.instagram : `https://instagram.com/${user.instagram}`} 
                         target="_blank" rel="noopener noreferrer"
                         className="text-[#df1f66] hover:text-dusk transition-colors">
                        {user.instagram}
                      </a>
                    </div>
                  )}
                  {user.tiktok && (
                    <div className="flex items-center gap-2">
                      <span className="text-cocoa font-medium">TikTok:</span>
                      <a href={user.tiktok.startsWith('http') ? user.tiktok : `https://tiktok.com/@${user.tiktok}`} 
                         target="_blank" rel="noopener noreferrer"
                         className="text-[#df1f66] hover:text-dusk transition-colors">
                        {user.tiktok}
                      </a>
                    </div>
                  )}
                  {user.linkedin && (
                    <div className="flex items-center gap-2">
                      <span className="text-cocoa font-medium">LinkedIn:</span>
                      <a href={user.linkedin.startsWith('http') ? user.linkedin : `https://linkedin.com/in/${user.linkedin}`} 
                         target="_blank" rel="noopener noreferrer"
                         className="text-[#df1f66] hover:text-dusk transition-colors">
                        {user.linkedin}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

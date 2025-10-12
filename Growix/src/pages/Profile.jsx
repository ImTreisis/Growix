import { useRef, useState, useEffect } from 'react'
import { useAuth } from '../state/AuthContext.jsx'

export default function Profile() {
  const { api, user, setUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({ 
    firstName: user?.firstName||'', 
    lastName: user?.lastName||'', 
    bio: user?.bio||'', 
    username: user?.username||'',
    instagram: user?.instagram||'',
    tiktok: user?.tiktok||'',
    linkedin: user?.linkedin||''
  })

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.bio || '',
        username: user.username || '',
        instagram: user.instagram || '',
        tiktok: user.tiktok || '',
        linkedin: user.linkedin || ''
      })
    }
  }, [user])
  const fileRef = useRef(null)

  const save = async (e) => {
    e.preventDefault()
    const r = await api.put('/users/me', form)
    setUser(r.data.user)
    setIsEditing(false)
  }

  const upload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const fd = new FormData()
    fd.append('photo', file)
    const r = await api.post('/users/me/photo', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    setUser(r.data.user)
  }

  if (!user) return null

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Profile Photo Section */}
      <aside className="cozy-card p-4 flex flex-col items-center gap-3 shadow-subtle">
        <img 
          src={user.photoUrl || 'https://placehold.co/200x200?text=Photo'} 
          alt="profile" 
          className="w-32 h-32 rounded-full object-cover border-4 border-warm3/30" 
        />
        <button 
          onClick={()=>fileRef.current?.click()} 
          className="px-3 py-2 font-inter rounded-xl transition-all duration-200 hover:scale-105 font-poppins font-bold transition-colors bg-orange-300 bg-opacity-75"
        >
          Upload Photo
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={upload} />
        
        {/* Username Display */}
        <div className="text-center">
          <p className="text-cocoa font-poppins font-bold">@{user.username}</p>
        </div>
      </aside>

      {/* Profile Information Section */}
      <div className="md:col-span-2 cozy-card p-6 shadow-subtle">
        {!isEditing ? (
          /* Display Mode */
          <div className="space-y-6">
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
              {(user.instagram || user.tiktok || user.linkedin) && (
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
                </div>
              )}

              {/* Edit Button - Bottom Right */}
              <div className="flex justify-end">
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-10 py-2 bg-dusk text-black font-poppins font-bold rounded-xl hover:bg-red-300 transition-colors bg-orange-300 bg-opacity-75"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <form onSubmit={save} className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-dusk font-poppins">Edit Profile</h2>
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-dusk text-white rounded-xl hover:bg-dusk/90 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <input 
                value={form.firstName} 
                onChange={(e)=>setForm({...form, firstName:e.target.value})} 
                placeholder="First name" 
                className="px-3 py-2 rounded-xl border focus:ring-2 focus:ring-[#df1f66]/20 focus:border-[#df1f66]" 
              />
              <input 
                value={form.lastName} 
                onChange={(e)=>setForm({...form, lastName:e.target.value})} 
                placeholder="Last name" 
                className="px-3 py-2 rounded-xl border focus:ring-2 focus:ring-[#df1f66]/20 focus:border-[#df1f66]" 
              />
            </div>

            <textarea 
              value={form.bio} 
              onChange={(e)=>setForm({...form, bio:e.target.value})} 
              placeholder="Tell us about yourself..." 
              className="w-full px-3 py-2 rounded-xl border focus:ring-2 focus:ring-[#df1f66]/20 focus:border-[#df1f66]"
              rows="4"
            />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-dusk font-poppins">Social Media</h3>
              <div className="grid gap-3">
                <input 
                  value={form.instagram} 
                  onChange={(e)=>setForm({...form, instagram:e.target.value})} 
                  placeholder="Instagram username or URL" 
                  className="px-3 py-2 rounded-xl border focus:ring-2 focus:ring-[#df1f66]/20 focus:border-[#df1f66]" 
                />
                <input 
                  value={form.tiktok} 
                  onChange={(e)=>setForm({...form, tiktok:e.target.value})} 
                  placeholder="TikTok username or URL" 
                  className="px-3 py-2 rounded-xl border focus:ring-2 focus:ring-[#df1f66]/20 focus:border-[#df1f66]" 
                />
                <input 
                  value={form.linkedin} 
                  onChange={(e)=>setForm({...form, linkedin:e.target.value})} 
                  placeholder="LinkedIn username or URL" 
                  className="px-3 py-2 rounded-xl border focus:ring-2 focus:ring-[#df1f66]/20 focus:border-[#df1f66]" 
                />
              </div>
        </div>
      </form>
        )}
      </div>
    </div>
  )
}



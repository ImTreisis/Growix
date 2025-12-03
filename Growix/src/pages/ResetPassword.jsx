import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'
import { useToast } from '../components/Toast.jsx'

export default function ResetPassword() {
  const { api } = useAuth()
  const { show } = useToast()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') || ''
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!token) {
      show('Reset link is missing or invalid', 'error')
      return
    }
    if (!password) {
      show('Choose a new password', 'error')
      return
    }
    if (password !== confirmPassword) {
      show('Passwords do not match', 'error')
      return
    }

    setIsSubmitting(true)
    try {
      await api.post('/auth/reset-password', { token, password })
      show('Password updated — you can log in now.')
      navigate('/auth')
    } catch (err) {
      const message = err.response?.data?.message || 'Reset failed'
      show(message, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto cozy-card p-6 grid gap-3 shadow-subtle">
      <div>
        <h1 className="text-2xl font-poppins font-semibold text-black">Choose a new password</h1>
        <p className="text-sm text-neutral-600">Pick a strong password (8+ characters, 1 number, 1 symbol).</p>
      </div>
      {!token && (
        <div className="p-3 rounded-xl bg-red-100 text-red-800 text-sm">
          This link is missing a token. Please restart the reset process.
        </div>
      )}
      <form onSubmit={handleSubmit} className="grid gap-3">
        <div>
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="px-3 py-2 rounded-xl border w-full"
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e)=>setConfirmPassword(e.target.value)}
            className="px-3 py-2 rounded-xl border w-full"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 rounded-xl font-medium ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-dusk text-white hover:bg-dusk/90'}`}
        >
          {isSubmitting ? 'Updating...' : 'Reset password'}
        </button>
      </form>
      <div className="text-sm">
        <Link to="/auth" className="text-dusk font-semibold">Back to login</Link>
      </div>
    </div>
  )
}



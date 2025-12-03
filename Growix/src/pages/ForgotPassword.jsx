import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'
import { useToast } from '../components/Toast.jsx'

export default function ForgotPassword() {
  const { api } = useAuth()
  const { show } = useToast()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!email) {
      show('Enter the email tied to your account', 'error')
      return
    }

    setIsSubmitting(true)
    try {
      await api.post('/auth/request-password-reset', { email })
      show('If the email exists, a reset link is on its way.')
    } catch (err) {
      console.error('Password reset request failed', err)
      show('Could not send reset link right now', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto cozy-card p-6 grid gap-3 shadow-subtle">
      <div>
        <h1 className="text-2xl font-poppins font-semibold text-black">Forgot password</h1>
        <p className="text-sm text-neutral-600">We will email you a link to choose a new password. Check Spam!</p>
      </div>
      <form onSubmit={submit} className="grid gap-3">
        <div>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="px-3 py-2 rounded-xl border w-full"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 rounded-xl font-medium ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-dusk text-white hover:bg-dusk/90'}`}
        >
          {isSubmitting ? 'Sending...' : 'Send reset link'}
        </button>
      </form>
      <div className="text-sm">
        Remembered it? <Link to="/auth" className="text-dusk font-semibold">Back to login</Link>
      </div>
    </div>
  )
}



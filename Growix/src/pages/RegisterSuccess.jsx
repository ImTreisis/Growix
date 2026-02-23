import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'

export default function RegisterSuccess() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [message, setMessage] = useState('Processing your registration...')

  useEffect(() => {
    if (!user) {
      navigate('/auth', { replace: true })
      return
    }
    const sessionId = new URLSearchParams(window.location.search).get('session_id')
    if (sessionId) {
      setMessage('You are officially registered! Check your email for confirmation.')
      setTimeout(() => navigate(`/detail/${id}`), 3000)
    } else {
      setMessage('Registration complete! Check your email for confirmation.')
      setTimeout(() => navigate(`/detail/${id}`), 2000)
    }
  }, [id, user, navigate])

  return (
    <div className="flex justify-center">
      <div className="cozy-card p-8 max-w-xl w-full shadow-subtle text-center">
        <h1 className="text-2xl font-semibold text-dusk mb-4">Success!</h1>
        <p className="text-cocoa">{message}</p>
        <p className="text-sm text-cocoa/70 mt-4">Redirecting to event details...</p>
      </div>
    </div>
  )
}

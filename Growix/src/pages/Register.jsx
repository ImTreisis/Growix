import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'
import { useToast } from '../components/Toast.jsx'

const formatSeminarDate = (localDateTime, fallbackDate) => {
  if (!localDateTime && !fallbackDate) return ''
  try {
    const value = localDateTime || fallbackDate
    let base = typeof value === 'string' ? value.trim() : String(value)
    if (!base) return ''
    if (base.includes('.')) base = base.split('.')[0]
    if (base.endsWith('Z')) base = base.slice(0, -1)
    if (base.length > 16) base = base.slice(0, 16)
    if (!base.includes('T')) return base
    const [datePart, timePart = ''] = base.split('T')
    const [year, month, day] = datePart.split('-').map(Number)
    const [hourStr = '00', minuteStr = '00'] = timePart.split(':')
    const hour = parseInt(hourStr, 10)
    const minute = parseInt(minuteStr, 10)
    const dateObj = new Date(Date.UTC(year, (month || 1) - 1, day || 1, isNaN(hour) ? 0 : hour, isNaN(minute) ? 0 : minute))
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC'
    }).format(dateObj)
  } catch {
    return ''
  }
}

export default function Register() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { api, user, isLoading } = useAuth()
  const { show } = useToast()
  const [seminar, setSeminar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth', { replace: true })
      return
    }
    if (!user) return
    setFirstName(user.firstName || '')
    setLastName(user.lastName || '')
    const fetchSeminar = async () => {
      try {
        const r = await api.get(`/seminars/${id}`)
        setSeminar(r.data.seminar)
      } catch {
        show('Seminar not found', 'error')
        navigate(-1)
      } finally {
        setLoading(false)
      }
    }
    fetchSeminar()
  }, [api, id, user, navigate, show])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!firstName.trim() || !lastName.trim()) {
      show('Please enter your first and last name', 'error')
      return
    }
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      const r = await api.post('/registrations/checkout', {
        seminarId: id,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      })
      if (r.data.free) {
        show('You are registered! Check your email for confirmation.')
        navigate(`/detail/${id}`)
      } else if (r.data.url) {
        window.location.href = r.data.url
      } else {
        show('Something went wrong', 'error')
      }
    } catch (err) {
      show(err.response?.data?.message || 'Registration failed', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || !user || loading || !seminar) return null

  const dateStr = formatSeminarDate(seminar.localDateTime, seminar.date)
  const isFree = !seminar.price || seminar.price === '0' || seminar.price === '0.00'
  const priceNum = isFree ? 0 : parseFloat(String(seminar.price).replace(',', '.')) || 0
  const feeNum = Math.round(priceNum * 10) / 100
  const totalNum = priceNum + feeNum

  return (
    <div className="flex justify-center">
      <div className="cozy-card p-6 max-w-xl w-full shadow-subtle">
        <h1 className="text-2xl font-semibold text-dusk mb-2">Register for {seminar.title}</h1>
        <p className="text-cocoa/80 text-sm mb-4">
          {dateStr} • {seminar.venue}
        </p>
        {seminar.price && !isFree && (
          <div className="mb-4 space-y-1">
            <p className="text-cocoa/80">Workshop: €{seminar.price}</p>
            <p className="text-cocoa/80">Platform fee (10%): €{feeNum.toFixed(2)}</p>
            <p className="text-pink-600 font-semibold">Total: €{totalNum.toFixed(2)}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <label className="block text-sm text-cocoa/80 mb-1">First name</label>
            <input
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border"
              placeholder="First name"
            />
          </div>
          <div>
            <label className="block text-sm text-cocoa/80 mb-1">Last name</label>
            <input
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border"
              placeholder="Last name"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-4 py-3 bg-dusk text-white rounded-xl font-medium ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Processing...' : isFree ? 'Register (Free)' : 'Pay €' + totalNum.toFixed(2)}
          </button>
        </form>
      </div>
    </div>
  )
}

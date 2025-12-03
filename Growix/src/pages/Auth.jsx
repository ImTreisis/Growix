import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'
import { useToast } from '../components/Toast.jsx'

export default function Auth() {
  const { api, login, setUser } = useAuth()
  const { show } = useToast()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ emailOrUsername:'', email:'', username:'', password:'', firstName:'', lastName:'' })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  // Client-side validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password) => {
    const minLength = password.length >= 8
    const hasNumber = /\d/.test(password)
    const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
    
    return {
      isValid: minLength && hasNumber && hasSymbol,
      errors: {
        minLength: !minLength ? 'Password must be at least 8 characters' : null,
        hasNumber: !hasNumber ? 'Password must contain at least 1 number' : null,
        hasSymbol: !hasSymbol ? 'Password must contain at least 1 symbol' : null
      }
    }
  }

  const validateUsername = (username) => {
    if (username.length < 5 || username.length > 20) {
      return 'Username must be 5-20 characters long'
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return 'Username can only contain letters, numbers, and underscores'
    }
    return null
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (mode === 'login') {
      if (!form.emailOrUsername) newErrors.emailOrUsername = 'Email or username is required'
      if (!form.password) newErrors.password = 'Password is required'
    } else {
      if (!form.email) newErrors.email = 'Email is required'
      else if (!validateEmail(form.email)) newErrors.email = 'Invalid email format'
      
      if (!form.username) newErrors.username = 'Username is required'
      else {
        const usernameError = validateUsername(form.username)
        if (usernameError) newErrors.username = usernameError
      }
      
      if (!form.password) newErrors.password = 'Password is required'
      else {
        const passwordValidation = validatePassword(form.password)
        if (!passwordValidation.isValid) {
          newErrors.password = Object.values(passwordValidation.errors).filter(Boolean).join(', ')
        }
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const submit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      show('Please fix the errors below', 'error')
      return
    }
    
    setIsLoading(true)
    try {
      let r
      if (mode === 'login') {
        r = await api.post('/auth/login', { emailOrUsername: form.emailOrUsername, password: form.password })
        show('Welcome back!')
      } else {
        r = await api.post('/auth/register', { email: form.email, username: form.username, password: form.password, firstName: form.firstName, lastName: form.lastName })
        show('Account created successfully!')
      }
      // Session is automatically created by backend
      login(r.data.user) // Update user state
      setUser(r.data.user)
      navigate('/')
    } catch (err) {
      const errorData = err.response?.data
      if (errorData?.errors) {
        // Handle detailed validation errors from backend
        setErrors(errorData.errors)
        show('Please fix the errors below', 'error')
      } else {
        const message = errorData?.message || (mode === 'login' ? 'Invalid credentials' : 'Registration failed')
        show(message, 'error')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const clearErrors = () => {
    setErrors({})
  }

  return (
    <div className="max-w-md mx-auto cozy-card p-6 grid gap-3 shadow-subtle">
      <div className="flex gap-3">
        <button 
          type="button"
          onClick={()=>{setMode('login'); clearErrors()}} 
          className={`px-3 py-2 rounded-xl ${mode==='login'?'bg-red-300 bg-opacity-75 font-poppins font-bold transition-all duration-200 hover:scale-105':''}`}
        >
          Login
        </button>
        <button 
          type="button"
          onClick={()=>{setMode('register'); clearErrors()}} 
          className={`px-3 py-2 rounded-xl ${mode==='register'?'bg-red-300 bg-opacity-75 font-poppins font-poppins font-bold transition-all duration-200 hover:scale-105':''}`}
        >
          Register
        </button>
      </div>
      <form onSubmit={submit} className="grid gap-3">
        {mode==='login' ? (
          <>
            <div>
              <input 
                required 
                placeholder="Email or Username" 
                value={form.emailOrUsername} 
                onChange={(e)=>setForm({...form, emailOrUsername:e.target.value})} 
                className={`px-3 py-2 rounded-xl border w-full ${errors.emailOrUsername ? 'border-red-500' : ''}`}
                onFocus={clearErrors}
              />
              {errors.emailOrUsername && <p className="text-red-500 text-sm mt-1">{errors.emailOrUsername}</p>}
            </div>
            <div>
              <input 
                required 
                type="password" 
                placeholder="Password" 
                value={form.password} 
                onChange={(e)=>setForm({...form, password:e.target.value})} 
                className={`px-3 py-2 rounded-xl border w-full ${errors.password ? 'border-red-500' : ''}`}
                onFocus={clearErrors}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              <div className="text-sm mt-2">
                <Link to="/forgot-password" className="text-dusk font-semibold">Forgot password?</Link>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <input 
                placeholder="First name" 
                value={form.firstName} 
                onChange={(e)=>setForm({...form, firstName:e.target.value})} 
                className="px-3 py-2 rounded-xl border"
                onFocus={clearErrors}
              />
              <input 
                placeholder="Last name" 
                value={form.lastName} 
                onChange={(e)=>setForm({...form, lastName:e.target.value})} 
                className="px-3 py-2 rounded-xl border"
                onFocus={clearErrors}
              />
            </div>
            <div>
              <input 
                required 
                type="email"
                placeholder="Email" 
                value={form.email} 
                onChange={(e)=>setForm({...form, email:e.target.value})} 
                className={`px-3 py-2 rounded-xl border w-full ${errors.email ? 'border-red-500' : ''}`}
                onFocus={clearErrors}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <input 
                required 
                placeholder="Username (5-20 characters)" 
                value={form.username} 
                onChange={(e)=>setForm({...form, username:e.target.value})} 
                className={`px-3 py-2 rounded-xl border w-full ${errors.username ? 'border-red-500' : ''}`}
                onFocus={clearErrors}
              />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>
            <div>
              <input 
                required 
                type="password" 
                placeholder="Password (8+ chars, 1 number, 1 symbol)" 
                value={form.password} 
                onChange={(e)=>setForm({...form, password:e.target.value})} 
                className={`px-3 py-2 rounded-xl border w-full ${errors.password ? 'border-red-500' : ''}`}
                onFocus={clearErrors}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
          </>
        )}
        <button 
          type="submit"
          disabled={isLoading}
          className={`px-4 py-2 rounded-xl font-medium ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-dusk text-white hover:bg-dusk/90'}`}
        >
          {isLoading ? 'Processing...' : (mode==='login' ? 'Login' : 'Create account')}
        </button>
      </form>
    </div>
  )
}



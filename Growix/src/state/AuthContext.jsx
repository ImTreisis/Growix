import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api' })

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      api.defaults.headers.common.Authorization = `Bearer ${token}`
      api.get('/auth/me').then((r) => setUser(r.data.user)).catch(() => {})
    } else {
      localStorage.removeItem('token')
      delete api.defaults.headers.common.Authorization
      setUser(null)
    }
  }, [token])

  const logout = () => { setToken(''); setUser(null) }
  const value = useMemo(() => ({ token, setToken, user, setUser, api, logout }), [token, user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}



import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

const api = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL || 'https://growix.onrender.com/api',
  withCredentials: true // Send cookies with requests
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Clear any old localStorage data that might interfere with cookie auth
    const oldToken = localStorage.getItem('token');
    if (oldToken) {
      console.log('Clearing old token from localStorage');
      localStorage.removeItem('token');
    }
    
    // Check if user is logged in by calling /users/me
    api.get('/users/me')
      .then((r) => {
        console.log('Auth check successful:', r.data.user);
        setUser(r.data.user);
      })
      .catch((err) => {
        console.log('Auth check failed:', err.response?.status, err.response?.data);
        setUser(null);
      })
      .finally(() => setLoading(false))
  }, [])

  const login = (userData) => {
    setUser(userData)
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setUser(null)
      // Clear any old localStorage data that might be interfering
      localStorage.clear()
    }
  }

  const value = useMemo(() => ({ user, setUser, login, logout, api, loading }), [user, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}



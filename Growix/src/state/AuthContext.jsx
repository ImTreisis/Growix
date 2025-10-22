import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

const api = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL || '/api', // Same domain - no CORS needed!
  withCredentials: true // Include cookies in all requests
})

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't automatically logout on 401 - let components handle it
    // This prevents logout when trying to save while not logged in
    return Promise.reject(error)
  }
)

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/users/me')
        setUser(response.data.user)
      } catch {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [])

  const login = (userData) => {
    setUser(userData)
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
    }
  }

  const value = useMemo(() => ({ 
    user, 
    setUser, 
    login, 
    logout, 
    api, 
    isLoading 
  }), [user, isLoading])
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}



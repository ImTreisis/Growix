import { useEffect } from 'react'
import { useAuth } from '../state/AuthContext.jsx'

export default function LogoutListener(){
  const { logout } = useAuth()
  useEffect(()=>{
    const handler = ()=> logout()
    window.addEventListener('growix:logout', handler)
    return ()=> window.removeEventListener('growix:logout', handler)
  }, [logout])
  return null
}



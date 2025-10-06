import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import LogoutListener from './components/LogoutListener.jsx'
import Home from './pages/Home.jsx'
import Browse from './pages/Browse.jsx'
import Organize from './pages/Organize.jsx'
import Profile from './pages/Profile.jsx'
import Saved from './pages/Saved.jsx'
import Auth from './pages/Auth.jsx'
import Detail from './pages/Detail.jsx'
import { AuthProvider, useAuth } from './state/AuthContext.jsx'
import ToastProvider from './components/Toast.jsx'

function PrivateRoute({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/auth" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
      <BrowserRouter>
        <div className="min-h-full gradient-bg">
          <LogoutListener />
          <Navbar />
          <main className="max-w-6xl mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/detail/:id" element={<Detail />} />
              <Route path="/organize" element={<PrivateRoute><Organize /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/saved" element={<PrivateRoute><Saved /></PrivateRoute>} />
              <Route path="/auth" element={<Auth />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}

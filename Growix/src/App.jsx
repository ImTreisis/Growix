import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import LogoutListener from './components/LogoutListener.jsx'
import Home from './pages/Home.jsx'
import Browse from './pages/Browse.jsx'
import Organize from './pages/Organize.jsx'
import About from './pages/About.jsx'
import Profile from './pages/Profile.jsx'
import PublicProfile from './pages/PublicProfile.jsx'
import Saved from './pages/Saved.jsx'
import Auth from './pages/Auth.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import Detail from './pages/Detail.jsx'
import Edit from './pages/Edit.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import TermsOfService from './pages/TermsOfService.jsx'
import { AuthProvider, useAuth } from './state/AuthContext.jsx'
import ToastProvider from './components/Toast.jsx'

function PrivateRoute({ children }) {
  const { user, isLoading } = useAuth()
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-cocoa">Loading...</div>
      </div>
    )
  }
  
  // Redirect to auth if not logged in
  return user ? children : <Navigate to="/auth" replace />
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
              <Route path="/workshops" element={<Browse />} />
              <Route path="/detail/:id" element={<Detail />} />
              <Route path="/detail/:id/edit" element={<PrivateRoute><Edit /></PrivateRoute>} />
              <Route path="/create" element={<PrivateRoute><Organize /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/profile/:userId" element={<PublicProfile />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}

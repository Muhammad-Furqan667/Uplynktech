import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ProtectedRoute = ({ children, requireAdmin = false, allowedRoles = [] }) => {
  const { user, profile, loading, profileLoading } = useAuth()
  const location = useLocation()

  // Define effective allowed roles
  const effectiveRoles = allowedRoles.length > 0 
    ? allowedRoles 
    : (requireAdmin ? ['Admin'] : [])

  // Only show the full initialization screen if we have NO user and are still loading
  // This prevents the page from unmounting during background focus checks if a session exists
  if (loading && !user) {
    return <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#F8F7F2',
      color: '#d4af37',
      fontSize: '1.2rem',
      fontWeight: 'bold'
    }}>Initializing Session...</div>
  }

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  // If we require admin, we MUST wait for the profile sync to finish ONLY on first load
  // Background profile updates (on focus/tab change) should be silent if we already have a profile
  if (requireAdmin && profileLoading && !profile) {
    return <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#F8F7F2',
      color: '#d4af37',
      fontSize: '1.1rem'
    }}>Verifying Credentials...</div>
  }

  if (requireAdmin && profile?.role !== 'Admin') {
    return <Navigate to="/erp/dashboard" replace />
  }

  return children
}

export default ProtectedRoute

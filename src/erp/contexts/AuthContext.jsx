import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import SecurityOverlay from '../components/SecurityOverlay'

const AuthContext = createContext({})

// Production Security Constants
const INACTIVITY_TIMEOUT = 60 * 60 * 1000 // 1 Hour
const MAX_SESSION_LIFE = 5 * 24 * 60 * 60 * 1000 // 5 Days

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [isSenior, setIsSenior] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(INACTIVITY_TIMEOUT)
  const lastActivityRef = useRef(Date.now())
  const location = useLocation()
  const navigate = useNavigate()

  const resetInactivityTimer = () => {
    lastActivityRef.current = Date.now()
    if (showTimeoutWarning) setShowTimeoutWarning(false)
    setTimeLeft(INACTIVITY_TIMEOUT)
  }

  // Effect 1: Core Auth Listener (Stable)
  useEffect(() => {
    let mounted = true
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return
      const sessionUser = session?.user ?? null
      setUser(sessionUser)

      if (sessionUser && !localStorage.getItem('uplynk_session_start')) {
        localStorage.setItem('uplynk_session_start', Date.now().toString())
      } else if (!sessionUser) {
        localStorage.removeItem('uplynk_session_start')
      }

      setLoading(false)
      if (sessionUser) syncUserData(sessionUser)
    })

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        if (session?.user) {
          setUser(session.user)
          syncUserData(session.user)
        }
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  // Effect 2: Security Engine (60m Total / 58m Warning)
  useEffect(() => {
    if (!user || !location.pathname.startsWith('/erp')) {
      setShowTimeoutWarning(false)
      return
    }

    const checkTimers = () => {
      const now = Date.now()
      const diff = now - lastActivityRef.current
      const isPersistent = localStorage.getItem('uplynk_stay_logged_in') === 'true'

      const sessionStart = localStorage.getItem('uplynk_session_start')
      if (sessionStart && (now - parseInt(sessionStart)) > MAX_SESSION_LIFE) {
        signOut()
        return
      }

      if (!isPersistent) {
        const WARNING_THRESHOLD = 58 * 60 * 1000 // 58 Minutes
        const LOGOUT_THRESHOLD = 60 * 60 * 1000 // 60 Minutes

        if (diff >= LOGOUT_THRESHOLD) {
          signOut()
        } else if (diff >= WARNING_THRESHOLD) {
          setShowTimeoutWarning(true)
          setTimeLeft(LOGOUT_THRESHOLD - diff)
        } else {
          if (showTimeoutWarning) setShowTimeoutWarning(false)
          setTimeLeft(LOGOUT_THRESHOLD - diff)
        }
      }
    }

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    const handleActivity = () => resetInactivityTimer()
    events.forEach(name => window.addEventListener(name, handleActivity))
    
    const interval = setInterval(checkTimers, 1000) // 1s check for production
    
    const handleVisibility = () => { if (document.visibilityState === 'visible') checkTimers() }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibility)
      events.forEach(name => window.removeEventListener(name, handleActivity))
    }
  }, [user, location.pathname])

  // Effect 3: Forceful Redirection Sentinel
  useEffect(() => {
    if (!loading && !user && location.pathname.startsWith('/erp')) {
      navigate('/auth/login', { replace: true })
    }
  }, [user, loading, location.pathname, navigate])

  const syncUserData = async (sessionUser) => {
    setProfileLoading(true)
    try {
      await Promise.all([ fetchProfile(sessionUser.id), checkSeniorStatus(sessionUser.id) ])
    } finally {
      setProfileLoading(false)
    }
  }

  const fetchProfile = async (userId) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (data) setProfile(data)
  }

  const checkSeniorStatus = async (userId) => {
    const { data } = await supabase.rpc('has_subordinates', { p_user_id: userId })
    if (typeof data === 'boolean') setIsSenior(data)
  }

  const signIn = async (email, password, stayLoggedIn = false) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    localStorage.setItem('uplynk_stay_logged_in', stayLoggedIn.toString())
    localStorage.setItem('uplynk_session_start', Date.now().toString())
    return data
  }

  const signOut = async () => {
    // 1. OPTIMISTIC RESET: Wipe state instantly
    setUser(null)
    setProfile(null)
    setIsSenior(false)

    // 2. NUKE STORAGE: Clear all session traces to fix login friction
    Object.keys(localStorage).forEach(key => {
      if (key.includes('sb-') || key.includes('uplynk_')) {
        localStorage.removeItem(key)
      }
    })
    sessionStorage.clear()

    // 3. BACKGROUND CLEANUP: Await nothing for UX speed
    supabase.auth.signOut().catch(console.error)
    
    // 4. FORCE REFRESH: Ensures a clean state for the next login
    window.location.href = '/auth/login'
  }

  return (
    <AuthContext.Provider value={{ 
      user, profile, isSenior, loading, profileLoading, 
      showTimeoutWarning, timeLeft, 
      signIn, signOut, resetInactivityTimer 
    }}>
      {children}
      {showTimeoutWarning && localStorage.getItem('uplynk_stay_logged_in') !== 'true' && (
        <SecurityOverlay timeLeft={timeLeft} onExtend={resetInactivityTimer} />
      )}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

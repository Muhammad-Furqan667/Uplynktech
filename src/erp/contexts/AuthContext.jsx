import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [isSenior, setIsSenior] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    console.log('[AuthContext] Initializing auth listeners...')
    
    // Safety timeout: Ensure the app loads even if Supabase/Network is slow
    const timeout = setTimeout(() => {
      if (mounted) {
        console.warn('[AuthContext] Loading timeout! Forcing loading = false')
        setLoading(false)
      }
    }, 5000)

    const syncUserData = async (sessionUser) => {
      if (!sessionUser || !mounted) {
        setProfile(null)
        setIsSenior(false)
        setProfileLoading(false)
        return
      }

      setProfileLoading(true)
      console.log('[AuthContext] Starting background sync for:', sessionUser.email)
      
      try {
        const start = Date.now()
        // Run profile and status checks in parallel for speed
        await Promise.all([
          fetchProfile(sessionUser.id),
          checkSeniorStatus(sessionUser.id)
        ])
        console.log(`[AuthContext] Background sync complete in ${Date.now() - start}ms`)
      } catch (err) {
        console.error('[AuthContext] Background sync error:', err)
      } finally {
        if (mounted) {
          setProfileLoading(false)
          setLoading(false) // Final safety
        }
      }
    }

    // Single listener for all auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return
      console.log(`[AuthContext] Auth Event: ${event}`)
      
      const sessionUser = session?.user ?? null
      setUser(sessionUser)
      
      // RELEASE UI IMMEDIATELY: We know if we have a user or not
      setLoading(false)
      clearTimeout(timeout)
      
      // SYNC IN BACKGROUND: Don't block the UI transition
      syncUserData(sessionUser)
    })

    // Initial check (handles cases where listener might be too late)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted && session?.user && !user) {
        console.log('[AuthContext] Session found via getSession')
        setUser(session.user)
        setLoading(false)
        syncUserData(session.user)
      }
    })

    return () => {
      mounted = false
      clearTimeout(timeout)
      subscription.unsubscribe()
    }
  }, [])

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      setProfile(data)
      return data
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  }

  const checkSeniorStatus = async (userId) => {
    try {
      const { data, error } = await supabase.rpc('has_subordinates', { p_user_id: userId })
      if (!error) setIsSenior(data)
    } catch (error) {
      console.error('Error checking senior status:', error)
    }
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{ user, profile, isSenior, loading, profileLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

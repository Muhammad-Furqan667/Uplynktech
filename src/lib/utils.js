import { supabase } from './supabase'

/**
 * Resolves an image source.
 */
export const resolveImageUrl = (src) => {
  if (!src) return ''
  if (src.startsWith('http')) return src
  if (src.startsWith('/')) return src
  return `/img/${src}`
}

/**
 * checkLeadRateLimit
 * Enforces a hard lock: max 2 leads per 45 minutes from same email.
 * @param {string} email 
 * @returns {Promise<{allowed: boolean, remainingMins?: number}>}
 */
export const checkLeadRateLimit = async (email) => {
  const fortyFiveMinsAgo = new Date(Date.now() - 45 * 60 * 1000).toISOString()
  
  const { data, count, error } = await supabase
    .from('contact_leads')
    .select('created_at', { count: 'exact' })
    .eq('email', email)
    .gt('created_at', fortyFiveMinsAgo)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Rate limit check failed:', error)
    return { allowed: true } // Fail open to not block real inquiries
  }

  if (count >= 2) {
    const oldestLead = new Date(data[data.length - 1].created_at)
    const nextAllowedTime = new Date(oldestLead.getTime() + 45 * 60 * 1000)
    const diffMs = nextAllowedTime - Date.now()
    const mins = Math.ceil(diffMs / (60 * 1000))
    
    return { 
      allowed: false, 
      remainingMins: mins > 0 ? mins : 1 
    }
  }

  return { allowed: true }
}

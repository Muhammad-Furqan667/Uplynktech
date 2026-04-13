import { useState, useEffect, useRef } from 'react'
import { FiMail, FiSend, FiInbox, FiExternalLink, FiUser, FiInfo } from 'react-icons/fi'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import './Mail.css'

const Mail = () => {
  const { user, profile } = useAuth()
  const [activeTab, setActiveTab] = useState('internal')
  const [messages, setMessages] = useState([])
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPeer, setSelectedPeer] = useState(null)
  const [replyContent, setReplyContent] = useState('')
  const [sending, setSending] = useState(false)
  const chatHistoryRef = useRef(null)

  const isContactHandler = 
    profile?.role === 'Admin' || 
    profile?.role === 'Contact' ||
    profile?.email === 'contactus@uplynktech.com' || 
    profile?.designation === 'Contact Officer'

  useEffect(() => {
    fetchMail()
    if (isContactHandler) fetchLeads()
  }, [activeTab])

  // Auto-scroll to bottom of chat container only
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight
    }
  }, [messages, selectedPeer])

  const isFetchingBus = useRef(false)

  const fetchMail = async (isSilent = false) => {
    if (isFetchingBus.current) return // Concurrency Guard: Skip if another fetch is active
    
    if (!isSilent) setLoading(true)
    isFetchingBus.current = true

    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(id, full_name, emp_id),
          receiver:profiles!messages_receiver_id_fkey(id, full_name, emp_id)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      if (error) throw error
      setMessages(data)
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      if (!isSilent) setLoading(false)
      isFetchingBus.current = false
    }
  }

  // 2. Realtime Subscription (Modern Channel API)
  useEffect(() => {
    if (!user?.id) return

    
    const channel = supabase.channel('erp-chat')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages' 
      }, async (payload) => {
        
        const rawMsg = payload.new
        const isSelfInvolved = rawMsg.receiver_id === user.id || rawMsg.sender_id === user.id
        
        if (isSelfInvolved) {
          // HYDRATION ENGINE: Realtime payloads are raw. We need to fetch profiles for the sidebar/UI.
          try {
            const { data: sender } = await supabase.from('profiles').select('id, full_name, emp_id').eq('id', rawMsg.sender_id).single()
            const { data: receiver } = await supabase.from('profiles').select('id, full_name, emp_id').eq('id', rawMsg.receiver_id).single()
            
            const fullMsg = {
              ...rawMsg,
              sender,
              receiver
            }


            setMessages(prev => {
              // Dedupe: check if we already have this message (or its optimistic placeholder)
              if (prev.some(m => m.id === fullMsg.id || (m.isOptimistic && m.content === fullMsg.content && m.sender_id === fullMsg.sender_id))) {
                // If ID matches, replace optimistic with real message
                return prev.map(m => (m.id === fullMsg.id || (m.isOptimistic && m.content === fullMsg.content && m.sender_id === fullMsg.sender_id)) ? fullMsg : m)
              }
              return [fullMsg, ...prev]
            })
          } catch (err) {
            console.error('[HYDRATION_ERROR]', err)
            // Fallback: Add raw message if hydration fails
            setMessages(prev => [rawMsg, ...prev])
          }
        }
      })
      .subscribe((status) => {
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user.id])

  const handleSendMessage = async (e) => {
    // 1. Prevent Page Reload (Absolute First)
    e.preventDefault()
    
    if (!replyContent.trim() || !selectedPeer) return

    const content = replyContent.trim()
    const tempId = `opt-${Date.now()}`
    
    // 3. Optimistic Update (Immediate UI feedback)
    const optimisticMsg = {
      id: tempId,
      sender_id: user.id,
      receiver_id: selectedPeer.id,
      content: content,
      created_at: new Date().toISOString(),
      isOptimistic: true,
      sender: profile,
      receiver: selectedPeer
    }

    setMessages(prev => [optimisticMsg, ...prev])
    setReplyContent('')

    try {
      setSending(true)
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          sender_id: user.id,
          receiver_id: selectedPeer.id,
          content: content
        }])
        .select()

      if (error) throw error
    } catch (error) {
      console.error('[INSERT_ERROR]', error)
      // Rollback optimistic update on error
      setMessages(prev => prev.filter(m => m.id !== tempId))
      alert('Message failed to send. Please try again.')
    } finally {
      setSending(false)
    }
  }

  // 3. Smart Conversation Derivation (Sorting & Previews)
  const conversations = Object.values(messages.reduce((acc, msg) => {
    const isSent = msg.sender_id === user.id
    const peer = isSent ? msg.receiver : msg.sender
    
    if (!peer || peer.id === user.id) return acc
    
    if (!acc[peer.id]) {
      acc[peer.id] = {
        peer,
        lastMessage: msg,
        unreadCount: 0
      }
    } else {
      // Always keep the NEWEST message as the lastMessage
      if (new Date(msg.created_at) > new Date(acc[peer.id].lastMessage.created_at)) {
        acc[peer.id].lastMessage = msg
      }
    }

    // Increment unread if message is for us and not read
    if (msg.receiver_id === user.id && !msg.is_read) {
      acc[peer.id].unreadCount += 1
    }

    return acc
  }, {}))
  .sort((a, b) => new Date(b.lastMessage.created_at) - new Date(a.lastMessage.created_at))

  // 4. Mark as Read Hook
  useEffect(() => {
    if (!selectedPeer || !user?.id) return

    const markThreadAsRead = async () => {
      try {
        const { error } = await supabase
          .from('messages')
          .update({ is_read: true })
          .match({ 
            sender_id: selectedPeer.id, 
            receiver_id: user.id,
            is_read: false 
          })

        if (error) throw error
        
        // Optimistically update local state to clear badges instantly
        setMessages(prev => prev.map(m => 
          (m.sender_id === selectedPeer.id && m.receiver_id === user.id) 
            ? { ...m, is_read: true } 
            : m
        ))
      } catch (err) {
        console.error('[READ_SYNC_ERROR]', err)
      }
    }

    markThreadAsRead()
  }, [selectedPeer, user.id])

  // Filter messages for the current active chat
  const chatMessages = selectedPeer 
    ? messages
        .filter(m => 
          (m.sender_id === selectedPeer.id && m.receiver_id === user.id) || 
          (m.sender_id === user.id && m.receiver_id === selectedPeer.id)
        )
        .reverse() // Display in chronological order
    : []

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_leads')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setLeads(data)
    } catch (error) {
      console.error('Error fetching leads:', error)
    }
  }

  return (
    <div className="mail-hub">
      <div className="mail-header">
        <h1>Mail <span className="gold-text">Hub</span></h1>
        <div className="tab-switcher">
          <button 
            className={`tab-btn ${activeTab === 'internal' ? 'active' : ''}`}
            onClick={() => setActiveTab('internal')}
          >
            <FiInbox /> Internal Messages
          </button>
          
          {isContactHandler && (
            <button 
              className={`tab-btn ${activeTab === 'external' ? 'active' : ''}`}
              onClick={() => setActiveTab('external')}
            >
              <FiExternalLink /> External Leads
            </button>
          )}
        </div>
      </div>

      <div className="mail-container">
        {loading ? (
          <div className="loading-state">Syncing communications...</div>
        ) : activeTab === 'internal' ? (
          <div className="internal-mail-view">
            <div className="message-list">
              <div className="list-header">
                <h3>Conversations</h3>
              </div>
              {conversations.length === 0 ? (
                <div className="empty-mail">
                  <FiMail className="empty-icon" />
                  <p>Your inbox is empty.</p>
                </div>
              ) : (
                conversations.map(conv => {
                  const { peer, lastMessage, unreadCount } = conv
                  const isSent = lastMessage.sender_id === user.id
                  return (
                    <div 
                      key={peer.id} 
                      className={`message-item ${selectedPeer?.id === peer.id ? 'active' : ''} ${unreadCount > 0 ? 'unread' : ''}`}
                      onClick={() => setSelectedPeer(peer)}
                    >
                      <div className="msg-icon">
                        {isSent ? <FiSend /> : <FiInbox />}
                      </div>
                      <div className="msg-content">
                        <div className="msg-meta">
                          <span className="msg-peer">
                            {peer.full_name}
                            {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
                          </span>
                          <span className="msg-date">{new Date(lastMessage.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="msg-preview">
                          {isSent ? 'You: ' : ''}{lastMessage.content}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            <div className="chat-box-container">
              {selectedPeer ? (
                <div className="chat-box">
                  <div className="chat-header">
                    <FiUser className="peer-avatar" />
                    <div className="peer-info">
                      <h4>{selectedPeer.full_name}</h4>
                      <span>Emp ID: {selectedPeer.emp_id}</span>
                    </div>
                  </div>

                  <div className="chat-history" ref={chatHistoryRef}>
                    {chatMessages.length === 0 ? (
                      <div className="no-chat-history">
                        <p>Starting conversation with {selectedPeer.full_name}</p>
                      </div>
                    ) : (
                      chatMessages.map(m => (
                        <div key={m.id} className={`chat-bubble ${m.sender_id === user.id ? 'mine' : 'theirs'}`}>
                          <p>{m.content}</p>
                          <span className="bubble-time">
                            {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  <form className="chat-input-area" onSubmit={handleSendMessage}>
                    <textarea 
                      placeholder="Type your message..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage(e)
                        }
                      }}
                    />
                    <button type="submit" disabled={sending || !replyContent.trim()} className="send-btn">
                      <FiSend />
                    </button>
                  </form>
                </div>
              ) : (
                <div className="chat-placeholder">
                  <FiMail className="placeholder-icon" />
                  <p>Select a contact to open conversation</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="leads-list">
            {leads.length === 0 ? (
              <div className="empty-mail">
                <FiExternalLink className="empty-icon" />
                <p>No external leads yet.</p>
              </div>
            ) : (
              leads.map(lead => (
                <div key={lead.id} className="lead-card">
                  <div className="lead-header">
                    <div className="lead-user">
                      <FiUser />
                      <div>
                        <h4>
                          {lead.full_name}
                          {lead.meta?.smtp_failed && <span className="lead-status-alert">SMTP OFFLINE</span>}
                        </h4>
                        <span>{lead.email}</span>
                      </div>
                    </div>
                    <div className="lead-meta-badges">
                      {lead.meta?.lead_origin && (
                        <span className="lead-origin-tag">{lead.meta.lead_origin}</span>
                      )}
                      <span className="lead-date">{new Date(lead.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="lead-body">
                    <div className="lead-item">
                      <FiInfo />
                      <span>Subject: {lead.subject || (lead.meta?.focus ? `Consultation: ${lead.meta.focus}` : 'General Inquiry')}</span>
                    </div>
                    {(lead.company || lead.meta?.company) && (
                      <div className="lead-item">
                         <FiExternalLink />
                         <span>Company: {lead.company || lead.meta.company}</span>
                      </div>
                    )}
                    {lead.meta?.scale && (
                      <div className="lead-tag">
                        Scale: {lead.meta.scale}
                    </div>
                    )}
                    <p className="lead-message">"{lead.message}"</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Mail

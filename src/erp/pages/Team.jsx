import { useState, useEffect } from 'react'
import { FiMessageSquare, FiSearch, FiUser, FiEye, FiClock, FiX } from 'react-icons/fi'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import './Team.css'

const Team = () => {
  const { user } = useAuth()
  const [teams, setTeams] = useState([]) // Grouped by team name
  const [expandedTeams, setExpandedTeams] = useState([]) // Array of expanded team IDs
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [allTeammates, setAllTeammates] = useState([]) // For search functionality
  
  // Interaction State
  const [recipient, setRecipient] = useState(null)
  const [messageContent, setMessageContent] = useState('')
  const [isSending, setIsSending] = useState(false)
  
  // Task View State
  const [viewingTasks, setViewingTasks] = useState(null) // Profile of teammate being viewed
  const [teammateTasks, setTeammateTasks] = useState([])

  useEffect(() => {
    // Initial load
    fetchTeamData()

    // Setup periodic sync (10s for team stability)
    const syncInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchTeamData()
      }
    }, 10000)

    return () => clearInterval(syncInterval)
  }, [])

  const fetchTeamData = async () => {
    try {
      setLoading(true)
      
      // 1. Get all Admins (Universal Support)
      const { data: admins } = await supabase
        .from('profiles')
        .select('id, full_name, emp_id, designation')
        .eq('role', 'Admin')

      // 2. Get teams I belong to
      const { data: myTeams } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', user.id)
      
      let memberList = []
      if (myTeams && myTeams.length > 0) {
        const teamIds = myTeams.map(t => t.team_id)

        // 3. Get all members of those teams WITH team names
        const { data: members, error: memError } = await supabase
          .from('team_members')
          .select(`
            team_id,
            team:teams(name),
            can_chat,
            can_see_tasks,
            user:profiles(id, full_name, emp_id, designation)
          `)
          .in('team_id', teamIds)
        
        if (memError) throw memError
        memberList = members || []
      }

      // 4. Get my subordinates (to check senior override)
      const { data: subordinates } = await supabase
        .from('hierarchy')
        .select('user_id')
        .eq('senior_id', user.id)
      
      const subIds = subordinates?.map(s => s.user_id) || []

      // 5. Build Grouped Structure
      // Admin group always exists
      const grouped = {
        'admin_support': {
          id: 'admin_support',
          name: 'ADMIN SUPPORT',
          members: []
        }
      }

      // Add actual teams
      memberList.forEach(m => {
        const tId = m.team_id
        const tName = m.team?.name || 'Shared Unit'
        const u = m.user
        
        if (!u || u.id === user.id) return

        if (!grouped[tId]) {
          grouped[tId] = { id: tId, name: tName, members: [] }
        }

        const isJunior = subIds.includes(u.id)
        
        // Avoid duplicates in the same team
        if (!grouped[tId].members.find(mem => mem.id === u.id)) {
          grouped[tId].members.push({
            ...u,
            canChat: m.can_chat || isJunior,
            canSeeTasks: m.can_see_tasks || isJunior,
            isSubordinate: isJunior,
            isAdmin: false
          })
        }
      })

      // Add Admins to special group
      admins?.forEach(adm => {
        if (adm.id === user.id) return
        grouped['admin_support'].members.push({
          ...adm,
          canChat: true,
          canSeeTasks: false,
          isSubordinate: false,
          isAdmin: true
        })
      })

      // Clean up empty admin group if no admins (unlikely)
      if (grouped['admin_support'].members.length === 0) {
        delete grouped['admin_support']
      }

      const teamList = Object.values(grouped)
      setTeams(teamList)
      setAllTeammates(teamList.flatMap(t => t.members))
      
      // Auto-expand first team if exists
      if (teamList.length > 0) {
        setExpandedTeams([teamList[0].id])
      }
    } catch (error) {
      console.error('Error fetching team data:', error)
    } finally {
      setLoading(false)
    }
  }

  const [notice, setNotice] = useState(null)

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!messageContent.trim() || !recipient) return
    setIsSending(true)
    setNotice(null)
    try {
      const { error } = await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: recipient.id,
        content: messageContent
      })
      if (error) throw error
      setNotice({ type: 'success', message: `Message sent to ${recipient.full_name}` })
      setMessageContent('')
      setTimeout(() => {
        setRecipient(null)
        setNotice(null)
      }, 2000)
    } catch (error) {
      setNotice({ type: 'error', message: 'Error: ' + error.message })
    } finally {
      setIsSending(false)
    }
  }

  const fetchTasksOf = async (teammate) => {
    setViewingTasks(teammate)
    try {
      const { data } = await supabase
        .from('tasks')
        .select('*')
        .eq('assignee_id', teammate.id)
        .order('created_at', { ascending: false })
      setTeammateTasks(data || [])
    } catch (error) {
      console.error('Error fetching teammate tasks:', error)
    }
  }

  const toggleTeam = (id) => {
    setExpandedTeams(prev => 
      prev.includes(id) ? prev.filter(tId => tId !== id) : [...prev, id]
    )
  }

  const filteredTeams = teams.map(team => ({
    ...team,
    members: team.members.filter(emp => 
      emp.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      emp.emp_id?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(team => team.members.length > 0)

  return (
    <div className="team-container">
      <div className="team-header">
        <div className="header-left">
          <h1>UPLYNK <span className="gold-text">Team</span></h1>
          <p>Collaborate with your designated team members and functional peers.</p>
        </div>
        <div className="header-actions">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search teammates..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Syncing team...</div>
      ) : teams.length === 0 ? (
        <div className="empty-team-state">
          <FiUser className="placeholder-icon" />
          <p>You haven't been assigned to any teams yet.</p>
          <span>Contact an Admin to join a functional unit.</span>
        </div>
      ) : (
        <div className="team-accordion">
          {filteredTeams.map(team => (
            <div key={team.id} className={`team-group ${expandedTeams.includes(team.id) ? 'expanded' : ''}`}>
              <div className="team-group-header" onClick={() => toggleTeam(team.id)}>
                <div className="team-title-sec">
                  <FiUser className="team-icon" />
                  <h3>{team.name}</h3>
                  <span className="team-count">{team.members.length} members</span>
                </div>
                <div className="exp-icon">
                  {expandedTeams.includes(team.id) ? <FiClock style={{transform: 'rotate(180deg)'}} /> : <FiClock />}
                </div>
              </div>

              {expandedTeams.includes(team.id) && (
                <div className="employee-grid">
                  {team.members.map(emp => (
                    <div key={emp.id} className={`emp-card ${emp.isSubordinate ? 'junior' : ''} ${emp.isAdmin ? 'admin-support' : ''}`}>
                      {emp.isSubordinate && <div className="junior-tag">Managing</div>}
                      {emp.isAdmin && <div className="admin-tag">ADMIN SUPPORT</div>}
                      <div className="emp-avatar">{emp.full_name.charAt(0)}</div>
                      <div className="emp-info">
                        <h3>{emp.full_name}</h3>
                        <span className="emp-desig">{emp.designation || 'Staff Member'}</span>
                        <span className="emp-id">{emp.emp_id}</span>
                      </div>
                      <div className="emp-actions">
                        <button 
                          className={`team-action-btn ${!emp.canChat ? 'disabled' : ''}`}
                          onClick={() => emp.canChat && setRecipient(emp)}
                          disabled={!emp.canChat}
                          title={!emp.canChat ? "Chat disabled by Admin" : "Send Message"}
                        >
                          <FiMessageSquare /> Chat
                        </button>
                        <button 
                          className={`team-action-btn ${!emp.canSeeTasks ? 'disabled' : ''}`}
                          onClick={() => emp.canSeeTasks && fetchTasksOf(emp)}
                          disabled={!emp.canSeeTasks}
                          title={!emp.canSeeTasks ? "Tasks hidden by Admin" : "View Tasks"}
                        >
                          <FiEye /> Tasks
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Message Modal */}
      {recipient && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Send Message</h2>
              <p>To: <strong>{recipient.full_name}</strong></p>
              <button className="close-btn" onClick={() => setRecipient(null)}><FiX /></button>
            </div>
            
            {notice && (
              <div className={`modal-notice ${notice.type}`}>
                {notice.message}
              </div>
            )}

            <form onSubmit={handleSendMessage} className="modal-form">
              <textarea 
                placeholder="Type your message..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                required
              ></textarea>
              <div className="modal-actions">
                <button type="submit" className="primary-btn gold-btn" disabled={isSending}>
                  {isSending ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Viewer Modal */}
      {viewingTasks && (
        <div className="modal-overlay">
          <div className="modal-content tasks-modal">
            <div className="modal-header">
              <h2>{viewingTasks.full_name}'s Tasks</h2>
              <button className="close-btn" onClick={() => setViewingTasks(null)}><FiX /></button>
            </div>
            <div className="modal-body overflow-scroll">
              {teammateTasks.length === 0 ? (
                <p className="no-tasks-hint">No active tasks found for this teammate.</p>
              ) : (
                <div className="teammate-tasks-list">
                  {teammateTasks.map(task => (
                    <div key={task.id} className={`teammate-task-item ${task.is_completed ? 'done' : ''}`}>
                      <div className="task-main">
                        <h4>{task.title}</h4>
                        <p>{task.description}</p>
                      </div>
                      <div className="task-side">
                        <span className="due-date"><FiClock /> {task.due_date}</span>
                        {task.is_completed && <span className="status-badge">Completed</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Team

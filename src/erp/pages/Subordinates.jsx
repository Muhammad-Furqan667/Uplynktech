import { useState, useEffect } from 'react'
import { FiPlus, FiChevronDown, FiChevronUp, FiUser, FiActivity } from 'react-icons/fi'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import './Subordinates.css'

const Subordinates = () => {
  const { user } = useAuth()
  const [departments, setDepartments] = useState([])
  const [expandedDept, setExpandedDept] = useState(null) // ID of expanded department
  const [selectedSub, setSelectedSub] = useState(null)
  const [showTaskModal, setShowTaskModal] = useState(false)
  
  // New Task State
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDueDate, setTaskDueDate] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initial load
    fetchSubordinates()

    // REALTIME: Monitor hierarchy and team structure changes instantly
    const channel = supabase
      .channel('subordinates-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'hierarchy' },
        () => fetchSubordinates()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user.id])

  const fetchSubordinates = async () => {
    try {
      // Get hierarchy data joined with profiles and departments
      const { data, error } = await supabase
        .from('hierarchy')
        .select(`
          dept_id,
          dept:departments(name),
          user:profiles!hierarchy_user_id_fkey(id, full_name, designation, emp_id)
        `)
        .eq('senior_id', user.id)

      if (error) throw error

      // Group by department ID
      const grouped = data.reduce((acc, curr) => {
        const dId = curr.dept_id
        if (!acc[dId]) {
          acc[dId] = { 
            id: dId, 
            name: curr.dept.name, 
            members: [] 
          }
        }
        acc[dId].members.push(curr.user)
        return acc
      }, {})

      const deptList = Object.values(grouped)
      setDepartments(deptList)
      if (deptList.length > 0) setExpandedDept(deptList[0].id)
    } catch (error) {
      console.error('Error fetching subordinates:', error)
    } finally {
      setLoading(false)
    }
  }

  const [notice, setNotice] = useState(null)

  const handleAddTask = async (e) => {
    e.preventDefault()
    if (!taskTitle || !taskDueDate || !selectedSub) return
    setNotice(null)

    try {
      const { error } = await supabase
        .from('tasks')
        .insert({
          assigner_id: user.id,
          assignee_id: selectedSub.id,
          dept_id: departments.find(d => d.members.some(m => m.id === selectedSub.id)).id,
          title: taskTitle,
          due_date: taskDueDate
        })

      if (error) throw error

      setNotice({ type: 'success', message: 'Task assigned successfully.' })
      setTaskTitle('')
      setTaskDueDate('')
      setTimeout(() => {
        setShowTaskModal(false)
        setNotice(null)
      }, 1500)
    } catch (error) {
      setNotice({ type: 'error', message: 'Error: ' + error.message })
    }
  }

  const [showUpdatesModal, setShowUpdatesModal] = useState(false)
  const [timelineUpdates, setTimelineUpdates] = useState([])
  const [timelineLoading, setTimelineLoading] = useState(false)
  const [timelineTarget, setTimelineTarget] = useState(null) // null for all, or {id, name}

  const fetchTimeline = async (member = null) => {
    setTimelineLoading(true)
    setTimelineTarget(member)
    setShowUpdatesModal(true)
    try {
      let query = supabase
        .from('task_updates')
        .select(`
          id,
          content,
          created_at,
          task:tasks(title),
          user:profiles(full_name)
        `)
        .order('created_at', { ascending: false })

      // Filter by member if provided
      if (member) {
        query = query.eq('user_id', member.id)
      }

      const { data, error } = await query

      if (error) throw error

      // Group date-wise
      const grouped = data.reduce((acc, curr) => {
        const dateKey = new Date(curr.created_at).toLocaleDateString()
        if (!acc[dateKey]) acc[dateKey] = []
        acc[dateKey].push(curr)
        return acc
      }, {})

      setTimelineUpdates(Object.entries(grouped))
    } catch (error) {
      console.error('Error fetching timeline:', error)
    } finally {
      setTimelineLoading(false)
    }
  }

  const formatMemberName = (fullName) => {
    if (!fullName) return { first: '', last: '' }
    const parts = fullName.trim().split(' ')
    const firstPart = parts[0]
    const lastPart = parts.slice(1).join(' ')
    
    const truncate = (str) => {
      if (!str) return ''
      return str.length > 13 ? str.substring(0, 13) + '...' : str
    }

    return {
      first: truncate(firstPart),
      last: truncate(lastPart)
    }
  }

  return (
    <div className="subordinates-container">
      <div className="page-header">
        <div className="header-text">
          <h1>Your Team <span className="subtitle">/ Subordinate Management</span></h1>
          <p>Supervise performance and review historical progress timelines.</p>
        </div>
        <button className="primary-btn gold-btn" onClick={() => fetchTimeline(null)}>
          <FiActivity /> Team Progress
        </button>
      </div>

      {loading ? (
        <div className="loading-state">Loading your direct reports...</div>
      ) : departments.length === 0 ? (
        <div className="empty-state">
          <FiUser className="empty-icon" />
          <h3>No subordinates found</h3>
          <p>You haven't been assigned as a senior in any department yet.</p>
        </div>
      ) : (
        <div className="dept-accordion">
          {departments.map((dept) => (
            <div key={dept.id} className={`dept-group ${expandedDept === dept.id ? 'expanded' : ''}`}>
              <div 
                className="dept-header" 
                onClick={() => setExpandedDept(expandedDept === dept.id ? null : dept.id)}
              >
                <div className="dept-info">
                  <FiActivity className="dept-icon" />
                  <h3>{dept.name}</h3>
                  <span className="count-badge">{dept.members.length} members</span>
                </div>
                {expandedDept === dept.id ? <FiChevronUp /> : <FiChevronDown />}
              </div>

              {expandedDept === dept.id && (
                <div className="dept-content">
                  <div className="member-grid">
                    {dept.members.map((member) => (
                      <div key={member.id} className="member-card">
                        <div className="member-avatar">
                          {member.full_name.charAt(0)}
                        </div>
                        <div className="member-details">
                          <h4 className="split-name">
                            <span className="first-name">{formatMemberName(member.full_name).first}</span>
                            <span className="last-name">{formatMemberName(member.full_name).last}</span>
                          </h4>
                          <span className="member-desig">{member.designation}</span>
                          <span className="member-id">{member.emp_id}</span>
                        </div>
                        
                        <div className="member-actions">
                          <button 
                            className="member-sub-btn update-view-btn"
                            onClick={() => fetchTimeline(member)}
                          >
                            Updates
                          </button>
                          <button 
                            className="member-sub-btn assign-view-btn"
                            onClick={() => {
                              setSelectedSub(member)
                              setShowTaskModal(true)
                            }}
                          >
                            <FiPlus /> Assign
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Task Updates Timeline Modal */}
      {showUpdatesModal && (
        <div className="modal-overlay">
          <div className="modal-content timeline-modal">
            <div className="modal-header">
              <h2>
                {timelineTarget 
                  ? `${timelineTarget.full_name}'s Progress` 
                  : 'Team Progress Timeline'
                }
              </h2>
              <button className="close-btn" onClick={() => setShowUpdatesModal(false)}>&times;</button>
            </div>
            
            <div className="timeline-body">
              {timelineLoading ? (
                <div className="modal-loading">Syncing records...</div>
              ) : timelineUpdates.length === 0 ? (
                <div className="empty-timeline">No updates found for your team.</div>
              ) : (
                <div className="date-groups">
                  {timelineUpdates.map(([date, updates]) => (
                    <div key={date} className="timeline-date-section">
                      <h3 className="timeline-date-header">{date}</h3>
                      <div className="updates-list">
                        {updates.map(upd => (
                          <div key={upd.id} className="update-record-card">
                            <div className="record-meta">
                              <span className="sub-name">{upd.user.full_name}</span>
                              <span className="task-title">Re: {upd.task.title}</span>
                              <span className="timestamp">{new Date(upd.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="record-content">
                              {upd.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Task Modal */}
      {showTaskModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Assign New Task</h2>
              <p>To: <strong>{selectedSub.full_name}</strong></p>
            </div>
            
            {notice && (
              <div className={`modal-notice ${notice.type}`}>
                {notice.message}
              </div>
            )}
            
            <form onSubmit={handleAddTask} className="modal-form">
              <div className="form-group">
                <label>Task Description</label>
                <textarea 
                  placeholder="E.g., Complete the design audit for Q2..."
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label>Due Date</label>
                <input 
                  type="date" 
                  value={taskDueDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="ghost-btn" onClick={() => setShowTaskModal(false)}>Cancel</button>
                <button type="submit" className="primary-btn gold-btn">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Subordinates

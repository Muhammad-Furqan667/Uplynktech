import { useState, useEffect, useRef } from 'react'
import { format, addDays, subDays, isSameDay, startOfDay } from 'date-fns'
import { FiCheckSquare, FiPlus, FiMessageSquare, FiClock, FiAlertCircle } from 'react-icons/fi'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import './Dashboard.css'

const Dashboard = () => {
  const { user, profile } = useAuth()
  const [tasks, setTasks] = useState([])
  const [timelineDates, setTimelineDates] = useState([])
  const [selectedTask, setSelectedTask] = useState(null)
  const [completionComment, setCompletionComment] = useState('')
  const [quickUpdate, setQuickUpdate] = useState('')
  const [loading, setLoading] = useState(true)

  const isFetchingBus = useRef(false)

  const fetchTasks = async (isSilent = false) => {
    if (isFetchingBus.current) return
    if (!isSilent) setLoading(true)
    isFetchingBus.current = true

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          assigner:profiles!tasks_assigner_id_fkey(full_name),
          department:departments(name)
        `)
        .eq('assignee_id', user.id)
        .order('due_date', { ascending: true })

      if (error) throw error
      setTasks(data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      if (!isSilent) setLoading(false)
      isFetchingBus.current = false
    }
  }

  useEffect(() => {
    const dates = []
    const today = startOfDay(new Date())
    for (let i = -7; i <= 6; i++) {
      dates.push(addDays(today, i))
    }
    setTimelineDates(dates)
    
    // Initial fetch
    fetchTasks(true)

    // REALTIME: Subscribe to task changes for instant UI updates
    const channel = supabase
      .channel('tasks-realtime')
      .on(
        'postgres_changes',
        {
          event: '*', 
          schema: 'public',
          table: 'tasks',
          filter: `assignee_id=eq.${user.id}`
        },
        () => {
          fetchTasks(true) // Silent refresh on any change
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user.id])

  const handleTaskCompletion = async () => {
    if (!completionComment.trim()) return

    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          is_completed: true,
          junior_comment: completionComment
        })
        .eq('id', selectedTask.id)

      if (error) throw error

      setTasks(tasks.map(t => 
        t.id === selectedTask.id 
          ? { ...t, is_completed: true, junior_comment: completionComment } 
          : t
      ))
      setSelectedTask(null)
      setCompletionComment('')
    } catch (error) {
      alert('Error updating task: ' + error.message)
    }
  }

  const [updateTaskId, setUpdateTaskId] = useState('')

  const handleQuickUpdate = async () => {
    if (!quickUpdate.trim() || !updateTaskId) return

    try {
      const { error } = await supabase
        .from('task_updates')
        .insert({
          task_id: updateTaskId,
          user_id: user.id,
          content: quickUpdate
        })

      if (error) throw error
      setQuickUpdate('')
      setUpdateTaskId('')
    } catch (error) {
      alert('Error recording update: ' + error.message)
    }
  }

  return (
    <div className="dashboard-grid">
      {/* Left Panel: 14-Day Timeline */}
      <section className="timeline-panel">
        <div className="panel-header">
          <h2>Task Timeline <span className="timeline-range">(14 Days)</span></h2>
        </div>
        
        <div className="timeline-scroll-container">
          {timelineDates.map((date, idx) => {
            const isToday = isSameDay(date, new Date())
            const dayTasks = tasks.filter(t => isSameDay(new Date(t.due_date), date))
            
            return (
              <div key={idx} className={`timeline-day ${isToday ? 'today' : ''}`}>
                <div className="day-header">
                  <span className="day-name">{format(date, 'EEE')}</span>
                  <span className="day-date">{format(date, 'MMM dd')}</span>
                </div>
                
                <div className="day-tasks">
                  {dayTasks.length > 0 ? (
                    dayTasks.map(task => (
                      <div 
                        key={task.id} 
                        className={`task-card ${task.is_completed ? 'completed' : ''}`}
                        onClick={() => !task.is_completed && setSelectedTask(task)}
                      >
                        <div className="task-status-bar"></div>
                        <div className="task-body">
                          <h4>{task.title}</h4>
                          <span className="task-dept">{task.department?.name}</span>
                        </div>
                        {task.is_completed && (
                          <FiCheckSquare className="task-done-icon" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="no-tasks">Free Day</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Right Panel: Quick Update */}
      <aside className="quick-update-panel">
        <div className="panel-card update-card">
          <h3>Task Progress</h3>
          <p>Record a status update for a specific task</p>
          
          <div className="update-form-group">
            <select 
              value={updateTaskId} 
              onChange={(e) => setUpdateTaskId(e.target.value)}
              className="task-select-dropdown"
            >
              <option value="">Select Task...</option>
              {tasks.map(t => (
                <option key={t.id} value={t.id}>
                  {t.is_completed ? '[DONE] ' : ''}{t.title}
                </option>
              ))}
            </select>
            
            <textarea 
              placeholder="Describe your progress or roadblocks..."
              value={quickUpdate}
              onChange={(e) => setQuickUpdate(e.target.value)}
              disabled={!updateTaskId}
            ></textarea>
          </div>

          <button 
            className="primary-btn gold-btn" 
            onClick={handleQuickUpdate}
            disabled={!updateTaskId || !quickUpdate.trim()}
          >
            <FiPlus /> Save Progress
          </button>
        </div>

        <div className="panel-card stats-card">
          <h3>Current Progress</h3>
          <div className="stat-row">
            <span>Pending</span>
            <span className="stat-val">{tasks.filter(t => !t.is_completed).length}</span>
          </div>
          <div className="stat-row">
            <span>Completed</span>
            <span className="stat-val emerald">{tasks.filter(t => t.is_completed).length}</span>
          </div>
        </div>
      </aside>

      {/* Completion Modal */}
      {selectedTask && (
        <div className="modal-overlay">
          <div className="modal-content">
            <FiCheckSquare className="modal-icon" />
            <h2>Complete Task</h2>
            <p className="task-name">{selectedTask.title}</p>
            
            <div className="comment-section">
              <label>Junior Comment (Mandatory)</label>
              <textarea 
                placeholder="Briefly describe what was achieved..."
                value={completionComment}
                onChange={(e) => setCompletionComment(e.target.value)}
                autoFocus
              ></textarea>
            </div>

            <div className="modal-actions">
              <button className="ghost-btn" onClick={() => setSelectedTask(null)}>Cancel</button>
              <button 
                className="primary-btn emerald-btn" 
                onClick={handleTaskCompletion}
                disabled={!completionComment.trim()}
              >
                Submit Completion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard

import { useState, useEffect } from 'react'
import { FiSave, FiLock, FiMail, FiPlus, FiTrash2, FiLayers, FiUsers, FiMessageSquare, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi'
import { supabase } from '../../../lib/supabase'
import './AdminPanel.css'

const AdminSettings = () => {
  const [smtpPassword, setSmtpPassword] = useState('')
  const [smtpEmail, setSmtpEmail] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const [testLoading, setTestLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)
  
  // Department State
  const [departments, setDepartments] = useState([])
  const [newDeptName, setNewDeptName] = useState('')
  const [deptLoading, setDeptLoading] = useState(false)

  // Team State (NEW)
  const [teams, setTeams] = useState([])
  const [profiles, setProfiles] = useState([])
  const [newTeamName, setNewTeamName] = useState('')
  const [teamLoading, setTeamLoading] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState(null) // ID of team being edited
  const [teamMembers, setTeamMembers] = useState([])
  const [newMemberId, setNewMemberId] = useState('')

  useEffect(() => {
    fetchSettings()
    fetchDepartments()
    fetchTeams()
    fetchProfiles()
  }, [])

  useEffect(() => {
    if (selectedTeam) fetchTeamMembers(selectedTeam)
  }, [selectedTeam])

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('erp_settings')
        .select('*')
        .in('key', ['GOOGLE_APP_PASSWORD', 'GOOGLE_EMAIL'])

      if (error) throw error
      if (data) {
        const pass = data.find(d => d.key === 'GOOGLE_APP_PASSWORD')
        const email = data.find(d => d.key === 'GOOGLE_EMAIL')
        if (pass) setSmtpPassword(pass.value)
        if (email) setSmtpEmail(email.value)
        
        // Use the latest update timestamp
        const latest = data.reduce((max, curr) => 
          new Date(curr.updated_at) > new Date(max) ? curr.updated_at : max
        , data[0]?.updated_at)
        setLastUpdated(latest)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name')
      if (error) throw error
      setDepartments(data || [])
    } catch (err) {
      console.error('Error fetching departments:', err)
    }
  }

  const fetchProfiles = async () => {
    const { data } = await supabase.from('profiles').select('id, full_name, emp_id').order('full_name')
    setProfiles(data || [])
  }

  const fetchTeams = async () => {
    const { data } = await supabase.from('teams').select('*').order('name')
    setTeams(data || [])
  }

  const fetchTeamMembers = async (teamId) => {
    const { data } = await supabase
      .from('team_members')
      .select(`
        *,
        user:profiles(full_name, emp_id)
      `)
      .eq('team_id', teamId)
    setTeamMembers(data || [])
  }

  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleCreateTeam = async (e) => {
    e.preventDefault()
    if (!newTeamName) return
    setTeamLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const { error } = await supabase.from('teams').insert([{ name: newTeamName }])
      if (error) throw error
      setSuccess(`Team "${newTeamName}" created.`)
      setNewTeamName('')
      fetchTeams()
    } catch (err) {
      setError(err.message)
    } finally {
      setTeamLoading(false)
    }
  }

  const handleAddMember = async (e) => {
    e.preventDefault()
    if (!selectedTeam || !newMemberId) return
    setError(null)
    setSuccess(null)
    try {
      const { error } = await supabase
        .from('team_members')
        .insert([{ team_id: selectedTeam, user_id: newMemberId }])
      if (error) throw error
      setSuccess('Member added to team.')
      setNewMemberId('')
      fetchTeamMembers(selectedTeam)
    } catch (err) {
      setError(err.message)
    }
  }

  const togglePermission = async (memberId, field, currentValue) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .update({ [field]: !currentValue })
        .eq('id', memberId)
      if (error) throw error
      fetchTeamMembers(selectedTeam)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleRemoveMember = async (memberId) => {
    try {
      const { error } = await supabase.from('team_members').delete().eq('id', memberId)
      if (error) throw error
      setSuccess('Member removed from team.')
      fetchTeamMembers(selectedTeam)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDeleteTeam = async (id) => {
    if (!window.confirm('Delete this team?')) return
    try {
      const { error } = await supabase.from('teams').delete().eq('id', id)
      if (error) throw error
      setSuccess('Team deleted.')
      if (selectedTeam === id) setSelectedTeam(null)
      fetchTeams()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleCreateDepartment = async (e) => {
    e.preventDefault()
    if (!newDeptName) return
    setDeptLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const { error } = await supabase
        .from('departments')
        .insert([{ name: newDeptName }])
      if (error) throw error
      setSuccess(`Department "${newDeptName}" created.`)
      setNewDeptName('')
      fetchDepartments()
    } catch (err) {
      setError(err.message)
    } finally {
      setDeptLoading(false)
    }
  }

  const handleDeleteDepartment = async (id) => {
    if (!window.confirm('Delete this department? This may affect hierarchy.')) return
    try {
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', id)
      if (error) throw error
      setSuccess('Department deleted.')
      fetchDepartments()
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    // Reset verification if credentials change
    setIsVerified(false)
  }, [smtpPassword, smtpEmail])

  const handleVerifyConnection = async () => {
    if (!smtpEmail || !smtpPassword) {
      setError('Please enter both Google Email and App Password before verifying.')
      return
    }
    
    setTestLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: { test: true, email: smtpEmail, password: smtpPassword }
      })
      
      if (error) throw error
      if (data.error) throw new Error(data.error)
      
      setIsVerified(true)
      setSuccess('SMTP Handshake Successful! Connection verified.')
    } catch (err) {
      setError(`Verification Failed: ${err.message}`)
      setIsVerified(false)
    } finally {
      setTestLoading(false)
    }
  }

  const handleSaveSettings = async (e) => {
    e.preventDefault()
    if (!isVerified) return
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const { error: pError } = await supabase
        .from('erp_settings')
        .upsert({
          key: 'GOOGLE_APP_PASSWORD',
          value: smtpPassword,
          updated_at: new Date().toISOString()
        })
      if (pError) throw pError

      const { error: eError } = await supabase
        .from('erp_settings')
        .upsert({
          key: 'GOOGLE_EMAIL',
          value: smtpEmail,
          updated_at: new Date().toISOString()
        })
      if (eError) throw eError

      setSuccess('System orchestration settings saved successfully.')
      fetchSettings()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-settings">
      {error && <div className="admin-error">{error}</div>}
      {success && <div className="admin-success">{success}</div>}

      {/* System Settings */}
      <section className="admin-form-section">
        <h3>System Orchestration</h3>
        <p className="form-hint">Configure core service integrations and credentials.</p>
        <form onSubmit={handleSaveSettings} className="admin-stacked-form">
          <div className="settings-item">
            <div className="settings-info">
              <FiMail className="settings-icon" />
              <div>
                <h4>Google Account</h4>
                <p>Specify the Gmail address and App Password for SMTP orchestration.</p>
              </div>
            </div>
            <div className="settings-input">
              <div className="input-with-icon-wrapper">
                <FiMail className="input-lock" />
                <input 
                  type="email" 
                  placeholder="name@gmail.com"
                  value={smtpEmail}
                  onChange={(e) => setSmtpEmail(e.target.value)}
                  required
                />
              </div>
              <div className="password-input-wrapper">
                <FiLock className="input-lock" />
                <input 
                  type="password" 
                  placeholder="•••• •••• •••• ••••"
                  value={smtpPassword}
                  onChange={(e) => setSmtpPassword(e.target.value)}
                  required
                />
              </div>
              {lastUpdated && <span className="update-stamp">Last updated: {new Date(lastUpdated).toLocaleString()}</span>}
            </div>
          </div>

          <div className="settings-actions">
            <button 
              type="button" 
              className={`primary-btn ${isVerified ? 'success-btn' : 'verify-btn'}`}
              onClick={handleVerifyConnection}
              disabled={testLoading}
            >
              {testLoading ? 'Checking...' : isVerified ? <><FiCheck /> Verified</> : 'Verify Connection'}
            </button>

            <button type="submit" className="primary-btn gold-btn" disabled={saving || !isVerified}>
              <FiSave /> {saving ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
          
          {!isVerified && !testLoading && (
            <p className="form-hint warning-hint">You must verify the connection before saving changes.</p>
          )}
        </form>
      </section>

      <div className="admin-divider"></div>

      {/* Team Management (NEW) */}
      <section className="admin-form-section">
        <h3>Team Orchestration</h3>
        <p className="form-hint">Organize personnel into functional teams and manage peer visibility.</p>

        <div className="team-mgmt-grid">
          <div className="team-selector-col">
            <form onSubmit={handleCreateTeam} className="admin-inline-form-compact">
              <input 
                type="text" 
                placeholder="Team Name" 
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                required
              />
              <button type="submit" className="small-add-btn" disabled={teamLoading}>
                <FiPlus />
              </button>
            </form>

            <div className="team-list-sidebar">
              {teams.map(t => (
                <div 
                  key={t.id} 
                  className={`team-nav-item ${selectedTeam === t.id ? 'active' : ''}`}
                  onClick={() => setSelectedTeam(t.id)}
                >
                  <FiUsers className="nav-icon" />
                  <span>{t.name}</span>
                  <button className="nav-delete" onClick={(e) => {e.stopPropagation(); handleDeleteTeam(t.id)}}>
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="team-members-col">
            {selectedTeam ? (
              <>
                <div className="member-add-row">
                  <select value={newMemberId} onChange={(e) => setNewMemberId(e.target.value)}>
                    <option value="">Select Personnel...</option>
                    {profiles.map(p => (
                      <option key={p.id} value={p.id}>{p.full_name} ({p.emp_id})</option>
                    ))}
                  </select>
                  <button className="primary-btn gold-btn small-btn" onClick={handleAddMember}>
                    <FiPlus /> Add
                  </button>
                </div>

                <div className="member-list-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Member</th>
                        <th title="Allow chatting with teammates">Chat</th>
                        <th title="Allow teammates to see tasks">Tasks</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamMembers.map(m => (
                        <tr key={m.id}>
                          <td>
                            <div className="member-cell">
                              <span className="name">{m.user?.full_name}</span>
                              <span className="eid">{m.user?.emp_id}</span>
                            </div>
                          </td>
                          <td>
                            <button 
                              className={`toggle-icon-btn ${m.can_chat ? 'on' : 'off'}`}
                              onClick={() => togglePermission(m.id, 'can_chat', m.can_chat)}
                            >
                              {m.can_chat ? <FiMessageSquare /> : <FiX />}
                            </button>
                          </td>
                          <td>
                            <button 
                              className={`toggle-icon-btn ${m.can_see_tasks ? 'on' : 'off'}`}
                              onClick={() => togglePermission(m.id, 'can_see_tasks', m.can_see_tasks)}
                            >
                              {m.can_see_tasks ? <FiEye /> : <FiEyeOff />}
                            </button>
                          </td>
                          <td>
                            <button className="icon-btn delete" onClick={() => handleRemoveMember(m.id)}>
                              <FiTrash2 />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="empty-team-placeholder">
                <FiUsers className="p-icon" />
                <p>Select or create a team to manage assignments.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="admin-divider"></div>

      {/* Departments */}
      <section className="admin-form-section">
        <h3>Department Orchestration</h3>
        <p className="form-hint">Manage organization units and divisions.</p>
        
        <div className="team-mgmt-grid">
          <div className="team-selector-col">
            <form onSubmit={handleCreateDepartment} className="admin-inline-form-compact">
              <input 
                type="text" 
                placeholder="Dept Name"
                value={newDeptName}
                onChange={(e) => setNewDeptName(e.target.value)}
                required
              />
              <button type="submit" className="small-add-btn" disabled={deptLoading}>
                <FiPlus />
              </button>
            </form>

            <div className="empty-selection-hint">
              <p>Add new operational units using the control above.</p>
            </div>
          </div>

          <div className="dept-content-col scrollable-area">
            <h4>Organizational Units</h4>
            <div className="dept-list-grid">
              {departments.map(dept => (
                <div key={dept.id} className="dept-pill-large">
                  <div className="pill-main">
                    <FiLayers className="pill-icon" />
                    <div className="pill-text">
                      <span className="name">{dept.name}</span>
                      <span className="type">Department</span>
                    </div>
                  </div>
                  <button className="pill-delete" onClick={() => handleDeleteDepartment(dept.id)}>
                    <FiTrash2 />
                  </button>
                </div>
              ))}
              {departments.length === 0 && (
                <div className="empty-list-placeholder">
                  <FiLayers className="p-icon" />
                  <p>No departments defined yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AdminSettings

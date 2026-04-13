import React, { useState, useEffect } from 'react'
import { FiUserPlus, FiTrash2, FiEdit2, FiCheck, FiKey, FiX, FiPlus, FiSearch } from 'react-icons/fi'
import { supabase } from '../../../lib/supabase'
import './AdminPanel.css'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  
  // New User State
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('User')
  const [designation, setDesignation] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [resettingPassword, setResettingPassword] = useState(null) // ID of user being reset
  const [newPassword, setNewPassword] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, hierarchy!hierarchy_user_id_fkey(dept:departments(name))')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // Enforce domain
    if (!email.toLowerCase().endsWith('@uplynktech.com')) {
      setError('Email must end with @uplynktech.com')
      return
    }

    try {
      // Use the secured SQL RPC function to create the user
      // This runs server-side in the database and preserves the admin session
      const { data, error: rpcError } = await supabase.rpc('admin_create_user', {
        p_email: email,
        p_password: password || 'Uplynk@123',
        p_full_name: fullName,
        p_designation: designation,
        p_role: role
      })

      if (rpcError) throw rpcError

      setSuccess(`User ${fullName} created successfully.`)
      setFullName('')
      setEmail('')
      setDesignation('')
      setPassword('')
      fetchUsers()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure? This only deletes the profile, not the auth record.')) return
    
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', id)
      if (error) throw error
      setUsers(users.filter(u => u.id !== id))
      setSuccess('User profile deleted.')
    } catch (err) {
      setError(err.message)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (!newPassword) return
    setError(null)

    try {
      const { error } = await supabase.rpc('update_user_password', { 
        user_id: resettingPassword, 
        new_password: newPassword 
      })
      if (error) throw error
      setSuccess('Password updated successfully for the user.')
      setResettingPassword(null)
      setNewPassword('')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="admin-users">
      <section className="admin-form-section">
        <h3>Invite New Personnel</h3>
        <p className="form-hint">Enforces @uplynktech.com domain. Provide a temp password if needed.</p>
        
        <form onSubmit={handleCreateUser} className="admin-inline-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="form-group">
              <label>Work Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@uplynktech.com"
                required
              />
            </div>
            <div className="form-group">
              <label>Designation</label>
              <input 
                type="text" 
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="Senior Engineer"
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="User">User</option>
                <option value="Admin">Admin</option>
                <option value="Contact">Contact</option>
              </select>
            </div>
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Initial Password"
              />
            </div>
          </div>

          {error && <div className="admin-error">{error}</div>}
          {success && <div className="admin-success">{success}</div>}

          <button type="submit" className="primary-btn gold-btn">
            <FiUserPlus /> Create Personnel
          </button>
        </form>
      </section>

      <div className="admin-divider"></div>

      <section className="user-list-section">
        <div className="section-header-row">
          <h3>Current Employees ({users.length})</h3>
          <div className="admin-actions-v2">
             <div className="admin-search-box">
               <FiSearch style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4}} />
               <input 
                 type="text" 
                 placeholder="Search name, email, ID..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
             </div>
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Employee Identity</th>
                <th>Work Email</th>
                <th>Role</th>
                <th>Designation</th>
                <th>Onboarding Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{textAlign: 'center', padding: '3rem', color: '#999'}}>
                    <div className="loading-spinner-small"></div>
                    Retrieving employees...
                  </td>
                </tr>
              ) : (() => {
                const filtered = users.filter(u => {
                  if (!searchQuery) return true
                  const q = searchQuery.toLowerCase()
                  return (
                    u.full_name?.toLowerCase().includes(q) ||
                    u.email?.toLowerCase().includes(q) ||
                    u.emp_id?.toLowerCase().includes(q)
                  )
                })

                if (filtered.length === 0) {
                  return (
                    <tr>
                      <td colSpan="6" style={{textAlign: 'center', padding: '3rem', color: '#999'}}>
                        {searchQuery ? 'No employees matches your search.' : 'No employees found in the directory.'}
                      </td>
                    </tr>
                  )
                }

                return filtered.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div className="u-info">
                        <span className="u-name">{u.full_name}</span>
                        <span className="u-id">{u.emp_id}</span>
                      </div>
                    </td>
                    <td className="u-email-cell">
                      {u.email ? (
                        u.email
                      ) : (
                        <span style={{color: 'var(--accent-color)', fontStyle: 'italic', opacity: 0.6, fontSize: '0.75rem'}}>
                          [UT-SYNC-PENDING]
                        </span>
                      )}
                    </td>
                    <td><span className={`role-badge ${u.role.toLowerCase()}`}>{u.role}</span></td>
                    <td>{u.designation || '---'}</td>
                    <td>{new Date(u.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="admin-action-row">
                        <button 
                          className="icon-btn highlight" 
                          onClick={() => setResettingPassword(u.id)}
                          title="Reset Password"
                        >
                          <FiKey />
                        </button>
                        <button className="icon-btn delete" onClick={() => handleDeleteUser(u.id)}>
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              })()}
            </tbody>
          </table>
        </div>
      </section>

      {resettingPassword && (
        <div className="admin-overlay">
          <div className="admin-modal">
            <h3>Reset Password</h3>
            <p className="form-hint">Updating password for selected user.</p>
            <form onSubmit={handleResetPassword}>
              <div className="form-group">
                <label>New Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  required
                  autoFocus
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="primary-btn gold-btn">Update Password</button>
                <button type="button" className="icon-btn" onClick={() => setResettingPassword(null)}>
                  <FiX /> Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUsers

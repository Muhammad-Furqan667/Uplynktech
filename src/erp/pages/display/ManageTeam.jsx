import React, { useState, useEffect } from 'react'
import { FiUsers, FiPlus, FiTrash2, FiEdit2, FiCheck, FiX, FiUser } from 'react-icons/fi'
import { supabase } from '../../../lib/supabase'
import { resolveImageUrl } from '../../../lib/utils'
import DisplayImageUploader from './DisplayImageUploader'

const ManageTeam = () => {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingMember, setEditingMember] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // Form State
  const [formData, setFormData] = useState({
    name: '', role: '', bio: '', image: '', 
    email: '', linkedin: '', is_ceo: false, 
    is_leadership: false, message: ''
  })

  useEffect(() => {
    fetchTeam()
  }, [])

  const fetchTeam = async () => {
    try {
      const { data, error } = await supabase
        .from('display_team')
        .select('*')
        .order('is_ceo', { ascending: false })
        .order('is_leadership', { ascending: false })
        .order('name', { ascending: true })

      if (error) throw error
      setMembers(data || [])
    } catch (err) {
      console.error('Error fetching team:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Cleanup payload: Remove ID and metadata to prevent update conflicts
      const { id, created_at, ...updateData } = formData

      if (editingMember) {
        const { error } = await supabase
          .from('display_team')
          .update(updateData)
          .eq('id', editingMember.id)
        if (error) throw error
        setSuccess('Team member updated successfully.')
      } else {
        const { error } = await supabase
          .from('display_team')
          .insert([updateData])
        if (error) throw error
        setSuccess('New team member added.')
      }

      setEditingMember(null)
      setFormData({
        name: '', role: '', bio: '', image: '', email: '', linkedin: '',
        is_ceo: false, is_leadership: false, message: ''
      })
      fetchTeam()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (member) => {
    setEditingMember(member)
    setFormData({
      name: member.name || '',
      role: member.role || '',
      bio: member.bio || '',
      image: member.image || '',
      email: member.email || '',
      linkedin: member.linkedin || '',
      is_ceo: member.is_ceo || false,
      is_leadership: member.is_leadership || false,
      message: member.message || ''
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this team member?')) return
    try {
      const { error } = await supabase.from('display_team').delete().eq('id', id)
      if (error) throw error
      setMembers(members.filter(m => m.id !== id))
      setSuccess('Member removed.')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="manage-section">
      <section className="admin-form-section">
        <h3>{editingMember ? 'Update Professional Profile' : 'Add New Engineering Lead'}</h3>
        <p className="form-hint">Populate the record for site-wide synchronization.</p>
        
        <form onSubmit={handleSubmit} className="admin-inline-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="James Wilson"
                required
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <input 
                type="text" 
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                placeholder="Head of Engineering"
                required
              />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Professional Bio</label>
              <textarea 
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                placeholder="Brief professional background..."
                rows="3"
              />
            </div>
            
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <DisplayImageUploader 
                value={formData.image}
                onChange={(val) => setFormData({...formData, image: val})}
                bucket="memebrs images"
                label="Profile Photo"
                placeholder="Storage URI or Static Link..."
              />
            </div>

            <div className="form-group">
              <label>Work Email</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="james@uplynktech.com"
              />
            </div>
            <div className="form-group">
              <label>LinkedIn URL</label>
              <input 
                type="url" 
                value={formData.linkedin}
                onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                placeholder="https://linkedin.com/in/..."
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Flags & Messaging</label>
              <div className="flags-row">
                <label className="checkbox-container">
                  <input 
                    type="checkbox" 
                    checked={formData.is_ceo} 
                    onChange={(e) => setFormData({...formData, is_ceo: e.target.checked})}
                  />
                  <span>Is CEO?</span>
                </label>
                <label className="checkbox-container">
                  <input 
                    type="checkbox" 
                    checked={formData.is_leadership} 
                    onChange={(e) => setFormData({...formData, is_leadership: e.target.checked})}
                  />
                  <span>Leadership?</span>
                </label>
              </div>
            </div>

            {formData.is_ceo && (
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>CEO Visionary Message</label>
                <textarea 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Flagship message for the hero section..."
                  rows="2"
                />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-btn gold-btn" disabled={loading}>
              {editingMember ? <FiCheck /> : <FiPlus />} {editingMember ? 'Update Profile' : 'Add Member'}
            </button>
            {editingMember && (
              <button type="button" className="icon-btn" onClick={() => { setEditingMember(null); setFormData({name: '', role: '', bio: '', image: '', email: '', linkedin: '', is_ceo: false, is_leadership: false, message: ''}) }}>
                Cancel
              </button>
            )}
          </div>

          {error && <div className="admin-error">{error}</div>}
          {success && <div className="admin-success">{success}</div>}
        </form>
      </section>

      <div className="admin-divider"></div>

      <section className="user-list-section">
        <h3>Active Technical Core</h3>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Expert Identity</th>
                <th>Role</th>
                <th>Priority</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map(member => (
                <tr key={member.id}>
                  <td>
                    <div className="admin-user-cell">
                      <div className="user-avatar-mini">
                        {member.image ? (
                          <img src={resolveImageUrl(member.image)} alt="" />
                        ) : (
                          <FiUser />
                        )}
                      </div>
                      <div className="u-info">
                        <span className="u-name">{member.name}</span>
                        <span className="u-id">{member.id.substring(0, 8)}</span>
                      </div>
                    </div>
                  </td>
                  <td>{member.role}</td>
                  <td>
                    <div className="badge-group">
                      {member.is_ceo && <span className="role-badge admin">CEO</span>}
                      {member.is_leadership && <span className="role-badge user">LEADERSHIP</span>}
                      {!member.is_ceo && !member.is_leadership && <span className="role-badge">MEMBER</span>}
                    </div>
                  </td>
                  <td className="u-email-cell">{member.email || '---'}</td>
                  <td>
                    <div className="admin-action-row">
                      <button className="icon-btn highlight" onClick={() => handleEdit(member)}>
                        <FiEdit2 />
                      </button>
                      <button className="icon-btn delete" onClick={() => handleDelete(member.id)}>
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default ManageTeam
